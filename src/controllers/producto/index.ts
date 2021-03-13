import express, { Request, Response } from 'express';
import { Producto } from '../../models/producto';

const router = express.Router();


export const indexProduto = async (req: Request, res: Response) => {
  const producto = await Producto.find()
  .populate('unidadMedida')
  .populate('medidaProducto')
  .populate('manejadorPrecio');
    
  res.send(producto);
}