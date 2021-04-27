import Order from '../models/Order.js'
import { OK, NOT_FOUND } from '../helpers/status.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

class OrdersController {

  async createOrder(user, orderData) {
    const { products: orderProducts, comment, deliveryTime } = orderData

    const { id: userId, address, lat, lng, section, floor, apartment } = await User.getById(user.id)
    const { id: orderId } = await Order.create({ userId, address, lat, lng, section, floor, apartment, comment, deliveryTime })

    const validProducts = await Product.getByIds(orderProducts.map(p => p.id))
    const productsWithQuantity = validProducts.map(p => {
      const { quantity } = orderProducts.find(op => op.id === p.id)

      return { ...p, quantity }
    })

    await Order.insertProducts(orderId, productsWithQuantity)

    return { status: OK, orderId }
  }

  async getByOrderId(userId, orderId) {
    const order = await Order.getByIdAndUserId(orderId, userId)
    if (!order) return { status: NOT_FOUND }

    const productsList = await Order.getProducts(orderId, userId)

    return { status: OK, orderDetails: { ...order, productsList } }
  }

  async getLastActiveByUser(userId) {
    const order = await Order.getLastActiveByUserId(userId)
    if (!order) return { status: NOT_FOUND }

    const productsList = await Order.getProducts(order.id, userId)

    return { status: OK, orderDetails: { ...order, productsList } }
  }

  async getByUserId(userId) {
    const orders = await Order.getByUserId(userId)

    return orders
  }
}

export default new OrdersController()
