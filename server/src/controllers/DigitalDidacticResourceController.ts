import type {
  DigitalBookSections,
  DigitalBookUpsertPayload,
} from '@/interfaces/DigitalResourceInterfaces'
import DigitalDidacticResource from '@/models/DigitalDidacticResource'
import Subject from '@/models/Subject'
import User from '@/models/User'
import { checkPassword } from '@/utils/auth'
import { Request, Response } from 'express'

const sectionKeys: Array<keyof DigitalBookSections> = [
  'identification',
  'pedagogical',
  'methodology',
  'content',
  'learningActivities',
  'evaluation',
  'help',
  'credits',
]

const buildSectionPayload = (payload: DigitalBookUpsertPayload) => {
  const updates: Partial<DigitalBookSections> = {}

  for (const sectionKey of sectionKeys) {
    if (Object.prototype.hasOwnProperty.call(payload, sectionKey)) {
      const sectionValue = payload[sectionKey]

      if (sectionValue !== undefined) {
        Object.assign(updates, { [sectionKey]: sectionValue })
      }
    }
  }

  return updates
}

const serializeResource = (resource: DigitalDidacticResource) => ({
  id: resource.id,
  userId: resource.userId,
  subjectId: resource.subjectId,
  resourceType: resource.resourceType,
  subject: resource.subject
    ? {
        id: resource.subject.id,
        name: resource.subject.name,
        code: resource.subject.code,
      }
    : null,
  identification: resource.identification,
  pedagogical: resource.pedagogical,
  methodology: resource.methodology,
  content: resource.content,
  learningActivities: resource.learningActivities,
  evaluation: resource.evaluation,
  help: resource.help,
  credits: resource.credits,
  savedSections: {
    identification: Boolean(resource.identification),
    pedagogical: Boolean(resource.pedagogical),
    methodology: Boolean(resource.methodology),
    content: Boolean(resource.content),
    learningActivities: Boolean(resource.learningActivities),
    evaluation: Boolean(resource.evaluation),
    help: Boolean(resource.help),
    credits: Boolean(resource.credits),
  },
  createdAt: resource.createdAt,
  updatedAt: resource.updatedAt,
})

export class DigitalDidacticResourceController {
  static getAllByUser = async (req: Request, res: Response) => {
    try {
      const resources = await DigitalDidacticResource.findAll({
        where: {
          userId: req.user.id,
        },
        include: [
          {
            model: Subject,
            attributes: ['id', 'name', 'code'],
          },
        ],
        order: [['updatedAt', 'DESC']],
      })

      res.json(resources.map(serializeResource))
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener los recursos digitales' })
    }
  }

  static createOrUpdate = async (req: Request, res: Response) => {
    try {
      const subjectId = Number(req.params.subjectId)
      const { resourceType } = req.params
      const payload = req.body as DigitalBookUpsertPayload
      const sectionPayload = buildSectionPayload(payload)

      let resource = await DigitalDidacticResource.findOne({
        where: {
          subjectId,
          userId: req.user.id,
          resourceType,
        },
        include: [
          {
            model: Subject,
            attributes: ['id', 'name', 'code'],
          },
        ],
      })

      if (resource) {
        await resource.update(sectionPayload)
        await resource.reload()

        return res.json({
          message: 'Libro digital actualizado correctamente',
          data: serializeResource(resource),
        })
      }

      resource = await DigitalDidacticResource.create({
        userId: req.user.id,
        subjectId,
        resourceType,
        ...sectionPayload,
      })

      await resource.reload({
        include: [
          {
            model: Subject,
            attributes: ['id', 'name', 'code'],
          },
        ],
      })

      res.status(201).json({
        message: 'Libro digital guardado correctamente',
        data: serializeResource(resource),
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al guardar el libro digital' })
    }
  }

  static get = async (req: Request, res: Response) => {
    try {
      const subjectId = Number(req.params.subjectId)
      const { resourceType } = req.params

      const resource = await DigitalDidacticResource.findOne({
        where: {
          subjectId,
          userId: req.user.id,
          resourceType,
        },
        include: [
          {
            model: Subject,
            attributes: ['id', 'name', 'code'],
          },
        ],
      })

      if (!resource) {
        return res.status(404).json({ error: 'Libro digital no encontrado' })
      }

      res.json(serializeResource(resource))
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener el libro digital' })
    }
  }

  static delete = async (req: Request, res: Response) => {
    try {
      const subjectId = Number(req.params.subjectId)
      const { resourceType } = req.params
      const { password } = req.body

      const user = await User.findByPk(req.user.id)

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      const isPasswordValid = await checkPassword(password, user.password)

      if (!isPasswordValid) {
        return res.status(403).json({ error: 'Contraseña incorrecta' })
      }

      const resource = await DigitalDidacticResource.findOne({
        where: {
          subjectId,
          userId: req.user.id,
          resourceType,
        },
      })

      if (!resource) {
        return res.status(404).json({ error: 'Libro digital no encontrado' })
      }

      await resource.destroy()

      res.json({ message: 'Recurso digital eliminado correctamente' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al eliminar el recurso digital' })
    }
  }
}
