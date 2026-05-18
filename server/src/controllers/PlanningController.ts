import { db } from '@/config/db'
import DidacticOrganization from '@/models/PlanningDidacticOrganization'
import GeneralData from '@/models/GeneralData'
import Planning, { PlanningStatus } from '@/models/Planning'
import PlagiarismTool from '@/models/PlagiarismTool'
import Reference from '@/models/Reference'
import Subject from '@/models/Subject'
import ThematicUnit from '@/models/ThematicUnit'
import TransversalAxis from '@/models/TransversalAxis'
import User from '@/models/User'
import { checkPassword } from '@/utils/auth'
import { Request, Response } from 'express'
import SessionActivity from '@/models/SessionActivity'

export class PlanningController {
  static create = async (req: Request, res: Response) => {
    try {
      const userId = req.user.id
      const subjectId = req.params.subjectId
      const period = req.userSubject.period

      const existingPlanning = await Planning.findOne({
        where: { userId, subjectId, period },
      })

      if (existingPlanning) {
        return res
          .status(400)
          .json({ error: 'Ya tienes una planeación para esta materia y período' })
      }

      const subject = await Subject.findByPk(Number(subjectId), {
        include: ['academy', 'studyPlans'],
      })

      if (!subject) {
        return res.status(404).json({ error: 'Materia no encontrada' })
      }

      const planning = await Planning.create({
        userId,
        subjectId,
        period,
        status: PlanningStatus.DRAFT,
      })
      res.status(201).json({
        message: 'Planeación creada correctamente',
        data: {
          id: planning.id,
          status: planning.status,
        },
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Hubo un error al crear la planeación' })
    }
  }

  static getAll = async (req: Request, res: Response) => {
    try {
      const plannings = await Planning.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: Subject,
            attributes: ['id', 'name', 'code'],
          },
        ],
        order: [['updatedAt', 'DESC']],
      })
      res.json(plannings)
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ error: 'Hubo un error al obtener las planeaciones' })
    }
  }

  static getById = async (req: Request, res: Response) => {
    try {
      const { planningId } = req.params

      const planning = await Planning.findOne({
        where: { id: planningId, userId: req.user.id },
        include: [Subject],
        order: [['updatedAt', 'DESC']],
      })

      if (!planning) {
        return res.status(404).json({ error: 'Planeación no encontrada' })
      }

      res.json(planning)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Hubo un error al obtener la planeación' })
    }
  }

  static delete = async (req: Request, res: Response) => {
    const transaction = await db.transaction()

    try {
      const { planningId } = req.params
      const { password } = req.body

      const user = await User.findByPk(req.user.id, { transaction })

      if (!user) {
        await transaction.rollback()
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      const isPasswordValid = await checkPassword(password, user.password)

      if (!isPasswordValid) {
        await transaction.rollback()
        return res.status(403).json({ error: 'Contraseña incorrecta' })
      }

      const planning = await Planning.findOne({
        where: { id: planningId, userId: req.user.id },
        transaction,
      })

      if (!planning) {
        await transaction.rollback()
        return res.status(404).json({ error: 'Planeación no encontrada' })
      }

      const thematicUnits = await ThematicUnit.findAll({
        where: { planningId },
        attributes: ['id'],
        transaction,
      })

      const thematicUnitIds = thematicUnits.map((unit) => unit.id)

      if (thematicUnitIds.length > 0) {
        await SessionActivity.destroy({
          where: { thematicUnitId: thematicUnitIds },
          transaction,
        })
      }

      await ThematicUnit.destroy({
        where: { planningId },
        transaction,
      })

      await Promise.all([
        GeneralData.destroy({ where: { planningId }, transaction }),
        TransversalAxis.destroy({ where: { planningId }, transaction }),
        DidacticOrganization.destroy({ where: { planningId }, transaction }),
        Reference.destroy({ where: { planningId }, transaction }),
        PlagiarismTool.destroy({ where: { planningId }, transaction }),
      ])

      await planning.destroy({ transaction })
      await transaction.commit()

      res.json({ message: 'Planeación eliminada correctamente' })
    } catch (error) {
      await transaction.rollback()
      console.log(error)
      res.status(500).json({ error: 'Hubo un error al eliminar la planeación' })
    }
  }

  static submit = async (req: Request, res: Response) => {
    try {
      const { planningId } = req.params

      const planning = await Planning.findOne({
        where: { id: planningId, userId: req.user.id },
      })

      if (!planning) {
        return res.status(404).json({ error: 'Planeación no encontrada' })
      }

      if (planning.status !== PlanningStatus.DRAFT) {
        return res.status(400).json({
          error: 'Solo las planeaciones en borrador pueden enviarse',
        })
      }

      planning.status = PlanningStatus.SENT
      planning.submissionDate = new Date()
      await planning.save()

      res.json({
        message: 'Planeación enviada correctamente',
        status: planning.status,
        submissionDate: planning.submissionDate,
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Hubo un error al enviar la planeación' })
    }
  }
}
