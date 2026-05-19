import Academy from '@/models/Academy'
import GeneralData from '@/models/GeneralData'
import Planning, { PlanningStatus } from '@/models/Planning'
import PlanningDidacticOrganization from '@/models/PlanningDidacticOrganization'
import PlanningObservation from '@/models/PlanningObservation'
import PlagiarismTool from '@/models/PlagiarismTool'
import Reference from '@/models/Reference'
import SessionActivity from '@/models/SessionActivity'
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

const canReviewPlanning = (status: PlanningStatus) =>
  status === PlanningStatus.SENT

const REVIEW_ACTION_TO_STATUS = {
  approve: PlanningStatus.APPROVED,
  reject: PlanningStatus.REJECTED,
} as const

type ReviewAction = keyof typeof REVIEW_ACTION_TO_STATUS

const findPlanningForDepartmentHead = async (
  planningId: number,
  academyId: number
) =>
  Planning.findOne({
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
        include: [
          {
            model: Academy,
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  })

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

      const subjectWhere: Record<string, unknown> = {}
      const teacherWhere: Record<string, unknown> = {
        academyId,
        role: 'Docente',
      }

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
                model: User,
                attributes: [],
                where: {
                  academyId,
                  role: 'Docente',
                },
              },
              {
                model: Subject,
                attributes: [],
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

      const planning = await findPlanningForDepartmentHead(planningId, academyId)

      if (!planning) {
        return res.status(404).json({ error: 'Planeación no encontrada' })
      }

      if (
        ![
          PlanningStatus.SENT,
          PlanningStatus.APPROVED,
          PlanningStatus.REJECTED,
        ].includes(planning.status)
      ) {
        return res.status(403).json({
          error:
            'Solo puedes visualizar planeaciones enviadas, aprobadas o rechazadas',
        })
      }

      const [generalData, transversalAxis, didacticOrganization, thematicUnits, references, plagiarismTool, observations] =
        await Promise.all([
          GeneralData.findOne({
            where: { planningId: planning.id },
          }),
          TransversalAxis.findOne({
            where: { planningId: planning.id },
          }),
          PlanningDidacticOrganization.findOne({
            where: { planningId: planning.id },
          }),
          ThematicUnit.findAll({
            where: { planningId: planning.id },
            order: [['order', 'ASC']],
          }),
          Reference.findAll({
            where: { planningId: planning.id },
            order: [['createdAt', 'ASC']],
          }),
          PlagiarismTool.findOne({
            where: { planningId: planning.id },
          }),
          PlanningObservation.findAll({
            where: { planningId: planning.id },
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'role'],
              },
            ],
            order: [['createdAt', 'ASC']],
          }),
        ])

      const thematicUnitIds = thematicUnits.map((unit) => unit.id)
      const sessions =
        thematicUnitIds.length > 0
          ? await SessionActivity.findAll({
              where: {
                thematicUnitId: {
                  [Op.in]: thematicUnitIds,
                },
              },
              order: [['order', 'ASC']],
            })
          : []

      const thematicUnitsWithSessions = thematicUnits.map((unit) => {
        const unitData = unit.toJSON()

        return {
          ...unitData,
          sessions: sessions
            .filter((session) => session.thematicUnitId === unit.id)
            .map((session) => session.toJSON()),
        }
      })

      res.json({
        id: planning.id,
        period: planning.period,
        status: planning.status,
        reviewStatus: getReviewStatus(planning.status),
        submissionDate: planning.submissionDate,
        feedback: planning.feedback,
        canReview: canReviewPlanning(planning.status),
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
          thematicUnitsCount: thematicUnitsWithSessions.length,
          referencesCount: references.length,
          plagiarismTool: plagiarismTool?.selectedTool || null,
        },
        submittedContent: {
          generalData,
          transversalAxis,
          didacticOrganization,
          thematicUnits: thematicUnitsWithSessions,
          references,
          plagiarismTool,
        },
        observations: observations.map((observation) => ({
          id: observation.id,
          planningId: observation.planningId,
          section: observation.section,
          message: observation.message,
          createdAt: observation.createdAt,
          updatedAt: observation.updatedAt,
          author: {
            id: observation.user.id,
            name: observation.user.name,
            role: observation.user.role,
          },
        })),
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error:
          'Hubo un error al obtener el detalle de la planeación del departamento',
      })
    }
  }

  static addObservation = async (req: Request, res: Response) => {
    try {
      const academyId = req.user.academyId
      const planningId = Number(req.params.planningId)
      const section = Number(req.body.section)
      const message = String(req.body.message || '').trim()

      if (!academyId) {
        return res.status(400).json({
          error: 'El usuario no tiene una academia asignada',
        })
      }

      const planning = await findPlanningForDepartmentHead(planningId, academyId)

      if (!planning) {
        return res.status(404).json({ error: 'Planeación no encontrada' })
      }

      if (!canReviewPlanning(planning.status)) {
        return res.status(400).json({
          error: 'Solo puedes agregar observaciones a planeaciones en revisión',
        })
      }

      const observation = await PlanningObservation.create({
        planningId: planning.id,
        userId: req.user.id,
        section,
        message,
      })

      res.status(201).json({
        message: 'Observación registrada correctamente',
        data: {
          id: observation.id,
          planningId: observation.planningId,
          section: observation.section,
          message: observation.message,
          createdAt: observation.createdAt,
          updatedAt: observation.updatedAt,
          author: {
            id: req.user.id,
            name: req.user.name,
            role: req.user.role,
          },
        },
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: 'Hubo un error al registrar la observación',
      })
    }
  }

  static review = async (req: Request, res: Response) => {
    try {
      const academyId = req.user.academyId
      const planningId = Number(req.params.planningId)
      const action = req.body.action as ReviewAction
      const feedback = String(req.body.feedback || '').trim()

      if (!academyId) {
        return res.status(400).json({
          error: 'El usuario no tiene una academia asignada',
        })
      }

      const planning = await findPlanningForDepartmentHead(planningId, academyId)

      if (!planning) {
        return res.status(404).json({ error: 'Planeación no encontrada' })
      }

      if (!canReviewPlanning(planning.status)) {
        return res.status(400).json({
          error: 'Solo puedes aprobar o rechazar planeaciones en revisión',
        })
      }

      if (action === 'reject' && !feedback) {
        return res.status(400).json({
          error: 'La retroalimentación es obligatoria para rechazar la planeación',
        })
      }

      planning.status = REVIEW_ACTION_TO_STATUS[action]
      planning.feedback = feedback
      await planning.save()

      if (feedback) {
        await PlanningObservation.create({
          planningId: planning.id,
          userId: req.user.id,
          section: 0,
          message: feedback,
        })
      }

      res.json({
        message:
          action === 'approve'
            ? 'Planeación aprobada correctamente'
            : 'Planeación rechazada correctamente',
        status: planning.status,
        reviewStatus: getReviewStatus(planning.status),
        feedback: planning.feedback,
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: 'Hubo un error al actualizar el estado de la planeación',
      })
    }
  }
}
