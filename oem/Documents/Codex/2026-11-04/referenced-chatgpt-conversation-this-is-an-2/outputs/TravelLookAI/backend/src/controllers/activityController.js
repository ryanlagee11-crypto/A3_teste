import { activityService } from '../services/activityService.js';

import {
  viagemIdParamsSchema,
  activityIdParamsSchema,
  createActivitySchema,
  updateActivitySchema,
  activityQuerySchema,
} from '../validators/activityValidator.js';

export const activityController = {
  async create(req, res) {
    const { viagemId } = viagemIdParamsSchema.parse(req.params);
    const input = createActivitySchema.parse(req.body);

    const activity = await activityService.create(viagemId, input);

    res.status(201).json({ data: activity });
  },

  async list(req, res) {
    const { viagemId } = viagemIdParamsSchema.parse(req.params);
    const filters = activityQuerySchema.parse(req.query);

    res.json(await activityService.list(viagemId, filters));
  },

  async get(req, res) {
    const { atividadeId } = activityIdParamsSchema.parse(req.params);

    res.json({
      data: await activityService.get(atividadeId),
    });
  },

  async update(req, res) {
    const { atividadeId } = activityIdParamsSchema.parse(req.params);
    const input = updateActivitySchema.parse(req.body);

    res.json({
      data: await activityService.update(atividadeId, input),
    });
  },

  async delete(req, res) {
    const { atividadeId } = activityIdParamsSchema.parse(req.params);

    await activityService.delete(atividadeId);

    res.status(204).send();
  },
};