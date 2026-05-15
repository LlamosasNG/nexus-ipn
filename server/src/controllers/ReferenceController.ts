import Planning from '@/models/Planning'
import Reference from '@/models/Reference'
import { Request, Response } from 'express'
import { db } from '@/config/db'

export class ReferenceController {
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

      const reference = await Reference.create({
        planningId: Number(planningId),
        ...req.body,
      })

      res.status(201).json({ message: 'Referencia creada', data: reference })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al crear la referencia' })
    }
  }

  static getAll = async (req: Request, res: Response) => {
    try {
      const { planningId } = req.params

      const references = await Reference.findAll({
        where: { planningId },
      })

      res.json(references)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener las referencias' })
    }
  }

  static update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)

      const reference = await Reference.findByPk(id)

      if (!reference) {
        return res
          .status(404)
          .json({ error: 'Referencia no encontrada' })
      }

      await reference.update(req.body)
      res.json({ message: 'Referencia actualizada', data: reference })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al actualizar la referencia' })
    }
  }

  static sync = async (req: Request, res: Response) => {
    const transaction = await db.transaction()

    try {
      const { planningId } = req.params
      const referencesPayload = Array.isArray(req.body.references)
        ? req.body.references
        : []

      const planning = await Planning.findOne({
        where: { id: planningId, userId: req.user.id },
        transaction,
      })

      if (!planning) {
        await transaction.rollback()
        return res.status(404).json({ error: 'Planeación no encontrada' })
      }

      const existingReferences = await Reference.findAll({
        where: { planningId },
        transaction,
      })

      const incomingIds = referencesPayload
        .map((reference) => reference.id)
        .filter((id): id is number => typeof id === 'number')

      const referencesToDelete = existingReferences.filter(
        (reference) => !incomingIds.includes(reference.id)
      )

      if (referencesToDelete.length > 0) {
        await Reference.destroy({
          where: { id: referencesToDelete.map((reference) => reference.id) },
          transaction,
        })
      }

      const syncedReferences = await Promise.all(
        referencesPayload.map(async (reference) => {
          const payload = {
            text: reference.text,
            thematicUnits: reference.thematicUnits,
            types: reference.types,
          }

          if (typeof reference.id === 'number') {
            const existingReference = existingReferences.find(
              (item) => item.id === reference.id
            )

            if (!existingReference) {
              throw new Error('Referencia no encontrada')
            }

            await existingReference.update(payload, { transaction })
            return existingReference
          }

          return Reference.create(
            {
              planningId: Number(planningId),
              ...payload,
            },
            { transaction }
          )
        })
      )

      await transaction.commit()

      res.json({
        message: 'Referencias actualizadas correctamente',
        data: syncedReferences,
      })
    } catch (error) {
      await transaction.rollback()
      console.log(error)
      res.status(500).json({ error: 'Error al sincronizar las referencias' })
    }
  }

  static delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)

      const reference = await Reference.findByPk(id)

      if (!reference) {
        return res
          .status(404)
          .json({ error: 'Referencia no encontrada' })
      }

      await reference.destroy()
      res.json({ message: 'Referencia eliminada' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al eliminar la referencia' })
    }
  }
}
