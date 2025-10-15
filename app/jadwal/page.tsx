"use client";

import { useState } from "react";
import FormAnggota from "@/components/forms/formAnggota";
import FormObat from "@/components/forms/formObat";
import FormKontrol from "@/components/forms/formKontrol";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function JadwalPage() {
  const [withKontrol, setWithKontrol] = useState(false);

  return (
    <main className="flex justify-center min-h-screen bg-gray-50 py-10 px-4">
      <Card className="w-full max-w-3xl bg-white shadow-lg rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Form Pengingat Minum Obat & Jadwal Kontrol
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* Form Data Anggota */}
          <FormAnggota />

          {/* Form Data Obat */}
          <FormObat />

          {/* Toggle Jadwal Kontrol */}
          <div className="flex items-center gap-2">
            <input
              id="kontrol"
              type="checkbox"
              checked={withKontrol}
              onChange={(e) => setWithKontrol(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="kontrol" className="text-sm font-medium text-gray-700">
              Tambahkan jadwal kontrol
            </label>
          </div>

          {/* Form Jadwal Kontrol (opsional) */}
          {withKontrol && <FormKontrol />}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold"
            onClick={() => alert("Data berhasil disimpan (simulasi)")}
          >
            Simpan Semua Data
          </button>
        </CardContent>
      </Card>
    </main>
  );
}
