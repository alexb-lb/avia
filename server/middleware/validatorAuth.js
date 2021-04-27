
import jwt from 'jsonwebtoken'
import config from '../config/config.js'

import { NOT_AUTHORIZED } from '../helpers/status.js'

export default async (ctx, next) => {
  try {
    const token = ctx.headers.authorization.replace('Bearer ', '')
    const { id } = jwt.verify(token, config.jwt.secret)

    ctx.params.user = { id }
    return next()
  } catch (error) {
    return ctx.body = { status: NOT_AUTHORIZED }
  }
}
