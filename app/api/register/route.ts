import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nama, nomor_wa } = body;
    const errors: string[] = [];
    
    if (!nama || nama.trim() === "") {
      errors.push("Nama wajib diisi.");
    } else {
        const clean_nama = nama.trim();
        if (/\s/.test(clean_nama)) {
            errors.push("Nama tidak boleh mengandung spasi.");
        }
        if (clean_nama !== clean_nama.toLowerCase()) {
            errors.push("Nama harus menggunakan huruf kecil semua.");
        }
    }

    if (!nomor_wa || nomor_wa.trim() === "") {
      errors.push("Nomor WhatsApp wajib diisi.");
    }

    const clean_nomor_wa = nomor_wa ? nomor_wa.replace(/\D/g, '') : ''; 
    
    const validPrefix = clean_nomor_wa.startsWith('62') || clean_nomor_wa.startsWith('08');
    if (!validPrefix) {
        errors.push("Nomor WhatsApp harus diawali dengan '62' atau '08'.");
    }
    
    if (clean_nomor_wa.length < 10 || clean_nomor_wa.length > 15) {
      errors.push("Format Nomor WhatsApp tidak valid (panjang minimal 10, maksimal 15 digit).");
    }
    
    if (clean_nomor_wa && clean_nomor_wa.length >= 10 && clean_nomor_wa.length <= 15 && validPrefix) {
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

    const final_nama = nama.trim().toLowerCase(); 

    const newUser = await prisma.user.create({
      data: { 
          nama: final_nama,
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
