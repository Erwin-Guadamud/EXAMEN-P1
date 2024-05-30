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

// GET - Retrieve all ControlesRealizados
router.get("/", async (req, res) => {
  try {
    const controlesRealizados = await prisma.controlRealizado.findMany({
      include: {
        paciente: true,
        signoVital: true,
      },
    });
    res.json(controlesRealizados);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los controles realizados" });
  }
});

// GET - Retrieve a ControlRealizado by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const controlRealizado = await prisma.controlRealizado.findUnique({
      where: { id: Number(id) },
      include: {
        paciente: true,
        signoVital: true,
      },
    });
    if (!controlRealizado) {
      res.status(404).json({ error: "Control realizado no encontrado" });
    } else {
      res.json(controlRealizado);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el control realizado" });
  }
});

// POST - Create a new ControlRealizado
router.post("/", async (req, res) => {
  const { pacienteId, signoVitalId, fecha, hora, valor, estado } = req.body;
  try {
    const controlRealizadoCreado = await prisma.controlRealizado.create({
      data: {
        pacienteId,
        signoVitalId,
        fecha,
        hora,
        valor,
        estado,
      },
    });

    res.status(201).json(controlRealizadoCreado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el control realizado" });
  }
});

// PUT - Update an existing ControlRealizado by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { pacienteId, signoVitalId, fecha, hora, valor, estado } = req.body;
  try {
    const controlRealizadoActualizado = await prisma.controlRealizado.update({
      where: { id: Number(id) },
      data: {
        pacienteId,
        signoVitalId,
        fecha,
        hora,
        valor,
        estado,
      },
    });
    res.json(controlRealizadoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el control realizado" });
  }
});

// DELETE - Logically delete a ControlRealizado by ID and register in Auditoria
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const controlRealizado = await prisma.controlRealizado.update({
      where: { id: Number(id) },
      data: {
        estado: "eliminado",
      },
    });

    const detalle = `ELIMINO EL ELEMENTO CON ID ${id} EN LA ENTIDAD ControlRealizado`;
    await registrarAuditoria('ControlRealizado', Number(id), detalle);

    res.json({ message: "Control realizado eliminado correctamente (lógicamente)" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el control realizado" });
  }
});

export default router;
