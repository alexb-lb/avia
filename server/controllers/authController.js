import passport from 'koa-passport'
import validator from 'validator'

import User from '../models/User.js'

import { OK, INVALID_DATA, EMAIL_ALREADY_TAKEN, NOT_FOUND, FAILED_TO_FETCH } from '../helpers/status.js'
import { generateToken } from '../services/jwt.js'

const generateBirthdayFromFacebookData = (bd) => {
  if (!bd) return null
  const bdArray = bd.split('/')

  return bdArray[2] + '-' + bdArray[0] + '-' + bdArray[1]
}

const getImageFromFacebookData = (picture) => {
  return (picture && picture.data && picture.data.url) ? picture.data.url : ''
}

// { isFacebookAuth, email, password, phone, name, residenceId, address, section, floor, apartment, comment } 
const isValid = ({ isFacebookAuth, socialProfile, email, password, name, phone, residenceId, section, floor, apartment }) => {

  const isCredentialsValid = isFacebookAuth
    ? (!!socialProfile && !!+socialProfile.facebookId)
    : (validator.isEmail(email) && password.trim().length >= 5)

  return (
    isCredentialsValid &&
    name.trim().length >= 2 &&
    phone.trim().length === 12 &&
    !!residenceId && +residenceId > 0 &&
    !!section &&
    !!floor && +floor > 0 &&
    !!apartment && +apartment > 0
  )
}

class AuthController {

  async checkEmailAvailable(email) {
    const user = await User.getByEmail(email.trim().toLowerCase())

    return { isEmailTaken: !!user }
  }

  async register(ctx) {
    //  { isFacebookAuth, email, password, phone, name, residenceId, address, section, floor, apartment, comment } 
    const payload = ctx.request.body

    // get data from facebook if fbToken exists
    if (payload.isFacebookAuth) {
      payload.socialProfile = await AuthController.authenticateFacebook(ctx)

      if (!payload.socialProfile || !payload.socialProfile.facebookId) return { status: FAILED_TO_FETCH, token: false, user: false }
    }

    // validate total data
    if (!isValid(payload)) return { status: INVALID_DATA, token: false, user: false }

    // normalize data
    const isFacebookAuth = payload.isFacebookAuth
    const email = (payload.email && payload.email.toLowerCase()) || null
    const password = (payload.password && payload.password.trim()) || null
    const comment = (payload.comment && payload.comment.trim()) || ''
    const name = payload.name.trim()
    const phone = payload.phone.trim()
    const residenceId = +payload.residenceId
    const section = +payload.section
    const floor = +payload.section
    const apartment = +payload.apartment
    const socialProfile = payload.socialProfile

    // if local register, check email availability
    if (!isFacebookAuth) {
      const isEmailTaken = await User.getByEmail(email)
      if (isEmailTaken) return { status: EMAIL_ALREADY_TAKEN, token: false, user: false }
    }

    const { id } = await User.create({ email, password, name, phone, residenceId, section, floor, apartment, comment })
    const user = await User.getById(id)

    if (isFacebookAuth) {
      await User.createFacebook({ ...socialProfile, userId: user.id })
    }

    const token = await generateToken(user)

    return { status: OK, token, user }
  }

  async login(payload) {
    const email = payload.email.toLowerCase()
    const password = payload.password.trim()

    const user = await User.getByCredentials(email, password)
    if (!user) return { status: NOT_FOUND, token: false, user: false }

    const token = await generateToken(user)

    return { status: OK, token, user }
  }

  async loginFacebook(ctx) {
    const profile = await AuthController.authenticateFacebook(ctx)
    if (!profile) return { status: FAILED_TO_FETCH, token: null, user: null }

    // authorize if user has been already authenticated
    const user = await User.getByFacebookId(profile.facebookId)
    if (!user) return { status: NOT_FOUND, token: null, user: null }

    // BEFORE THAT STEP YOU MUST DO EMAIL VERIFICATION AFTER LOCAL REGISTER TO PREVENT SCAM
    // // link facebook account to registered local acc by email
    // const localUser = await User.getByEmail(profile.email)
    // if (localUser) {
    //   await User.linkLocalAndSocialAccounts(user, localUser)
    // }

    const token = await generateToken(user)

    return { status: OK, token, user }
  }

  /**
 * Authentication via Facebook API
 * Extract token from request header 'access_token'
 *
 * React can't get user's FB token without redirect to FB page, this breaks single-page idea
 * So I grab FB access_token from frontend via facebook button component (Facebook Login API)
 * I decided to use 'passport-facebook-token' module instead of 'passport-facebook' because of needs
 * to handle token from frontend. 'passport-facebook' can't handle extracted access_token
 * Tutorial: https://medium.com/@alexanderleon/implement-social-authentication-with-react-restful-api-9b44f4714fa
 */
  static authenticateFacebook(ctx) {
    return new Promise(res => {
      passport.authenticate('facebook-token', { session: false }, async (err, profileRaw) => {
        if (err) return res(null)

        const fbProfile = profileRaw._json

        const profile = {
          network: 'facebook',
          facebookId: fbProfile.id,
          email: fbProfile.email ? fbProfile.email.toLowerCase() : '',
          firstName: fbProfile.first_name ? fbProfile.first_name : '',
          lastName: fbProfile.last_name ? fbProfile.last_name : '',
          image: getImageFromFacebookData(fbProfile.picture),
          birthday: generateBirthdayFromFacebookData(fbProfile.birthday),
        }

        return res(profile)
      })(ctx)
    })
  }
}

export default new AuthController()
