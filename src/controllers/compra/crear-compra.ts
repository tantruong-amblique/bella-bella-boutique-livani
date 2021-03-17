import { Request, Response } from 'express';
import { SolicitudIncorrecta } from '../../errores/solicitud-incorrecta';
import { AlmacenDetalle } from '../../models/almacen-detalle';
import { Compra } from '../../models/compra';
import { CompraTMP } from '../../models/compraTMP';
import { FacturaCompra } from '../../models/factura-compra';
import { HistoricoAlmacenDetalle } from '../../models/historico-almacen-detalle';
import { ProductoCompra } from '../../models/producto-compra';
import { ProductoCompraTMP } from '../../models/producto-compraTMP';
import { UnidadMedida } from '../../models/unidad-medida';
import { EstadoCompra } from '../../types/estado-compra';

export const crearCompra = async (req: Request, res: Response) => {
  const { compraId } = req.body;
  const compraTMP = await CompraTMP.findById(compraId).populate(
    'productoCompraTMP'
  );
  if (!compraTMP) {
    throw new SolicitudIncorrecta(
      'Esta compra no existe.'
    );
  }
  const compra = Compra.build({
    id: compraTMP.id,
    tienda: compraTMP.tienda,
    establecimiento: compraTMP.establecimiento,
    proveedor: compraTMP.proveedor,
    estadoCompra: EstadoCompra.EsperandoConfimacion,
    producto: compraTMP.productoCompraTMP,
    totalCompra: compraTMP.totalCompra!,
    cantidadProducto: compraTMP.contadorProducto,
    expiracion: compraTMP.expiracion,
    almacenId: compraTMP.almacenId,
    usuarioIdAlta: compraTMP.usuarioIdAlta,
    emailUsuarioAlta: compraTMP.emailUsuarioAlta,
  });
  for (let buscarCompra in compraTMP.productoCompraTMP) {
    let buscarProducto = compraTMP.productoCompraTMP[buscarCompra];
    let unidadmedida = await UnidadMedida.findById(buscarProducto.unidadMedidaId);

    const productoCompra = ProductoCompra.build({
      id: buscarProducto.id,
      productoId: buscarProducto.productoId,
      descripcionProducto: buscarProducto.descripcionProducto,
      tipoProducto: buscarProducto.tipoProducto,
      unidadMedidaId: buscarProducto.unidadMedidaId,
      literal: buscarProducto.literal,
      manejadorPrecioId: buscarProducto.manejadorPrecioId,
      descripcionManejadorPrecio: buscarProducto.descripcionManejadorPrecio,
      tipoPrecio: buscarProducto.tipoPrecio,
      precioProducto: buscarProducto.precioProducto,
      cantidadProducto: buscarProducto.cantidadProducto,
      sumatoriaPrecioProducto: buscarProducto.sumatoriaPrecioProducto,
      tiendaId: buscarProducto.tiendaId,
      usuarioIdAlta: buscarProducto.usuarioIdAlta,
      emailUsuarioAlta: buscarProducto.emailUsuarioAlta,
    });
    await productoCompra.save();

    const almacenDetalle = await AlmacenDetalle.findOne({
      almacenId: compra.almacenId,
      productoId: buscarProducto.productoId,
      literalUnidadMedida: unidadmedida!.literal,
    })
    const historicoAlmacenDetalle = await HistoricoAlmacenDetalle.findOne({
      almacenId: compra.almacenId,
      productoId: buscarProducto.productoId,
      literalUnidadMedida: unidadmedida!.literal,
    })

    if(!almacenDetalle){
      const almacenDetalle2 = AlmacenDetalle.build({
        almacenId: compra.almacenId,
        productoId: buscarProducto.productoId,
        nombreProducto: buscarProducto.descripcionProducto,
        cantidad: buscarProducto.cantidadProducto,
        tipoProducto: buscarProducto.tipoProducto,
        tipoPrecio: buscarProducto.tipoPrecio,
        managerPrecioId: buscarProducto.manejadorPrecioId,
        descripcionPrecio: buscarProducto.descripcionManejadorPrecio,
        literalUnidadMedida: unidadmedida!.literal,
        precioProducto: buscarProducto.precioProducto,
        sumatoriaPrecioProducto: buscarProducto.sumatoriaPrecioProducto!,
        fechaUltimaCompra: compra.fechaAlta!,
        usuarioUltimaCompra: compra.emailUsuarioAlta!,
      });
      await almacenDetalle2.save();

      const historicoAlmacenDetalle2 = HistoricoAlmacenDetalle.build({
        id: almacenDetalle2.id,
        almacenId: almacenDetalle2.almacenId,
        productoId: almacenDetalle2.productoId,
        nombreProducto: almacenDetalle2.nombreProducto,
        cantidad: almacenDetalle2.cantidad,
        tipoProducto: almacenDetalle2.tipoProducto,
        tipoPrecio: almacenDetalle2.tipoPrecio,
        managerPrecioId: almacenDetalle2.managerPrecioId,
        descripcionPrecio: almacenDetalle2.descripcionPrecio,
        literalUnidadMedida: almacenDetalle2.literalUnidadMedida,
        precioProducto: almacenDetalle2.precioProducto,
        sumatoriaPrecioProducto: almacenDetalle2.sumatoriaPrecioProducto,
        fechaUltimaCompra: almacenDetalle2.fechaUltimaCompra,
        usuarioUltimaCompra: almacenDetalle2.usuarioUltimaCompra,
      });
      await historicoAlmacenDetalle2.save();

    }else{
      const cantidadAux = almacenDetalle.cantidad;
      const sumatoriaPrecioProductoAux = almacenDetalle.sumatoriaPrecioProducto;
      almacenDetalle.set({
        cantidad: cantidadAux + buscarProducto.cantidadProducto,
        precioProducto: buscarProducto.precioProducto,
        sumatoriaPrecioProducto: sumatoriaPrecioProductoAux + buscarProducto.sumatoriaPrecioProducto!,
        fechaUltimaCompra: compra.fechaAlta!,
        usuarioUltimaCompra: compra.emailUsuarioAlta!,
      })
      await almacenDetalle.save();

      historicoAlmacenDetalle!.set({
        cantidad: almacenDetalle.cantidad,
        precioProducto: almacenDetalle.precioProducto,
        sumatoriaPrecioProducto: almacenDetalle.sumatoriaPrecioProducto,
        fechaUltimaCompra: almacenDetalle.fechaUltimaCompra,
        usuarioUltimaCompra: almacenDetalle.usuarioUltimaCompra,
      });
      await historicoAlmacenDetalle!.save()

    }

    ProductoCompraTMP.findOne({ _id: buscarProducto.id }).remove().exec();
  }
  CompraTMP.findOne({ _id: compraTMP!.id }).remove().exec();
  await compra.save();


  const factura = FacturaCompra.build({
    compra,
    tipoFactura: 'compra',
  });

  await factura.save();

  compra.set({
    facturaId: factura.id,
    estadoCompra: EstadoCompra.Completa,
  });

  await compra.save();

  const compraFinal = await Compra.findById(compra.id)
    .populate('producto')
    .populate('empresa')
    .populate('establecimiento')
    .populate('proveedor');

  res.send(compraFinal);
}