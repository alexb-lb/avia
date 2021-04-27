import query from '../db/queryPromise.js'
import { encryptPassword } from '../services/password.js'

class Carrier {
  async getByCredentials(email, password) {
    const passwordHash = await encryptPassword(password)

    const userRaw = await query(
      'SELECT id, email, firstName, lastName, image, phone, type FROM carriers WHERE email = ? AND password = ?',
      [email, passwordHash]
    )

    return userRaw.length > 0 ? userRaw[0] : null
  }
}

export default new Carrier()
