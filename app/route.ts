import { PrismaClient } from "@prisma/client";
import { redirect } from "next/dist/server/api-utils";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nama, nomor_wa } = body;
    const errors: string[] = [];

    if (!nama || nama.trim() === "") {
      errors.push("Nama wajib diisi.");
    }
    if (!nomor_wa || nomor_wa.trim() === "") {
      errors.push("Nomor WhatsApp wajib diisi.");
    }

    const clean_nomor_wa = nomor_wa ? nomor_wa.replace(/\D/g, '') : ''; 
    if (clean_nomor_wa.length < 10 || clean_nomor_wa.length > 15) {
      errors.push("Format Nomor WhatsApp tidak valid.");
    }
    
    if (clean_nomor_wa && clean_nomor_wa.length >= 10 && clean_nomor_wa.length <= 15) {
        const existingUser = await prisma.user.findUnique({
            where: { nomor_wa: clean_nomor_wa },
        });

        if (existingUser) {
            errors.push("Nomor WhatsApp ini sudah terdaftar. Silakan login atau gunakan nomor lain.");
        }
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ 
          success: false, 
          message: "Data yang dimasukkan tidak valid.",
          errors: errors 
      }), { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
      });
    }

    const newUser = await prisma.user.create({
      data: { 
          nama: nama.trim(), 
          nomor_wa: clean_nomor_wa 
      },
    });

    return Response.json({ success: true, user: newUser, redirectUrl: "/login" });
    
  } catch (error: any) {
    return new Response(JSON.stringify({ 
        success: false, 
        message: "Terjadi kesalahan server: " + error.message 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}