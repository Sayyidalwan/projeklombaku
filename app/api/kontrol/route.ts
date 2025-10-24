import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { anggota_id, tanggal_kontrol, jam, tempat, keterangan } = body;

    const errors: string[] = [];
    const parsedAnggotaId = Number(anggota_id);

    // 1. Validasi Anggota ID
    if (!anggota_id || isNaN(parsedAnggotaId) || parsedAnggotaId <= 0) {
      errors.push("ID anggota tidak valid atau anggota wajib dipilih.");
    }
    
    // 2. Validasi Tanggal dan Jam (Wajib & Tidak di Masa Lalu)
    if (!tanggal_kontrol || !jam) {
      errors.push("Tanggal dan jam kontrol wajib diisi.");
    } else {
      // Menggabungkan tanggal dan jam menjadi objek Date untuk cek
      const [year, month, day] = tanggal_kontrol.split('-').map(Number);
      const [hour, minute] = jam.split(':').map(Number);
      
      // Catatan: month - 1 karena bulan di JavaScript dimulai dari 0 (Januari)
      const scheduledDateTime = new Date(year, month - 1, day, hour, minute);
      
      if (isNaN(scheduledDateTime.getTime())) {
          errors.push("Format tanggal atau jam tidak valid.");
      } else if (scheduledDateTime < new Date()) {
        errors.push("Jadwal kontrol tidak boleh di masa lalu.");
      }
    }

    // 3. Validasi Tempat Kontrol (Wajib, Panjang min 3, max 100)
    if (!tempat || tempat.trim().length < 3) {
      errors.push("Tempat kontrol wajib diisi dan minimal 3 karakter.");
    } else if (tempat.length > 100) {
      errors.push("Tempat kontrol maksimal 100 karakter.");
    }

    // 4. Validasi Keterangan (Opsional, max 255)
    if (keterangan && keterangan.length > 255) {
      errors.push("Keterangan maksimal 255 karakter.");
    }
    
    // Kirim error jika validasi gagal
    if (errors.length > 0) {
      return NextResponse.json({ 
        error: "Validasi Gagal.", 
        details: errors 
      }, { status: 400 });
    }

    // Penyimpanan data
    await prisma.jadwalKontrol.create({
      data: {
        anggota_id: parsedAnggotaId,
        tanggal_kontrol: new Date(tanggal_kontrol),
        // Membuat objek Date untuk kolom jam. (Prisma umumnya menyimpan Waktu sebagai DateTime)
        jam: new Date(`1970-01-01T${jam}:00Z`), 
        tempat: tempat.trim(), // Pastikan tidak ada spasi berlebihan
        keterangan: keterangan ? keterangan.trim() : null,
      },
    });

    return NextResponse.json({ message: "Jadwal kontrol berhasil disimpan" });
  } catch (error) {
    console.error("Kesalahan Server:", error);
    return NextResponse.json({ error: "Gagal menyimpan jadwal kontrol. Periksa log server." }, { status: 500 });
  }
}