"use client";
import { useEffect, useState } from "react";

export default function FormKontrol() {
  const [anggotaList, setAnggotaList] = useState<any[]>([]);
  const [form, setForm] = useState({
    anggota_id: "",
    tanggal_kontrol: "",
    jam: "",
    tempat: "",
    keterangan: "",
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
    const res = await fetch("/api/kontrol", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <section className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Form Jadwal Kontrol</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pilih Anggota */}
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
          <p className="text-sm text-gray-500 mt-1">Pilih anggota keluarga yang akan melakukan kontrol.</p>
        </div>

        {/* Tanggal Kontrol */}
        <div>
          <label htmlFor="tanggal_kontrol" className="font-medium text-gray-700">Tanggal Kontrol</label>
          <input
            id="tanggal_kontrol"
            type="date"
            value={form.tanggal_kontrol}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Masukkan tanggal kontrol ke rumah sakit atau klinik.</p>
        </div>

        {/* Jam Kontrol */}
        <div>
          <label htmlFor="jam" className="font-medium text-gray-700">Jam Kontrol</label>
          <input
            id="jam"
            type="time"
            value={form.jam}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Pilih jam untuk jadwal kontrol.</p>
        </div>

        {/* Tempat Kontrol */}
        <div className="col-span-2">
          <label htmlFor="tempat" className="font-medium text-gray-700">Tempat Kontrol</label>
          <input
            id="tempat"
            value={form.tempat}
            onChange={handleChange}
            placeholder="Contoh: RSUD Jakarta"
            required
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Isi dengan nama tempat kontrol (rumah sakit, klinik, dll).</p>
        </div>

        {/* Keterangan */}
        <div className="col-span-2">
          <label htmlFor="keterangan" className="font-medium text-gray-700">Keterangan (Opsional)</label>
          <textarea
            id="keterangan"
            value={form.keterangan}
            onChange={handleChange}
            placeholder="Contoh: Kontrol rutin setelah operasi"
            className="border px-3 py-2 rounded w-full mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">Tambahkan catatan atau detail tambahan jika perlu.</p>
        </div>

        {/* Tombol Simpan */}
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
          >
            Simpan Jadwal Kontrol
          </button>
        </div>
      </form>
    </section>
  );
}
