-- ==============================================================================
-- CENTRO DENTAL BEHAPPY - ESQUEMA DE AUTENTICACIÓN Y SEGMENTACIÓN DE ROLES
-- ==============================================================================

-- 1. Tipo Enum para Roles de Usuario
CREATE TYPE user_role AS ENUM ('paciente', 'doctor', 'recepcion', 'admin');

-- 2. Tabla Perfiles de Usuario (Extensión de auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    rut TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'paciente',
    prevision TEXT DEFAULT 'Fonasa',
    convenio_level TEXT DEFAULT '20%',
    specialty TEXT, -- Exclusivo para doctores
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla Fichas Clínicas y Evoluciones (Notas SOAP)
CREATE TABLE IF NOT EXISTS public.fichas_clinicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.profiles(id),
    doctor_name TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment_performed TEXT NOT NULL,
    prescription TEXT,
    next_step TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla Odontograma por Pieza Dental
CREATE TABLE IF NOT EXISTS public.odontogramas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.profiles(id),
    tooth_number INT NOT NULL CHECK (tooth_number >= 11 AND tooth_number <= 85),
    status TEXT NOT NULL DEFAULT 'sano', -- 'sano', 'caries', 'obturado', 'corona', 'implante', 'extraccion_indicada'
    surface_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (paciente_id, tooth_number)
);

-- 5. Tabla Convenios y Descuentos BeHappy
CREATE TABLE IF NOT EXISTS public.convenios_pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL, -- 'Plan Preventivo', 'Plan Oro 40%', 'Plan Corporativo'
    discount_percentage INT NOT NULL DEFAULT 20,
    status TEXT NOT NULL DEFAULT 'activo', -- 'activo', 'vencido', 'suspendido'
    valid_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Trigger para crear automáticamente el perfil al registrar usuario en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Paciente BeHappy'),
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'paciente'::user_role)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fichas_clinicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odontogramas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.convenios_pacientes ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad:
-- Paciente: Solo puede ver su propio perfil, citas y fichas
CREATE POLICY "Pacientes pueden ver su propio perfil" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

-- Staff (Doctor, Recepción, Admin) pueden ver todos los perfiles
CREATE POLICY "Staff puede ver todos los perfiles" 
    ON public.profiles FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('doctor', 'recepcion', 'admin')
        )
    );

-- Fichas Clínicas: Paciente lee la suya, doctores crean/editan
CREATE POLICY "Pacientes pueden leer sus fichas clínicas" 
    ON public.fichas_clinicas FOR SELECT 
    USING (paciente_id = auth.uid());

CREATE POLICY "Doctores y Admins pueden crear fichas clínicas" 
    ON public.fichas_clinicas FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );
