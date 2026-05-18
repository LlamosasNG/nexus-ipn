import { PlanningStatus } from '@/models/Planning'
import DigitalDidacticResource from '@/models/DigitalDidacticResource'
import Planning from '@/models/Planning'
import Subject from '@/models/Subject'
import User from '@/models/User'
import { Request, Response } from 'express'

const isResourceComplete = (resource: DigitalDidacticResource) =>
  Boolean(
    resource.identification &&
      resource.pedagogical &&
      resource.methodology &&
      resource.content &&
      resource.learningActivities &&
      resource.evaluation &&
      resource.help &&
      resource.credits
  )

export class DepartmentHeadDashboardController {
  static getMetrics = async (req: Request, res: Response) => {
    try {
      const academyId = req.user.academyId
      const teacherWhere = academyId
        ? { academyId, role: 'Docente' }
        : { role: 'Docente' }

      const [teachers, plannings, digitalResources] = await Promise.all([
        User.findAll({
          where: teacherWhere,
          attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
          order: [['name', 'ASC']],
        }),
        Planning.findAll({
          include: [
            {
              model: Subject,
              attributes: ['id', 'name', 'code'],
            },
            {
              model: User,
              attributes: ['id', 'name', 'email'],
              where: teacherWhere,
            },
          ],
          order: [['updatedAt', 'DESC']],
        }),
        DigitalDidacticResource.findAll({
          include: [
            {
              model: Subject,
              attributes: ['id', 'name', 'code'],
            },
            {
              model: User,
              attributes: ['id', 'name', 'email'],
              where: teacherWhere,
            },
          ],
          order: [['updatedAt', 'DESC']],
        }),
      ])

      const participatingTeacherIds = new Set<number>()

      for (const planning of plannings) {
        participatingTeacherIds.add(planning.userId)
      }

      for (const resource of digitalResources) {
        participatingTeacherIds.add(resource.userId)
      }

      const draftPlannings = plannings.filter(
        (planning) => planning.status === PlanningStatus.DRAFT
      )
      const latestDraftPlanningByTeacherId = new Map<number, Planning>()

      for (const planning of draftPlannings) {
        if (!latestDraftPlanningByTeacherId.has(planning.userId)) {
          latestDraftPlanningByTeacherId.set(planning.userId, planning)
        }
      }

      const teacherIds = new Set(teachers.map((teacher) => teacher.id))
      const activeTeacherCount = Array.from(participatingTeacherIds).filter((id) =>
        teacherIds.has(id)
      ).length
      const teacherParticipation =
        teachers.length === 0
          ? 0
          : Number(
              (
                (activeTeacherCount / teachers.length) *
                100
              ).toFixed(1)
            )

      const approvedDigitalResources = digitalResources.filter(isResourceComplete)

      const recentActivity = [
        ...teachers.map((teacher) => {
          const draftPlanning = latestDraftPlanningByTeacherId.get(teacher.id)

          return {
            id: `teacher-${teacher.id}`,
            type: 'teacher' as const,
            title: teacher.name,
            subjectName: draftPlanning
              ? draftPlanning.subject?.name || 'Materia no disponible'
              : 'Actividad docente en el sistema',
            teacherName: teacher.email,
            status: draftPlanning
              ? 'Planeación en borrador'
              : participatingTeacherIds.has(teacher.id)
                ? 'Con actividad académica'
                : 'Registrado sin actividad',
            updatedAt: draftPlanning?.updatedAt || teacher.updatedAt,
          }
        }),
        ...plannings.map((planning) => ({
          id: `planning-${planning.id}`,
          type: 'planning' as const,
          title: planning.subject?.name || `Planeación ${planning.id}`,
          subjectName: planning.subject?.name || 'Materia no disponible',
          teacherName: planning.user?.name || 'Docente no disponible',
          status: planning.status,
          updatedAt: planning.updatedAt,
        })),
        ...digitalResources.map((resource) => ({
          id: `resource-${resource.id}`,
          type: 'resource' as const,
          title:
            resource.identification?.title ||
            resource.subject?.name ||
            `Recurso digital ${resource.id}`,
          subjectName: resource.subject?.name || 'Materia no disponible',
          teacherName: resource.user?.name || 'Docente no disponible',
          status: isResourceComplete(resource) ? 'Completado' : 'En proceso',
          updatedAt: resource.updatedAt,
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 8)

      res.json({
        academy: req.user.academy
          ? {
              id: req.user.academy.id,
              name: req.user.academy.name,
            }
          : null,
        metrics: {
          totalTeachers: teachers.length,
          activeTeachers: activeTeacherCount,
          teachersWithDraftPlannings: latestDraftPlanningByTeacherId.size,
          totalPlannings: plannings.length,
          draftPlannings: draftPlannings.length,
          pendingPlannings: plannings.filter(
            (planning) => planning.status === PlanningStatus.SENT
          ).length,
          approvedPlannings: plannings.filter(
            (planning) => planning.status === PlanningStatus.APPROVED
          ).length,
          approvedDigitalResources: approvedDigitalResources.length,
          teacherParticipation,
          recentActivityCount: recentActivity.length,
        },
        recentActivity,
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: 'Hubo un error al obtener el dashboard del jefe de departamento',
      })
    }
  }
}
