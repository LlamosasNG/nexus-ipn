import colors from 'colors'
import cors from 'cors'
import express, { Express } from 'express'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { db } from './config/db'
import academyRoutes from './routes/academyRoutes'
import authRoutes from './routes/authRoutes'
import departmentHeadRoutes from './routes/departmentHeadRoutes'
import digitalResourceRoutes from './routes/digitalResourceRoutes'
import planningRoutes from './routes/planningRoutes'
import subjectRoutes from './routes/subjectRoutes'

async function connectDB() {
  try {
    await db.authenticate()
    await db.sync()
    console.log(colors.blue.bold('Successfully connected to the database'))
  } catch (error) {
    console.log(colors.red.bold('Connection to the database failed'))
  }
}
connectDB()
const app: Express = express()

//app.use(generalLimiter)
app.use(cors(corsConfig))
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/department-head', departmentHeadRoutes)
app.use('/api/academies', academyRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/plannings', planningRoutes)
app.use('/api/digital-resources', digitalResourceRoutes)

export default app
