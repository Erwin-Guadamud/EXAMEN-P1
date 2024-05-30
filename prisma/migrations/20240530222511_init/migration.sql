-- CreateTable
CREATE TABLE "Paciente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "identificacion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activo',

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignoVital" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "nivelMinimo" INTEGER NOT NULL,
    "nivelMaximo" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activo',

    CONSTRAINT "SignoVital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlRealizado" (
    "id" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "signoVitalId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TIMESTAMP(3) NOT NULL,
    "valor" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activo',

    CONSTRAINT "ControlRealizado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ControlRealizado" ADD CONSTRAINT "ControlRealizado_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlRealizado" ADD CONSTRAINT "ControlRealizado_signoVitalId_fkey" FOREIGN KEY ("signoVitalId") REFERENCES "SignoVital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
