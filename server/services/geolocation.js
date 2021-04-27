import config from '../config/config.js'
import GoogleMaps from '@google/maps'

const googleMapsClient = GoogleMaps.createClient({ key: config.google.key })

export const getCoordinatesByAddress = (address, coordinates) => {
  return new Promise((res, rej) => {
    if (coordinates && !!coordinates.lat && !!coordinates.lng) {
      return res(coordinates)
    }

    googleMapsClient.geocode({ address }, (err, result) => {
      if (err) return rej(err)

      const coordinates = { lat: null, lng: null }

      if (result.json.results.length) {
        coordinates.lat = result.json.results[0].geometry.location.lat
        coordinates.lng = result.json.results[0].geometry.location.lng
      }

      return res(coordinates)
    })
  })
}
