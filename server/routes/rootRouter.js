import Router from 'koa-router'

import authRouter from './authRouter.js'
import userRouter from './userRouter.js'
import productsRouter from './productsRouter.js'
import ordersRouter from './ordersRouter.js'
import favoritesRouter from './favoritesRouter.js'
import warehousesRouter from './warehousesRouter.js'
import carrierRouter from './carrierRouter.js'

const router = new Router({ prefix: '/api' })

router.use(
  authRouter.routes(),
  userRouter.routes(),
  productsRouter.routes(),
  ordersRouter.routes(),
  favoritesRouter.routes(),
  warehousesRouter.routes(),
  carrierRouter.routes(),
)

export default router
