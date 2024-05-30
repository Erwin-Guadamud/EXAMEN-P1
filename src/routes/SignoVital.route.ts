import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Función para registrar en la auditoría
async function registrarAuditoria(entidad: string, idAuditado: number, detalle: string) {
  await prisma.auditoria.create({
    data: {
      entidad,
      idAuditado,
      detalle,
      fecha: new Date(),
      estado: "activo",
    },
  });
}

// GET - Retrieve all SignosVitales
router.get("/", async (req, res) => {
  try {
    const signosVitales = await prisma.signoVital.findMany();
    res.json(signosVitales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los signos vitales" });
  }
});

// GET - Retrieve a SignoVital by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const signoVital = await prisma.signoVital.findUnique({
      where: { id: Number(id) },
    });
    if (!signoVital) {
      res.status(404).json({ error: "Signo vital no encontrado" });
    } else {
      res.json(signoVital);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el signo vital" });
  }
});

// POST - Create a new SignoVital
router.post("/", async (req, res) => {
  const { descripcion, nivelMinimo, nivelMaximo } = req.body;
  try {
    const signoVitalCreado = await prisma.signoVital.create({
      data: {
        descripcion,
        nivelMinimo,
        nivelMaximo,
      },
    });
    res.status(201).json(signoVitalCreado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el signo vital" });
  }
});

// PUT - Update an existing SignoVital by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { descripcion, nivelMinimo, nivelMaximo } = req.body;
  try {
    const signoVitalActualizado = await prisma.signoVital.update({
      where: { id: Number(id) },
      data: {
        descripcion,
        nivelMinimo,
        nivelMaximo,
      },
    });
    res.json(signoVitalActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el signo vital" });
  }
});

// DELETE - Delete a SignoVital by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const signoVital = await prisma.signoVital.findUnique({
      where: { id: Number(id) },
    });
    if (!signoVital) {
      res.status(404).json({ error: "Signo vital no encontrado" });
      return;
    }

    await prisma.signoVital.delete({
      where: { id: Number(id) },
    });

    const detalle = `ELIMINO EL ELEMENTO CON ID ${id} EN LA ENTIDAD SignoVital`;
    await registrarAuditoria('SignoVital', Number(id), detalle);

    res.json({ message: "Signo vital eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el signo vital" });
  }
});

export default router;
