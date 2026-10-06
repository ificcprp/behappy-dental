# INVENTARIO TÉCNICO DE PRODUCTO — CENTRO DENTAL BEHAPPY

> **Inventario exhaustivo de páginas, componentes, endpoints, modelos y activos en producción.**
> **Fecha de corte**: Octubre 2026.

---

## 1. INVENTARIO DE PÁGINAS (App Router Next.js 15)

| Ruta | Propósito | Estado |
| :--- | :--- | :--- |
| `/` | Landing page principal con Hero, 20 tratamientos, doctores, convenios, ubicación y reserva | ✅ Producción |
| `/tratamientos` | Catálogo dedicado con los 20 tratamientos reales en alta resolución y dark mode | ✅ Producción |
| `/precios` | Calculadora de aranceles y desglose de descuentos con Convenio BeHappy (hasta 40%) | ✅ Producción |
| `/nosotros` | Presentación del cuerpo médico con los 8 odontólogos de la clínica | ✅ Producción |
| `/galeria` | Casos clínicos reales de estética, ortodoncia e implantes | ✅ Producción |
| `/contacto` | Dirección (Suecia 3580), teléfono, WhatsApp y formulario de contacto | ✅ Producción |
| `/login` | Acceso seguro con selector por rol y 4 botones de acceso rápido (1-clic) | ✅ Producción |
| `/registro` | Creación de ficha de paciente con RUT y previsión | ✅ Producción |
| `/portal` | Dental OS & ERP clínico con **Sidebar de Administración y Editor CMS Web en Vivo** | ✅ Producción |
| `/_not-found` | Página 404 estilizada con enlaces de retorno | ✅ Producción |

---

## 2. INVENTARIO DE ROUTE HANDLERS (API)

| Endpoint | Métodos | Propósito |
| :--- | :--- | :--- |
| `/api/cms` | `GET`, `POST` | Obtención y actualización del payload de contenido del sitio web (tratamientos, doctores, contacto, ticker) |
| `/api/citas` | `GET`, `POST`, `PATCH` | Agendamiento de citas, consulta de agenda por Box y actualización de estado de atención |

---

## 3. COMPONENTES PRINCIPALES

### Portal Clínico & Administración
- `SiteCmsEditor.tsx`: Editor visual para los 20 tratamientos, 8 doctores, datos de contacto, ticker de anuncios y seguros.
- `PortalContent`: Núcleo de Dental OS con lógica condicional para los 4 roles (Paciente, Doctor, Recepción, Admin).

### Componentes Públicos del Centro Dental
- `RealTreatmentsGrid.tsx`: Grilla interactiva reactiva conectada al CMS con selector de categorías y modal de ficha clínica.
- `TopAnnouncementTicker.tsx`: Cintillo rotativo superior conectado a los anuncios del CMS.
- `DoctorsSection.tsx`: Directorio del equipo médico suscrito a actualizaciones en vivo.
- `AppointmentBookingSection.tsx`: Formulario integrado de reserva de horas con validación de horarios y derivación a WhatsApp.
- `Navbar.tsx` & `Footer.tsx`: Navegación principal institucional con logo corporativo y enlaces directos.

---

## 4. INVENTARIO DE DATOS Y ACTIVOS CLÍNICOS

### Los 20 Tratamientos Clínicos Reales (`/public/images/treatments_real/`)
1. Blanqueamiento Dental (`blanqueamiento.jpg`)
2. Ortodoncia Convencional (`ortodoncia.jpg`)
3. Implantes Dentales Titanio (`implantes.jpg`)
4. Radiografías Digitales (`radiografias.jpg`)
5. Extracción Simple y Compleja (`extraccion.jpg`)
6. Ortodoncia Invisible Invisalign® (`invisalign.jpg`)
7. Coronas y Carillas de Porcelana (`coronas.jpg`)
8. Revisión y Diagnóstico General (`revision.jpg`)
9. Prótesis Dentales (`protesis.jpg`)
10. Odontopediatría Integral (`odontopediatria.jpg`)
11. Limpieza y Profilaxis Ultrasonido (`limpieza.jpg`)
12. Tratamiento de Periodontitis (`periodontitis.jpg`)
13. Extracción Muelas del Juicio (`extraccion-muelas-juicio.jpg`)
14. Prevención de Caries & Flúor (`prevencion-caries.jpg`)
15. Diseño Digital de Sonrisa (`diseno-sonrisa.jpg`)
16. Tratamiento de Bruxismo & Plano (`bruxismo.jpg`)
17. Tratamiento de Caries e Incrustaciones (`caries.jpg`)
18. Endodoncia Mecanizada (`endodoncia.jpg`)
19. Reconstrucción de Mordida (`reconstruccion-mordida.jpg`)
20. Sedación y Anestesia Sin Dolor (`anestesia.jpg`)

### Los 8 Odontólogos (`/public/images/doctors/`)
1. Dr. Johnny Lugo (Ortodoncia & Fundador)
2. Dr. Juan José Herrera (Cirugía e Implantes)
3. Dra. Keila Rodríguez González (Estética & Rehabilitación)
4. Dra. Maythe Gamboa (Endodoncia)
5. Dra. Natascha Martins (Odontopediatría)
6. Dra. Gabriela Fernández (Periodoncia)
7. Dr. William (Rehabilitación Oral)
8. Dra. María Helena (Cirugía Menor)
