"use client";
import { useEffect, useState } from "react";

interface FormData {
  anggota_id: string;
  nama_obat: string;
  dosis: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  keterangan: string;
  jam_minum: string;
  tanggal: string; // Tanggal Jadwal
}

interface ErrorData {
  anggota_id?: string;
  nama_obat?: string;
  dosis?: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  keterangan?: string;
  jam_minum?: string;
  tanggal?: string;
  global?: string;
}

const mapServerError = (message: string): keyof ErrorData | 'global' => {
  if (message.includes("anggota wajib dipilih") || message.includes("ID anggota tidak valid")) return "anggota_id";
  if (message.includes("Nama obat wajib diisi") || message.includes("Nama obat maksimal")) return "nama_obat";
  if (message.includes("Dosis wajib diisi") || message.includes("Dosis maksimal")) return "dosis";
  if (message.includes("Tanggal Mulai wajib diisi") || message.includes("Formatnya tidak valid")) return "tanggal_mulai";
  if (message.includes("Tanggal Selesai wajib diisi") || message.includes("Formatnya tidak valid") || message.includes("tidak boleh sebelum Tanggal Mulai")) return "tanggal_selesai";
  if (message.includes("Jam minum wajib diisi")) return "jam_minum";
  if (message.includes("Tanggal Jadwal wajib diisi") || message.includes("harus berada dalam rentang")) return "tanggal";
  if (message.includes("Keterangan maksimal")) return "keterangan";
  return "global";
};


export default function FormObat() {
  const [anggotaList, setAnggotaList] = useState<any[]>([]);
  const [form, setForm] = useState<FormData>({
    anggota_id: "",
    nama_obat: "",
    dosis: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    keterangan: "",
    jam_minum: "",
    tanggal: "",
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
    setErrors(prev => ({ ...prev, [e.target.id]: undefined, global: undefined }));
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  
  const validateForm = (formData: FormData): ErrorData => {
    const newErrors: ErrorData = {};

    if (!formData.anggota_id) {
      newErrors.anggota_id = "Anggota keluarga wajib dipilih.";
    }

    if (formData.nama_obat.trim().length === 0) {
      newErrors.nama_obat = "Nama obat wajib diisi.";
    } else if (formData.nama_obat.trim().length < 3) {
      newErrors.nama_obat = "Nama obat minimal 3 karakter.";
    } else if (formData.nama_obat.length > 100) {
      newErrors.nama_obat = "Nama obat maksimal 100 karakter.";
    }

    if (formData.dosis.trim().length === 0) {
      newErrors.dosis = "Dosis wajib diisi.";
    } else if (formData.dosis.trim().length < 2) {
      newErrors.dosis = "Dosis minimal 2 karakter.";
    } else if (formData.dosis.length > 50) {
      newErrors.dosis = "Dosis maksimal 50 karakter.";
    }
    
    const tMulai = formData.tanggal_mulai ? new Date(formData.tanggal_mulai) : null;
    const tSelesai = formData.tanggal_selesai ? new Date(formData.tanggal_selesai) : null;

    if (!formData.tanggal_mulai) {
        newErrors.tanggal_mulai = "Tanggal Mulai wajib diisi.";
    }
    if (!formData.tanggal_selesai) {
        newErrors.tanggal_selesai = "Tanggal Selesai wajib diisi.";
    }

    if (tMulai && tSelesai && tMulai.getTime() > tSelesai.getTime()) {
      newErrors.tanggal_selesai = "Tanggal Selesai tidak boleh sebelum Tanggal Mulai.";
    }

    if (!formData.jam_minum) {
      newErrors.jam_minum = "Jam minum wajib diisi.";
    }
    
    const tJadwal = formData.tanggal ? new Date(formData.tanggal) : null;
    if (!formData.tanggal) {
      newErrors.tanggal = "Tanggal Jadwal wajib diisi.";
    }
    
    if (tMulai && tSelesai && tJadwal) {
        const tJadwalNormalized = new Date(tJadwal.setHours(0, 0, 0, 0));
        const tMulaiNormalized = new Date(tMulai.setHours(0, 0, 0, 0));
        const tSelesaiNormalized = new Date(tSelesai.setHours(0, 0, 0, 0));
        
        if (tJadwalNormalized < tMulaiNormalized || tJadwalNormalized > tSelesaiNormalized) {
          newErrors.tanggal = "Tanggal Jadwal harus berada dalam rentang Tanggal Mulai dan Tanggal Selesai.";
        }
    }

    if (formData.keterangan && formData.keterangan.length > 255) {
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
        alert("Mohon lengkapi atau perbaiki isian yang ditandai merah."); 
        return; 
    }

    setIsLoading(true);
    
    try {
        const res = await fetch("/api/obat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        
        const data = await res.json();

        if (!res.ok) {
            const serverErrors: ErrorData = {};
            if (data.details && Array.isArray(data.details)) {
                data.details.forEach((detail: string) => {
                    const field = mapServerError(detail);
                    if (!serverErrors[field]) {
                        serverErrors[field] = detail;
                    }
                });
                setErrors(serverErrors);
                alert(`Gagal menyimpan: ${data.details[0]}`); 
            } else {
                 setErrors({ global: data.error || "Terjadi kesalahan saat menyimpan data." });
                 alert(data.error || "Terjadi kesalahan saat menyimpan data.");
            }
        } else {
            alert(data.message);
            setForm({ anggota_id: "", nama_obat: "", dosis: "", tanggal_mulai: "", tanggal_selesai: "", keterangan: "", jam_minum: "", tanggal: "" });
        }
    } catch (error) {
        setErrors({ global: "Gagal terhubung ke server. Cek koneksi Anda." });
        alert("Gagal terhubung ke server. Cek koneksi Anda.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const ErrorMessage: React.FC<{ message: string | undefined }> = ({ message }) => {
    if (!message) return null;
    return <p className="text-sm text-red-600 mt-1 font-medium">{message}</p>;
  };


  return (
    <section className="border p-6 rounded-lg bg-white shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Form Tambah Obat</h2>
      
      {errors.global && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{errors.global}</span>
        </div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Anggota */}
        <div className="col-span-2">
          <label htmlFor="anggota_id" className="font-medium text-gray-700">Pilih Anggota <span className="text-red-500">*</span></label>
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
          <p className="text-sm text-gray-500 mt-1">Pilih anggota keluarga yang akan menggunakan obat ini.</p>
        </div>

        {/* Nama Obat */}
        <div>
          <label htmlFor="nama_obat" className="font-medium text-gray-700">Nama Obat <span className="text-red-500">*</span></label>
          <input
            id="nama_obat"
            value={form.nama_obat}
            onChange={handleChange}
            placeholder="Contoh: Paracetamol"
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.nama_obat ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.nama_obat} />
          <p className="text-sm text-gray-500 mt-1">Masukkan nama obat yang dikonsumsi. Min 3 karakter.</p>
        </div>

        {/* Dosis */}
        <div>
          <label htmlFor="dosis" className="font-medium text-gray-700">Dosis <span className="text-red-500">*</span></label>
          <input
            id="dosis"
            value={form.dosis}
            onChange={handleChange}
            placeholder="Contoh: 3x sehari"
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.dosis ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.dosis} />
          <p className="text-sm text-gray-500 mt-1">Isi aturan dosis konsumsi obat ini. Min 2 karakter.</p>
        </div>

        {/* Tanggal Mulai */}
        <div>
          <label htmlFor="tanggal_mulai" className="font-medium text-gray-700">Tanggal Mulai <span className="text-red-500">*</span></label>
          <input
            id="tanggal_mulai"
            type="date"
            value={form.tanggal_mulai}
            onChange={handleChange}
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.tanggal_mulai ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.tanggal_mulai} />
          <p className="text-sm text-gray-500 mt-1">Tanggal mulai mengonsumsi obat.</p>
        </div>

        {/* Tanggal Selesai */}
        <div>
          <label htmlFor="tanggal_selesai" className="font-medium text-gray-700">Tanggal Selesai <span className="text-red-500">*</span></label>
          <input
            id="tanggal_selesai"
            type="date"
            value={form.tanggal_selesai}
            onChange={handleChange}
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.tanggal_selesai ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.tanggal_selesai} />
          <p className="text-sm text-gray-500 mt-1">Tanggal terakhir obat dikonsumsi.</p>
        </div>

        {/* Jam Minum */}
        <div>
          <label htmlFor="jam_minum" className="font-medium text-gray-700">Jam Minum <span className="text-red-500">*</span></label>
          <input
            id="jam_minum"
            type="time"
            value={form.jam_minum}
            onChange={handleChange}
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.jam_minum ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.jam_minum} />
          <p className="text-sm text-gray-500 mt-1">Pilih jam minum obat.</p>
        </div>

        {/* Tanggal Jadwal */}
        <div>
          <label htmlFor="tanggal" className="font-medium text-gray-700">Tanggal Jadwal <span className="text-red-500">*</span></label>
          <input
            id="tanggal"
            type="date"
            value={form.tanggal}
            onChange={handleChange}
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.tanggal ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.tanggal} />
          <p className="text-sm text-gray-500 mt-1">Tanggal untuk jadwal minum obat. Harus dalam rentang tanggal mulai-selesai.</p>
        </div>

        {/* Keterangan */}
        <div className="col-span-2">
          <label htmlFor="keterangan" className="font-medium text-gray-700">Keterangan (Opsional)</label>
          <textarea
            id="keterangan"
            value={form.keterangan}
            onChange={handleChange}
            placeholder="Contoh: Diminum setelah makan"
            className={`border px-3 py-2 rounded w-full mt-1 ${errors.keterangan ? 'border-red-500' : ''}`}
          />
          <ErrorMessage message={errors.keterangan} />
          <p className="text-sm text-gray-500 mt-1">Tambahkan catatan tambahan jika diperlukan. Maksimal 255 karakter.</p>
        </div>

        {/* Tombol Submit */}
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
            {isLoading ? 'Menyimpan...' : 'Simpan Data Obat'}
          </button>
        </div>
      </form>
    </section>
  );
}