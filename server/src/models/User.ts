import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript'
import Academy from './Academy'
import Planning from './Planning'
import Subject from './Subject'
import UserSubject from './UserSubject'

@Table({
  tableName: 'users',
})
class User extends Model {
  @ForeignKey(() => Academy)
  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  declare academyId: number

  @BelongsTo(() => Academy)
  declare academy: Academy

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
  })
  declare name: string

  @AllowNull(false)
  @Column({
    type: DataType.STRING(60),
  })
  declare password: string

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    validate: {
      isEmail: true,
    },
  })
  declare email: string

  @AllowNull(false)
  @Default('Docente')
  @Column({
    type: DataType.ENUM('Docente', 'Jefe de Departamento', 'Academia', 'Administrador'),
  })
  declare role: 'Docente' | 'Jefe de Departamento' | 'Academia' | 'Administrador'

  @Column({
    type: DataType.STRING(6),
  })
  declare token: string

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare confirmed: boolean

  @BelongsToMany(() => Subject, () => UserSubject)
  declare subjects: Subject[]

  @HasMany(() => Planning)
  declare plannings: Planning[]
}

export default User
