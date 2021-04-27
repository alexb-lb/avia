import Warehouse from '../models/Warehouse.js'

class WarehousesController {

  async getAll() {
    const warehousesRaw = await Warehouse.getAll()

    return warehousesRaw
  }
}

export default new WarehousesController()
