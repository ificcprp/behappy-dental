# PLAN TÉCNICO DETALLADO — CENTRO DENTAL BEHAPPY OS

> **Documento de Especificación de Datos, Flujos Clínicos y Pasarelas de Pago**
> **Adaptado desde**: Estructura de ingeniería de `IFICC APP`.

---

## 1. ESQUEMA DE BASE DE DATOS POSTGRESQL (SUPABASE)

El modelo relacional clínico se compone de tablas con Row Level Security (RLS) activo:

```sql
-- 1. Perfiles de Usuario (Extensión de auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    rut TEXT UNIQUE,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('paciente', 'doctor', 'recepcion', 'admin')),
    prevision TEXT DEFAULT 'Fonasa',
    convenio_level TEXT DEFAULT '20%',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Especialistas / Odontólogos
CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    specialty TEXT NOT NULL,
    registration_number TEXT, -- Superintendencia de Salud
    image_url TEXT,
    bio TEXT,
    default_box TEXT DEFAULT 'Box 1',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Catálogo de Tratamientos Clínicos
CREATE TABLE public.treatments (
    id TEXT PRIMARY KEY, -- ej: 'invisalign', 'blanqueamiento'
    name TEXT NOT NULL,
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

-- 4. Agenda y Citas de Box
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id),
    doctor_id UUID REFERENCES public.doctors(id),
    treatment_id TEXT REFERENCES public.treatments(id),
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    box TEXT NOT NULL DEFAULT 'Box 1',
    status TEXT NOT NULL CHECK (status IN ('en_espera', 'en_box', 'confirmada', 'finalizada', 'cancelada')),
    price_clp INTEGER NOT NULL DEFAULT 35000,
    convenio_discount_clp INTEGER DEFAULT 14000,
    payment_status TEXT DEFAULT 'pendiente' CHECK (payment_status IN ('pendiente', 'pagado', 'parcial', 'anulado')),
    flow_order_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Fichas Clínicas SOAP y Odontograma
CREATE TABLE public.clinical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id) NOT NULL,
    doctor_id UUID REFERENCES public.doctors(id) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    diagnosis TEXT NOT NULL,
    treatment_performed TEXT NOT NULL,
    prescription TEXT,
    next_step TEXT,
    odontogram_json JSONB, -- Estado de las 32 piezas dentales
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CMS y Configuración de Sede
CREATE TABLE public.site_cms_payloads (
    id TEXT PRIMARY KEY DEFAULT 'current',
    treatments_payload JSONB NOT NULL,
    doctors_payload JSONB NOT NULL,
    contact_payload JSONB NOT NULL,
    announcements_payload JSONB NOT NULL,
    promotions_payload JSONB NOT NULL,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. INTEGRACIÓN DE PAGOS: PATRÓN FLOW.CL (CHILE)

Siguiendo el patrón arquitectónico de `IFICC APP` (donde se implementó un proveedor de pago robusto para Chile):

```
┌────────────────────────────────────────────────────────┐
│  Paciente solicita Cita o Abono de Tratamiento        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Next.js API Route (/api/pagos/flow/create)            │
│  - Genera orden con monto en CLP                       │
│  - Aplica descuento de Convenio BeHappy (ej: 40%)     │
│  - Firma criptográfica HMAC-SHA256 con API Secret      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Pasarela Flow.cl                                      │
│  - Soporta Webpay Plus, Servipag, BancoEstado, Mach   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Webhook /api/pagos/flow/webhook                       │
│  - Verifica firma criptográfica                        │
│  - Actualiza estado de la cita a 'confirmada'          │
│  - Notifica a Recepción y envía WhatsApp a paciente    │
└────────────────────────────────────────────────────────┘
```

---

## 3. CICLO DE VIDA DEL CMS EN VIVO

1. **Lectura Inmediata**: Los componentes públicos cargan inicialmente desde `cmsStore.ts` y localStorage en el cliente, logrando renderizado sin bloqueo.
2. **Edición Segura**: Exclusivamente los usuarios con rol `admin` tienen acceso a la vista `<SiteCmsEditor />` desde el sidebar.
3. **Broadcasting**: Al hacer clic en "Guardar y Publicar en Vivo", se dispara un `CustomEvent('behappy_cms_updated')` en la ventana del navegador.
4. **Actualización Reactiva**: Todos los componentes escuchando el evento (`RealTreatmentsGrid`, `TopAnnouncementTicker`, `DoctorsSection`) re-renderizan sus datos al instante.
5. **Persistencia en la Nube**: El payload se despacha vía `POST /api/cms` para persistir la copia maestra en Supabase PostgreSQL.
