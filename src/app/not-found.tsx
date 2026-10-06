import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#faf8f5] text-[#141413] text-center space-y-4">
      <span className="text-xs font-mono tracking-widest text-[#78736a] uppercase">
        Error 404 · Página no encontrada
      </span>
      <h1 className="text-4xl font-normal tracking-tight text-[#141413]">
        Esta página no está disponible
      </h1>
      <p className="text-sm text-[#66635d] font-light max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida. Puedes volver al catálogo principal de tratamientos.
      </p>
      <div className="pt-4 flex gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 bg-[#141413] text-[#faf8f5] text-xs font-mono uppercase tracking-wider hover:bg-black transition"
        >
          Ir al Inicio
        </Link>
        <Link
          href="/tratamientos"
          className="px-5 py-2.5 border border-[#cfc9be] text-[#141413] text-xs font-mono uppercase tracking-wider hover:border-[#141413] transition"
        >
          Ver Tratamientos
        </Link>
      </div>
    </div>
  );
}
