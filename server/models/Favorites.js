import query from '../db/queryPromise.js'

class Favorites {
  async getProductsByUser(userId) {
    const productsRaw = await query(
      'SELECT \
         p.id, \
         p.nameRu, \
         p.image, \
         p.description, \
         p.price, \
         p.currencyRu, \
         c.name AS categoryName, \
         sc.name AS subCategoryName \
       FROM productsFavorites AS pf \
       LEFT JOIN products AS p ON p.id = pf.productId\
       LEFT JOIN categories AS c ON p.categoryId = c.id \
       LEFT JOIN subCategories AS sc ON p.subCategoryId = sc.id \
       WHERE pf.userId = ?',
      [userId]
    )

    return productsRaw
  }

  async getProductByUserAndProduct(userId, productId) {
    const productRaw = await query(
      'SELECT \
         p.id, \
         p.nameRu, \
         p.image, \
         p.description, \
         p.price, \
         p.currencyRu, \
         c.name AS categoryName, \
         sc.name AS subCategoryName \
       FROM productsFavorites AS pf \
       LEFT JOIN products AS p ON p.id = pf.productId\
       LEFT JOIN categories AS c ON p.categoryId = c.id \
       LEFT JOIN subCategories AS sc ON p.subCategoryId = sc.id \
       WHERE pf.userId = ? AND pf.productId = ?',
      [userId, productId]
    )

    return productRaw.length > 0 ? productRaw[0] : null
  }

  async addProduct(userId, productId) {
    const result = await query(
      'INSERT INTO productsFavorites (userId, productId) VALUES(?, ?) ON DUPLICATE KEY UPDATE userId = ?, productId = ?',
      [userId, productId, userId, productId]
    )
    return result.length > 0 ? result[0] : null
  }

  async removeProduct(userId, productId) {
    const productRaw = await query(
      'DELETE FROM productsFavorites WHERE userId = ? AND productId = ?',
      [userId, productId]
    )

    return productRaw.length > 0 ? productRaw[0] : null
  }

  async getSubCategoriesByUser(userId) {
    const categoriesRaw = await query(
      'SELECT \
         sc.id, \
         sc.name, \
         sc.nameRu,  \
         sc.image  \
       FROM productsFavorites AS pf \
       LEFT JOIN products AS p ON p.id = pf.productId\
       LEFT JOIN categories AS c ON p.categoryId = c.id \
       LEFT JOIN subCategories AS sc ON p.subCategoryId = sc.id \
       WHERE pf.userId = ? \
       GROUP BY sc.id',
      [userId]
    )

    return categoriesRaw
  }

}

export default new Favorites()

