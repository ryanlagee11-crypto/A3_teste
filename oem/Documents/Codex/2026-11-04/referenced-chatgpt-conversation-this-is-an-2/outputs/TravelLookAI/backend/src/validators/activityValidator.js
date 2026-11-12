import { z } from 'zod';

const uuidSchema = z.string().uuid('ID inválido.');

const activityFields = {
  nome: z.string().trim().min(1).max(150),
  tipo: z.string().trim().min(1).max(80),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida. Use AAAA-MM-DD.'),
  horario: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Horário inválido.'),
  local: z.string().trim().min(1).max(255),
  duracaoMinutos: z.coerce.number().int().positive(),
  observacao: z.string().max(255).nullable().optional(),
};

export const viagemIdParamsSchema = z.object({
  viagemId: uuidSchema,
});

export const activityIdParamsSchema = z.object({
  atividadeId: uuidSchema,
});

export const createActivitySchema = z.object(activityFields);

export const updateActivitySchema = z.object({
  nome: activityFields.nome.optional(),
  tipo: activityFields.tipo.optional(),
  data: activityFields.data.optional(),
  horario: activityFields.horario.optional(),
  local: activityFields.local.optional(),
  duracaoMinutos: activityFields.duracaoMinutos.optional(),
  observacao: activityFields.observacao,
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Informe pelo menos um campo para atualizar.' }
);

export const activityQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});