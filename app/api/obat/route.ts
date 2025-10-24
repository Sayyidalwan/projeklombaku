import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      anggota_id, 
      nama_obat, 
      dosis, 
      keterangan, 
      tanggal_mulai, 
      tanggal_selesai, 
      jam_minum, 
      tanggal 
    } = body;

    const errors: string[] = [];
    const parsedAnggotaId = Number(anggota_id);

    if (!anggota_id || isNaN(parsedAnggotaId) || parsedAnggotaId <= 0) {
      errors.push("ID anggota tidak valid atau anggota wajib dipilih.");
    }

    if (!nama_obat || nama_obat.trim().length < 3) {
      errors.push("Nama obat wajib diisi dan minimal 3 karakter.");
    } else if (nama_obat.length > 100) {
      errors.push("Nama obat maksimal 100 karakter.");
    }

    if (!dosis || dosis.trim().length < 2) {
      errors.push("Dosis wajib diisi dan minimal 2 karakter.");
    } else if (dosis.length > 50) {
      errors.push("Dosis maksimal 50 karakter.");
    }

    const tMulai = tanggal_mulai ? new Date(tanggal_mulai) : null;
    const tSelesai = tanggal_selesai ? new Date(tanggal_selesai) : null;

    if (!tanggal_mulai || !tMulai || isNaN(tMulai.getTime())) {
      errors.push("Tanggal Mulai wajib diisi dan formatnya tidak valid.");
    }
    if (!tanggal_selesai || !tSelesai || isNaN(tSelesai.getTime())) {
      errors.push("Tanggal Selesai wajib diisi dan formatnya tidak valid.");
    }
    
    if (tMulai && tSelesai && tMulai.getTime() > tSelesai.getTime()) {
      errors.push("Tanggal Selesai tidak boleh sebelum Tanggal Mulai.");
    }

    if (keterangan && keterangan.length > 255) {
      errors.push("Keterangan maksimal 255 karakter.");
    }

    if (!jam_minum) {
      errors.push("Jam minum wajib diisi.");
    }

    const tJadwal = tanggal ? new Date(tanggal) : null;
    if (!tanggal || !tJadwal || isNaN(tJadwal.getTime())) {
      errors.push("Tanggal Jadwal wajib diisi dan formatnya tidak valid.");
    }

    if (tMulai && tSelesai && tJadwal) {
      const tJadwalNormalized = new Date(tJadwal.setHours(0, 0, 0, 0));
      const tMulaiNormalized = new Date(tMulai.setHours(0, 0, 0, 0));
      const tSelesaiNormalized = new Date(tSelesai.setHours(0, 0, 0, 0));
      
      if (tJadwalNormalized < tMulaiNormalized || tJadwalNormalized > tSelesaiNormalized) {
        errors.push("Tanggal Jadwal harus berada dalam rentang Tanggal Mulai dan Tanggal Selesai.");
      }
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
    
    const newObat = await prisma.obat.create({
      data: {
        anggota_id: parsedAnggotaId,
        nama_obat: nama_obat.trim(),
        dosis: dosis.trim(),
        keterangan: keterangan ? keterangan.trim() : null,
        tanggal_mulai: tMulai!,
        tanggal_selesai: tSelesai!,
      },
    });

    await prisma.jadwalObat.create({
      data: {
        obat_id: newObat.obat_id,
        jam_minum: new Date(`1970-01-01T${jam_minum}:00Z`),
        tanggal: tJadwal!,
      },
    });

    return NextResponse.json({ message: "Obat dan jadwal berhasil disimpan" });
  } catch (error) {
    console.error("Kesalahan Server:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan obat. Periksa log server." },
      { status: 500 }
    );
  }
}
