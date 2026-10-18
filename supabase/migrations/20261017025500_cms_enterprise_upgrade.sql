-- ==============================================================================
-- CENTRO DENTAL BEHAPPY - CMS ENTERPRISE UPGRADE MIGRATION
-- Versiones, Auditoría Clínica, Matriz Arancelaria y Acreditación Sanitaria
-- ==============================================================================

-- 1. Tabla de Versiones y Auditoría Sanitaria del CMS
CREATE TABLE IF NOT EXISTS public.cms_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    version_tag TEXT NOT NULL, -- ej: "v2.5 - Aranceles Noviembre 2026"
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
CREATE POLICY "Permitir lectura de versiones a usuarios autenticados"
    ON public.cms_versions
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Permitir inserción y actualización de versiones a personal autorizado" ON public.cms_versions;
CREATE POLICY "Permitir inserción y actualización de versiones a personal autorizado"
    ON public.cms_versions
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Ampliación de Tabla de Tratamientos (Matriz Arancelaria y Gobernanza Médica)
CREATE TABLE IF NOT EXISTS public.treatments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT NOT NULL,
    tag TEXT NOT NULL,
    image TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    clinical_indication TEXT NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    estimated_price_clp INTEGER DEFAULT 35000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS price_base_clp INTEGER DEFAULT 35000;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS price_club_clp INTEGER DEFAULT 21000;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS fonasa_code TEXT;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS box_duration_minutes INTEGER DEFAULT 30;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS informed_consent_url TEXT;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS contraindications TEXT[] DEFAULT '{}';
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS before_after_images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.treatments ADD COLUMN IF NOT EXISTS installments_max INTEGER DEFAULT 12;

-- 3. Ampliación de Tabla de Doctores (Acreditación Superintendencia de Salud & Box)
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    specialty TEXT NOT NULL,
    registration_number TEXT,
    image_url TEXT,
    bio TEXT,
    default_box TEXT DEFAULT 'Box 1',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS sis_registration_number TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS university_degree TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS is_available_online BOOLEAN DEFAULT TRUE;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS assigned_box TEXT DEFAULT 'Box 1';
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS allowed_treatment_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS weekly_schedule_json JSONB DEFAULT '{}'::jsonb;

-- 4. Bucket de Almacenamiento Seguro para Medios Clínicos (Supabase Storage)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('clinic-media', 'clinic-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Permitir lectura pública de medios clínicos en clinic-media" ON storage.objects;
CREATE POLICY "Permitir lectura pública de medios clínicos en clinic-media"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'clinic-media');

DROP POLICY IF EXISTS "Permitir subida de medios a usuarios autorizados en clinic-media" ON storage.objects;
CREATE POLICY "Permitir subida de medios a usuarios autorizados en clinic-media"
    ON storage.objects FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'clinic-media');

DROP POLICY IF EXISTS "Permitir actualización y borrado de medios en clinic-media" ON storage.objects;
CREATE POLICY "Permitir actualización y borrado de medios en clinic-media"
    ON storage.objects FOR ALL
    TO anon, authenticated
    USING (bucket_id = 'clinic-media');
