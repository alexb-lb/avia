import Category from '../models/Category.js'
import SubCategory from '../models/SubCategory.js'

class ProductCategoriesController {

  async getAll() {
    const categoriesRaw = await Category.getAll()
    const subCategoriesRaw = await SubCategory.getAll()

    const categories = categoriesRaw.map(c => {
      const subCategories = subCategoriesRaw.filter(sc => sc.categoryId === c.id)
      const withoutRedundantParams = subCategories.map(({ categoryId, ...params }) => params)

      return { ...c, subCategories: withoutRedundantParams }
    })

    return categories
  }

  async getCategoryInfo(categoryName) {
    const category = await Category.getByName(categoryName)

    return category || null
  }

  async getSubCategoryInfo(categoryName) {
    const category = await SubCategory.getByName(categoryName)

    return category || null
  }
}

export default new ProductCategoriesController()
