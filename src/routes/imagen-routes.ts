import express from "express";
import { body } from "express-validator";
import { indexImagen } from "../controllers/imagen";
import { actualizarImagen } from "../controllers/imagen/actualizar-imagen";
import { crearImagen } from "../controllers/imagen/crear-imagen";
import { verImagen } from "../controllers/imagen/ver-imagen";
import { requireAuth } from "../middlewares/autorizacion-requerida";
import { validarSolicitud } from "../middlewares/validar-solicitud";

const router = express.Router();

router.post(
    '/api/producto/imagen/registrar',
    requireAuth,
    [
      body('descripcion')
        .not()
        .isEmpty()
        .withMessage('El nombre del producto es requerido'),
      body('urlImagen')
        .not()
        .isEmpty()
        .withMessage('La imagen es requerida'),
      body('colorId').not().isEmpty().withMessage('El color es requerido'),
      body('productoId').not().isEmpty().withMessage('El producto es requerido'),
      ],
    validarSolicitud,
    crearImagen
)

router.put(
    '/api/producto/imagen/:id',
    requireAuth,
    actualizarImagen
)

router.get(
    '/api/producto/imagen/all',
    requireAuth,
    indexImagen
)

router.get(
    '/api/producto/imagen/:id',
    requireAuth,
    verImagen
)

export { router as imagenRouter };
