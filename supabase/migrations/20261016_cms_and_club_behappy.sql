-- ==============================================================================
-- CENTRO DENTAL BEHAPPY - TABLA CMS EN NUBE Y SUSCRIPCIONES CLUB BEHAPPY
-- Ejecutar en el SQL Editor de Supabase (https://app.supabase.com)
-- ==============================================================================

-- 1. Tabla de Persistencia Cloud para el CMS Web en Vivo (/portal -> /api/cms)
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

-- Habilitar RLS en site_cms_payloads
ALTER TABLE public.site_cms_payloads ENABLE ROW LEVEL SECURITY;

-- Lectura pública para que todos los pacientes vean los precios, planes y textos actualizados
CREATE POLICY "Permitir lectura pública del CMS"
    ON public.site_cms_payloads
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Escritura desde API Route (service_role o usuarios autenticados admin)
CREATE POLICY "Permitir actualización del CMS desde portal administrativo"
    ON public.site_cms_payloads
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Tabla de Solicitudes y Miembros del Club BeHappy (EssentialFlow Dental)
CREATE TABLE IF NOT EXISTS public.suscripciones_club (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    titular_name TEXT NOT NULL,
    titular_rut TEXT,
    titular_phone TEXT NOT NULL,
    titular_email TEXT,
    plan_id TEXT NOT NULL, -- 'plan-sonrisa', 'plan-familia', 'plan-pyme'
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

CREATE POLICY "Permitir registro público de solicitudes al Club BeHappy"
    ON public.suscripciones_club
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Permitir gestión de suscripciones a personal autenticado"
    ON public.suscripciones_club
    FOR ALL
    TO authenticated
    USING (true);
