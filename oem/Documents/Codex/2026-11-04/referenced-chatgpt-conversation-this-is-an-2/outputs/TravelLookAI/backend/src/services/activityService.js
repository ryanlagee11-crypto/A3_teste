import { randomUUID } from 'node:crypto';
import { activityRepository } from '../repositories/activityRepository.js';
import { HttpError } from '../utils/httpError.js';

export const activityService = {
  async create(viagemId, input) {
    const viagem = await activityRepository.findTripById(viagemId);

    if (!viagem) {
      throw new HttpError(
        404,
        'TRIP_NOT_FOUND',
        'Viagem não encontrada.'
      );
    }

    return activityRepository.create({
      id: randomUUID(),
      viagemId,
      ...input,
    });
  },

  async list(viagemId, filters) {
    const viagem = await activityRepository.findTripById(viagemId);

    if (!viagem) {
      throw new HttpError(
        404,
        'TRIP_NOT_FOUND',
        'Viagem não encontrada.'
      );
    }

    if (
      filters.dataInicio &&
      filters.dataFim &&
      filters.dataInicio > filters.dataFim
    ) {
      throw new HttpError(
        400,
        'INVALID_DATE_RANGE',
        'A data inicial não pode ser posterior à data final.'
      );
    }

    const result = await activityRepository.listByTrip(viagemId, filters);

    return {
      data: result.rows,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / filters.limit),
      },
    };
  },

  async get(id) {
    const activity = await activityRepository.findById(id);

    if (!activity) {
      throw new HttpError(
        404,
        'ACTIVITY_NOT_FOUND',
        'Atividade não encontrada.'
      );
    }

    return activity;
  },

  async update(id, input) {
    await this.get(id);

    return activityRepository.update(id, input);
  },

  async delete(id) {
    await this.get(id);

    await activityRepository.delete(id);
  },
};