"use client";
import { useEffect, useState } from "react";

// Tipe untuk Form dan Error
interface FormData {
  anggota_id: string;
  tanggal_kontrol: string;
  jam: string;
  tempat: string;
  keterangan: string;
}

interface ErrorData {
  anggota_id?: string;
  tanggal_kontrol?: string;
  jam?: string;
  tempat?: string;
  keterangan?: string;
  global?: string; // Untuk error non-field spesifik
}

export default function FormKontrol() {
  const [anggotaList, setAnggotaList] = useState<any[]>([]);
  const [form, setForm] = useState<FormData>({
    anggota_id: "",
    tanggal_kontrol: "",
    jam: "",
    tempat: "",
    keterangan: "",
  });
  const [errors, setErrors] = useState<ErrorData>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/anggota")
      .then((res) => res.json())
      .then((data) => setAnggotaList(data))
      .catch((err) => console.error("Gagal fetch anggota:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // Menghapus error saat user mulai mengetik/mengubah field
    setErrors(prev => ({ ...prev, [e.target.id]: undefined, global: undefined }));
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateForm = (formData: FormData): ErrorData => {
    const newErrors: ErrorData = {};
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Anggota ID
    if (!formData.anggota_id) {
      newErrors.anggota_id = "Anggota keluarga wajib dipilih.";
    }

    // 2. Tanggal Kontrol
    if (!formData.tanggal_kontrol) {
      newErrors.tanggal_kontrol = "Tanggal kontrol wajib diisi.";
    } else if (formData.tanggal_kontrol < today) {
      // Hanya cek tanggal, bukan jam, untuk validasi cepat.
      newErrors.tanggal_kontrol = "Tanggal kontrol tidak boleh di masa lalu.";
    }

    // 3. Jam Kontrol
    if (!formData.jam) {
      newErrors.jam = "Jam kontrol wajib diisi.";
    }

    // 4. Tempat Kontrol
    if (formData.tempat.trim().length < 3) {
      newErrors.tempat = "Tempat kontrol minimal 3 karakter.";
    } else if (formData.tempat.length > 100) {
      newErrors.tempat = "Tempat kontrol maksimal 100 karakter.";
    }

    // 5. Keterangan
    if (formData.keterangan.length > 255) {
      newErrors.keterangan = "Keterangan maksimal 255 karakter.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const clientErrors = validateForm(form);
    
    if (Object.keys(clientErrors).length > 0) {
        setErrors(clientErrors);
        // Alert minimal, fokus pada pesan di field
        alert("Mohon lengkapi atau perbaiki isian yang ditandai merah."); 
        return; 
    }

    setIsLoading(true);
    
    try {
        const res = await fetch("/api/kontrol", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        
        const data = await res.json();

        if (!res.ok) {
            // Tangani error dari Back-end
            if (data.details) {
                // Tampilkan error back-end pertama ke user
                setErrors({ global: data.details[0] });
                alert(`Gagal menyimpan: ${data.details[0]}`);
            } else {
                 setErrors({ global: data.error || "Terjadi kesalahan saat menyimpan data." });
                 alert(data.error || "Terjadi kesalahan saat menyimpan data.");
            }
        } else {
            alert(data.message);
            // Reset form setelah berhasil
            setForm({ anggota_id: "", tanggal_kontrol: "", jam: "", tempat: "", keterangan: "" });
        }
    } catch (error) {
        setErrors({ global: "Gagal terhubung ke server." });
        alert("Gagal terhubung ke server.");
    } finally {
        setIsLoading(false);
    }
  };
  
  // Komponen untuk menampilkan pesan error
  const ErrorMessage: React.FC<{ message: string | undefined }> = ({ message }) => {
    if (!message) return null;
    return <p className="text-sm text-red-600 mt-1 font-medium">{message}</p>;
  };


  return (
    <section className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Form Jadwal Kontrol</h2>
      
      {errors.global && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{errors.global}</span>
        </div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pilih Anggota */}
        <div className="col-span-2">
          <label htmlFor="anggota_id" className="font-medium text-gray-700">Pilih Anggota</label>
          <select
            id="anggota_id"
            value={form.anggota_id}
            onChange={handleChange}
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.anggota_id ? 'border-red-500' : ''}`}
          >
            <option value="">-- Pilih Anggota Keluarga --</option>
            {anggotaList.map((a) => (
              <option key={a.anggota_id} value={a.anggota_id}>
                {a.nama}
              </option>
            ))}
          </select>
          <ErrorMessage message={errors.anggota_id} />
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
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.tanggal_kontrol ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.tanggal_kontrol} />
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
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.jam ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.jam} />
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
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.tempat ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.tempat} />
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
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.keterangan ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.keterangan} />
          <p className="text-sm text-gray-500 mt-1">Tambahkan catatan atau detail tambahan jika perlu.</p>
        </div>

        {/* Tombol Simpan */}
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-5 py-2 rounded-md font-medium ${
                isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Jadwal Kontrol'}
          </button>
        </div>
      </form>
    </section>
  );
}