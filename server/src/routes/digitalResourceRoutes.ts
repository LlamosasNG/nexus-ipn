import { planningWriteLimiter, readLimiter } from '@/config/limiter'
import { DigitalDidacticResourceController } from '@/controllers/DigitalDidacticResourceController'
import type {
  DigitalBookUpsertPayload,
  DigitalResourceType,
} from '@/interfaces/DigitalResourceInterfaces'
import { authenticate } from '@/middleware/auth'
import { hasAccess, subjectExists } from '@/middleware/subject'
import { handleInputErrors } from '@/middleware/validation'
import { Router } from 'express'
import { body, param } from 'express-validator'

const router: Router = Router()

const supportedResourceTypes = ['digital-book', 'interactive-digital-book']

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isString = (value: unknown): value is string => typeof value === 'string'

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const validateIdentification = (
  value: unknown,
  resourceType?: DigitalResourceType
) => {
  if (!isObjectRecord(value)) return false
  const interactiveDescriptionIsValid =
    resourceType === 'interactive-digital-book'
      ? isString(value.interactiveDescription) &&
        value.interactiveDescription.trim().length > 0
      : value.interactiveDescription === undefined ||
        isString(value.interactiveDescription)

  return (
    (value.coverImage === undefined || isString(value.coverImage)) &&
    interactiveDescriptionIsValid &&
    isString(value.title) &&
    isStringArray(value.thematicUnits)
  )
}

const validatePedagogical = (value: unknown) => {
  if (!isObjectRecord(value)) return false
  return (
    isString(value.welcome) &&
    isStringArray(value.generalCompetencies) &&
    isStringArray(value.specificCompetencies) &&
    isString(value.diagnostic)
  )
}

const validateMethodology = (value: unknown) => {
  if (!isObjectRecord(value)) return false
  return (
    isString(value.usage) &&
    isString(value.totalPeriod) &&
    isString(value.weeklyHours) &&
    isString(value.advisorWorkMethod) &&
    isStringArray(value.strategies) &&
    isString(value.competencies) &&
    isStringArray(value.generalObjectives) &&
    isStringArray(value.specificObjectives) &&
    isString(value.accompanimentFigures)
  )
}

const validateContent = (value: unknown) => {
  if (!isObjectRecord(value) || !Array.isArray(value.unidades)) return false

  return value.unidades.every((unit) => {
    if (!isObjectRecord(unit) || !Array.isArray(unit.temas)) return false

    return (
      isString(unit.id) &&
      isString(unit.nombreUnidad) &&
      isString(unit.objetivoUnidad) &&
      unit.temas.every((topic) => {
        if (!isObjectRecord(topic) || !Array.isArray(topic.subtemas)) return false

        return (
          isString(topic.id) &&
          isString(topic.tituloTema) &&
          isString(topic.contenidoInicio) &&
          isString(topic.contenidoDesarrollo) &&
          isString(topic.contenidoConclusion) &&
          topic.subtemas.every((subtopic) => {
            if (!isObjectRecord(subtopic)) return false

            return (
              isString(subtopic.id) &&
              isString(subtopic.tituloSubtema) &&
              isString(subtopic.contenidoInicio) &&
              isString(subtopic.contenidoDesarrollo) &&
              isString(subtopic.contenidoConclusion)
            )
          })
        )
      })
    )
  })
}

const validateLearningActivities = (value: unknown) => {
  if (!isObjectRecord(value) || !Array.isArray(value.activities)) return false

  return value.activities.every((activity) => {
    if (!isObjectRecord(activity)) return false

    return (
      isString(activity.proposito) &&
      isString(activity.modalidad) &&
      isString(activity.estrategiaDidactica) &&
      isString(activity.instrucciones) &&
      isString(activity.evidenciaEsperada) &&
      isFiniteNumber(activity.porcentaje) &&
      isBoolean(activity.espacioComunicacion) &&
      isBoolean(activity.esAutomatizada) &&
      isFiniteNumber(activity.puntajeProgramado) &&
      isFiniteNumber(activity.numeroIntentos) &&
      isString(activity.mecanismoRetroalimentacion)
    )
  })
}

const validateEvaluation = (value: unknown) => {
  if (!isObjectRecord(value)) return false
  return (
    isString(value.evaluacionFinal) &&
    isString(value.autoevaluacion) &&
    isString(value.momentosEvaluacion)
  )
}

const validateHelp = (value: unknown) => {
  if (!isObjectRecord(value)) return false

  if (!Array.isArray(value.resources) || !Array.isArray(value.references) || !Array.isArray(value.glossary)) {
    return false
  }

  return (
    value.resources.every((resource) => {
      if (!isObjectRecord(resource)) return false
      return (
        isString(resource.tituloRecurso) &&
        isString(resource.urlRecurso) &&
        isString(resource.tipoRecurso)
      )
    }) &&
    value.references.every((reference) => {
      if (!isObjectRecord(reference)) return false
      return isString(reference.referenciaAPA)
    }) &&
    value.glossary.every((glossaryItem) => {
      if (!isObjectRecord(glossaryItem)) return false
      return isString(glossaryItem.termino) && isString(glossaryItem.definicion)
    })
  )
}

const validateCredits = (value: unknown) => {
  if (!isObjectRecord(value) || !Array.isArray(value.authors)) return false

  return (
    isString(value.fechaReferencia) &&
    value.authors.every((author) => {
      if (!isObjectRecord(author)) return false
      return isString(author.nombreAutor) && isString(author.semblanzaAutor)
    })
  )
}

const validateDigitalBookPayload = (
  value: unknown,
  resourceType?: DigitalResourceType
) => {
  if (!isObjectRecord(value)) {
    throw new Error('El cuerpo de la solicitud debe ser un objeto válido')
  }

  const payload = value as DigitalBookUpsertPayload
  const entries = Object.entries(payload)

  if (entries.length === 0) {
    throw new Error('Debes enviar al menos una sección del libro digital')
  }

  const allowedKeys = new Set([
    'identification',
    'pedagogical',
    'methodology',
    'content',
    'learningActivities',
    'evaluation',
    'help',
    'credits',
  ])

  for (const key of Object.keys(payload)) {
    if (!allowedKeys.has(key)) {
      throw new Error(`La sección ${key} no es válida para el libro digital`)
    }
  }

  if (
    (payload.identification &&
      !validateIdentification(payload.identification, resourceType)) ||
    (payload.pedagogical && !validatePedagogical(payload.pedagogical)) ||
    (payload.methodology && !validateMethodology(payload.methodology)) ||
    (payload.content && !validateContent(payload.content)) ||
    (payload.learningActivities && !validateLearningActivities(payload.learningActivities)) ||
    (payload.evaluation && !validateEvaluation(payload.evaluation)) ||
    (payload.help && !validateHelp(payload.help)) ||
    (payload.credits && !validateCredits(payload.credits))
  ) {
    throw new Error('El contenido de una o más secciones del libro digital es inválido')
  }

  return true
}

router.use(authenticate)

router.param('subjectId', subjectExists)
router.param('subjectId', hasAccess)

router.get('/', readLimiter, DigitalDidacticResourceController.getAllByUser)

router.post(
  '/:subjectId/:resourceType',
  planningWriteLimiter,
  param('subjectId').isInt().withMessage('El ID de la materia debe ser un número válido'),
  param('resourceType')
    .isIn(supportedResourceTypes)
    .withMessage('El tipo de recurso digital no es compatible'),
  body().custom((value, { req }) =>
    validateDigitalBookPayload(value, req.params.resourceType)
  ),
  handleInputErrors,
  DigitalDidacticResourceController.createOrUpdate
)

router.put(
  '/:subjectId/:resourceType',
  planningWriteLimiter,
  param('subjectId').isInt().withMessage('El ID de la materia debe ser un número válido'),
  param('resourceType')
    .isIn(supportedResourceTypes)
    .withMessage('El tipo de recurso digital no es compatible'),
  body().custom((value, { req }) =>
    validateDigitalBookPayload(value, req.params.resourceType)
  ),
  handleInputErrors,
  DigitalDidacticResourceController.createOrUpdate
)

router.get(
  '/:subjectId/:resourceType',
  readLimiter,
  param('subjectId').isInt().withMessage('El ID de la materia debe ser un número válido'),
  param('resourceType')
    .isIn(supportedResourceTypes)
    .withMessage('El tipo de recurso digital no es compatible'),
  handleInputErrors,
  DigitalDidacticResourceController.get
)

router.delete(
  '/:subjectId/:resourceType',
  planningWriteLimiter,
  param('subjectId').isInt().withMessage('El ID de la materia debe ser un número válido'),
  param('resourceType')
    .isIn(supportedResourceTypes)
    .withMessage('El tipo de recurso digital no es compatible'),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
  handleInputErrors,
  DigitalDidacticResourceController.delete
)

export default router
