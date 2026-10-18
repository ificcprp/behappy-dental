# ARQUITECTURA DE INTEGRACIÓN REST HEADLESS: BEHAPPY WEB & DENTALINK (HEALTHATOM)

> **Documento Técnico de Ingeniería y Operación Clínica**  
> **Fecha de Emisión:** Octubre 2026  
> **Objetivo:** Conectar la plataforma web de captación y triaje de Centro Dental BeHappy (Next.js 15 App Router) directamente con el software de gestión clínica Dentalink mediante su API REST oficial, sin duplicar datos clínicos ni interrumpir el trabajo de recepción o box.

---

## 1. Filosofía de Arquitectura y Separación de Responsabilidades

Uno de los mayores errores en proyectos de digitalización dental es intentar reemplazar o duplicar el software de ficha clínica que el equipo médico ya domina. Centro Dental BeHappy opera con **Dentalink**, un sistema robusto y acreditado para la gestión interna.

Nuestra arquitectura aplica el patrón **Headless Clinical Front-Office**:

```mermaid
flowchart TD
    subgraph PACIENTE ["PACIENTE EN ÑUÑOA (Canales Externos)"]
        GAds["Google Search Ads<br/>('Dentista Ñuñoa')"]
        MetaAds["Meta Ads (Instagram)<br/>('Estética & Implantes')"]
        Organic["Búsqueda Orgánica SEO"]
    end

    subgraph FRONTEND ["FRONT-OFFICE BEHAPPY (Next.js 15 en Vercel)"]
        Landing["Web Institucional & Branding"]
        Triaje["Triaje Clínico por Síntoma"]
        Simulador["Simulador Copagos Fonasa/Isapre"]
        Engine["Motor de Reserva Headless"]
        Club["Membresías Club BeHappy (Flow.cl)"]
    end

    subgraph BACKEND_PROXY ["API PROXY SERVER (Next.js Route Handlers)"]
        Dispo["/api/dentalink/disponibilidad"]
        Citas["/api/citas"]
        Token["Capa Segura con Token Oculto"]
    end

    subgraph DENTALINK_CLOUD ["DENTALINK REST API (HealthAtom Cloud)"]
        DL_Agendas["GET /agendas<br/>(Disponibilidad de Sillones)"]
        DL_Pacientes["POST /pacientes<br/>(Ficha & RUT Paciente)"]
        DL_Citas["POST /citas<br/>(Inyección Directa en Box)"]
    end

    subgraph CLINICA_BOX ["OPERACIÓN CLÍNICA EN SUECIA 3580"]
        Monitor["Monitor Recepción Dentalink<br/>(Cita entra automáticamente)"]
        BoxEHR["Ficha Médica & Odontograma Box<br/>(Ley 20.584 / MINSAL)"]
        CajaSII["Caja, DTE Boleta SII & Liquidación"]
    end

    PACIENTE --> FRONTEND
    FRONTEND --> BACKEND_PROXY
    BACKEND_PROXY -->|Token Server-to-Server| DENTALINK_CLOUD
    DENTALINK_CLOUD --> CLINICA_BOX
```

### Matriz de Responsabilidades Estructurales

| Dominio Operativo | Administrado por **Dentalink** | Administrado por **BeHappy Web** |
| :--- | :---: | :---: |
| **Historia Clínica Electrónica (EHR)** (Ley 20.584) | **Fuente Única Oficial (100%)** | *No almacena anamnesis médica* |
| **Odontograma Clínico en Box** (Marcado de caries/implantes) | **Exclusivo en Box** | *No duplica marcado de piezas* |
| **Boletas Electrónicas SII (DTE) y Caja Chica** | **Exclusivo Dentalink** | *Solo pasarela web de abonos (Flow)* |
| **Liquidación de Honorarios a Especialistas** | **Exclusivo Dentalink** | *Cero intervención* |
| **Agenda de Sillones y Bloqueos de Horario** | **Fuente Maestra** | *Consulta disponibilidad vía API* |
| **Captación Publicitaria (Google Ads / Meta)** | *Inexistente en Dentalink* | **Motor de Atribución y Tracking CAC** |
| **Triaje Orientativo por Síntoma** | *Inexistente en Dentalink* | **Guía empática para el paciente** |
| **Simulador Pre-Consulta Fonasa/Isapre** | *Inexistente en Dentalink* | **Transparencia arancelaria en $ CLP** |
| **Membresías Preventivas Club BeHappy** | *Convenios tradicionales* | **Cobro recurrente PAC/PAT (Flow.cl)** |

---

## 2. Flujo de Integración API REST (Paso a Paso)

La integración se ejecuta de forma asíncrona y transparente para el paciente a través de los Route Handlers del servidor Next.js, protegiendo las credenciales maestras.

### Secuencia de Ejecución

```mermaid
sequenceDiagram
    autonumber
    actor Paciente as Paciente
    participant Web as Web BeHappy (Frontend)
    participant NextApi as Servidor Next.js (/api/citas)
    participant Dentalink as API REST Dentalink

    Paciente->>Web: Completa triaje, selecciona doctor y franja
    Paciente->>Web: Ingresa Nombre, RUT, Teléfono y Motivo
    Web->>NextApi: POST /api/citas (payload de reserva)
    
    rect rgb(240, 248, 240)
    Note over NextApi,Dentalink: Transacción Segura Server-to-Server
    NextApi->>Dentalink: GET /pacientes/buscar?q=RUT (con fallback fail-closed)
    alt Paciente ya existe (RUT normalizado coincide)
        Dentalink-->>NextApi: Retorna id_paciente existente
    else Paciente nuevo
        NextApi->>Dentalink: POST /pacientes (RUT, Nombre, Teléfono, Comuna)
        Dentalink-->>NextApi: Retorna nuevo id_paciente creado
    end
    
    NextApi->>Dentalink: GET agendas (disponibilidad real de la franja)
    NextApi->>Dentalink: POST /citas (id_paciente, id_dentista, sillón y hora del slot libre)
    Dentalink-->>NextApi: Retorna id_cita (persistido en citas.dentalink_cita_id)
    end

    NextApi-->>Web: Respuesta exitosa con ID de cita y link de WhatsApp
    Web-->>Paciente: Pantalla de confirmación + Botón "Añadir a Google Calendar"
```

---

## 3. Especificación Técnica de Endpoints y Payloads

### A. Autenticación y Cabeceras
La API de Dentalink utiliza autenticación por Token estático asignado a la clínica:
```http
Authorization: Token YOUR_DENTALINK_API_TOKEN
Accept: application/json
Content-Type: application/json
```
*Variable de entorno:* `process.env.DENTALINK_API_TOKEN` en Vercel (nunca expuesta al cliente ni en repositorios públicos).

*Variables de entorno del módulo Dentalink:*

| Variable | Uso | Default |
| :--- | :--- | :--- |
| `DENTALINK_API_TOKEN` | Token de API (si falta, el sistema opera en modo preview) | — |
| `DENTALINK_API_URL` | Base de la API | `https://api.dentalink.healthatom.com/api/v1` |
| `NEXT_PUBLIC_DENTALINK_AGENDA_URL` | Link directo a la agenda clásica | Agenda Clínica BeHappy |
| `DENTALINK_SUCURSAL_ID` | Id de sucursal para agenda/citas | `1` |
| `DENTALINK_TIMEOUT_MS` | Timeout de llamadas a la API | `8000` |
| `DENTALINK_DENTIST_MAP` | JSON `{"doctor-slug": id_dentista}` para mapear la web a Dentalink | `{}` |
| `DENTALINK_ESTADO_DEFAULT_ID` | Id de estado al crear citas si no se puede resolver `GET /citas/estados` | `1` |
| `DENTALINK_CLUB_CONVENIO_ID` | Id del convenio "Club BeHappy" en Dentalink para activar/desactivar membresías | — |

> **Requisito de activación:** con token configurado, una reserva solo se inyecta en Dentalink si (a) el paciente informó RUT, (b) el profesional tiene id mapeado y (c) hay disponibilidad real en la franja solicitada. Si falta cualquiera, la solicitud queda registrada en Supabase y se envía a recepción por WhatsApp (fallback manual).

---

### B. Consulta de Disponibilidad de Agenda
*Endpoint Dentalink (por dentista):*  
`GET https://api.dentalink.healthatom.com/api/v1/sucursales/{id_sucursal}/dentistas/{id_dentista}/agendas?q={"fecha":{"eq":"2026-10-25"}}`

*La respuesta oficial NO es una lista plana*: entrega un objeto anidado por fecha, hora y sillón (`fechas → "DD/MM/AAAA" → horas → "HH:MM" → sillones → {id_sillon: true | {cita}}`), donde `true` indica un sillón libre. El cliente BeHappy (`src/lib/dentalink.ts`) normaliza esta estructura y también la del endpoint general `GET /agendas` (que exige el filtro `duracion` y entrega filas con `id_paciente: 0` cuando el horario está libre).

El endpoint `GET /api/dentalink/disponibilidad` expone los slots normalizados con `source: "dentalink_live_api"` solo cuando hay token: si la API falla, responde `502` (nunca inventa disponibilidad en modo live). Sin token, responde slots simulados con `source: "dentalink_preview_mode"`.

---

### C. Creación o Localización de Paciente
*Endpoint Dentalink:*  
`POST https://api.dentalink.healthatom.com/api/v1/pacientes`

*Payload enviado por BeHappy Web:*
```json
{
  "rut": "184321092",
  "nombre": "Constanza",
  "apellidos": "Valenzuela Silva",
  "email": "c.valenzuela@gmail.com",
  "telefono": "+56987654321",
  "ciudad": "Santiago",
  "comuna": "Ñuñoa"
}
```

*Respuesta:*
```json
{
  "result": "OK",
  "data": {
    "id": 12789,
    "rut": "18.432.109-2",
    "nombre": "Constanza",
    "apellidos": "Valenzuela Silva"
  }
}
```

---

### D. Inyección de la Cita en el Sillón
*Endpoint Dentalink:*  
`POST https://api.dentalink.healthatom.com/api/v1/citas`

*Payload enviado por BeHappy Web:*
```json
{
  "id_paciente": "<id_paciente devuelto por /pacientes/buscar o POST /pacientes>",
  "id_dentista": 1,
  "id_sucursal": 1,
  "id_sillon": 1,
  "id_estado": 1,
  "fecha": "2026-10-25",
  "hora_inicio": "11:00:00",
  "hora_fin": "11:30:00",
  "motivo": "[Web] Evaluación Odontológica General",
  "comentarios": "[Captación Web BeHappy] Triaje: Dolor / Sensibilidad en molares | Doctor solicitado: Dra. María Jesús Rodríguez | Campaña: Google Search Ads (Palabra clave: 'urgencia dental ñuñoa') | Dispositivo: Móvil."
}
```
`id_sillon`, `hora_inicio` y `hora_fin` se toman del primer slot libre devuelto por la agenda real del profesional; `id_estado` se resuelve con `GET /citas/estados` (fallback `DENTALINK_ESTADO_DEFAULT_ID`).

---

### E. Convenios del Club BeHappy (membresías ↔ Dentalink)

Cuando una membresía del Club se activa o se desactiva, el sistema sincroniza el convenio de descuento en la ficha del paciente en Dentalink:

| Evento | Acción | Endpoint Dentalink |
| :--- | :--- | :--- |
| Pago Flow aprobado (webhook) o checkout simulado | Asigna el convenio Club (reemplaza las asociaciones activas previas) | `POST /pacientes/{id_paciente}/convenios` body `{"id_convenio": N}` |
| Cancelación / pausa (operación de staff) | Desasocia el convenio | `DELETE /pacientes/{id_paciente}/convenios/{id_convenio}` |

* Pipeline: `src/lib/clubConvenios.ts` (`syncClubSubscriberConvenio`) → busca al paciente por RUT con `GET /pacientes/buscar` (nunca crea fichas por sí solo), verifica con `GET /pacientes/{id_paciente}/convenios` que no esté ya asignado y luego ejecuta la acción. Los errores quedan registrados en `suscripciones_club.dentalink_sync_error`.
* Endpoint de administración para reintentos o bajas manuales: `POST /api/club/convenios` (solo admin) con body `{"subscription_id": "<uuid>", "action": "assign" | "remove"}` — también acepta `{"rut": "...", "action": ...}`. `GET /api/club/convenios?subscription_id=...` (o `?rut=...`) lista los convenios vigentes del paciente en Dentalink.
* Requisitos: `DENTALINK_API_TOKEN` y `DENTALINK_CLUB_CONVENIO_ID` configurados, y que la suscripción tenga `titular_rut`. Si el paciente aún no existe en Dentalink, la sincronización queda pendiente (visible en `dentalink_sync_error`) y puede reintentarse cuando recepción cree la ficha.

---

## 4. Telemetría de Atribución Publicitaria (El Gran Diferencial)

Dentalink por sí solo **no sabe de dónde vienen los pacientes**. La recepción solo ve que alguien agendó.

Con la integración de BeHappy Web:
1. El usuario hace clic en un anuncio de **Google Ads** o **Meta Ads**.
2. Los parámetros UTM (`utm_source`, `utm_campaign`, `utm_content`) son capturados por Next.js.
3. Al reservar, el Route Handler inyecta el origen en el campo `comentarios` de Dentalink.
4. Se dispara el evento de conversión a **Google Analytics 4 (Measurement Protocol)** y a **Meta Conversions API (CAPI)**.
5. La dirección de BeHappy puede auditar a fin de mes:
   $$\text{CAC Real} = \frac{\text{Gasto Total en Pauta Google Ads}}{\text{Citas Efectivas Asistidas en Dentalink}}$$

---

## 5. Resiliencia y Mecanismo de Fallback (Cero Pacientes Perdidos)

En odontología privada, un paciente que no logra agendar se va inmediatamente a otra clínica de la misma comuna. Por ello, la arquitectura cuenta con **doble cinturón de seguridad** (implementado hoy, sin workers en segundo plano):

1. **Si la API de Dentalink responde normalmente y hay disponibilidad real:**
   - La cita se inyecta en Dentalink (paciente deduplicado por RUT vía `GET /pacientes/buscar`, sillón y hora tomados de la agenda real).
   - El `id_cita` de Dentalink se persiste en `citas.dentalink_cita_id`, lo que permite sincronizar cambios de estado desde el portal (`PUT /citas/{id_cita}`).
   - El paciente recibe confirmación inmediata en pantalla + enlace directo para guardar en Google Calendar.
2. **Si la API falla, hay timeout (8 s), el paciente no informó RUT, el profesional no tiene id mapeado o no hay disponibilidad en la franja:**
   - El sistema no muestra error al paciente.
   - La reserva se persiste en la base de datos del servidor (Supabase) con estado `solicitada`.
   - Se ofrece el chat oficial de WhatsApp de recepción (+56 9 4757 8597) con el mensaje preformateado para confirmación y creación manual en Dentalink.
   - La respuesta de `/api/citas` indica `dentalinkPending: true` para que la operación sepa que esa reserva requiere gestión manual (no existe reintento automático).
3. **Opción Directa para el Paciente:**
   - En el pie del formulario de reserva se provee el enlace oficial directo a la agenda clásica de Dentalink:
     `https://00b229f2077285343f1ffac76fd853c23816acec.agenda.softwaredentalink.com/`

---

## 6. Cumplimiento Normativo Chileno

1. **Ley 20.584 (Derechos y Deberes de las Personas en Salud):**
   - La ficha clínica y el odontograma oficial residen de forma inalterable y exclusiva dentro de Dentalink.
   - La web no almacena antecedentes médicos sensibles ni diagnósticos definitivos.
2. **Ley 19.628 y Nueva Ley 21.719 (Protección de Datos Personales):**
   - Los datos de contacto (Nombre, RUT, Teléfono) se transmiten exclusivamente bajo túneles cifrados TLS 1.3 con certificados SSL clase A+.
   - Cero filtración de datos de pacientes a trackers publicitarios de terceros.
3. **Reglamento de Publicidad Sanitaria (Decreto Supremo Nº 57):**
   - El triaje web se declara explícitamente como **orientativo y pre-cualificatorio**, sin emitir diagnósticos médicos automatizados ni prescripción de fármacos.

---

## 7. Guía para la Administración de BeHappy: Cómo Obtener el Token en Dentalink

Para que la web comience a escribir citas directamente en la recepción, la administradora de la clínica solo debe seguir estos pasos en su cuenta de Dentalink (toma menos de 2 minutos):

1. Iniciar sesión en Dentalink con rol de **Administrador**.
2. Ir al menú superior derecho: **Administración → Configuración de la Clínica**.
3. Seleccionar la pestaña **API / Integraciones**.
4. Hacer clic en el botón verde **"+ Agregar Nuevo Cliente API"**.
5. Escribir como nombre del cliente: `BeHappy Web Engine 2026`.
6. Seleccionar los permisos:
   - `Agendas`: Lectura.
   - `Pacientes`: Lectura y Escritura.
   - `Citas`: Lectura y Escritura.
7. Copiar la clave alfanumérica generada (Token) y suministrarla por canal seguro al equipo de despliegue.

*Una vez inyectada la variable `DENTALINK_API_TOKEN` en Vercel, la sincronización queda operativa de forma instantánea.*
