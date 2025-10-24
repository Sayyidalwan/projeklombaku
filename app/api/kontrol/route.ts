import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { anggota_id, tanggal_kontrol, jam, tempat, keterangan } = body;

    const errors: string[] = [];
    const parsedAnggotaId = Number(anggota_id);

    if (!anggota_id || isNaN(parsedAnggotaId) || parsedAnggotaId <= 0) {
      errors.push("ID anggota tidak valid atau anggota wajib dipilih.");
    }

    if (!tanggal_kontrol || !jam) {
      errors.push("Tanggal dan jam kontrol wajib diisi.");
    } else {
      const scheduledDateTimeString = `${tanggal_kontrol}T${jam}:00`; 
      const scheduledDateTime = new Date(scheduledDateTimeString);
      
      const now = new Date();

      if (isNaN(scheduledDateTime.getTime())) {
        errors.push("Format tanggal atau jam tidak valid.");
      } else if (scheduledDateTime <= now) {
        errors.push("Jadwal kontrol harus di masa depan. Tidak boleh di masa lalu atau saat ini.");
      }
    }

    if (!tempat || tempat.trim().length < 3) {
      errors.push("Tempat kontrol wajib diisi dan minimal 3 karakter.");
    } else if (tempat.length > 100) {
      errors.push("Tempat kontrol maksimal 100 karakter.");
    }

    if (keterangan && keterangan.length > 255) {
      errors.push("Keterangan maksimal 255 karakter.");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Validasi Gagal.",
          details: errors,
        },
        { status: 400 }
      );
    }

    await prisma.jadwalKontrol.create({
      data: {
        anggota_id: parsedAnggotaId,
        tanggal_kontrol: new Date(tanggal_kontrol),
        jam: new Date(`1970-01-01T${jam}:00Z`),
        tempat: tempat.trim(),
        keterangan: keterangan ? keterangan.trim() : null,
      },
    });

    return NextResponse.json({ message: "Jadwal kontrol berhasil disimpan" });
  } catch (error) {
    console.error("Kesalahan Server:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan jadwal kontrol. Periksa log server." },
      { status: 500 }
    );
  }
}
