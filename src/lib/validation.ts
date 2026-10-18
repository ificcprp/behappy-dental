import { z } from "zod";

export const citaSchema = z.object({
  patient_name: z.string().trim().min(2).max(160),
  patient_phone: z.string().trim().min(6).max(30),
  patient_email: z.string().trim().email().max(160).optional().or(z.literal("")),
  patient_rut: z.string().trim().max(30).optional().nullable(),
  doctor_id: z.string().trim().max(160).optional().nullable(),
  doctor_name: z.string().trim().max(160).optional().nullable(),
  treatment_id: z.string().trim().max(160).optional().nullable(),
  treatment_name: z.string().trim().min(2).max(200),
  preferred_date: z.string().trim().max(40).optional().nullable(),
  preferred_time_slot: z.string().trim().max(60).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
  utm_source: z.string().trim().max(160).optional().nullable(),
});

export const citaPatchSchema = z.object({
  id: z.string().trim().min(1).max(200),
  status: z.enum([
    "solicitada",
    "confirmada",
    "atendida",
    "cancelada",
    "pendiente",
    "en_espera",
    "en_box",
    "completada",
  ]),
});

export const sessionSchema = z.object({
  email: z.string().trim().min(3).max(200),
  password: z.string().max(200).optional(),
  demo: z.boolean().optional(),
});

export const flowCreateSchema = z.object({
  type: z.enum(["abono_cita", "copago_tratamiento", "membresia_club"]),
  amount: z.number().int().min(1000).max(100_000_000),
  subject: z.string().trim().min(2).max(300),
  email: z.string().trim().email().max(160),
  patientName: z.string().trim().min(2).max(160),
  patientPhone: z.string().trim().max(30).optional(),
  patientRut: z.string().trim().max(30).optional(),
  treatmentName: z.string().trim().max(200).optional(),
  doctorName: z.string().trim().max(160).optional(),
  appointmentId: z.string().trim().max(200).optional(),
  planId: z.string().trim().max(160).optional(),
  billingCycle: z.enum(["monthly", "annual"]).optional(),
});

export const clinicalRecordSchema = z.object({
  patient_id: z.string().trim().min(1).max(160),
  patient_name: z.string().trim().max(160).optional(),
  doctor_name: z.string().trim().max(160).optional(),
  diagnosis: z.string().trim().min(2).max(4000),
  treatment_performed: z.string().trim().min(2).max(4000),
  prescription: z.string().trim().max(4000).optional().nullable(),
  next_step: z.string().trim().max(4000).optional().nullable(),
  odontogram_json: z.unknown().optional(),
  informed_consent_json: z.unknown().optional(),
});

export function firstIssueMessage(error: z.ZodError): string {
  const issue = error.issues[0];
  return issue ? `${issue.path.join(".") || "campo"}: ${issue.message}` : "Datos inválidos";
}
