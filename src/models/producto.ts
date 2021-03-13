import mongoose from 'mongoose';
import { DocumentoUnidadMedida } from './unidad-medida';
import { DocumentoMedidaProducto } from './medida-producto';
import { DocManejadorPrecio } from './manejador-precio';

interface AtribProducto {
  producto: string
  descripcion: [string];
  codigoBarra?: string;
  tipoProducto: string;
  urlImagen?: string;
  tiendaId: string;
  usuarioIdAlta?: string;
  emailUsuarioAlta?: string;
  fechaAlta?: Date;
  unidadMedida?: [DocumentoUnidadMedida];
  medidaProducto?: [DocumentoMedidaProducto];
  manejadorPrecio?: [DocManejadorPrecio];
}

interface DocProducto extends mongoose.Document {
  producto: string
  descripcion: [string];
  codigoBarra?: string;
  tipoProducto: string;
  urlImagen?: string;
  tiendaId: string;
  usuarioIdAlta?: string;
  emailUsuarioAlta?: string;
  fechaAlta?: Date;
  unidadMedida?: [DocumentoUnidadMedida];
  medidaProducto?: [DocumentoMedidaProducto];
  manejadorPrecio?: [DocManejadorPrecio];
}

interface ModelProducto extends mongoose.Model<DocProducto> {
  build(atrib: AtribProducto): DocProducto;
}

const schemaProducto = new mongoose.Schema(
  {
    producto: {
      type: String,
      required: true,
      lowercase: true,
    },
    descripcion: [
      {
        type: String,
        required: true,
        lowercase: true,
      }
    ],
    codigoBarra: {
      type: String,
    },
    tipoProducto: {
      type: String,
      required: true,
    },
    urlImagen: {
      type: String,
    },
    tiendaId: {
      type: String,
      required: true,
    },
    usuarioIdAlta: {
      type: String,
    },
    emailUsuarioAlta: {
      type: String,
    },
    fechaAlta: {
      type: mongoose.Schema.Types.Date,
      default: Date.now,
    },
    unidadMedida: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnidadMedida',
      },
    ],
    medidaProducto: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedidaProducto',
      },
    ],
    manejadorPrecio: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ManejadorPrecio',
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        for (let u in ret.unidadMedida) {
          delete ret.unidadMedida[u].tiendaId;
        }
        for (let u in ret.medidaProducto) {
          delete ret.medidaProducto[u].tiendaId;
        }
      },
    },
  }
);

schemaProducto.statics.build = (atrib: AtribProducto) => {
  return new Producto(atrib);
};

const Producto = mongoose.model<DocProducto, ModelProducto>(
  'Producto',
  schemaProducto
);

export { Producto };
