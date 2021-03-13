import mongoose from 'mongoose';

interface AtribManejadorPrecio {
  unidadMedidaId: string;
  descripcion: string;
  tipoPrecio: string;
  precio: number;
  estado?: boolean;
}

export interface DocManejadorPrecio extends mongoose.Document {
  unidadMedidaId: string;
  descripcion: string;
  tipoPrecio: string;
  precio: number;
  estado?: boolean;
}

interface ModelManejadorPrecio extends mongoose.Model<DocManejadorPrecio> {
  build(atrib: AtribManejadorPrecio): DocManejadorPrecio;
}

const schemaManejadorPrecio = new mongoose.Schema(
  {
    unidadMedidaId: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
      lowercase: true,
    },
    tipoPrecio: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

schemaManejadorPrecio.statics.build = (atrib: AtribManejadorPrecio) => {
  return new ManejadorPrecio(atrib);
};

const ManejadorPrecio = mongoose.model<
  DocManejadorPrecio,
  ModelManejadorPrecio
>('ManejadorPrecio', schemaManejadorPrecio);

export { ManejadorPrecio };
