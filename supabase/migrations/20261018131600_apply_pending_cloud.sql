-- ==============================================================================
-- CENTRO DENTAL BEHAPPY — APLICACIÓN PENDIENTE DE ESQUEMA CLOUD (ejecutar 1 vez)
-- Consolida y aplica lo que faltaba en la base de datos:
--   1) site_cms_payloads (CMS en vivo)      4) columnas de pago en citas
--   2) cms_versions (auditoría)             5) clinical_records (fichas)
--   3) suscripciones_club (Club BeHappy)    6) bucket clinic-media
-- Seguridad: todas las escrituras pasan por la API Next.js con service_role;
-- no se crean políticas de escritura anónima.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CMS en vivo
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_cms_payloads (
    id TEXT PRIMARY KEY DEFAULT 'current',
    full_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    treatments_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    doctors_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    contact_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    announcements_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    promotions_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    membership_plans_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_cms_payloads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública del CMS" ON public.site_cms_payloads;
DROP POLICY IF EXISTS "Permitir actualización del CMS desde portal administrativo" ON public.site_cms_payloads;
DROP POLICY IF EXISTS "Lectura pública solo del contenido publicado" ON public.site_cms_payloads;

-- Lectura pública SOLO de la fila publicada ('current'); el borrador queda privado
CREATE POLICY "Lectura pública solo del contenido publicado"
    ON public.site_cms_payloads
    FOR SELECT
    TO anon, authenticated
    USING (id = 'current');

-- ------------------------------------------------------------------------------
-- 2. Historial de versiones del CMS (solo service_role)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    version_tag TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    payload JSONB NOT NULL,
    change_summary TEXT,
    is_active_production BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_cms_versions_status ON public.cms_versions(status);
CREATE INDEX IF NOT EXISTS idx_cms_versions_active ON public.cms_versions(is_active_production);
CREATE INDEX IF NOT EXISTS idx_cms_versions_created_at ON public.cms_versions(created_at DESC);

ALTER TABLE public.cms_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura de versiones a usuarios autenticados" ON public.cms_versions;
DROP POLICY IF EXISTS "Permitir inserción y actualización de versiones a personal autorizado" ON public.cms_versions;

-- ------------------------------------------------------------------------------
-- 3. Suscripciones del Club BeHappy (solo service_role)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.suscripciones_club (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    titular_name TEXT NOT NULL,
    titular_rut TEXT,
    titular_phone TEXT NOT NULL,
    titular_email TEXT,
    plan_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
    monthly_amount_clp INTEGER NOT NULL,
    cargas_count INTEGER NOT NULL DEFAULT 0,
    flow_subscription_id TEXT,
    status TEXT NOT NULL DEFAULT 'pendiente_activacion' CHECK (status IN ('pendiente_activacion', 'activa', 'pausada', 'cancelada')),
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_suscripciones_club_status ON public.suscripciones_club(status);
CREATE INDEX IF NOT EXISTS idx_suscripciones_club_phone ON public.suscripciones_club(titular_phone);

ALTER TABLE public.suscripciones_club ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir registro público de solicitudes al Club BeHappy" ON public.suscripciones_club;
DROP POLICY IF EXISTS "Permitir gestión de suscripciones a personal autenticado" ON public.suscripciones_club;

-- ------------------------------------------------------------------------------
-- 4. Citas: columnas de pago + cierre de la inserción anónima directa
--    (los pacientes reservan vía /api/citas, que valida, limita y usa service_role)
-- ------------------------------------------------------------------------------
ALTER TABLE public.citas ADD COLUMN IF NOT EXISTS payment_status TEXT;
ALTER TABLE public.citas ADD COLUMN IF NOT EXISTS flow_order_id TEXT;

DROP POLICY IF EXISTS "Permitir solicitud de citas públicas" ON public.citas;

-- ------------------------------------------------------------------------------
-- 5. Fichas clínicas en la nube (tabla usada por /api/clinica/records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clinical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    patient_id TEXT NOT NULL,
    doctor_name TEXT,
    diagnosis TEXT NOT NULL,
    treatment_performed TEXT NOT NULL,
    prescription TEXT,
    next_step TEXT,
    odontogram_json JSONB
);

CREATE INDEX IF NOT EXISTS idx_clinical_records_patient ON public.clinical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_records_created_at ON public.clinical_records(created_at DESC);

ALTER TABLE public.clinical_records ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6. Bucket público de imágenes del CMS (lectura pública, escritura vía API)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('clinic-media', 'clinic-media', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/avif'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Permitir lectura pública de medios clínicos en clinic-media" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida de medios a usuarios autorizados en clinic-media" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización y borrado de medios en clinic-media" ON storage.objects;
DROP POLICY IF EXISTS "clinic-media lectura publica" ON storage.objects;

CREATE POLICY "clinic-media lectura publica"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'clinic-media');
