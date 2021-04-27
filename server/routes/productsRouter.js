
import Router from 'koa-router'
const router = new Router()

import CategoriesController from '../controllers/categoriesController.js'
import ProductsController from '../controllers/productsController.js'
import { OK, NOT_FOUND } from '../helpers/status.js'

router.get('/categories', async (ctx) => {
  const categories = await CategoriesController.getAll()

  ctx.body = { status: OK, categories }
})

router.get('/categories/:categoryName', async (ctx) => {
  let category = await CategoriesController.getCategoryInfo(ctx.params.categoryName)

  if (!category) {
    category = await CategoriesController.getSubCategoryInfo(ctx.params.categoryName)
  }

  if (!category) {
    return ctx.body = { status: NOT_FOUND, category: null }
  }

  ctx.body = { status: OK, category }
})

router.get('/products/categories/:category', async (ctx) => {
  const products = await ProductsController.getByCategory(ctx.params.category, ctx.request.query)

  ctx.body = { status: OK, products }
})

router.get('/products/categories/:category/:subCategory', async (ctx) => {
  const products = await ProductsController.getBySubcategory(ctx.params.subCategory, ctx.request.query)

  ctx.body = { status: OK, products }
})

router.get('/products/search/:searchString', async (ctx) => {
  const products = await ProductsController.search(ctx.params.searchString)

  ctx.body = { status: OK, products }
})

router.get('/products/:productId', async (ctx) => {
  const { status, productDetails } = await ProductsController.getByProductId(ctx.params.productId)

  if (status === NOT_FOUND) {
    return ctx.body = { status: NOT_FOUND, productDetails: null }
  }

  ctx.body = { status: OK, productDetails }
})

// ?ids=123,345,234
router.get('/products', async (ctx) => {
  const products = await ProductsController.getByIds(ctx.request.query.ids)

  ctx.body = { status: OK, products }
})

export default router
