import { Request, Response } from 'express';
import { ErrorNoEncontrado } from '../../errores/error-no-encontrado';
import { ManejadorPrecio } from '../../models/manejador-precio';

export const verManejadorPrecio = async (req: Request, res: Response) => {
    const manejadorPrecio = await ManejadorPrecio.findById(req.params.id);

    if (!manejadorPrecio) {
      throw new ErrorNoEncontrado();
    }

    res.send(manejadorPrecio);
  }
