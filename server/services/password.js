import bcrypt from 'bcrypt'

const rounds = 10

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(rounds)
  const hash = await bcrypt.hash(password, salt)

  return hash
}

const comparePassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash)

  return result
}

export { encryptPassword, comparePassword }
