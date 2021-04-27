import Favorites from '../models/Favorites.js'

import { OK } from '../helpers/status.js'

class ProductsController {

  async getProductsByUser(userId) {
    const products = await Favorites.getProductsByUser(userId)

    return { products }
  }

  async toggleProduct(userId, productId) {
    const isProductInFavorite = await Favorites.getProductByUserAndProduct(userId, productId)

    if (isProductInFavorite) {
      await Favorites.removeProduct(userId, productId)
    } else {
      await Favorites.addProduct(userId, productId)
    }

    return { status: OK }
  }

  async getSubCategoriesByUser(userId) {
    const categories = await Favorites.getSubCategoriesByUser(userId)

    return { categories }
  }
}

export default new ProductsController()
