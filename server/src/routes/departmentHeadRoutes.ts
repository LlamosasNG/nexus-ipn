import { planningWriteLimiter, readLimiter } from '@/config/limiter'
import { DepartmentHeadDashboardController } from '@/controllers/DepartmentHeadDashboardController'
import { DepartmentHeadPlanningController } from '@/controllers/DepartmentHeadPlanningController'
import { authenticate } from '@/middleware/auth'
import { authorizeRoles } from '@/middleware/role'
import { handleInputErrors } from '@/middleware/validation'
import { body, query, param } from 'express-validator'
import { Router } from 'express'

const router: Router = Router()

router.use(authenticate)
router.use(authorizeRoles('Jefe de Departamento'))

router.get(
  '/dashboard',
  readLimiter,
  DepartmentHeadDashboardController.getMetrics
)

router.get(
  '/plannings',
  readLimiter,
  query('page').optional({ checkFalsy: true }).isInt({ min: 1 }),
  query('pageSize').optional({ checkFalsy: true }).isInt({ min: 1, max: 50 }),
  query('teacherId').optional({ checkFalsy: true }).isInt({ min: 1 }),
  query('subjectId').optional({ checkFalsy: true }).isInt({ min: 1 }),
  query('academyId').optional({ checkFalsy: true }).isInt({ min: 1 }),
  query('period').optional({ checkFalsy: true }).isString(),
  query('search').optional({ checkFalsy: true }).isString(),
  query('status')
    .optional({ checkFalsy: true })
    .isIn(['Pendiente', 'En revisión', 'Validada', 'Rechazada']),
  query('sortBy')
    .optional({ checkFalsy: true })
    .isIn(['updatedAt', 'createdAt', 'teacherName', 'subjectName', 'period', 'status']),
  query('sortOrder').optional({ checkFalsy: true }).isIn(['asc', 'desc']),
  handleInputErrors,
  DepartmentHeadPlanningController.getAll
)

router.get(
  '/plannings/:planningId',
  readLimiter,
  param('planningId')
    .isInt()
    .withMessage('El ID de la planeación debe ser un número válido'),
  handleInputErrors,
  DepartmentHeadPlanningController.getById
)

router.post(
  '/plannings/:planningId/observations',
  planningWriteLimiter,
  param('planningId')
    .isInt()
    .withMessage('El ID de la planeación debe ser un número válido'),
  body('section')
    .isInt({ min: 1, max: 5 })
    .withMessage('La sección debe estar entre 1 y 5'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('La observación es obligatoria')
    .isLength({ max: 2000 })
    .withMessage('La observación no puede exceder 2000 caracteres'),
  handleInputErrors,
  DepartmentHeadPlanningController.addObservation
)

router.patch(
  '/plannings/:planningId/review',
  planningWriteLimiter,
  param('planningId')
    .isInt()
    .withMessage('El ID de la planeación debe ser un número válido'),
  body('action')
    .isIn(['approve', 'reject'])
    .withMessage('La acción debe ser approve o reject'),
  body('feedback')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La retroalimentación no puede exceder 2000 caracteres'),
  handleInputErrors,
  DepartmentHeadPlanningController.review
)

export default router
