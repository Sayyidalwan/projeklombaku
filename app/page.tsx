import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Selamat Datang di Projek Form!</h1>
      <Link
        href="/register"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Buka Formulir
      </Link>
    </main>
  );
}
