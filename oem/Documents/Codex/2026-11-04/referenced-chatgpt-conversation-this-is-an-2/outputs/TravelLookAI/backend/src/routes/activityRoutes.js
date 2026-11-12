import { Router } from 'express';
import { activityController } from '../controllers/activityController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const activityRoutes = Router();

activityRoutes.post(
  '/viagens/:viagemId/atividades',
  asyncHandler(activityController.create)
);

activityRoutes.get(
  '/viagens/:viagemId/atividades',
  asyncHandler(activityController.list)
);

activityRoutes.get(
  '/atividades/:atividadeId',
  asyncHandler(activityController.get)
);

activityRoutes.put(
  '/atividades/:atividadeId',
  asyncHandler(activityController.update)
);

activityRoutes.delete(
  '/atividades/:atividadeId',
  asyncHandler(activityController.delete)
);