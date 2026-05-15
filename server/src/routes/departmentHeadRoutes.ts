import { readLimiter } from '@/config/limiter'
import { DepartmentHeadDashboardController } from '@/controllers/DepartmentHeadDashboardController'
import { DepartmentHeadPlanningController } from '@/controllers/DepartmentHeadPlanningController'
import { authenticate } from '@/middleware/auth'
import { authorizeRoles } from '@/middleware/role'
import { handleInputErrors } from '@/middleware/validation'
import { query, param } from 'express-validator'
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
  query('page').optional().isInt({ min: 1 }),
  query('pageSize').optional().isInt({ min: 1, max: 50 }),
  query('teacherId').optional().isInt({ min: 1 }),
  query('subjectId').optional().isInt({ min: 1 }),
  query('academyId').optional().isInt({ min: 1 }),
  query('period').optional().isString(),
  query('search').optional().isString(),
  query('status')
    .optional()
    .isIn(['Pendiente', 'En revisión', 'Validada', 'Rechazada']),
  query('sortBy')
    .optional()
    .isIn(['updatedAt', 'createdAt', 'teacherName', 'subjectName', 'period', 'status']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
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

export default router
