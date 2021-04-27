import query from '../db/queryPromise.js'
import { encryptPassword, comparePassword } from '../services/password.js'

class User {

  async getById(id) {
    const userRaw = await query(
      'SELECT \
        u.id, \
        u.email, \
        u.name, \
        u.lastName, \
        u.image, \
        u.birthday, \
        u.section, \
        u.floor, \
        u.apartment, \
        r.address, \
        r.lat, \
        r.lng \
       FROM users AS u \
       LEFT JOIN residences AS r ON u.residenceId = r.id \
       WHERE u.id = ?',
      [id]
    )

    return userRaw.length > 0 ? userRaw[0] : null
  }

  async getByCredentials(email, password) {
    const userRaw = await query(
      'SELECT id, email, password AS hash, name, lastName, image, birthday FROM users WHERE email = ?',
      [email]
    )
    if(userRaw.length === 0) return null
    
    const compareResult = await comparePassword(password, userRaw[0].hash)
    if(!compareResult) return null

    return {
      id: userRaw[0].id,
      email: userRaw[0].email,
      name: userRaw[0].name,
      lastName: userRaw[0].lastName,
      image: userRaw[0].image,
      birthday: userRaw[0].birthday,
    }
  }

  async getByFacebookId(facebookId) {
    const userRaw = await query(
      'SELECT u.id, u.email, u.name, u.lastName, u.image, u.birthday \
       FROM usersFacebook AS fbu \
       LEFT JOIN users AS u ON fbu.userId = u.id \
       WHERE fbu.facebookId = ?',
      [facebookId]
    )

    return userRaw.length > 0 ? userRaw[0] : null
  }

  async getByEmail(email) {
    const userRaw = await query(
      'SELECT id, email, name, lastName, image, birthday FROM users WHERE email = ?',
      [email]
    )

    return userRaw.length > 0 ? userRaw[0] : null
  }

  // { email, password, name, phone, residenceId, section, floor, apartment }
  async create({
    email = null,
    password = null,
    name = '',
    lastName = '',
    phone,
    image = '',
    birthday = null,
    residenceId,
    section,
    floor,
    apartment,
    comment = '',
  }) {
    const passwordHash = password && password.length > 0 ? await encryptPassword(password) : null
    email = email && email.length > 0 ? email : null

    const { insertId } = await query(
      'INSERT INTO users (email, password, name, lastName, phone, residenceId, section, floor, apartment, comment, image, birthday ) \
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [email, passwordHash, name, lastName, phone, residenceId, section, floor, apartment, comment, image, birthday]
    )

    return { id: insertId }
  }

  async createFacebook({ facebookId, userId, email = '', firstName = '', lastName = '', image = '' }) {
    await query(
      'INSERT INTO usersFacebook (facebookId, userId, email, firstName, lastName, image) VALUES(?, ?, ?, ?, ?, ?);',
      [facebookId, userId, email, firstName, lastName, image]
    )

    return { facebookId }
  }

  async deleteById(id) {
    const result1 = await query('DELETE FROM users WHERE id = ?', [id])
    const result2 = await query('DELETE FROM usersFacebook WHERE userId = ?', [id])

    return { deletedCount: result1.affectedRows + result2.affectedRows }
  }
}

export default new User()
