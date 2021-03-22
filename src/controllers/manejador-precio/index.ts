import { Request, Response } from 'express';
import { MedidaPrecio } from '../../models/medida-precio';

export const indexManejadorPrecio = async (req: Request, res: Response) => {
  const medidaPrecio = await MedidaPrecio.find()
    .populate('unidadMedida')
    .populate('DocumentoMedidaProducto')
    .populate('DocManejadorPrecio')
    
  res.send(medidaPrecio);
}
