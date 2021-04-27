import query from '../db/queryPromise.js'

class Product {

  async getByCategory({ name, limit, offset }) {
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
       FROM products AS p \
       LEFT JOIN categories AS c ON p.categoryId = c.id \
       LEFT JOIN subCategories AS sc ON p.subCategoryId = sc.id \
       WHERE c.name = ? \
       LIMIT ? OFFSET ?',
      [name, limit, offset]
    )

    return productsRaw
  }

  async getBySubCategory({ name, limit, offset }) {
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
       FROM products AS p \
       LEFT JOIN categories AS c ON p.categoryId = c.id \
       LEFT JOIN subCategories AS sc ON p.subCategoryId = sc.id \
       WHERE sc.name = ? \
       LIMIT ? OFFSET ?',
      [name, limit, offset]
    )

    return productsRaw
  }

  async getById(id) {
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
      FROM products AS p \
      LEFT JOIN categories AS c ON p.categoryId = c.id \
      LEFT JOIN subCategories AS sc ON p.subCategoryId = sc.id \
      WHERE p.id = ?',
      [id]
    )

    return productRaw.length > 0 ? productRaw[0] : null
  }

  async getByIds(ids) {
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
      FROM products AS p \
      LEFT JOIN categories AS c ON p.categoryId = c.id \
      LEFT JOIN subCategories AS sc ON p.subCategoryId = sc.id \
      WHERE p.id IN (?)',
      [ids]
    )

    return productsRaw
  }

  async search(searchStr) {
    const sqlSearch = '%' + searchStr + '%'

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
      FROM products AS p \
      LEFT JOIN categories AS c ON p.categoryId = c.id \
      LEFT JOIN subCategories AS sc ON p.subCategoryId = sc.id \
      WHERE p.nameRu LIKE ? OR p.description LIKE ?',
      [sqlSearch, sqlSearch]
    )

    return productsRaw
  }
}

export default new Product()
