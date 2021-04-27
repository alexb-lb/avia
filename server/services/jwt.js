import jwt from 'jsonwebtoken'
import config from '../config/config.js'

export const generateToken = (user) => jwt.sign({ id: user.id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
