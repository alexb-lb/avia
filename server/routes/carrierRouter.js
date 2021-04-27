import Router from 'koa-router'

import auth from '../middleware/validatorAuth.js'
import { OK, NOT_FOUND, INVALID_DATA } from '../helpers/status.js'

import CarrierController from '../controllers/carrierController.js'

const router = new Router({ prefix: '/carrier' })

router.post('/auth/login', async (ctx) => {
  const { status, token, user } = await CarrierController.login(ctx.request.body)

  if (status === NOT_FOUND) {
    return ctx.body = { status: NOT_FOUND }
  }

  ctx.body = { status: OK, token, user }
})

router.get('/orders', auth, async (ctx) => {
  const orders = await CarrierController.getOrdersByCarrierId(ctx.params.user.id)

  ctx.body = { status: OK, orders }
})

router.get('/orders/:orderId', auth, async (ctx) => {
  const { status, orderDetails } = await CarrierController.getOrderById(ctx.params.orderId, ctx.params.user.id)

  if (status === NOT_FOUND) {
    return ctx.body = { status: NOT_FOUND, orderDetails: null }
  }

  ctx.body = { status: OK, orderDetails }
})

router.post('/orders/:orderId/status', auth, async (ctx) => {
  const { status, orderStatus } =
    await CarrierController.setOrderStatus(ctx.params.orderId, ctx.params.user.id, ctx.request.body.status)

  ctx.body = { status, orderStatus }
})


export default router



