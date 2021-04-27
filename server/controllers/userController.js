import User from '../models/User.js'

class UserController {

  async getById(userId) {
    const user = await User.getById(userId)

    return { user }
  }

  async deleteById(userId) {
    const { deletedCount } = await User.deleteById(userId)

    return deletedCount
  }
}

export default new UserController()
