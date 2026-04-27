import { DidacticOrganizationController } from '@/controllers/DidacticOrganizationController'
import { GeneralDataController } from '@/controllers/GeneralDataController'
import { PlagiarismToolController } from '@/controllers/PlagiarismToolController'
import { PlanningController } from '@/controllers/PlanningController'
import { ReferenceController } from '@/controllers/ReferenceController'
import { ThematicUnitController } from '@/controllers/ThematicUnitController'
import { TransversalAxisController } from '@/controllers/TransversalAxisController'
import { authenticate } from '@/middleware/auth'
import { hasAccess, subjectExists } from '@/middleware/subject'
import { Router } from 'express'
import {
  readLimiter,
  writeLimiter,
  planningWriteLimiter,
  strictLimiter,
} from '@/config/limiter'

const router: Router = Router()

router.use(authenticate)

router.param('subjectId', subjectExists)
router.param('subjectId', hasAccess)

router.post('/create/:subjectId', strictLimiter, PlanningController.create)
router.get('/', readLimiter, PlanningController.getAll)
router.get('/:planningId', readLimiter, PlanningController.getById)

router.post(
  '/:planningId/general-data',
  planningWriteLimiter,
  GeneralDataController.createOrUpdate
)
router.put(
  '/:planningId/general-data',
  planningWriteLimiter,
  GeneralDataController.createOrUpdate
)
router.get(
  '/:planningId/general-data',
  readLimiter,
  GeneralDataController.get
)

router.post(
  '/:planningId/transversal-axes',
  planningWriteLimiter,
  TransversalAxisController.createOrUpdate
)
router.put(
  '/:planningId/transversal-axes',
  planningWriteLimiter,
  TransversalAxisController.createOrUpdate
)
router.get(
  '/:planningId/transversal-axes',
  readLimiter,
  TransversalAxisController.get
)

router.post(
  '/:planningId/didactic-organization',
  planningWriteLimiter,
  DidacticOrganizationController.createOrUpdate
)
router.put(
  '/:planningId/didactic-organization',
  planningWriteLimiter,
  DidacticOrganizationController.createOrUpdate
)
router.get(
  '/:planningId/didactic-organization',
  readLimiter,
  DidacticOrganizationController.get
)

router.post(
  '/:planningId/thematic-units',
  planningWriteLimiter,
  ThematicUnitController.create
)
router.get(
  '/:planningId/thematic-units',
  readLimiter,
  ThematicUnitController.getAll
)
router.get(
  '/:planningId/thematic-units/:id',
  readLimiter,
  ThematicUnitController.getById
)
router.put(
  '/:planningId/thematic-units/:id',
  planningWriteLimiter,
  ThematicUnitController.update
)
router.delete(
  '/:planningId/thematic-units/:id',
  writeLimiter,
  ThematicUnitController.delete
)
router.put(
  '/:planningId/thematic-units/reorder',
  planningWriteLimiter,
  ThematicUnitController.reorder
)
router.get(
  '/:planningId/thematic-units/:unitId/sessions',
  readLimiter,
  ThematicUnitController.getSessionsByUnit
)

router.post(
  '/:planningId/thematic-units/:unitId/sessions',
  planningWriteLimiter,
  ThematicUnitController.createSession
)
router.put(
  '/:planningId/thematic-units/:unitId/sessions/:sessionId',
  planningWriteLimiter,
  ThematicUnitController.updateSession
)
router.delete(
  '/:planningId/thematic-units/:unitId/sessions/:sessionId',
  writeLimiter,
  ThematicUnitController.deleteSession
)

router.post(
  '/:planningId/references',
  planningWriteLimiter,
  ReferenceController.create
)
router.get(
  '/:planningId/references',
  readLimiter,
  ReferenceController.getAll
)
router.put(
  '/:planningId/references/:id',
  planningWriteLimiter,
  ReferenceController.update
)
router.delete(
  '/:planningId/references/:id',
  writeLimiter,
  ReferenceController.delete
)

router.post(
  '/:planningId/plagiarism-tool',
  planningWriteLimiter,
  PlagiarismToolController.createOrUpdate
)
router.put(
  '/:planningId/plagiarism-tool',
  planningWriteLimiter,
  PlagiarismToolController.createOrUpdate
)
router.get(
  '/:planningId/plagiarism-tool',
  readLimiter,
  PlagiarismToolController.get
)

export default router
