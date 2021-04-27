
import Router from 'koa-router'

import WarehousesController from '../controllers/warehousesController.js'
import ResidenceController from '../controllers/residencesController.js'
import { OK } from '../helpers/status.js'

const router = new Router({ prefix: '/warehouses' })

router.get('/', async (ctx) => {
  const warehouses = await WarehousesController.getAll()

  ctx.body = { status: OK, warehouses }
})

router.get('/:warehouseId/residences', async (ctx) => {
  const residences = await ResidenceController.getByWarehouseId(ctx.params.warehouseId)

  ctx.body = { status: OK, residences }
})

export default router
