"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CMSGalleryItem,
  CMSHero,
  DEFAULT_GALLERY,
  CMSData,
} from "@/lib/cmsStore";
import {
  Image as ImageIcon,
  Video,
  Upload,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Layers,
  FolderOpen,
  Filter,
} from "lucide-react";
import { ImageUploadButton } from "./ImageUploadButton";

interface MediaLibraryEditorProps {
  cmsData: CMSData;
  onUpdateGallery: (updatedGallery: CMSGalleryItem[]) => void;
  onUpdateHero: (updatedHero: CMSHero) => void;
}

export function MediaLibraryEditor({
  cmsData,
  onUpdateGallery,
  onUpdateHero,
}: MediaLibraryEditorProps) {
  const gallery = cmsData.gallery || DEFAULT_GALLERY;
  const hero = cmsData.hero;

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleGalleryChange = (
    index: number,
    field: keyof CMSGalleryItem,
    value: string
  ) => {
    const next = [...gallery];
    next[index] = { ...next[index], [field]: value };
    onUpdateGallery(next);
  };

  const handleAddGalleryItem = () => {
    const newItem: CMSGalleryItem = {
      id: `gal-${Date.now()}`,
      code: `ARCH-0${gallery.length + 1}`,
      title: "Nueva Imagen Clínica",
      category: "Infraestructura",
      src: "/images/clinic-interior.jpg",
      desc: "Descripción del procedimiento o equipamiento clínico en Suecia 3580.",
      mediaType: "image",
    };
    onUpdateGallery([...gallery, newItem]);
  };

  const handleRemoveGalleryItem = (index: number) => {
    const next = gallery.filter((_, i) => i !== index);
    onUpdateGallery(next);
  };

  // Inventario consolidado de todos los medios del sitio
  const siteMediaDirectory = [
    {
      section: "Portada (Hero)",
      name: "Fondo del Hero",
      type: hero?.mediaType === "video" ? "video" : "image",
      url: (hero?.mediaType === "video" ? hero.bgVideo : hero.bgImage) || "/images/hero-woman.jpg",
    },
    ...gallery.map((g) => ({
      section: "Galería Clínica",
      name: g.title,
      type: g.mediaType || "image",
      url: g.src,
    })),
    ...(cmsData.doctors || []).map((d) => ({
      section: "Cuerpo Médico",
      name: d.name,
      type: "image",
      url: d.image,
    })),
    ...(cmsData.treatments || []).slice(0, 8).map((t) => ({
      section: "Tratamientos",
      name: t.name,
      type: "image",
      url: t.image,
    })),
    {
      section: "Sección Bienvenida",
      name: "Box Dental Nueva Paciente",
      type: "image",
      url: cmsData.welcomeSection?.newPatient?.image || "/images/clinic-interior.jpg",
    },
  ];

  const filteredMedia =
    activeCategory === "all"
      ? siteMediaDirectory
      : siteMediaDirectory.filter((m) =>
          activeCategory === "video"
            ? m.type === "video"
            : m.section.toLowerCase().includes(activeCategory.toLowerCase())
        );

  return (
    <div className="space-y-6">
      
      {/* Cabecera del Gestor de Medios */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-purple-600" />
              <span>Centro de Control de Imágenes y Videos del Sitio</span>
            </h3>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Administra todas las fotografías, videos corporativos y la galería de behappydental.cl
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ImageUploadButton
              allowVideo
              label="Subir nuevo archivo (Foto o Video)"
              onUploaded={(url) => {
                handleCopy(url);
              }}
            />
          </div>
        </div>

        {/* Barra de Estadísticas y Filtros */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filtrar por sección:
          </span>
          {[
            { id: "all", label: `Todos (${siteMediaDirectory.length})` },
            { id: "Portada", label: "Hero & Portada" },
            { id: "Galería", label: `Galería (${gallery.length})` },
            { id: "Cuerpo Médico", label: "Doctores" },
            { id: "Tratamientos", label: "Tratamientos" },
            { id: "video", label: "Solo Videos" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 text-xs font-mono rounded-full border transition ${
                activeCategory === cat.id
                  ? "bg-purple-600 text-white border-purple-600 font-bold"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECCIÓN 1: GESTIÓN DE LA GALERÍA CLÍNICA (/galeria) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded uppercase">
                Página /galeria
              </span>
              <h4 className="text-base font-semibold text-slate-900">
                Galería de Instalaciones & Procedimientos Clínicos
              </h4>
            </div>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Controla las fotos, títulos y descripciones que los pacientes ven en la sección Galería.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddGalleryItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-mono rounded-md shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Foto a Galería</span>
          </button>
        </div>

        {/* Lista de Tarjetas de Galería */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gallery.map((item, index) => (
            <div
              key={item.id || index}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 space-y-3 relative group"
            >
              <div className="flex items-start gap-3">
                {/* Miniatura con preview */}
                <div className="relative w-28 h-20 bg-slate-200 rounded overflow-hidden shrink-0 border border-slate-300">
                  {item.src && (
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                    {item.code || `ARCH-0${index + 1}`}
                  </div>
                </div>

                {/* Campos de texto */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) =>
                        handleGalleryChange(index, "category", e.target.value)
                      }
                      placeholder="Categoría (ej: Ortodoncia)"
                      className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold bg-transparent border-b border-transparent focus:border-purple-400 outline-none w-1/2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(index)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Eliminar de galería"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleGalleryChange(index, "title", e.target.value)
                    }
                    placeholder="Título del procedimiento"
                    className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded outline-none focus:border-slate-800"
                  />

                  <textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) =>
                      handleGalleryChange(index, "desc", e.target.value)
                    }
                    placeholder="Descripción clínica..."
                    className="w-full text-[11px] text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded outline-none focus:border-slate-800 leading-tight"
                  />
                </div>
              </div>

              {/* Selector de URL / Subida para este item */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                <input
                  type="text"
                  value={item.src}
                  onChange={(e) =>
                    handleGalleryChange(index, "src", e.target.value)
                  }
                  placeholder="/images/... o URL"
                  className="flex-1 text-[11px] font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-700 outline-none"
                />
                <ImageUploadButton
                  compact
                  label="Cambiar foto"
                  onUploaded={(url) => handleGalleryChange(index, "src", url)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 2: DIRECTORIO VISUAL GLOBAL DE RECURSOS */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              <span>Directorio Visual de Todos los Medios en Uso</span>
            </h4>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Haz clic en cualquier enlace para copiar la URL y pegarla en cualquier sección.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {filteredMedia.length} recursos encontrados
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredMedia.map((media, idx) => (
            <div
              key={idx}
              className="group border border-slate-200 rounded-lg p-2 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 transition flex flex-col justify-between"
            >
              <div className="relative aspect-video rounded bg-slate-200 overflow-hidden border border-slate-200">
                {media.type === "video" ? (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-purple-400">
                    <Video className="w-6 h-6" />
                  </div>
                ) : (
                  <Image
                    src={media.url || "/images/hero-woman.jpg"}
                    alt={media.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-200"
                  />
                )}
                <div className="absolute top-1 left-1 bg-black/70 text-white text-[8px] font-mono px-1 py-0.5 rounded">
                  {media.section}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-medium text-slate-800 truncate" title={media.name}>
                  {media.name}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    {media.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(media.url)}
                    className="text-[10px] font-mono text-purple-700 hover:text-purple-900 flex items-center gap-1"
                    title="Copiar URL"
                  >
                    {copiedUrl === media.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
