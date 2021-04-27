import Router from 'koa-router'

import { OK } from '../helpers/status.js'
import auth from '../middleware/validatorAuth.js'
import FavoritesController from '../controllers/favoritesController.js'

const router = new Router({ prefix: '/user/favorites' })

router.get('/products', auth, async (ctx) => {
  const { products } = await FavoritesController.getProductsByUser(ctx.params.user.id)

  ctx.body = { status: OK, products }
})

router.post('/products', auth, async (ctx) => {
  const { status } = await FavoritesController.toggleProduct(ctx.params.user.id, ctx.request.body.product.id)

  ctx.body = { status }
})

router.get('/subcategories', auth, async (ctx) => {
  const { categories } = await FavoritesController.getSubCategoriesByUser(ctx.params.user.id)

  ctx.body = { status: OK, categories }
})

export default router
