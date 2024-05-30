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

// GET - Retrieve all Pacientes
router.get("/", async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pacientes" });
  }
});

// GET - Retrieve a Paciente by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: Number(id) },
    });
    if (!paciente) {
      res.status(404).json({ error: "Paciente no encontrado" });
    } else {
      res.json(paciente);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el paciente" });
  }
});

// POST - Create a new Paciente
router.post("/", async (req, res) => {
  const { nombre, identificacion } = req.body;
  try {
    const pacienteCreado = await prisma.paciente.create({
      data: {
        nombre,
        identificacion,
      },
    });

    const detalle = `CREO EL ELEMENTO CON ID ${pacienteCreado.id} EN LA ENTIDAD Paciente`;
    await registrarAuditoria('Paciente', pacienteCreado.id, detalle);

    res.status(201).json(pacienteCreado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el paciente" });
  }
});

// PUT - Update an existing Paciente by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, identificacion } = req.body;
  try {
    const pacienteActualizado = await prisma.paciente.update({
      where: { id: Number(id) },
      data: {
        nombre,
        identificacion,
      },
    });

    const detalle = `ACTUALIZO EL ELEMENTO CON ID ${id} EN LA ENTIDAD Paciente`;
    await registrarAuditoria('Paciente', Number(id), detalle);

    res.json(pacienteActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el paciente" });
  }
});

// DELETE - Delete a Paciente by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.paciente.delete({
      where: { id: Number(id) },
    });

    const detalle = `ELIMINO EL ELEMENTO CON ID ${id} EN LA ENTIDAD Paciente`;
    await registrarAuditoria('Paciente', Number(id), detalle);

    res.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el paciente" });
  }
});

export default router;
