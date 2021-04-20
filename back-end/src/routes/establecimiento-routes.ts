import express from "express";
import { body } from "express-validator";
import { indexEstablecimiento } from "../controllers/establecimiento";
import { actualizarEstablecimiento } from "../controllers/establecimiento/actualizar-establecimiento";
import { registrarEstablecimiento } from "../controllers/establecimiento/crear-establecimiento";
import { verEstablecimiento } from "../controllers/establecimiento/ver-establecimiento";
import { requireAuth } from "../middlewares/autorizacion-requerida";
import { validarSolicitud } from "../middlewares/validar-solicitud";


const router = express.Router();

router.post(
  '/api/establecimiento/registrar',
  requireAuth,
  [
    body('descripcion')
      .trim()
      .isLength({ min: 4, max: 160 })
      .withMessage('la descripcion del establecimiento debe contener minimo de 4 caracteres y maxima de 160'),
    body('subNombre')
      .trim()
      .isLength({ min: 4, max: 160 })
      .withMessage(
        'El sub-nombre debe contener minimo de 4 caracteres y maxima de 160'
      ),
  ],
  validarSolicitud,
  registrarEstablecimiento
);

router.put(
  '/api/establecimiento/:id',
  requireAuth,
  actualizarEstablecimiento
);

router.get(
  '/api/establecimiento', 
  requireAuth, 
  indexEstablecimiento
);

router.get(
  '/api/establecimiento/:id',
  requireAuth,
  verEstablecimiento
)

export { router as establecimientoRouter };
