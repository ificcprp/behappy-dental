# CONSTITUCIÓN DEL PROYECTO — CENTRO DENTAL BEHAPPY OS

> **Propósito**: Definir las reglas fundamentales de arquitectura, estándares técnicos, modelo de negocio clínico y directrices de desarrollo para el software de **Centro Dental BeHappy**.
> **Modelo de Referencia**: Clean Architecture & Enterprise Standards adaptados desde la plataforma de software de `IFICC APP`.
> **Última actualización**: Octubre 2026.

---

## 1. IDIOMA Y ESTILO DE COMUNICACIÓN

- **Idioma Oficial**: Todo el código, comentarios, commits, documentación técnica (`docs/`), nombres de dominio y respuestas DEBEN estar en **español**.
- **Vocabulario Clínico Estándar**: Usar terminología odontológica formal chilena (RUT, Fonasa, Isapre, Box Clínico, Ficha SOAP, Odontograma FDI, Superintendencia de Salud).

---

## 2. PILARES ARQUITECTÓNICOS

### 2.1 Clean Architecture (Arquitectura Limpia)
El sistema divide su lógica en 4 capas estrictas dentro de `src/`:

```
src/
├── domain/            # Capa 1: Entidades puras de la clínica dental (sin dependencias externas)
│   ├── paciente/      # Datos del paciente, RUT, previsión, nivel de convenio
│   ├── doctor/        # Odontólogos, especialidad médica, número de registro SIS
│   ├── cita/          # Agendas, boxes (1, 2, 3), estados de atención
│   ├── tratamiento/   # Los 20 tratamientos clínicos, categorías, precios e insumos
│   ├── ficha-clinica/ # Ficha clínica SOAP (Subjetivo, Objetivo, Análisis, Plan) y Odontograma
│   └── pago/          # Presupuestos, copagos, pagos en línea (Flow.cl CLP)
│
├── application/       # Capa 2: Casos de uso y reglas de negocio del centro dental
│   ├── citas/         # Agendamiento, reprogramación, sala de espera
│   ├── clinica/       # Guardado de notas SOAP, actualización de odontograma
│   ├── cms/           # Actualización y publicación en vivo del sitio web público
│   └── pagos/         # Generación de cobros, validación de convenios
│
├── infrastructure/    # Capa 3: Implementaciones externas, bases de datos y pasarelas
│   ├── supabase/      # Cliente Supabase, RLS policies, PostgreSQL schemas
│   ├── payments/      # Integración Flow.cl (Chile), Webpay / Transbank
│   ├── storage/       # Buckets para radiografías, consentimientos informados y fotos clínicas
│   └── notifications/ # Integración WhatsApp Business API y correos transaccionales
│
└── presentation/      # Capa 4: UI, controladores, páginas de Next.js y componentes React
    ├── app/           # Next.js 15 App Router (rutas públicas y rutas del portal)
    ├── components/    # Componentes de interfaz (Dental OS, Navbar, CMS Editor, Grillas)
    └── hooks/         # Hooks reactivos de presentación
```

### 2.2 TypeScript Estricto
- `strict: true` habilitado en `tsconfig.json`.
- Prohibido el uso de `any` para entidades de negocio. Todos los modelos deben tiparse fuertemente.
- Validación de entradas y payloads mediante schemas **Zod**.

### 2.3 Seguridad de Datos Clínicos y Privacidad (Ley 20.584 Chile)
- Las fichas clínicas y odontogramas son datos sensibles de salud protegidos por la legislación chilena.
- Acceso restringido por **Row Level Security (RLS)** en PostgreSQL/Supabase:
  - Los **pacientes** solo pueden leer su propio expediente y citas.
  - Los **doctores** tienen acceso a los pacientes que atienden en sus boxes.
  - La **recepción** tiene acceso a agenda, sala de espera y pagos, sin acceso a notas clínicas profundas.
  - La **dirección médica (admin)** tiene acceso a auditoría global, métricas y CMS.

---

## 3. MODELO DE NEGOCIO Y MAPEO DE ENTIDADES (IFICC ➔ BEHAPPY)

| Módulo en Base IFICC (Académico) | Mapeo en BeHappy Dental OS (Clínico) | Propósito en la Clínica Dental |
| :--- | :--- | :--- |
| `Student` (Estudiante) | **`Paciente`** | Expediente clínico, RUT chileno, previsión (Fonasa/Isapre), convenio BeHappy. |
| `Teacher` (Profesor) | **`Doctor / Especialista`** | Odontólogos acreditados, especialidades (Ortodoncia, Implantes, Estética), Box asignado. |
| `Staff / Admin` | **`Recepción / Dirección`** | Admisión, recepción de pacientes *walk-in*, agendamiento, caja y dashboard ejecutivo. |
| `Program / Course` | **`Tratamiento / Especialidad`** | Catálogo de los 20 tratamientos reales (Invisalign, Blanqueamiento, Caries, etc.). |
| `Session / Schedule` | **`Cita Clínica / Box`** | Turnos de atención en Box 1, Box 2, Box 3 con duración, fecha y hora. |
| `Assignment / Submission` | **`Ficha Clínica SOAP / Odontograma`** | Registro médico legal de procedimientos realizados y estado de cada pieza dental. |
| `Tuition / Installments` | **`Presupuesto / Copago Dental`** | Presupuesto odontológico, descuento de convenio (hasta 40%) y cobro. |
| `Payment Gateway (Flow.cl)` | **`Pasarela Flow.cl / Transbank`** | Pago de reserva y abono de tratamientos en moneda local (CLP). |
| `Public Website` | **`Web Pública + CMS en Portal Admin`** | Catálogo editorial en vivo, 100% editable desde el sidebar de Dirección. |

---

## 4. DIRECTRICES DE EVOLUCIÓN A LARGO PLAZO

1. **Cero Regresiones Visuales**: El diseño editorial, paleta cromática, dark mode y los 20 tratamientos reales con fotografías de alta resolución deben mantenerse intactos en la capa de presentación.
2. **Modularidad**: Ningún componente de la UI debe acoplarse directamente a la base de datos sin pasar por los servicios de aplicación.
3. **Persistencia Dual**: El sistema debe operar con alta resiliencia: sincronización en memoria / caché local para latencia cero + respaldo transaccional en Supabase PostgreSQL.
4. **Auditoría Permanente**: Todo cambio clínico (modificación de diagnósticos o recetas) debe quedar registrado con marca temporal y autor médico.
