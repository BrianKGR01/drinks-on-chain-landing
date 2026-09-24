import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-8 px-6">
      <p className="small-heading">404</p>
      <h1 className="text-heading">Página no encontrada</h1>
      <Link href="/" className="underline-anim font-display tracking-wide-ui uppercase text-sm">
        Volver al inicio
      </Link>
    </main>
  );
}
