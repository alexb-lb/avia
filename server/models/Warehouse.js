import query from '../db/queryPromise.js'

class Warehouse {

  async getAll() {
    const warehousesRaw = await query('SELECT id, name, address, lat, lng FROM warehouses WHERE isActive = 1')

    return warehousesRaw
  }
}

export default new Warehouse()
