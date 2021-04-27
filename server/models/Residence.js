import query from '../db/queryPromise.js'

class Warehouse {

  async getByWarehouseId(warehouseId) {
    const residencesRaw = await query(
      'SELECT id, warehouseId, address, lat, lng, sections, floors, apartments \
       FROM residences WHERE warehouseId = ?',
      [warehouseId]
    )

    return residencesRaw
  }
}

export default new Warehouse()
