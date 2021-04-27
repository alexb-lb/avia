import Carrier from '../models/Carrier.js'
import Order from '../models/Order.js'

import { OK, NOT_FOUND, INVALID_DATA } from '../helpers/status.js'
import { generateToken } from '../services/jwt.js'

class CarrierController {

  async login(payload) {
    const email = payload.email.toLowerCase()
    const password = payload.password.trim()

    const user = await Carrier.getByCredentials(email, password)
    if (!user) return { status: NOT_FOUND, token: false, user: false }

    const token = await generateToken(user)

    return { status: OK, token, user }
  }

  async getOrdersByCarrierId(carrierId) {
    const orders = await Order.getByCarrierId(carrierId)

    return orders
  }

  async getOrderById(orderId, carrierId) {
    const order = await Order.getByIdAndCarrierId(orderId, carrierId)
    if (!order) return { status: NOT_FOUND, orderDetails: null }

    const productsList = await Order.getProducts(orderId, order.userId)

    return { status: OK, orderDetails: { ...order, productsList } }
  }

  async setOrderStatus(orderId, carrierId, orderStatus) {
    const order = await Order.getByIdAndCarrierId(orderId, carrierId)
    if (!order) return { status: NOT_FOUND, orderStatus }

    const carrierStatuses = await Order.getStatusesAllowedForCarrier(orderId, order.userId)
    const fullStatus = carrierStatuses.find(s => s.name === orderStatus.toLowerCase())

    if (!fullStatus) return { status: INVALID_DATA, orderStatus }

    await Order.setStatusById(orderId, fullStatus.id)

    return { status: OK, orderStatus }
  }
}

export default new CarrierController()
