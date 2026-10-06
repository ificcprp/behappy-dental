-- Tablas del Sistema de Gestión de Citas y Pacientes - Centro Dental BeHappy
-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS public.citas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_email TEXT,
    doctor_id TEXT,
    doctor_name TEXT,
    treatment_id TEXT NOT NULL,
    treatment_name TEXT NOT NULL,
    preferred_date DATE,
    preferred_time_slot TEXT, -- 'mañana' o 'tarde'
    notes TEXT,
    status TEXT DEFAULT 'solicitada' CHECK (status IN ('solicitada', 'confirmada', 'atendida', 'cancelada')),
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT
);

-- Índices para búsqueda rápida en el panel de recepción
CREATE INDEX IF NOT EXISTS idx_citas_created_at ON public.citas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_citas_status ON public.citas(status);
CREATE INDEX IF NOT EXISTS idx_citas_patient_phone ON public.citas(patient_phone);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;

-- Política 1: Permitir inserción anónima para que los pacientes puedan solicitar horas desde la web
CREATE POLICY "Permitir solicitud de citas públicas" ON public.citas
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Política 2: Solo personal autenticado (secretaria, doctores) puede leer y actualizar citas
CREATE POLICY "Permitir lectura de citas a usuarios autenticados" ON public.citas
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Permitir actualización de citas a usuarios autenticados" ON public.citas
    FOR UPDATE
    TO authenticated
    USING (true);
