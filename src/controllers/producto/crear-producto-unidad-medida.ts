import { Request, Response } from 'express';
import { SolicitudIncorrecta } from '../../errores/solicitud-incorrecta';
import { Producto } from '../../models/producto';
import { UnidadMedida } from '../../models/unidad-medida';

export const crearProductoUnidadMedida = async (req: Request, res: Response) => {
  const unidadMedida = await UnidadMedida.findById(req.body.unidadMedidaId);

  if (!unidadMedida) {
    throw new SolicitudIncorrecta('La unidad de medida no existe');
  }

  const productoExistnte = await Producto.findOne({_id: req.body.productoId, unidadMedida });

  if (productoExistnte) {
    throw new SolicitudIncorrecta('La unidad de medida ya esta asociada a este producto');
  }
  
  const producto = await Producto.findById(req.body.productoId).populate('unidadMedida');
  
  if (!producto) {
    throw new SolicitudIncorrecta('El producto no existe');
  }

  producto.unidadMedida!.push(unidadMedida);
  await producto.save();
  
  res.status(201).send(producto);
}