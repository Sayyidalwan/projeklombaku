"use client";
import { useEffect, useState } from "react";

export default function FormObat() {
  const [anggotaList, setAnggotaList] = useState<any[]>([]);
  const [form, setForm] = useState({
    anggota_id: "",
    nama_obat: "",
    dosis: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    keterangan: "",
    jam_minum: "",
    tanggal: "",
  });

  useEffect(() => {
    fetch("/api/anggota")
      .then((res) => res.json())
      .then((data) => setAnggotaList(data))
      .catch((err) => console.error("Gagal fetch anggota:", err));
  }, []);

  const handleChange = (e: any) => setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/obat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <section className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Form Tambah Obat</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Anggota */}
        <div className="col-span-2">
          <label htmlFor="anggota_id" className="font-medium text-gray-700">Pilih Anggota</label>
          <select
            id="anggota_id"
            value={form.anggota_id}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded w-full mt-1"
          >
            <option value="">-- Pilih Anggota Keluarga --</option>
            {anggotaList.map((a) => (
              <option key={a.anggota_id} value={a.anggota_id}>
                {a.nama}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Pilih anggota keluarga yang akan menggunakan obat ini.</p>
        </div>

        {/* Nama Obat */}
        <div>
          <label htmlFor="nama_obat" className="font-medium text-gray-700">Nama Obat</label>
          <input
            id="nama_obat"
            value={form.nama_obat}
            onChange={handleChange}
            placeholder="Contoh: Paracetamol"
            required
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Masukkan nama obat yang dikonsumsi.</p>
        </div>

        {/* Dosis */}
        <div>
          <label htmlFor="dosis" className="font-medium text-gray-700">Dosis</label>
          <input
            id="dosis"
            value={form.dosis}
            onChange={handleChange}
            placeholder="Contoh: 3x sehari"
            required
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Isi aturan dosis konsumsi obat ini.</p>
        </div>

        {/* Tanggal Mulai */}
        <div>
          <label htmlFor="tanggal_mulai" className="font-medium text-gray-700">Tanggal Mulai</label>
          <input
            id="tanggal_mulai"
            type="date"
            value={form.tanggal_mulai}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Tanggal mulai mengonsumsi obat.</p>
        </div>

        {/* Tanggal Selesai */}
        <div>
          <label htmlFor="tanggal_selesai" className="font-medium text-gray-700">Tanggal Selesai</label>
          <input
            id="tanggal_selesai"
            type="date"
            value={form.tanggal_selesai}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Tanggal terakhir obat dikonsumsi.</p>
        </div>

        {/* Jam Minum */}
        <div>
          <label htmlFor="jam_minum" className="font-medium text-gray-700">Jam Minum</label>
          <input
            id="jam_minum"
            type="time"
            value={form.jam_minum}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Pilih jam minum obat.</p>
        </div>

        {/* Tanggal Jadwal */}
        <div>
          <label htmlFor="tanggal" className="font-medium text-gray-700">Tanggal Jadwal</label>
          <input
            id="tanggal"
            type="date"
            value={form.tanggal}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Tanggal untuk jadwal minum obat.</p>
        </div>

        {/* Keterangan */}
        <div className="col-span-2">
          <label htmlFor="keterangan" className="font-medium text-gray-700">Keterangan (Opsional)</label>
          <textarea
            id="keterangan"
            value={form.keterangan}
            onChange={handleChange}
            placeholder="Contoh: Diminum setelah makan"
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Tambahkan catatan tambahan jika diperlukan.</p>
        </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
          >
            Simpan Data Obat
          </button>
        </div>
      </form>
    </section>
  );
}
