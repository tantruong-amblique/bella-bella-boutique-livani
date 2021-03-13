import { Request, Response } from 'express';
import { ErrorNoEncontrado } from '../../errores/error-no-encontrado';
import { ManejadorPrecio } from '../../models/manejador-precio';

export const actualizarManejadorPrecio = async (req: Request, res: Response) => {
  const manejadorPrecio = await ManejadorPrecio.findById(req.params.id);

  if (!manejadorPrecio) {
    throw new ErrorNoEncontrado();
  }

  manejadorPrecio.set({
    descripcion: req.body.descripcion,
    tipoPrecio: req.body.tipoPrecio,
    precio: req.body.precio,
  });
  await manejadorPrecio.save();
  
  res.send(manejadorPrecio);
}
