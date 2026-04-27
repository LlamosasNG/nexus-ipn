import Planning from '@/models/Planning'
import PlanningDidacticOrganization from '@/models/PlanningDidacticOrganization'
import { Request, Response } from 'express'

export class DidacticOrganizationController {
  static createOrUpdate = async (req: Request, res: Response) => {
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

      const existing = await PlanningDidacticOrganization.findOne({
        where: { planningId },
      })

      if (existing) {
        await existing.update(req.body)
        return res.json({ message: 'Organización didáctica actualizada', data: existing })
      }

      const didacticOrganization = await PlanningDidacticOrganization.create({
        planningId: Number(planningId),
        ...req.body,
      })

      res.status(201).json({ message: 'Organización didáctica guardada', data: didacticOrganization })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al guardar la organización didáctica' })
    }
  }

  static get = async (req: Request, res: Response) => {
    try {
      const { planningId } = req.params

      const didacticOrganization = await PlanningDidacticOrganization.findOne({
        where: { planningId },
      })

      if (!didacticOrganization) {
        return res
          .status(404)
          .json({ error: 'Organización didáctica no encontrada' })
      }

      res.json(didacticOrganization)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener la organización didáctica' })
    }
  }
}