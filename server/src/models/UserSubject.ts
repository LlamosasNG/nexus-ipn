import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import Subject from './Subject'
import User from './User'
import { normalizeAcademicPeriod } from '@/utils/academicPeriod'

@Table({
  tableName: 'user_subjects',
})
class UserSubject extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number

  @ForeignKey(() => Subject)
  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  declare subjectId: number

  @Column({
    type: DataType.STRING(20),
    set(value: string) {
      this.setDataValue('period', normalizeAcademicPeriod(value))
    },
  })
  declare period: string

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare active: boolean
}

export default UserSubject
