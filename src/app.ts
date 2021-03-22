import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { usuarioActual } from './middlewares/usuario-actual'
import { ErrorNoEncontrado } from './errores/error-no-encontrado'
import { controladorError } from './middlewares/controlador-error'

import { usuarioRouter } from './routes/usuario-routes';
import { tiendaRouter } from './routes/tienda-routes';
import { establecimientoRouter } from './routes/establecimiento-routes';
import { clienteRouter } from './routes/cliente-routes';
import { proveedorRouter } from './routes/proveedor-routes';
import { unidadMedidaRouter } from './routes/unidad-medida-routes';
import { productoRouter } from './routes/producto-routes';
import { manejadorPrecioRouter } from './routes/manejador-precio-routes';
import { almacenRouter } from './routes/almacen-routes';
import { compraRouter } from './routes/compra-routes';
import { colorRouter } from './routes/color-routes';
import { medidaProductoRouter } from './routes/medida-producto-routes';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    //secure: process.env.NODE_ENV !== 'test',
    secure: false,
  })
);

app.use(usuarioActual);

//Routes de usuario
app.use(usuarioRouter);

//Routes de tienda
app.use(tiendaRouter);

//Routes de establecimiento
app.use(establecimientoRouter);

//Routes de cliente
app.use(clienteRouter);

//Routes de proveedor
app.use(proveedorRouter);

//Routes de unidad de medida
app.use(unidadMedidaRouter);

//Routes de producto
app.use(productoRouter);

//Routes de manejador de precios
app.use(manejadorPrecioRouter);

//Routes de almacen
app.use(almacenRouter);

//Routes de compra
app.use(compraRouter);

//Routes de compra
app.use(colorRouter);

//Routes de compra
app.use(medidaProductoRouter);

app.all('*', async (req, res) => {
  throw new ErrorNoEncontrado();
});

app.use(controladorError);

export { app };
