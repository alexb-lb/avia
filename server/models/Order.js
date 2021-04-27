import query from '../db/queryPromise.js'

class Order {

  async create({
    userId, address, lat = null, lng = null, section = null, floor = null, apartment = null, comment = '', deliveryTime
  }) {

    const { insertId } = await query(
      'INSERT INTO orders (userId, address, lat, lng, section, floor, apartment, comment, deliveryTime) \
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [userId, address, lat, lng, section, floor, apartment, comment, deliveryTime]
    )

    return { id: insertId }
  }

  async insertProducts(orderId, products) {
    const bulk = products.map(p => [orderId, p.id, p.price, p.quantity])

    await query('INSERT INTO ordersProducts (orderId, productId, price, quantity) VALUES ?;', [bulk])

    return { success: true }
  }

  async getByIdAndUserId(id, userId) {
    const productRaw = await query(
      'SELECT \
        o.id, \
        o.address, \
        o.lat, \
        o.lng, \
        o.section, \
        o.floor, \
        o.apartment, \
        o.comment, \
        o.deliveryTime, \
        o.createdAt, \
        os.name AS status, \
        c.firstName AS carrierName, \
        c.phone AS carrierPhone, \
        c.type AS carrierType \
      FROM orders AS o \
      LEFT JOIN ordersStatuses AS os ON o.statusId = os.id \
      LEFT JOIN carriers AS c ON o.carrierId = c.id \
      WHERE o.id = ? AND o.userId = ?',
      [id, userId]
    )

    return productRaw.length > 0 ? productRaw[0] : null
  }

  async getLastActiveByUserId(userId) {
    const productRaw = await query(
      'SELECT \
        o.id, \
        o.address, \
        o.lat, \
        o.lng, \
        o.section, \
        o.floor, \
        o.apartment, \
        o.comment, \
        o.deliveryTime, \
        o.createdAt, \
        os.name AS status, \
        c.firstName AS carrierName, \
        c.phone AS carrierPhone, \
        c.type AS carrierType \
      FROM orders AS o \
      LEFT JOIN ordersStatuses AS os ON o.statusId = os.id \
      LEFT JOIN carriers AS c ON o.carrierId = c.id \
      WHERE o.userId = ? AND os.name != "completed" \
      ORDER BY createdAt DESC \
      LIMIT 1',
      [userId]
    )

    return productRaw.length > 0 ? productRaw[0] : null
  }

  async getProducts(orderId) {
    const productsRaw = await query(
      'SELECT \
         op.id, \
         op.productId, \
         op.price, \
         op.quantity, \
         p.nameRu, \
         p.image, \
         p.description, \
         p.currencyRu, \
         c.name AS categoryName, \
         sc.name AS subCategoryName \
       FROM ordersProducts AS op \
       LEFT JOIN products AS p ON op.productId = p.id \
       LEFT JOIN categories AS c ON p.categoryId = c.id \
       LEFT JOIN subCategories AS sc ON p.subCategoryId = sc.id \
       WHERE op.orderId = ?',
      [orderId]
    )

    return productsRaw
  }

  async getByUserId(userId) {
    const ordersRaw = await query(
      'SELECT \
        o.id, \
        o.address, \
        o.lat, \
        o.lng, \
        o.section, \
        o.floor, \
        o.apartment, \
        o.comment, \
        o.deliveryTime, \
        o.createdAt, \
        os.name AS status, \
        c.firstName AS carrierName, \
        c.phone AS carrierPhone, \
        c.type AS carrierType, \
        op.priceTotal, \
        op.quantityTotal \
      FROM orders AS o \
      LEFT JOIN ordersStatuses AS os ON o.statusId = os.id \
      LEFT JOIN carriers AS c ON o.carrierId = c.id \
      LEFT JOIN (\
        SELECT SUM(price * quantity) AS priceTotal, SUM(quantity) AS quantityTotal, orderId \
        FROM ordersProducts AS _op \
        LEFT JOIN orders AS _o ON _op.orderId = _o.id \
        WHERE _o.userId = ? \
        GROUP BY _op.orderId \
      ) AS op ON o.id = op.orderId\
      WHERE o.userId = ? \
      ORDER BY o.createdAt DESC',
      [userId, userId]
    )

    return ordersRaw
  }

  async getByCarrierId(carrierId) {
    const ordersRaw = await query(
      'SELECT \
        o.id, \
        o.address, \
        o.lat, \
        o.lng, \
        o.section, \
        o.floor, \
        o.apartment, \
        o.comment, \
        o.deliveryTime, \
        o.createdAt, \
        os.name AS status, \
        u.name AS clientName, \
        u.phone AS clientPhone, \
        u.image AS clientImage \
      FROM orders AS o \
      LEFT JOIN ordersStatuses AS os ON o.statusId = os.id \
      LEFT JOIN users AS u ON o.userId = u.id \
      WHERE o.carrierId = ? \
      ORDER BY o.createdAt DESC',
      [carrierId]
    )

    return ordersRaw
  }

  async getByIdAndCarrierId(id, carrierId) {
    const productRaw = await query(
      'SELECT \
        o.id, \
        o.address, \
        o.lat, \
        o.lng, \
        o.section, \
        o.floor, \
        o.apartment, \
        o.comment, \
        o.deliveryTime, \
        o.createdAt, \
        os.name AS status, \
        u.name AS clientName, \
        u.phone AS clientPhone, \
        op.priceTotal, \
        op.quantityTotal \
      FROM orders AS o \
      LEFT JOIN ordersStatuses AS os ON o.statusId = os.id \
      LEFT JOIN users AS u ON o.userId = u.id \
      LEFT JOIN (\
        SELECT SUM(price * quantity) AS priceTotal, SUM(quantity) AS quantityTotal, orderId \
        FROM ordersProducts \
        WHERE orderId = ? \
      ) AS op ON o.id = op.orderId\
      WHERE o.id = ? AND o.carrierId = ?',
      [id, id, carrierId]
    )

    return productRaw.length > 0 ? productRaw[0] : null
  }

  async getStatusesAllowedForCarrier() {
    const statusesRaw = await query('SELECT id, name FROM ordersStatuses WHERE canBeChangedByCarrier = 1')

    return statusesRaw
  }

  async setStatusById(orderId, statusId) {
    const { affectedRows = null } = await query('UPDATE orders SET statusId = ? WHERE id = ?', [statusId, orderId])

    return affectedRows
  }
}

export default new Order()
