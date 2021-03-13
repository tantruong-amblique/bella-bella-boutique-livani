import { Request, Response } from 'express';
import { Producto } from '../../models/producto';

export const indexManejadorPrecio = async (req: Request, res: Response) => {
  const manejadorprecio = await Producto.find()
    .populate('manejadorPrecio')
    .populate('unidadMedida');
    
  res.send(manejadorprecio);
}
