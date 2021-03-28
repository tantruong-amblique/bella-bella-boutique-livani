import { Request, Response } from 'express';
import { SolicitudIncorrecta } from '../../errores/solicitud-incorrecta';
import { FacturaVenta } from '../../models/factura-venta';
import { HistoricoStockDetalle } from '../../models/historico-stock-detalle';
import { ProductoCompra } from '../../models/producto-compra';
import { ProductoCompraTMP } from '../../models/producto-compraTMP';
import { StockDetalle } from '../../models/stock-detalle';
import { Venta } from '../../models/venta';
import { VentaTMP } from '../../models/ventaTMP';
import { EstadoCompra } from '../../types/estado-compra';

export const crearCliente = async (req: Request, res: Response) => {
    const { ventaId } = req.body;

    const ventaTMP = await VentaTMP.findById(ventaId).populate(
      'productoCompraTMP'
    );

    if (!ventaTMP) {
      throw new SolicitudIncorrecta(
        'Esta venta es invalida.'
      );
    }

    const venta = Venta.build({
      id: ventaTMP.id,
      tienda: ventaTMP.tienda,
      establecimiento: ventaTMP.establecimiento,
      cliente: ventaTMP.cliente,
      estadoCompra: EstadoCompra.EsperandoConfimacion,
      producto: ventaTMP.productoCompraTMP,
      totalVenta: ventaTMP.totalVenta!,
      cantidadProducto: ventaTMP.contadorProducto,
      expiracion: ventaTMP.expiracion,
      stockId: ventaTMP.stockId,
      usuarioIdAlta: ventaTMP.usuarioIdAlta,
      emailUsuarioAlta: ventaTMP.emailUsuarioAlta,
    });

    for (let buscarVenta in ventaTMP!.productoCompraTMP) {
      let productoEncontrado = ventaTMP!.productoCompraTMP[buscarVenta];
      
      const productoCompra = ProductoCompra.build({
        id: productoEncontrado.id,
        productoId: productoEncontrado.productoId,
        descripcionProducto: productoEncontrado.descripcionProducto,
        tipoProducto: productoEncontrado.tipoProducto,
        unidadMedidaId: productoEncontrado.unidadMedidaId,
        literal: productoEncontrado.literal,
        literalMedidaProducto: productoEncontrado.literalMedidaProducto,
        colorId: productoEncontrado.colorId,
        manejadorPrecioId: productoEncontrado.manejadorPrecioId,
        descripcionManejadorPrecio: productoEncontrado.descripcionManejadorPrecio,
        tipoPrecio: productoEncontrado.tipoPrecio,
        precioProducto: productoEncontrado.precioProducto,
        cantidadProducto: productoEncontrado.cantidadProducto,
        sumatoriaPrecioProducto: productoEncontrado.sumatoriaPrecioProducto,
        tiendaId: productoEncontrado.tiendaId,
        usuarioIdAlta: productoEncontrado.usuarioIdAlta,
        emailUsuarioAlta: productoEncontrado.emailUsuarioAlta,
      });
      await productoCompra.save();
      
      const stockDetalle = await StockDetalle.findOne({
        stockId: venta.stockId,
        productoId: productoEncontrado.productoId,
        literalUnidadMedida: productoEncontrado.literal,
        literalMedidaProducto: productoEncontrado.literalMedidaProducto,
        colorId: productoEncontrado.colorId
      })
      const historicoStockDetalle = await HistoricoStockDetalle.findOne({
        stockId: venta.stockId,
        productoId: productoEncontrado.productoId,
        literalUnidadMedida: productoEncontrado.literal,
        literalMedidaProducto: productoEncontrado.literalMedidaProducto,
        colorId: productoEncontrado.colorId
      })
  
      if(!stockDetalle){
        const stockDetalle2 = StockDetalle.build({
          stockId: venta.stockId,
          productoId: productoEncontrado.productoId,
          nombreProducto: productoEncontrado.descripcionProducto,
          cantidad: productoEncontrado.cantidadProducto,
          tipoProducto: productoEncontrado.tipoProducto,
          tipoPrecio: productoEncontrado.tipoPrecio,
          managerPrecioId: productoEncontrado.manejadorPrecioId,
          descripcionPrecio: productoEncontrado.descripcionManejadorPrecio,
          literalUnidadMedida: productoEncontrado.literal,
          literalMedidaProducto: productoEncontrado.literalMedidaProducto,
          colorId: productoEncontrado.colorId,
          precioProducto: productoEncontrado.precioProducto,
          sumatoriaPrecioProducto: productoEncontrado.sumatoriaPrecioProducto!,
          fechaUltimaConversion: venta.fechaAlta!,
          usuarioUltimaCompra: venta.emailUsuarioAlta!,
        });
        await stockDetalle2.save();
  
        const historicoStockDetalle2 = HistoricoStockDetalle.build({
          id: stockDetalle2.id,
          stockId: stockDetalle2.stockId,
          productoId: stockDetalle2.productoId,
          nombreProducto: stockDetalle2.nombreProducto,
          cantidad: stockDetalle2.cantidad,
          tipoProducto: stockDetalle2.tipoProducto,
          tipoPrecio: stockDetalle2.tipoPrecio,
          managerPrecioId: stockDetalle2.managerPrecioId,
          descripcionPrecio: stockDetalle2.descripcionPrecio,
          literalUnidadMedida: stockDetalle2.literalUnidadMedida,
          literalMedidaProducto: stockDetalle2.literalMedidaProducto,
          colorId: stockDetalle2.colorId,
          precioProducto: stockDetalle2.precioProducto,
          sumatoriaPrecioProducto: stockDetalle2.sumatoriaPrecioProducto,
          fechaUltimaConversion: stockDetalle2.fechaUltimaConversion,
          usuarioUltimaCompra: stockDetalle2.usuarioUltimaCompra,
        });
        await historicoStockDetalle2.save();
  
      }else{
        const cantidadAux = stockDetalle.cantidad;
        const sumatoriaPrecioProductoAux = stockDetalle.sumatoriaPrecioProducto;
        stockDetalle.set({
          cantidad: cantidadAux + productoEncontrado.cantidadProducto,
          precioProducto: productoEncontrado.precioProducto,
          sumatoriaPrecioProducto: sumatoriaPrecioProductoAux + productoEncontrado.sumatoriaPrecioProducto!,
          fechaUltimaCompra: venta.fechaAlta!,
          usuarioUltimaCompra: venta.emailUsuarioAlta!,
        })
        await stockDetalle.save();
  
        historicoStockDetalle!.set({
          cantidad: stockDetalle.cantidad,
          precioProducto: stockDetalle.precioProducto,
          sumatoriaPrecioProducto: stockDetalle.sumatoriaPrecioProducto,
          fechaUltimaConversion: stockDetalle.fechaUltimaConversion,
          usuarioUltimaCompra: stockDetalle.usuarioUltimaCompra,
        });
        await historicoStockDetalle!.save()
  
      }
  
      ProductoCompraTMP.findOne({ _id: productoEncontrado.id }).remove().exec();
    }

    VentaTMP.findOne({ _id: ventaTMP!.id }).remove().exec();

    await venta.save();

    const factura = FacturaVenta.build({
      venta,
      tipoFactura: 'compra',
    });
  
    await factura.save();
  
    venta.set({
      facturaId: factura.id,
      estadoCompra: EstadoCompra.Completa,
    });

    await venta.save();

    const compraFinal = await Venta.findById(venta.id)
    .populate('producto')
    .populate('tienda')
    .populate('establecimiento')
    .populate('cliente');

    res.status(201).send(compraFinal);
  }
