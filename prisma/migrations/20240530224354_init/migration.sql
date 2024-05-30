/*
  Warnings:

  - You are about to drop the column `idAuditado` on the `Auditoria` table. All the data in the column will be lost.
  - Added the required column `id_Auditado` to the `Auditoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auditoria" DROP COLUMN "idAuditado",
ADD COLUMN     "id_Auditado" INTEGER NOT NULL;
