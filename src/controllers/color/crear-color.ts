import { Request, Response } from 'express';
//import { validarSolicitud, SolicitudIncorrecta } from '@eloyk/comun';
import { Color } from '../../models/color';
import { Tienda } from '../../models/tienda';

export const registrarColor = async (req: Request, res: Response) => {
    const { 
      descripcion,
      colorImagen,
    } = req.body;

    const tienda = await Tienda.findOne({nombreTienda: 'bella bella boutique'});

    const color = Color.build({ 
      descripcion,
      color: colorImagen,
      tiendaId: tienda!.id,
      usuarioIdAlta: req.usuarioActual!.id,
      emailUsuarioAlta: req.usuarioActual!.email 
    });
    await color.save();

    res.status(201).send(color);
}