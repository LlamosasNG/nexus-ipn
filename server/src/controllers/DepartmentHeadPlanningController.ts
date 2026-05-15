import Academy from '@/models/Academy'
import GeneralData from '@/models/GeneralData'
import Planning, { PlanningStatus } from '@/models/Planning'
import PlagiarismTool from '@/models/PlagiarismTool'
import Reference from '@/models/Reference'
import Subject from '@/models/Subject'
import ThematicUnit from '@/models/ThematicUnit'
import TransversalAxis from '@/models/TransversalAxis'
import User from '@/models/User'
import { Op, OrderItem } from 'sequelize'
import { Request, Response } from 'express'

type DepartmentHeadPlanningReviewStatus =
  | 'Pendiente'
  | 'En revisión'
  | 'Validada'
  | 'Rechazada'

const REVIEW_STATUS_TO_PLANNING_STATUS: Record<
  DepartmentHeadPlanningReviewStatus,
  PlanningStatus[]
> = {
  Pendiente: [PlanningStatus.DRAFT, PlanningStatus.LATE],
  'En revisión': [PlanningStatus.SENT],
  Validada: [PlanningStatus.APPROVED],
  Rechazada: [PlanningStatus.REJECTED],
}

const getReviewStatus = (
  status: PlanningStatus
): DepartmentHeadPlanningReviewStatus => {
  if (status === PlanningStatus.SENT) return 'En revisión'
  if (status === PlanningStatus.APPROVED) return 'Validada'
  if (status === PlanningStatus.REJECTED) return 'Rechazada'
  return 'Pendiente'
}

const getSortOrder = (
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): OrderItem[] => {
  const direction = sortOrder.toUpperCase() as 'ASC' | 'DESC'

  if (sortBy === 'teacherName') {
    return [[User, 'name', direction]]
  }

  if (sortBy === 'subjectName') {
    return [[Subject, 'name', direction]]
  }

  if (sortBy === 'period') {
    return [['period', direction]]
  }

  if (sortBy === 'status') {
    return [['status', direction]]
  }

  if (sortBy === 'createdAt') {
    return [['createdAt', direction]]
  }

  return [['updatedAt', direction]]
}

export class DepartmentHeadPlanningController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const academyId = req.user.academyId

      if (!academyId) {
        return res.status(400).json({
          error: 'El usuario no tiene una academia asignada',
        })
      }

      const page = Math.max(Number(req.query.page) || 1, 1)
      const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 10, 1), 50)
      const offset = (page - 1) * pageSize

      const teacherId = req.query.teacherId
        ? Number(req.query.teacherId)
        : undefined
      const subjectId = req.query.subjectId
        ? Number(req.query.subjectId)
        : undefined
      const academyFilterId = req.query.academyId
        ? Number(req.query.academyId)
        : undefined
      const period = typeof req.query.period === 'string' ? req.query.period : ''
      const search =
        typeof req.query.search === 'string' ? req.query.search.trim() : ''
      const reviewStatus =
        typeof req.query.status === 'string'
          ? (req.query.status as DepartmentHeadPlanningReviewStatus)
          : undefined
      const sortBy =
        typeof req.query.sortBy === 'string' ? req.query.sortBy : 'updatedAt'
      const sortOrder =
        req.query.sortOrder === 'asc' ? 'asc' : ('desc' as 'asc' | 'desc')

      if (academyFilterId && academyFilterId !== academyId) {
        return res.json({
          data: [],
          meta: {
            page,
            pageSize,
            total: 0,
            totalPages: 0,
          },
          filters: {
            teachers: [],
            subjects: [],
            academies: [],
            periods: [],
            statuses: Object.keys(REVIEW_STATUS_TO_PLANNING_STATUS),
          },
        })
      }

      const planningWhere: {
        period?: string
        status?: unknown
        [Op.or]?: object[]
      } = {}

      if (period) {
        planningWhere.period = period
      }

      if (reviewStatus) {
        planningWhere.status = {
          [Op.in]: REVIEW_STATUS_TO_PLANNING_STATUS[reviewStatus],
        }
      }

      if (search) {
        planningWhere[Op.or] = [
          { period: { [Op.iLike]: `%${search}%` } },
          { status: { [Op.iLike]: `%${search}%` } },
          { '$user.name$': { [Op.iLike]: `%${search}%` } },
          { '$user.email$': { [Op.iLike]: `%${search}%` } },
          { '$subject.name$': { [Op.iLike]: `%${search}%` } },
          { '$subject.code$': { [Op.iLike]: `%${search}%` } },
        ]
      }

      const subjectWhere: Record<string, unknown> = { academyId }
      const teacherWhere: Record<string, unknown> = { role: 'Docente' }

      if (subjectId) {
        subjectWhere.id = subjectId
      }

      if (teacherId) {
        teacherWhere.id = teacherId
      }

      const [plannings, teachers, subjects, academy, periodsRaw] =
        await Promise.all([
          Planning.findAndCountAll({
            where: planningWhere,
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'email'],
                where: teacherWhere,
              },
              {
                model: Subject,
                attributes: ['id', 'name', 'code', 'academyId'],
                where: subjectWhere,
              },
            ],
            distinct: true,
            col: 'Planning.id',
            subQuery: false,
            order: getSortOrder(sortBy, sortOrder),
            limit: pageSize,
            offset,
          }),
          User.findAll({
            where: {
              academyId,
              role: 'Docente',
            },
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
          }),
          Subject.findAll({
            where: { academyId },
            attributes: ['id', 'name', 'code'],
            order: [['name', 'ASC']],
          }),
          Academy.findByPk(academyId, {
            attributes: ['id', 'name'],
          }),
          Planning.findAll({
            include: [
              {
                model: Subject,
                attributes: [],
                where: { academyId },
              },
            ],
            attributes: ['period'],
            raw: true,
          }),
        ])

      const periods = Array.from(
        new Set(
          periodsRaw
            .map((planning) => planning.period)
            .filter((value): value is string => Boolean(value))
        )
      ).sort((a, b) => a.localeCompare(b, 'es'))

      res.json({
        data: plannings.rows.map((planning) => ({
          id: planning.id,
          period: planning.period,
          status: planning.status,
          reviewStatus: getReviewStatus(planning.status),
          submissionDate: planning.submissionDate,
          feedback: planning.feedback,
          createdAt: planning.createdAt,
          updatedAt: planning.updatedAt,
          teacher: {
            id: planning.user.id,
            name: planning.user.name,
            email: planning.user.email,
          },
          subject: {
            id: planning.subject.id,
            name: planning.subject.name,
            code: planning.subject.code,
          },
          academy: academy
            ? {
                id: academy.id,
                name: academy.name,
              }
            : null,
        })),
        meta: {
          page,
          pageSize,
          total: plannings.count,
          totalPages: Math.ceil(plannings.count / pageSize),
        },
        filters: {
          teachers: teachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
          })),
          subjects: subjects.map((subject) => ({
            id: subject.id,
            name: subject.name,
            code: subject.code,
          })),
          academies: academy
            ? [
                {
                  id: academy.id,
                  name: academy.name,
                },
              ]
            : [],
          periods,
          statuses: Object.keys(REVIEW_STATUS_TO_PLANNING_STATUS),
        },
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error:
          'Hubo un error al obtener la gestión de planeaciones del departamento',
      })
    }
  }

  static getById = async (req: Request, res: Response) => {
    try {
      const academyId = req.user.academyId
      const planningId = Number(req.params.planningId)

      if (!academyId) {
        return res.status(400).json({
          error: 'El usuario no tiene una academia asignada',
        })
      }

      const planning = await Planning.findOne({
        where: { id: planningId },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email'],
            where: {
              academyId,
              role: 'Docente',
            },
          },
          {
            model: Subject,
            attributes: [
              'id',
              'name',
              'code',
              'academicUnit',
              'semester',
              'areaFormation',
              'modality',
            ],
            where: { academyId },
            include: [
              {
                model: Academy,
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      })

      if (!planning) {
        return res.status(404).json({ error: 'Planeación no encontrada' })
      }

      const [generalData, transversalAxis, thematicUnitsCount, referencesCount, plagiarismTool] =
        await Promise.all([
          GeneralData.findOne({
            where: { planningId },
            attributes: ['id'],
          }),
          TransversalAxis.findOne({
            where: { planningId },
            attributes: ['id'],
          }),
          ThematicUnit.count({ where: { planningId } }),
          Reference.count({ where: { planningId } }),
          PlagiarismTool.findOne({
            where: { planningId },
            attributes: ['id', 'selectedTool'],
          }),
        ])

      res.json({
        id: planning.id,
        period: planning.period,
        status: planning.status,
        reviewStatus: getReviewStatus(planning.status),
        submissionDate: planning.submissionDate,
        feedback: planning.feedback,
        createdAt: planning.createdAt,
        updatedAt: planning.updatedAt,
        teacher: {
          id: planning.user.id,
          name: planning.user.name,
          email: planning.user.email,
        },
        subject: {
          id: planning.subject.id,
          name: planning.subject.name,
          code: planning.subject.code,
          academicUnit: planning.subject.academicUnit,
          semester: planning.subject.semester,
          areaFormation: planning.subject.areaFormation,
          modality: planning.subject.modality,
        },
        academy: planning.subject.academy
          ? {
              id: planning.subject.academy.id,
              name: planning.subject.academy.name,
            }
          : null,
        summary: {
          hasGeneralData: Boolean(generalData),
          hasTransversalAxis: Boolean(transversalAxis),
          thematicUnitsCount,
          referencesCount,
          plagiarismTool: plagiarismTool?.selectedTool || null,
        },
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error:
          'Hubo un error al obtener el detalle de la planeación del departamento',
      })
    }
  }
}
