import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { anggota_id, tanggal_kontrol, jam, tempat, keterangan } = body;

    await prisma.jadwalKontrol.create({
      data: {
        anggota_id: Number(anggota_id),
        tanggal_kontrol: new Date(tanggal_kontrol),
        jam: new Date(`1970-01-01T${jam}:00Z`),
        tempat,
        keterangan,
      },
    });

    return NextResponse.json({ message: "Jadwal kontrol berhasil disimpan" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan jadwal kontrol" }, { status: 500 });
  }
}
