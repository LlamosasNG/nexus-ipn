import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import ThematicUnit from './ThematicUnit'

@Table({
  tableName: 'session_activities',
  timestamps: true,
})
export default class SessionActivity extends Model {
  @AllowNull(false)
  @ForeignKey(() => ThematicUnit)
  @Column({
    type: DataType.INTEGER,
  })
  declare thematicUnitId: number

  @BelongsTo(() => ThematicUnit)
  declare thematicUnit: ThematicUnit

  // 3.12 Número de sesión ("1" o "3-4")
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare sessionNumber: string

  // 3.13 Temas
  @Column({
    type: DataType.JSONB,
  })
  declare topics: string[]

  // 3.14 Actividades
  @Column({
    type: DataType.TEXT,
  })
  declare activityStart: string

  @Column({
    type: DataType.TEXT,
  })
  declare activityDevelopment: string

  @Column({
    type: DataType.TEXT,
  })
  declare activityClosure: string

  // 3.15 Recursos
  @Column({
    type: DataType.JSONB,
  })
  declare resources: string[]

  // 3.16 Evidencia
  @Column({
    type: DataType.STRING,
  })
  declare evidence: string

  // 3.17 Porcentaje de evaluación
  @Column({
    type: DataType.FLOAT,
  })
  declare evaluationPercentage: number

  // 3.18 Instrumento de evaluación
  @Column({
    type: DataType.STRING,
  })
  declare evaluationInstrument: string

  // Order for sorting sessions
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare order: number
}
