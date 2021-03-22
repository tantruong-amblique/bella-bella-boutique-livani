import { Request, Response } from 'express';
import { ErrorNoEncontrado } from '../../errores/error-no-encontrado';
import { Color } from '../../models/color';
import { Tienda } from '../../models/tienda';

export const actualizarColor = async (req: Request, res: Response) => {
    const {
      descripcion,
      colorImagen
    } = req.body;
    const color = await Color.findById(req.params.id);

    if (!color) {
      throw new ErrorNoEncontrado();
    }
    color.set({
      descripcion,
      colorImagen,
    });
    await color.save();

    res.status(201).send(color);
}