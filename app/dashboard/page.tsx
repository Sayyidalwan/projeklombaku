"use client";

import FormAnggota from "@/components/forms/formAnggota";
import FormKontrol from "@/components/forms/formKontrol";
import FormObat from "@/components/forms/formObat";
import StatusMinumObat from "@/components/forms/StatusMinumObat";

export default function DashboardPage() {
  return (
    <main className="p-8 space-y-10">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Keluarga</h1>
        <p className="text-gray-600">Kelola data kesehatan keluarga kamu di sini.</p>
      </header>

      <section className="space-y-8">
        <FormAnggota />
        <FormKontrol />
        <FormObat />

        <div>
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Status Minum Obat</h2>
          <StatusMinumObat />
        </div>
      </section>
    </main>
  );
}
