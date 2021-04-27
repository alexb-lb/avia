import Residence from '../models/Residence.js'

class ResidencesController {

  async getByWarehouseId(warehouseId) {
    const residencesRaw = await Residence.getByWarehouseId(warehouseId)

    return residencesRaw
  }
}

export default new ResidencesController()
