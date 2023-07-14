import { Schema, model } from 'mongoose'
import { IUser, UserModel } from './user.interface'
import config from '../../../config/config'
import bcrypt from 'bcrypt'
// Creating a user schema
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

userSchema.statics.isUserExist = async function (
  email: string
): Promise<Pick<IUser, 'email' | 'password'> | null> {
  return await User.findOne({ email }, { email: 1, password: 1 })
}

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

// pre hook for hashing bcrypt passwords

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    )
  }
  next()
})

// const User = model<IUser>('User', userSchema)
// export default User

export const User = model<IUser, UserModel>('User', userSchema)
