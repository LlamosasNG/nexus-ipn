import { readLimiter, writeLimiter } from '@/config/limiter'
import { SubjectController } from '@/controllers/SubjectController'
import { authenticate } from '@/middleware/auth'
import { subjectExists } from '@/middleware/subject'
import { handleInputErrors } from '@/middleware/validation'
import { Router } from 'express'
import { body, param } from 'express-validator'

const router: Router = Router()

router.use(authenticate)

router.post(
  '/assign-subjects',
  writeLimiter,
  body('subjectIds')
    .isArray({ min: 1, max: 5 })
    .withMessage('Debes seleccionar entre 1 y 5 materias'),
  body('subjectIds.*')
    .isInt()
    .withMessage('Los IDs de las materias deben ser números válidos'),
  body('period')
    .optional({ checkFalsy: true })
    .matches(/^\d{4}-[12]$/)
    .withMessage('El período debe tener formato año-semestre, por ejemplo 2026-2'),
  handleInputErrors,
  SubjectController.assign
)

router.get('/my-subjects', readLimiter, SubjectController.getByUser)

router.param('subjectId', subjectExists)
router.get('/:subjectId', readLimiter, SubjectController.subject)

router.get(
  '/:academyId',
  readLimiter,
  param('academyId')
    .isInt()
    .withMessage('El ID de la academia debe ser un número válido'),
  handleInputErrors,
  SubjectController.getByAcademy
)

router.delete(
  '/:subjectId',
  writeLimiter,
  param('subjectId')
    .isInt()
    .withMessage('El ID de la materia debe ser un número válido'),
  handleInputErrors,
  SubjectController.remove
)

export default router
