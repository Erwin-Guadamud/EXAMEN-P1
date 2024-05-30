-- CreateTable
CREATE TABLE "Auditoria" (
    "id" SERIAL NOT NULL,
    "entidad" TEXT NOT NULL,
    "detalle" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "idAuditado" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activo',

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);
