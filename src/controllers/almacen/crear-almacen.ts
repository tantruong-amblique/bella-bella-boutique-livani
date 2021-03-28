import { Request, Response } from 'express';
import { SolicitudIncorrecta } from '../../errores/solicitud-incorrecta';
import { Almacen } from '../../models/almacen';
import { Establecimiento } from '../../models/establecimiento';
import { HistoricoAlmacen } from '../../models/historico-almacen';
import { HistoricoStock } from '../../models/historico-stock';
import { Stock } from '../../models/stock';
import { Tienda } from '../../models/tienda';

export const registrarAlmacen = async (req: Request, res: Response) => {
    const { 
      descripcion,
      establecimientoId,
    } = req.body;

    const establecimiento = await Establecimiento.findOne({ _id: establecimientoId });
    if (!establecimiento) {
      throw new SolicitudIncorrecta(
        'El establecimiento no es valido.'
      );
    }
  
    const tienda = await Tienda.findOne({ nombreTienda: 'bella bella boutique' });

    const almacen = Almacen.build({ 
      descripcion,
      establecimientoId,
      tiendaId: tienda!.id,
      usuarioIdAlta: req.usuarioActual!.id,
      emailUsuarioAlta: req.usuarioActual!.email 
    });
    await almacen.save();

    const historicoAlmacen = HistoricoAlmacen.build({
      id: almacen.id,
      descripcion,
      establecimientoId,
      tiendaId: tienda!.id,
      usuarioIdAlta: req.usuarioActual!.id,
      emailUsuarioAlta: req.usuarioActual!.email 
    });
    await historicoAlmacen.save();

    const stock = Stock.build({ 
      descripcion,
      establecimientoId,
      tiendaId: tienda!.id,
      usuarioIdAlta: req.usuarioActual!.id,
      emailUsuarioAlta: req.usuarioActual!.email 
    });
    await stock.save();

    const historicoStock = HistoricoStock.build({
      id: stock.id,
      descripcion,
      establecimientoId,
      tiendaId: tienda!.id,
      usuarioIdAlta: req.usuarioActual!.id,
      emailUsuarioAlta: req.usuarioActual!.email 
    });
    await historicoStock.save();

    res.status(201).send(almacen);
}