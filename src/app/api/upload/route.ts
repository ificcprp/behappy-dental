import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isAdminSession } from "@/lib/cmsAuth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const BUCKET = "clinic-media";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function cloudReady(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co"
  );
}

export async function POST(request: Request) {
  if (!isAdminSession(request)) {
    return NextResponse.json(
      { error: "Se requiere sesión de administrador para subir imágenes." },
      { status: 401 }
    );
  }

  if (!cloudReady()) {
    return NextResponse.json({ error: "Almacenamiento no configurado." }, { status: 503 });
  }

  const limit = rateLimit(`upload:${getClientIp(request)}`, 20, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas subidas. Intenta nuevamente en unos minutos." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter || 60) } }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo no proporcionado." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa JPG, PNG, WebP o AVIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "La imagen supera el máximo de 5 MB." }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
    const path = `cms/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: true,
      cacheControl: "31536000",
    });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        { error: "No se pudo subir la imagen. Verifica que el bucket clinic-media exista." },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({ success: true, url: data.publicUrl, path });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: error?.message || "Error al subir la imagen." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAdminSession(request)) {
    return NextResponse.json(
      { error: "Se requiere sesión de administrador para eliminar imágenes." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path || !path.startsWith("cms/")) {
      return NextResponse.json({ error: "Ruta de archivo inválida." }, { status: 400 });
    }

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      return NextResponse.json({ error: "No se pudo eliminar la imagen." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error al eliminar la imagen." },
      { status: 500 }
    );
  }
}
