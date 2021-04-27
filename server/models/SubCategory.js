import query from '../db/queryPromise.js'

class SubCategory {

  async getByName(name) {
    const subCategoryRaw = await query(
      'SELECT sc.*, c.name AS categoryName, c.nameRu AS categoryNameRu \
      FROM subCategories AS sc \
      LEFT JOIN categories AS c ON sc.categoryId = c.id \
      WHERE sc.name = ?',
      [name]
    )

    return subCategoryRaw.length > 0 ? subCategoryRaw[0] : null
  }

  async getAll() {
    const subCategoriesRaw = await query('SELECT id, name, nameRu, categoryId, image FROM subCategories')

    return subCategoriesRaw
  }
}

export default new SubCategory()
