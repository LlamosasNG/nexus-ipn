import Academy from '@/models/Academy'
import Planning from '@/models/Planning'
import Subject from '@/models/Subject'
import User from '@/models/User'
import UserSubject from '@/models/UserSubject'
import { normalizeAcademicPeriod } from '@/utils/academicPeriod'
import { Request, Response } from 'express'

export class SubjectController {
  static getByAcademy = async (req: Request, res: Response) => {
    try {
      const { academyId } = req.params
      const subjects = await Subject.findAll({
        where: { academyId },
        include: [
          {
            model: Academy,
            attributes: ['id', 'name'],
          },
        ],
        order: [['name', 'ASC']],
      })
      res.json(subjects)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las materias' })
    }
  }

  static assign = async (req: Request, res: Response) => {
    try {
      const { subjectIds, period } = req.body
      const userId = req.user.id

      // Validar que no se excedan 5 materias
      if (subjectIds.length > 5) {
        const error = new Error('No puedes asignar más de 5 materias')
        return res.status(400).json({ error: error.message })
      }

      // Verificar que todas las materias existan
      const subjects = await Subject.findAll({
        where: {
          id: subjectIds,
        },
      })

      if (subjects.length !== subjectIds.length) {
        const error = new Error('Una o más materias no existen')
        return res.status(404).json({ error: error.message })
      }

      // Eliminar asignaciones anteriores del usuario
      await UserSubject.destroy({
        where: { userId },
      })

      // Crear nuevas asignaciones
      const academicPeriod = normalizeAcademicPeriod(period)
      const assignments = subjectIds.map((subjectId: number) => ({
        userId,
        subjectId,
        period: academicPeriod,
        active: true,
      }))

      await UserSubject.bulkCreate(assignments)

      res.json({ message: 'Materias asignadas exitosamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error al asignar las materias' })
    }
  }

  static remove = async (req: Request, res: Response) => {
    try {
      const { subjectId } = req.params
      const userId = req.user.id

      const deleted = await UserSubject.destroy({
        where: {
          userId,
          subjectId,
        },
      })
      if (deleted === 0) {
        const error = new Error('No tienes asignada esta materia')
        return res.status(404).json({ error: error.message })
      }
      res.json({ message: 'Materia removida exitosamente' })
    } catch (error) {
      res.status(500).json({ error: 'Error al remover la materia' })
    }
  }

  static getByUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [
          {
            model: Subject,
            attributes: ['id', 'name', 'code'],
            through: {
              attributes: ['period', 'active'],
            },
            include: [
              {
                model: Academy,
                attributes: ['id', 'name'],
              },
              {
                model: Planning,
                where: { userId: req.user.id },
                attributes: ['id', 'period', 'status'],
                required: false,
              },
            ],
          },
        ],
      })
      res.json(user?.subjects || [])
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener tus materias' })
    }
  }

  static subject = async (req: Request, res: Response) => {
    res.json(req.subject)
  }
}
