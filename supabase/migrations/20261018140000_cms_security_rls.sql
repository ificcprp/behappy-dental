-- ==============================================================================
-- CENTRO DENTAL BEHAPPY - CMS RLS HARDENING
-- Cierra la escritura anónima directa a Supabase y oculta el borrador al público.
-- La API (/api/cms) sigue funcionando: usa SUPABASE_SERVICE_ROLE_KEY en el servidor.
-- Ejecutar en el SQL Editor de Supabase.
-- ==============================================================================

-- 1. site_cms_payloads:
--    - Lectura pública SOLO de la fila publicada ('current'); el borrador ('draft') queda privado.
--    - Se elimina la política de escritura abierta (anon/authenticated):
--      la escritura queda reservada al service_role (que omite RLS) vía /api/cms autenticado.
DROP POLICY IF EXISTS "Permitir lectura pública del CMS" ON public.site_cms_payloads;
DROP POLICY IF EXISTS "Lectura pública solo del contenido publicado" ON public.site_cms_payloads;
CREATE POLICY "Lectura pública solo del contenido publicado"
    ON public.site_cms_payloads
    FOR SELECT
    TO anon, authenticated
    USING (id = 'current');

DROP POLICY IF EXISTS "Permitir actualización del CMS desde portal administrativo" ON public.site_cms_payloads;

-- 2. cms_versions (historial de auditoría):
--    - Sin acceso anónimo de lectura ni escritura; solo service_role (API autenticada).
DROP POLICY IF EXISTS "Permitir lectura de versiones a usuarios autenticados" ON public.cms_versions;
DROP POLICY IF EXISTS "Permitir inserción y actualización de versiones a personal autorizado" ON public.cms_versions;
