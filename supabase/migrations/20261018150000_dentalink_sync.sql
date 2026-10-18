-- ==============================================================================
-- CENTRO DENTAL BEHAPPY — VÍNCULO CON DENTALINK EN CITAS
-- Agrega la columna para persistir el id de cita de Dentalink y permitir
-- la sincronización de estados (PUT /citas/{id_cita}) desde el portal.
-- Idempotente: seguro de ejecutar aunque ya esté aplicado.
-- ==============================================================================

ALTER TABLE public.citas ADD COLUMN IF NOT EXISTS dentalink_cita_id BIGINT;

CREATE INDEX IF NOT EXISTS idx_citas_dentalink_cita_id ON public.citas(dentalink_cita_id);
