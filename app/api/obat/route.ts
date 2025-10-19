import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { anggota_id, nama_obat, dosis, keterangan, tanggal_mulai, tanggal_selesai, jam_minum, tanggal } = body;

    // Buat dulu data obat
    const newObat = await prisma.obat.create({
      data: {
        anggota_id: Number(anggota_id),
        nama_obat,
        dosis,
        keterangan,
        tanggal_mulai: new Date(tanggal_mulai),
        tanggal_selesai: new Date(tanggal_selesai),
      },
    });

    // Setelah itu buat jadwal minum obat
    await prisma.jadwalObat.create({
      data: {
        obat_id: newObat.obat_id,
        jam_minum: new Date(`1970-01-01T${jam_minum}:00Z`),
        tanggal: new Date(tanggal),
      },
    });

    return NextResponse.json({ message: "Obat dan jadwal berhasil disimpan" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan obat" }, { status: 500 });
  }
}
