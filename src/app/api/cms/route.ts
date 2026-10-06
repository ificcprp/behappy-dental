import { NextResponse } from "next/server";
import { DEFAULT_CMS_DATA } from "@/lib/cmsStore";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: DEFAULT_CMS_DATA,
  });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    return NextResponse.json({
      success: true,
      message: "Contenido CMS guardado correctamente",
      lastUpdated: new Date().toISOString(),
      updatedItemsCount: {
        treatments: payload.treatments?.length || 0,
        doctors: payload.doctors?.length || 0,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Error procesando solicitud" },
      { status: 500 }
    );
  }
}
