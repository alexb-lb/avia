import Router from 'koa-router'
import passport from 'koa-passport'

import { OK, INVALID_DATA, EMAIL_ALREADY_TAKEN, NOT_FOUND } from '../helpers/status.js'
import AuthController from '../controllers/authController.js'
import { facebookStrategy } from '../middleware/passportStrategies.js'

const router = new Router({ prefix: '/auth' })

passport.use('facebook-token', facebookStrategy())

router.post('/register', async (ctx) => {
  const { status, token, user } = await AuthController.register(ctx)

  if (status === INVALID_DATA) {
    return ctx.body = { status: INVALID_DATA }
  }

  if (status === EMAIL_ALREADY_TAKEN) {
    return ctx.body = { status: EMAIL_ALREADY_TAKEN }
  }

  ctx.body = { status: OK, token, user }
})

router.post('/login', async (ctx) => {
  const { status, token, user } = await AuthController.login(ctx.request.body)

  if (status === NOT_FOUND) {
    return ctx.body = { status: NOT_FOUND }
  }

  ctx.body = { status: OK, token, user }
})

router.get('/facebook', async (ctx) => {
  const { status, token, user } = await AuthController.loginFacebook(ctx)

  if (status !== OK) {
    return ctx.body = { status, token, user }
  }

  ctx.body = { status: OK, token, user }
})

router.get('/email/:email', async (ctx) => {
  const { isEmailTaken } = await AuthController.checkEmailAvailable(ctx.params.email)

  if (isEmailTaken) {
    return ctx.body = { status: EMAIL_ALREADY_TAKEN, isAvailable: false }
  }

  ctx.body = { status: OK, isAvailable: true }
})

export default router
