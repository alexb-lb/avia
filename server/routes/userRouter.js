import Router from 'koa-router'

import { OK, NOT_FOUND } from '../helpers/status.js'
import auth from '../middleware/validatorAuth.js'
import UserController from '../controllers/userController.js'

const router = new Router({ prefix: '/user' })

router.get('/', auth, async (ctx) => {
  const { user } = await UserController.getById(ctx.params.user.id)

  if (!user) return ctx.body = { status: NOT_FOUND, user: null }

  ctx.body = { status: OK, user }
})

router.get('/delete', auth, async (ctx) => {
  await UserController.deleteById(ctx.params.user.id)

  ctx.body = { status: OK }
})


export default router
