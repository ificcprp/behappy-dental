-- ==============================================================================
-- CENTRO DENTAL BEHAPPY — SINCRONIZACIÓN DEL CLUB CON DENTALINK
-- Registra en cada suscripción el paciente y estado de sincronización del
-- convenio Club BeHappy en Dentalink (POST/DELETE /pacientes/{id}/convenios).
-- Idempotente: seguro de ejecutar aunque ya esté aplicado.
-- ==============================================================================

ALTER TABLE public.suscripciones_club
    ADD COLUMN IF NOT EXISTS dentalink_paciente_id BIGINT;

ALTER TABLE public.suscripciones_club
    ADD COLUMN IF NOT EXISTS dentalink_convenio_synced_at TIMESTAMPTZ;

ALTER TABLE public.suscripciones_club
    ADD COLUMN IF NOT EXISTS dentalink_sync_error TEXT;
