import query from '../db/queryPromise.js'

class Category {

  async getByName(name) {
    const categoryRaw = await query('SELECT * FROM categories WHERE name = ?', [name])

    return categoryRaw.length > 0 ? categoryRaw[0] : null
  }

  async getAll() {
    const categoriesRaw = await query('SELECT id, name, nameRu FROM categories')

    return categoriesRaw
  }
}

export default new Category()
