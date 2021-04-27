import Router from 'koa-router'

import { OK, INVALID_DATA, NOT_FOUND } from '../helpers/status.js'
import auth from '../middleware/validatorAuth.js'
import OrdersController from '../controllers/orderController.js'

const router = new Router({ prefix: '/user/orders' })

router.get('/', auth, async (ctx) => {
  const orders = await OrdersController.getByUserId(ctx.params.user.id)

  ctx.body = { status: OK, orders }
})

router.post('/', auth, async (ctx) => {
  const { status, orderId } = await OrdersController.createOrder(ctx.params.user, ctx.request.body)

  if (status === INVALID_DATA) {
    return ctx.body = { status: INVALID_DATA, orderId: null }
  }

  ctx.body = { status: OK, orderId }
})

router.get('/active', auth, async (ctx) => {
  const { status, orderDetails } = await OrdersController.getLastActiveByUser(ctx.params.user.id)

  if (status === NOT_FOUND) {
    return ctx.body = { status: NOT_FOUND, orderDetails: null }
  }

  ctx.body = { status: OK, orderDetails }
})

router.get('/:orderId', auth, async (ctx) => {
  const { status, orderDetails } = await OrdersController.getByOrderId(ctx.params.user.id, ctx.params.orderId)

  if (status === NOT_FOUND) {
    return ctx.body = { status: NOT_FOUND, orderDetails: null }
  }

  ctx.body = { status: OK, orderDetails }
})

export default router
