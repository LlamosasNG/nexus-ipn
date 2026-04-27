import Planning from '@/models/Planning'
import SessionActivity from '@/models/SessionActivity'
import ThematicUnit from '@/models/ThematicUnit'
import { Request, Response } from 'express'

export class ThematicUnitController {
  // --- CRUD de Unidades Temáticas ---

  static create = async (req: Request, res: Response) => {
    try {
      const { planningId } = req.params

      const planning = await Planning.findOne({
        where: { id: planningId, userId: req.user.id },
      })

      if (!planning) {
        return res
          .status(404)
          .json({ error: 'Planeación no encontrada' })
      }

      const unitCount = await ThematicUnit.count({ where: { planningId } })
      if (unitCount >= 15) {
        return res.status(400).json({ error: 'Máximo 15 unidades temáticas permitidas' })
      }

      const thematicUnit = await ThematicUnit.create({
        planningId: Number(planningId),
        order: unitCount,
        ...req.body,
      })

      res.status(201).json({ message: 'Unidad temática creada', data: thematicUnit })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al crear la unidad temática' })
    }
  }

  static getAll = async (req: Request, res: Response) => {
    try {
      const { planningId } = req.params

      const units = await ThematicUnit.findAll({
        where: { planningId },
        include: [{
          model: SessionActivity,
          order: [['order', 'ASC']]
        }],
        order: [['order', 'ASC']],
      })

      res.json(units)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener las unidades temáticas' })
    }
  }

  static getById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)

      const unit = await ThematicUnit.findByPk(id, {
        include: [SessionActivity],
      })

      if (!unit) {
        return res
          .status(404)
          .json({ error: 'Unidad temática no encontrada' })
      }

      res.json(unit)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener la unidad temática' })
    }
  }

  static update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)

      const unit = await ThematicUnit.findByPk(id)

      if (!unit) {
        return res
          .status(404)
          .json({ error: 'Unidad temática no encontrada' })
      }

      await unit.update(req.body)
      res.json({ message: 'Unidad temática actualizada', data: unit })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al actualizar la unidad temática' })
    }
  }

  static delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)

      const unit = await ThematicUnit.findByPk(id)

      if (!unit) {
        return res
          .status(404)
          .json({ error: 'Unidad temática no encontrada' })
      }

      await unit.destroy()
      res.json({ message: 'Unidad temática eliminada' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al eliminar la unidad temática' })
    }
  }

  static reorder = async (req: Request, res: Response) => {
    try {
      const { planningId } = req.params
      const { orderedIds }: { orderedIds: number[] } = req.body

      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ error: 'orderedIds debe ser un array' })
      }

      for (let i = 0; i < orderedIds.length; i++) {
        await ThematicUnit.update(
          { order: i },
          { where: { id: orderedIds[i], planningId } }
        )
      }

      res.json({ message: 'Unidades reordenadas' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al reordenar las unidades temáticas' })
    }
  }

  static getSessionsByUnit = async (req: Request, res: Response) => {
    try {
      const unitId = Number(req.params.unitId)

      const sessions = await SessionActivity.findAll({
        where: { thematicUnitId: unitId },
        order: [['order', 'ASC']],
      })

      res.json(sessions)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener las sesiones' })
    }
  }

  // --- CRUD de Sesiones dentro de una Unidad Temática ---

  static createSession = async (req: Request, res: Response) => {
    try {
      const unitId = Number(req.params.unitId)

      const unit = await ThematicUnit.findByPk(unitId)

      if (!unit) {
        return res
          .status(404)
          .json({ error: 'Unidad temática no encontrada' })
      }

      const session = await SessionActivity.create({
        thematicUnitId: unitId,
        ...req.body,
      })

      res.status(201).json({ message: 'Sesión creada', data: session })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al crear la sesión' })
    }
  }

  static updateSession = async (req: Request, res: Response) => {
    try {
      const sessionId = Number(req.params.sessionId)

      const session = await SessionActivity.findByPk(sessionId)

      if (!session) {
        return res
          .status(404)
          .json({ error: 'Sesión no encontrada' })
      }

      await session.update(req.body)
      res.json({ message: 'Sesión actualizada', data: session })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al actualizar la sesión' })
    }
  }

  static deleteSession = async (req: Request, res: Response) => {
    try {
      const sessionId = Number(req.params.sessionId)

      const session = await SessionActivity.findByPk(sessionId)

      if (!session) {
        return res
          .status(404)
          .json({ error: 'Sesión no encontrada' })
      }

      await session.destroy()
      res.json({ message: 'Sesión eliminada' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al eliminar la sesión' })
    }
  }
}
