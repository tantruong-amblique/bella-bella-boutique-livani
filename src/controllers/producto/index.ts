import express, { Request, Response } from 'express';
import { Producto } from '../../models/producto';

const router = express.Router();


export const indexProduto = async (req: Request, res: Response) => {
  const producto = await Producto.find()
  .populate('medidaPrecio')
  .populate('colorImagen');
    
  res.send(producto);
}