import express, { Request, Response } from 'express';
import { requireAuth, Venta } from '@eloyk/comun';

const router = express.Router();

router.get(
  '/api/venta',
  requireAuth,
  async (req: Request, res: Response) => {
    const venta = await Venta.findById(req.params.id)    
    .populate('producto')
    .populate('empresa')
    .populate('establecimiento')
    .populate('cliente');

    res.send(venta);
  }
);

export { router as indexProdutoRouter };
