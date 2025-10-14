-- CreateTable
CREATE TABLE `obat` (
    `obat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `anggota_id` INTEGER NOT NULL,
    `nama_obat` VARCHAR(100) NOT NULL,
    `dosis` VARCHAR(50) NOT NULL,
    `keterangan` VARCHAR(100) NULL,
    `tanggal_mulai` DATE NOT NULL,
    `tanggal_selesai` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`obat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_obat` (
    `jadwal_id` INTEGER NOT NULL AUTO_INCREMENT,
    `obat_id` INTEGER NOT NULL,
    `jam_minum` TIME NOT NULL,
    `status` ENUM('BELUM', 'SUDAH') NOT NULL DEFAULT 'BELUM',
    `tanggal` DATE NOT NULL,

    PRIMARY KEY (`jadwal_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_kontrol` (
    `kontrol_id` INTEGER NOT NULL AUTO_INCREMENT,
    `anggota_id` INTEGER NOT NULL,
    `tanggal_kontrol` DATE NOT NULL,
    `jam` TIME NOT NULL,
    `tempat` VARCHAR(100) NOT NULL,
    `keterangan` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`kontrol_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `obat` ADD CONSTRAINT `obat_anggota_id_fkey` FOREIGN KEY (`anggota_id`) REFERENCES `keluarga_anggota`(`anggota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwal_obat` ADD CONSTRAINT `jadwal_obat_obat_id_fkey` FOREIGN KEY (`obat_id`) REFERENCES `obat`(`obat_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwal_kontrol` ADD CONSTRAINT `jadwal_kontrol_anggota_id_fkey` FOREIGN KEY (`anggota_id`) REFERENCES `keluarga_anggota`(`anggota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
