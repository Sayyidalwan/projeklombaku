import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const isValidUsername = (username: string) => {
  return /^[a-z0-9]+$/.test(username)
}

const isValidNoWa = (noWa: string) => {
  return /^(62|08)\d+$/.test(noWa)
}

export async function POST(req: Request) {
  try {
  const { username, noWa } = await req.json()

  if (!username || !noWa) {
    return Response.json(
      { success: false, message: "Username dan Nomor WhatsApp wajib diisi." },
      { status: 400 }
    )
  }

  if (!isValidUsername(username)) {
    return Response.json(
      { success: false, message: "Username harus huruf kecil, tanpa spasi, dan hanya boleh mengandung angka." },
      { status: 400 }
    )
  }

  if (!isValidNoWa(noWa)) {
    return Response.json(
      { success: false, message: "Nomor WhatsApp harus diawali '62' atau '08'." },
      { status: 400 }
    )
  }

  const user = await prisma.user.findFirst({
    where: {
    nama: username,
    nomor_wa: noWa
    }
  })

  if (!user) {
    return Response.json(
    { success: false, message: "User tidak ditemukan. Periksa kembali username dan nomor Anda." },
    { status: 404 }
    )
  }

  return Response.json(
    { success: true, message: "Login berhasil", user },
    { status: 200 }
  )
  } catch (error) {
  console.error(error)
  return Response.json(
    { success: false, message: "Terjadi kesalahan server internal." },
    { status: 500 }
  )
  }
}
