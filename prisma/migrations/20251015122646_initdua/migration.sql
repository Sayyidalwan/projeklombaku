/*
  Warnings:

  - You are about to drop the column `alamat` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nomor_wa` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `users_nomor_wa_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `alamat`,
    DROP COLUMN `nomor_wa`;
