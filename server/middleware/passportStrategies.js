import FacebookTokenStrategy from 'passport-facebook-token'
import config from '../config/config.js'

export const facebookStrategy = () => {
  return new FacebookTokenStrategy({
    clientID: config.facebook.appId,
    clientSecret: config.facebook.secret,
    profileFields: ['id', 'first_name', 'last_name', 'link', 'gender', 'picture', 'verified', 'email', 'birthday']
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile)
  })
}
