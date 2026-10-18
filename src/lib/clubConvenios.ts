import { supabase } from "@/lib/supabase";
import {
  assignDentalinkConvenio,
  findDentalinkPacienteByRut,
  getClubConvenioId,
  getDentalinkPacienteConvenios,
  isDentalinkConfigured,
  removeDentalinkConvenio,
} from "@/lib/dentalink";

export interface ClubConvenioSyncResult {
  ok: boolean;
  action: "assign" | "remove";
  reason?: string;
  pacienteId?: number;
  convenioId?: number;
  replacedConvenios?: string[];
}

async function recordSyncResult(params: {
  subscriptionId?: string;
  result: ClubConvenioSyncResult;
}): Promise<void> {
  if (!params.subscriptionId) return;
  try {
    const patch: Record<string, unknown> = params.result.ok
      ? {
          dentalink_paciente_id: params.result.pacienteId ?? null,
          dentalink_convenio_synced_at: new Date().toISOString(),
          dentalink_sync_error: null,
        }
      : {
          dentalink_sync_error: params.result.reason || "Error desconocido",
        };

    const { error } = await supabase
      .from("suscripciones_club")
      .update(patch)
      .eq("id", params.subscriptionId);
    if (error) {
      console.warn("[Club] No se pudo registrar el resultado de sincronización:", error.message);
    }
  } catch (error) {
    console.warn("[Club] No se pudo registrar el resultado de sincronización:", error);
  }
}

export async function syncClubSubscriberConvenio(params: {
  subscriptionId?: string;
  rut?: string | null;
  action: "assign" | "remove";
}): Promise<ClubConvenioSyncResult> {
  const finish = async (result: ClubConvenioSyncResult): Promise<ClubConvenioSyncResult> => {
    await recordSyncResult({ subscriptionId: params.subscriptionId, result });
    return result;
  };

  if (!isDentalinkConfigured()) {
    return finish({
      ok: false,
      action: params.action,
      reason: "Dentalink no configurado (modo preview): convenio no sincronizado.",
    });
  }

  const convenioId = getClubConvenioId();
  if (!convenioId) {
    return finish({
      ok: false,
      action: params.action,
      reason: "DENTALINK_CLUB_CONVENIO_ID no configurado.",
    });
  }

  const rut = params.rut?.trim();
  if (!rut) {
    return finish({
      ok: false,
      action: params.action,
      reason: "Suscripción sin RUT del titular.",
    });
  }

  try {
    const paciente = await findDentalinkPacienteByRut(rut);
    if (!paciente) {
      return finish({
        ok: false,
        action: params.action,
        reason:
          "Paciente no encontrado en Dentalink (se sincronizará cuando recepción cree su ficha).",
      });
    }

    if (params.action === "assign") {
      const actuales = await getDentalinkPacienteConvenios(paciente.id);
      if (actuales.some((convenio) => convenio.id === convenioId)) {
        return finish({
          ok: true,
          action: "assign",
          pacienteId: paciente.id,
          convenioId,
          reason: "El convenio ya estaba asignado.",
        });
      }

      const others = actuales
        .filter((convenio) => convenio.id !== convenioId)
        .map((convenio) => convenio.nombre || String(convenio.id));

      await assignDentalinkConvenio(paciente.id, convenioId);
      return finish({
        ok: true,
        action: "assign",
        pacienteId: paciente.id,
        convenioId,
        replacedConvenios: others,
      });
    }

    await removeDentalinkConvenio(paciente.id, convenioId);
    return finish({
      ok: true,
      action: "remove",
      pacienteId: paciente.id,
      convenioId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return finish({
      ok: false,
      action: params.action,
      reason: message.slice(0, 300),
    });
  }
}
