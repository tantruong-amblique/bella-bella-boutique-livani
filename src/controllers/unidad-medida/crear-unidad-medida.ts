import { Request, Response } from 'express';
//import { validarSolicitud, SolicitudIncorrecta } from '@eloyk/comun';
import { UnidadMedida } from '../../models/unidad-medida';
import { Tienda } from '../../models/tienda';

export const registrarUnidadMedida = async (req: Request, res: Response) => {
    const { 
      descripcion,
      literal,
    } = req.body;

    const tienda = await Tienda.findOne({nombreTienda: 'bella bella boutique'});

    const unidadMedida = UnidadMedida.build({ 
      descripcion,
      literal,
      tiendaId: tienda!.id,
      usuarioIdAlta: req.usuarioActual!.id,
      emailUsuarioAlta: req.usuarioActual!.email 
    });
    await unidadMedida.save();

    res.status(201).send(unidadMedida);
}