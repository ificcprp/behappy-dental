# BEHAPPY DENTAL OS — AGENTS.md

> **Guía y Contexto Técnico para Agentes de Inteligencia Artificial & Desarrolladores**.
> **Repositorio**: `ificcprp/behappy-dental`
> **Producción Vercel**: `https://behappy-dental.vercel.app`
> **Sede Física**: Suecia 3580, OF. 304, Ñuñoa, Santiago, Chile.

---

## 1. STACK TECNOLÓGICO COMPLETO

### Core Web & Runtime
| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| **Next.js** | `15.5.x` (App Router) | Framework fullstack de React |
| **React** | `19.x` | Librería de interfaz de usuario |
| **TypeScript** | `5.x` | Tipado estricto en todo el codebase |
| **Node.js** | `>=20` | Runtime de ejecución |

### Base de Datos & Backend
| Tecnología | Propósito |
| :--- | :--- |
| **Supabase (PostgreSQL)** | Base de datos relacional para citas, pacientes, fichas SOAP y tablas dentales |
| **@supabase/supabase-js** | Cliente JS para consultas y sincronización |
| **Row Level Security (RLS)** | Políticas de seguridad a nivel de fila por rol |

### UI & Estilos
| Tecnología | Propósito |
| :--- | :--- |
| **TailwindCSS** | Sistema de diseño utilitario (paleta dark/light editorial) |
| **lucide-react** | Iconografía médica, clínica y de navegación |
| **Geist Sans / Mono** | Tipografías de alta legibilidad técnica |

### Pagos & Notificaciones (Proyección IFICC Adaptada)
| Tecnología | Propósito |
| :--- | :--- |
| **Flow.cl** | Pasarela de pagos líder en Chile (Webpay, Servipag, Multicaja en CLP) |
| **WhatsApp Business Webhooks** | Confirmación automatizada de citas y recordatorios |

---

## 2. ESTRUCTURA DEL PROYECTO

```
behappy-dental/
├── docs/                                # Documentación de arquitectura a largo plazo
│   ├── CONSTITUCION.md                 # Pilares técnicos y de negocio
│   ├── AGENTS.md                       # Este archivo (guía de agentes)
│   ├── PLAN_TECNICO_DETALLADO.md       # Arquitectura de datos y flujos clínicos
│   └── INVENTARIO_TECNICO_PRODUCTO.md  # Inventario completo de módulos y páginas
│
├── public/
│   └── images/
│       ├── brand/                      # Logotipo oficial
│       ├── doctors/                    # Los 8 odontólogos de la clínica
│       └── treatments_real/            # Fotografías reales de los 20 tratamientos
│
├── src/
│   ├── domain/                         # Modelos y entidades de dominio puro
│   │   ├── paciente.ts
│   │   ├── doctor.ts
│   │   ├── cita.ts
│   │   └── tratamiento.ts
│   │
│   ├── application/                    # Casos de uso de negocio clínico
│   │   ├── auth/                       # Gestión de sesiones y roles
│   │   ├── citas/                      # Reglas de agendamiento y boxes
│   │   └── cms/                        # Control y publicación de contenidos
│   │
│   ├── infrastructure/                 # Clientes de BD, APIs y almacenamiento
│   │   ├── supabase/                   # Cliente Supabase y queries SQL
│   │   └── payments/                   # Adaptadores de pago (Flow.cl)
│   │
│   ├── components/                     # Componentes React
│   │   ├── dental/                     # Secciones públicas (Hero, Tratamientos, Doctores)
│   │   └── portal/                     # Dental OS & CMS Editor
│   │
│   ├── data/                           # Datos precargados clínicos
│   │   ├── clinicInfo.ts               # Horarios, dirección, WhatsApp
│   │   ├── doctors.ts                  # Perfiles de los 8 doctores
│   │   ├── treatments.ts               # Fichas de los 20 tratamientos
│   │   └── portalMockData.ts           # Expedientes y odontograma base
│   │
│   └── app/                            # Rutas públicas y API endpoints de Next.js
│       ├── page.tsx                    # Landing Page principal
│       ├── tratamientos/               # Catálogo completo con dark mode
│       ├── precios/                    # Planes de convenio y aranceles
│       ├── nosotros/                   # Cuerpo médico acreditado
│       ├── galeria/                    # Casos clínicos antes/después
│       ├── contacto/                   # Mapa, WhatsApp y formulario
│       ├── portal/                     # Dental OS con Sidebar Admin (CMS en vivo)
│       ├── login/                      # Login con accesos directos por rol
│       ├── registro/                   # Alta de nuevo paciente
│       └── api/                        # Route Handlers (/api/cms, /api/citas)
```

---

## 3. ROLES Y MATRIZ DE PERMISOS

| Rol | Identificador | Capacidades |
| :--- | :--- | :--- |
| **Dirección / Admin** | `admin` | Acceso total al **Sidebar CMS**, edición de la web pública, dashboard de métricas, control de citas y reasignación de roles de usuario. |
| **Doctor(a)** | `doctor` | Acceso a agenda de su Box, visualización de pacientes asignados, redacción de notas clínicas SOAP y actualización del odontograma. |
| **Recepción** | `recepcion` | Vista de sala de espera en tiempo real, registro de pacientes *walk-in*, asignación rápida de box y cobro de copagos. |
| **Paciente** | `paciente` | Consulta de su expediente clínico, historial de citas, ahorro acumulado por convenio (hasta 40%) y agendamiento de nuevas horas. |

---

## 4. CONVENCIONES PARA AGENTES DE IA

1. **No romper la compilación**: Toda modificación debe compilar limpiamente con `next build`.
2. **Preservar los 20 tratamientos y fotografías**: Las imágenes en `/images/treatments_real/` son activos reales de alta resolución y deben conservarse.
3. **Persistencia dual**: Toda funcionalidad del CMS y roles debe funcionar de inmediato para pruebas locales (`localStorage` + eventos reactivos) y soportar sincronización con Supabase vía API.
4. **Respetar la Constitución**: Consultar siempre `docs/CONSTITUCION.md` antes de proponer cambios estructurales mayores.
