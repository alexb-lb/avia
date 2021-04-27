import Product from '../models/Product.js'

import { OK, NOT_FOUND } from '../helpers/status.js'

const LIMIT = 10000
const OFFSET = 0

class ProductsController {

  async getByCategory(name, { limit = LIMIT, offset = OFFSET }) {
    const products = await Product.getByCategory({ name, limit, offset })

    return products
  }

  async getBySubcategory(name, { limit = LIMIT, offset = OFFSET }) {
    const products = await Product.getBySubCategory({ name, limit, offset })

    return products
  }

  async getByProductId(productId) {
    const productDetails = await Product.getById(productId)

    if (!productDetails) return { status: NOT_FOUND }

    return { status: OK, productDetails }
  }

  async getByIds(idsStr) {
    if (!idsStr.trim('')) return []

    const productsIds = idsStr.split(',')

    const products = await Product.getByIds(productsIds)

    return products
  }

  async search(searchStr) {
    if (searchStr.trim('').length < 3) return []

    const products = await Product.search(searchStr.toLowerCase())

    return products
  }
}

export default new ProductsController()
