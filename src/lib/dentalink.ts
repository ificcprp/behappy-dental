/**
 * DENTALINK API REST CLIENT (Headless Dentalink Engine)
 *
 * Permite a Centro Dental BeHappy integrar su plataforma web Next.js
 * directamente con su software de gestión clínica Dentalink (HealthAtom).
 *
 * Cumplimiento Ley 20.584 y Ley 19.628:
 * - Esta capa NO almacena fichas clínicas ni anamnesis médica sensible.
 * - Actúa como proxy seguro y autenticado para consulta de disponibilidad y registro de citas.
 * - Toda la historia médica y odontograma legal reside exclusivamente en Dentalink.
 */

import { CLINIC_INFO } from "@/data/clinicInfo";

export interface DentalinkConfig {
  apiUrl: string;
  apiToken: string | null;
  agendaUrl: string;
  sucursalId: number;
  timeoutMs: number;
  estadoDefaultId: number;
}

export interface DentalinkApiResponse<T> {
  result?: string;
  data: T;
  links?: {
    self?: string;
    next?: string;
    prev?: string;
  };
}

export interface DentalinkAgendaSlot {
  id_dentista: number;
  id_sucursal: number;
  id_sillon: number;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:mm
  hora_fin: string; // HH:mm (puede venir vacío en la agenda anidada)
}

export interface DentalinkPacienteInput {
  rut: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  ciudad?: string;
  comuna?: string;
}

export interface DentalinkCitaInput {
  id_paciente: number;
  id_dentista: number;
  id_sucursal?: number;
  id_sillon?: number;
  id_estado?: number;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:mm or HH:mm:ss
  hora_fin: string; // HH:mm or HH:mm:ss
  motivo?: string;
  comentarios?: string;
}

export interface DentalinkEstado {
  id: number;
  nombre: string;
}

export interface DentalinkPacienteConvenio {
  id: number;
  nombre?: string;
  fecha_afiliacion?: string;
  habilitado?: number;
  descuento?: number;
}

export const DENTALINK_ESTADO_CANDIDATAS: Record<string, string[]> = {
  solicitada: ["solicitada", "agendada", "pendiente", "por confirmar"],
  confirmada: ["confirmada", "agendada", "confirmado"],
  atendida: ["atendida", "realizada", "finalizada", "asistida"],
  cancelada: ["cancelada", "anulada", "no asistio"],
};

const DEFAULT_TIMEOUT_MS = 8000;
const ESTADOS_CACHE_TTL_MS = 10 * 60 * 1000;

let estadosCache: { fetchedAt: number; items: DentalinkEstado[] } | null = null;

export function getDentalinkConfig(): DentalinkConfig {
  const token = process.env.DENTALINK_API_TOKEN || null;
  const apiUrl =
    process.env.DENTALINK_API_URL ||
    CLINIC_INFO.dentalink?.apiBaseUrl ||
    "https://api.dentalink.healthatom.com/api/v1";
  const agendaUrl =
    process.env.NEXT_PUBLIC_DENTALINK_AGENDA_URL || CLINIC_INFO.dentalink?.agendaUrl || "";
  const sucursalId = parseInt(
    process.env.DENTALINK_SUCURSAL_ID || String(CLINIC_INFO.dentalink?.sucursalId ?? 1),
    10
  );
  const parsedTimeout = parseInt(process.env.DENTALINK_TIMEOUT_MS || String(DEFAULT_TIMEOUT_MS), 10);
  const parsedEstado = parseInt(process.env.DENTALINK_ESTADO_DEFAULT_ID || "1", 10);

  return {
    apiUrl,
    apiToken: token,
    agendaUrl,
    sucursalId: Number.isFinite(sucursalId) ? sucursalId : 1,
    timeoutMs:
      Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : DEFAULT_TIMEOUT_MS,
    estadoDefaultId: Number.isFinite(parsedEstado) ? parsedEstado : 1,
  };
}

export function isDentalinkConfigured(): boolean {
  const cfg = getDentalinkConfig();
  return !!cfg.apiToken && cfg.apiToken.trim().length > 10;
}

export function resolveDentalinkDentistaId(doctorId?: string | null): number | null {
  if (!doctorId) return null;
  const value = doctorId.trim();
  if (!value) return null;
  if (/^\d+$/.test(value)) return Number(value);

  const envMap = process.env.DENTALINK_DENTIST_MAP;
  if (envMap) {
    try {
      const parsed = JSON.parse(envMap) as Record<string, unknown>;
      const mapped = parsed[value];
      if (typeof mapped === "number" && Number.isFinite(mapped)) return mapped;
    } catch {
      console.warn("[Dentalink Client] DENTALINK_DENTIST_MAP no contiene JSON válido.");
    }
  }

  const fallbackMap = (CLINIC_INFO.dentalink?.dentistaIds || {}) as Record<
    string,
    number | null | undefined
  >;
  const mapped = fallbackMap[value];
  return typeof mapped === "number" && Number.isFinite(mapped) ? mapped : null;
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return time;
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor((total % 1440) / 60)).padStart(2, "0");
  const mm = String(((total % 1440) % 60)).padStart(2, "0");
  return `${hh}:${mm}`;
}

function normalizeTime(value?: string | null): string {
  if (!value) return "";
  const match = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (!match) return String(value);
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function toSecondsTime(value: string): string {
  if (!value) return value;
  return value.split(":").length === 2 ? `${value}:00` : value;
}

function toIsoDate(value: string): string | null {
  const slash = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slash) return `${slash[3]}-${slash[2]}-${slash[1]}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizeRut(value: string): string {
  return value.replace(/[^0-9kK]/g, "").toUpperCase();
}

async function callDentalinkApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cfg = getDentalinkConfig();

  if (!cfg.apiToken) {
    throw new Error("DENTALINK_API_TOKEN no configurado en variables de entorno.");
  }

  const url = `${cfg.apiUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const headers: Record<string, string> = {
    Authorization: `Token ${cfg.apiToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Dentalink API timeout (${cfg.timeoutMs} ms) en ${endpoint}`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    let parsedError: string;
    try {
      const jsonErr = JSON.parse(errorBody);
      parsedError = jsonErr.message || jsonErr.error || errorBody;
    } catch {
      parsedError = errorBody;
    }
    throw new Error(`Dentalink API error (${response.status}): ${parsedError}`);
  }

  const text = await response.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Dentalink API respuesta no-JSON en ${endpoint}`);
  }
}

function normalizeAgendaPayload(
  raw: unknown,
  ctx: { fecha: string; sucursalId: number; idDentista?: number }
): DentalinkAgendaSlot[] {
  if (Array.isArray(raw)) {
    const slots = raw
      .filter(
        (row) => row && typeof row === "object" && (row as { id_paciente?: number }).id_paciente === 0
      )
      .map((row) => {
        const item = row as Record<string, unknown>;
        return {
          id_dentista: typeof item.id_dentista === "number" ? item.id_dentista : 0,
          id_sucursal: ctx.sucursalId,
          id_sillon: typeof item.id_recurso === "number" ? item.id_recurso : 0,
          fecha: toIsoDate(String(item.fecha || "")) || ctx.fecha,
          hora_inicio: normalizeTime(item.hora_inicio as string),
          hora_fin: normalizeTime(item.hora_fin as string),
        };
      })
      .filter((slot) => slot.hora_inicio);

    return slots.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }

  if (raw && typeof raw === "object" && "fechas" in (raw as Record<string, unknown>)) {
    const fechas = (
      raw as {
        fechas?: Record<
          string,
          { sillon?: number; horas?: Record<string, { sillones?: Record<string, unknown> }> }
        >;
      }
    ).fechas;
    if (!fechas) return [];

    const slots: DentalinkAgendaSlot[] = [];
    for (const [dateKey, day] of Object.entries(fechas)) {
      const iso = toIsoDate(dateKey);
      if (!iso || iso !== ctx.fecha) continue;
      const horas = day?.horas;
      if (!horas) continue;

      for (const [hora, detail] of Object.entries(horas)) {
        const sillones = detail?.sillones;
        if (!sillones) continue;
        for (const [sillonId, value] of Object.entries(sillones)) {
          if (value !== true) continue;
          const idSillon = parseInt(sillonId, 10);
          if (!Number.isFinite(idSillon)) continue;
          slots.push({
            id_dentista: ctx.idDentista ?? 0,
            id_sucursal: ctx.sucursalId,
            id_sillon: idSillon,
            fecha: iso,
            hora_inicio: normalizeTime(hora),
            hora_fin: "",
          });
        }
      }
    }

    return slots.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  }

  return [];
}

export async function getDentalinkDisponibilidad(params: {
  idDentista?: number;
  idSucursal?: number;
  fecha: string;
}): Promise<DentalinkAgendaSlot[]> {
  const cfg = getDentalinkConfig();
  const sucursalId = params.idSucursal || cfg.sucursalId;

  if (!isDentalinkConfigured()) {
    console.info("[Dentalink Client] Modo preview: disponibilidad simulada (sin token).");
    return generateMockAvailability(params.fecha, sucursalId);
  }

  const endpoint = params.idDentista
    ? `sucursales/${sucursalId}/dentistas/${params.idDentista}/agendas?q={"fecha":{"eq":"${params.fecha}"}}`
    : `agendas?q={"fecha":{"eq":"${params.fecha}"},"id_sucursal":{"eq":${sucursalId}},"duracion":{"eq":30}}`;

  const res = await callDentalinkApi<DentalinkApiResponse<unknown>>(endpoint);
  return normalizeAgendaPayload(res.data, {
    fecha: params.fecha,
    sucursalId,
    idDentista: params.idDentista,
  });
}

export async function findDentalinkPacienteByRut(
  rut: string
): Promise<{ id: number; rut: string } | null> {
  if (!isDentalinkConfigured()) return null;

  const cleanRut = normalizeRut(rut);
  const searchRes = await callDentalinkApi<DentalinkApiResponse<Array<{ id: number; rut: string }>>>(
    `pacientes/buscar?q=${encodeURIComponent(rut.trim())}`
  );

  const match = (searchRes.data || []).find(
    (candidate) =>
      candidate && typeof candidate.rut === "string" && normalizeRut(candidate.rut) === cleanRut
  );
  return match || null;
}

export async function findOrCreateDentalinkPaciente(patient: DentalinkPacienteInput): Promise<number> {
  if (!isDentalinkConfigured()) {
    return 12789;
  }

  const match = await findDentalinkPacienteByRut(patient.rut);
  if (match) return match.id;

  const createRes = await callDentalinkApi<DentalinkApiResponse<{ id: number }>>("pacientes", {
    method: "POST",
    body: JSON.stringify({
      rut: normalizeRut(patient.rut),
      nombre: patient.nombre.trim(),
      apellidos: patient.apellidos.trim(),
      email: patient.email?.trim() || null,
      telefono: patient.telefono?.trim() || null,
      ciudad: patient.ciudad || "Ñuñoa",
      comuna: patient.comuna || "Ñuñoa",
    }),
  });

  return createRes.data.id;
}

export function getClubConvenioId(): number | null {
  const raw = process.env.DENTALINK_CLUB_CONVENIO_ID;
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function getDentalinkPacienteConvenios(
  idPaciente: number
): Promise<DentalinkPacienteConvenio[]> {
  const res = await callDentalinkApi<DentalinkApiResponse<DentalinkPacienteConvenio[]>>(
    `pacientes/${idPaciente}/convenios`
  );
  return (res.data || []).filter((convenio) => convenio && typeof convenio.id === "number");
}

export async function assignDentalinkConvenio(idPaciente: number, idConvenio: number): Promise<void> {
  await callDentalinkApi(`pacientes/${idPaciente}/convenios`, {
    method: "POST",
    body: JSON.stringify({ id_convenio: idConvenio }),
  });
}

export async function removeDentalinkConvenio(idPaciente: number, idConvenio: number): Promise<void> {
  try {
    await callDentalinkApi(`pacientes/${idPaciente}/convenios/${idConvenio}`, {
      method: "DELETE",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("(404)")) return;
    throw error;
  }
}

export async function createDentalinkCita(cita: DentalinkCitaInput): Promise<{ id: number; success: boolean }> {
  if (!isDentalinkConfigured()) {
    console.info("[Dentalink Client] Modo preview (sin token activo). Cita generada virtualmente.");
    return { id: Math.floor(Math.random() * 90000) + 10000, success: true };
  }

  const cfg = getDentalinkConfig();
  const payload: Record<string, unknown> = {
    id_paciente: cita.id_paciente,
    id_dentista: cita.id_dentista,
    id_sucursal: cita.id_sucursal || cfg.sucursalId,
    id_estado: cita.id_estado || cfg.estadoDefaultId,
    fecha: cita.fecha,
    hora_inicio: toSecondsTime(cita.hora_inicio),
    hora_fin: toSecondsTime(cita.hora_fin),
    motivo: cita.motivo || "Consulta Dental Web",
    comentarios: cita.comentarios || "[Origen: Web BeHappy Dental]",
  };
  if (cita.id_sillon) payload.id_sillon = cita.id_sillon;

  const res = await callDentalinkApi<DentalinkApiResponse<{ id: number }>>("citas", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    id: res.data.id,
    success: true,
  };
}

export async function getDentalinkEstados(): Promise<DentalinkEstado[]> {
  if (!isDentalinkConfigured()) return [];

  const now = Date.now();
  if (estadosCache && now - estadosCache.fetchedAt < ESTADOS_CACHE_TTL_MS) {
    return estadosCache.items;
  }

  const res = await callDentalinkApi<DentalinkApiResponse<DentalinkEstado[]>>("citas/estados");
  const items = (res.data || []).filter(
    (estado) => estado && typeof estado.id === "number" && typeof estado.nombre === "string"
  );
  estadosCache = { fetchedAt: now, items };
  return items;
}

export async function resolveDentalinkEstadoId(candidates: string[]): Promise<number | null> {
  try {
    const estados = await getDentalinkEstados();
    const normalized = candidates.map(normalizeText);
    for (const estado of estados) {
      const nombre = normalizeText(estado.nombre);
      if (normalized.some((candidate) => nombre.includes(candidate))) return estado.id;
    }
  } catch (error) {
    console.warn("[Dentalink Client] No se pudieron resolver los estados de cita:", error);
  }
  return null;
}

export async function updateDentalinkCitaEstado(idCita: number, idEstado: number): Promise<void> {
  await callDentalinkApi(`citas/${idCita}`, {
    method: "PUT",
    body: JSON.stringify({ id_estado: idEstado }),
  });
}

function generateMockAvailability(fecha: string, sucursalId: number): DentalinkAgendaSlot[] {
  const slots: DentalinkAgendaSlot[] = [
    { id_dentista: 1, id_sucursal: sucursalId, id_sillon: 1, fecha, hora_inicio: "10:00", hora_fin: "10:30" },
    { id_dentista: 1, id_sucursal: sucursalId, id_sillon: 1, fecha, hora_inicio: "11:00", hora_fin: "11:30" },
    { id_dentista: 1, id_sucursal: sucursalId, id_sillon: 1, fecha, hora_inicio: "12:00", hora_fin: "12:30" },
    { id_dentista: 2, id_sucursal: sucursalId, id_sillon: 2, fecha, hora_inicio: "15:00", hora_fin: "15:30" },
    { id_dentista: 2, id_sucursal: sucursalId, id_sillon: 2, fecha, hora_inicio: "16:30", hora_fin: "17:00" },
    { id_dentista: 3, id_sucursal: sucursalId, id_sillon: 3, fecha, hora_inicio: "17:30", hora_fin: "18:00" },
    { id_dentista: 3, id_sucursal: sucursalId, id_sillon: 3, fecha, hora_inicio: "18:30", hora_fin: "19:00" },
  ];
  return slots;
}
