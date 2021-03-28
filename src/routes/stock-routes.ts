import express from "express";
import { body } from "express-validator";
import { indexAlmacen } from "../controllers/almacen";
import { verAlmacen } from "../controllers/almacen/ver-almacen";
import { indexStock } from "../controllers/stock";
import { crearStock } from "../controllers/stock/crear-stock";
import { verStock } from "../controllers/stock/ver-stock";
import { requireAuth } from "../middlewares/autorizacion-requerida";
import { validarSolicitud } from "../middlewares/validar-solicitud";

const router = express.Router();

router.post(
  '/api/stock',
  requireAuth,
  [
    body('almacenId')
      .not()
      .isEmpty()
      .withMessage('El almacen es requerido'),
    body('stockId')
      .not()
      .isEmpty()
      .withMessage('El almacen es requerido'),
  ],
  validarSolicitud,
  crearStock
);

router.get(
  '/api/stock',
  requireAuth,
  indexStock
);

router.get(
  '/api/stock/:id',
  requireAuth,
  verStock
)

export { router as stockRouter };
