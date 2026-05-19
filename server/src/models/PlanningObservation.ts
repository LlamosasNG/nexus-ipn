import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import User from './User'

@Table({
  tableName: 'planning_observations',
  timestamps: true,
})
export default class PlanningObservation extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare planningId: number

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number

  @BelongsTo(() => User)
  declare user: User

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare section: number

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  declare message: string
}
