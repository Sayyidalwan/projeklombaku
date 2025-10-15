import Navbar from "./components/Navbar"

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className="p-10 text-center">
        <h2 className="text-3xl font-semibold">Selamat Datang</h2>
        <p className="mt-4 text-gray-600">Ini halaman depan websitemu.</p>
      </section>
    </main>
  )
}
