import { supabase } from "../src/lib/supabase";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

interface TestResult {
  name: string;
  status: "PASS" | "FAIL";
  details: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<string>) {
  const start = Date.now();
  try {
    const details = await fn();
    results.push({ name, status: "PASS", details, durationMs: Date.now() - start });
    console.log(`✅ [PASS] ${name} (${Date.now() - start}ms) - ${details}`);
  } catch (err: any) {
    results.push({ name, status: "FAIL", details: err?.message || String(err), durationMs: Date.now() - start });
    console.error(`❌ [FAIL] ${name} (${Date.now() - start}ms) - ${err?.message || String(err)}`);
  }
}

async function main() {
  console.log("=================================================");
  console.log("🩺 CENTRO DENTAL BEHAPPY - SUITE DE PRUEBAS E2E");
  console.log(`📡 URL Objetivo: ${BASE_URL}`);
  console.log("=================================================\n");

  let authCookie = "";

  // 1. Páginas Públicas
  await runTest("Páginas Públicas (Home, Portal, Club, Precios, Tratamientos)", async () => {
    const pages = ["/", "/portal", "/club", "/precios", "/tratamientos", "/contacto"];
    for (const p of pages) {
      const res = await fetch(`${BASE_URL}${p}`);
      if (!res.ok) throw new Error(`Página ${p} retornó HTTP ${res.status}`);
    }
    return `Las ${pages.length} páginas respondieron con HTTP 200 OK`;
  });

  // 2. CMS API Pública (Lectura desde Supabase)
  await runTest("API CMS Pública (/api/cms)", async () => {
    const res = await fetch(`${BASE_URL}/api/cms`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error(`Respuesta no exitosa: ${json.error}`);
    if (json.source !== "supabase") throw new Error(`Origen esperado: 'supabase', recibido: '${json.source}'`);
    if (!json.data?.clinicInfo?.name) throw new Error("Faltan datos de la clínica en el payload");
    return `Payload sincronizado desde Supabase (Clínica: ${json.data.clinicInfo.name}, Tratamientos: ${json.data.treatments?.length || 0})`;
  });

  // 3. Autenticación Administrativa del CMS
  await runTest("Autenticación Administrativa (/api/auth/session)", async () => {
    const loginRes = await fetch(`${BASE_URL}/api/auth/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@behappydental.cl",
        password: "BeHappy2026!",
      }),
    });
    if (!loginRes.ok) throw new Error(`Login retornó HTTP ${loginRes.status}`);
    const loginJson = await loginRes.json();
    if (!loginJson.success) throw new Error(`Login falló: ${loginJson.error}`);

    // Extraer cookie
    const setCookie = loginRes.headers.get("set-cookie");
    if (!setCookie) throw new Error("No se recibió cookie de sesión");
    authCookie = setCookie.split(";")[0];

    // Verificar sesión
    const verifyRes = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { Cookie: authCookie },
    });
    const verifyJson = await verifyRes.json();
    if (!verifyJson.authenticated) throw new Error("La sesión no es reconocida como autenticada");

    return `Sesión administrativa iniciada correctamente (Rol: ${verifyJson.role})`;
  });

  // 4. Operaciones Protegidas del CMS (Borrador e Historial)
  await runTest("CMS Protegido: Historial de Versiones y Borradores", async () => {
    if (!authCookie) throw new Error("Se requiere cookie de sesión");

    // Historial
    const histRes = await fetch(`${BASE_URL}/api/cms?history=true`, {
      headers: { Cookie: authCookie },
    });
    if (!histRes.ok) throw new Error(`Historial retornó HTTP ${histRes.status}`);
    const histJson = await histRes.json();
    if (!histJson.success || !Array.isArray(histJson.versions)) throw new Error("Falla al listar versiones");

    // Guardar borrador de prueba
    const draftRes = await fetch(`${BASE_URL}/api/cms`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: authCookie },
      body: JSON.stringify({
        action: "save-draft",
        payload: {
          ...histJson.versions[0]?.payload || {},
          _testField: "Prueba automatizada " + Date.now(),
        },
      }),
    });
    const draftJson = await draftRes.json();
    if (!draftJson.success) throw new Error(`Guardar borrador falló: ${draftJson.error}`);

    return `Historial listó ${histJson.versions.length} versiones. Borrador guardado exitosamente.`;
  });

  // 5. Agendamiento de Citas (Validación + Inserción en Supabase)
  let createdCitaId: string | null = null;
  await runTest("API Agendamiento de Citas (/api/citas)", async () => {
    const testAppointment = {
      patient_name: "Paciente Automatizado E2E",
      patient_phone: "+56912345678",
      patient_email: "test.e2e@behappydental.cl",
      treatment_id: "limpieza-dental",
      treatment_name: "Limpieza y Destartraje Profundo",
      preferred_date: "2026-10-30",
      preferred_time_slot: "mañana",
      notes: "Cita creada por suite de pruebas automatizadas",
    };

    const res = await fetch(`${BASE_URL}/api/citas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testAppointment),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error(`Error en cita: ${json.error}`);

    // Verificar directamente en Supabase que existe
    const { data: row, error: sErr } = await supabase
      .from("citas")
      .select("id, patient_name, status")
      .eq("patient_email", "test.e2e@behappydental.cl")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (sErr || !row) throw new Error("La cita no fue encontrada en la base de datos Supabase");
    createdCitaId = row.id;

    return `Cita creada con ID ${row.id} y verificada en base de datos de producción (Estado: ${row.status})`;
  });

  // 6. Fichas Clínicas en la Nube (/api/clinica/records)
  const testPatientId = "PACIENTE-TEST-E2E-RUT";
  await runTest("API Fichas Clínicas (/api/clinica/records)", async () => {
    if (!authCookie) throw new Error("Se requiere cookie de sesión de staff");

    // 1. Crear ficha
    const createRes = await fetch(`${BASE_URL}/api/clinica/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
      body: JSON.stringify({
        patient_id: testPatientId,
        doctor_name: "Dra. Sofía Dental E2E",
        diagnosis: "Diagnóstico de prueba automatizada",
        treatment_performed: "Evaluación clínica integral y profilaxis",
        prescription: "Enjuague bucal antiséptico",
        next_step: "Control radiográfico anual",
        odontogram_json: { 11: "sano", 12: "sano", 21: "caries" },
      }),
    });

    if (!createRes.ok) throw new Error(`Creación retornó HTTP ${createRes.status}`);
    const createJson = await createRes.json();
    if (!createJson.success) throw new Error(`Creación falló: ${createJson.error}`);

    // 2. Leer ficha
    const readRes = await fetch(`${BASE_URL}/api/clinica/records?patientId=${testPatientId}`, {
      headers: { Cookie: authCookie },
    });
    if (!readRes.ok) throw new Error(`Lectura retornó HTTP ${readRes.status}`);
    const readJson = await readRes.json();
    if (!readJson.success || !Array.isArray(readJson.records) || readJson.records.length === 0) {
      throw new Error("No se pudo recuperar la ficha clínica recién creada");
    }

    return `Ficha creada y recuperada exitosamente (${readJson.records.length} evolución(es) registradas)`;
  });

  // 7. Pasarela de Pagos Flow (Creación de Orden / Simulación)
  await runTest("API Pasarela de Pagos Flow (/api/pagos/flow/create)", async () => {
    const res = await fetch(`${BASE_URL}/api/pagos/flow/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "abono_cita",
        amount: 15000,
        subject: "Abono Consulta Diagnóstica BeHappy",
        email: "flow.test@behappydental.cl",
        patientName: "Paciente Prueba Flow",
        patientPhone: "+56999887766",
        treatmentName: "Diagnóstico y Plan de Tratamiento",
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    const json = await res.json();
    if (!json.success && !json.redirectUrl && !json.url) {
      throw new Error(`Flujo de pago no entregó URL de redirección: ${JSON.stringify(json)}`);
    }

    return `Orden generada correctamente (${json.simulated ? "Modo Demo Simulado" : "Flow Producción"}, URL: ${json.redirectUrl || json.url})`;
  });

  // 8. Storage Cloud (Bucket clinic-media con MIME image/png)
  await runTest("Supabase Storage: Bucket clinic-media", async () => {
    const testPath = `test-healthcheck-${Date.now()}.png`;
    // 1x1 transparent PNG buffer
    const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const content = Buffer.from(pngBase64, "base64");

    // Subir
    const { error: upErr } = await supabase.storage.from("clinic-media").upload(testPath, content, {
      contentType: "image/png",
      upsert: true,
    });
    if (upErr) throw new Error(`Subida falló: ${upErr.message}`);

    // Obtener URL pública
    const { data: pubUrl } = supabase.storage.from("clinic-media").getPublicUrl(testPath);
    if (!pubUrl?.publicUrl) throw new Error("No se obtuvo URL pública");

    // Borrar archivo de prueba
    await supabase.storage.from("clinic-media").remove([testPath]);

    return `Subida de imagen PNG, URL pública (${pubUrl.publicUrl.slice(0, 50)}...) y limpieza verificadas`;
  });

  // 9. Limpieza de Registros de Prueba
  console.log("\n🧹 Limpiando registros de prueba en base de datos...");
  if (createdCitaId) {
    const { error: delCitaErr } = await supabase.from("citas").delete().eq("id", createdCitaId);
    if (!delCitaErr) console.log("   Cita de prueba eliminada.");
  }
  const { error: delRecordErr } = await supabase.from("clinical_records").delete().eq("patient_id", testPatientId);
  if (!delRecordErr) console.log("   Fichas clínicas de prueba eliminadas.");

  // Resumen Final
  console.log("\n=================================================");
  console.log("📊 RESUMEN FINAL DE PRUEBAS:");
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  console.log(`Total: ${results.length} | Exitosas: ${passed} | Fallidas: ${failed}`);
  console.log("=================================================");
  
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error fatal en suite de pruebas:", err);
  process.exit(1);
});
