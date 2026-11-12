import { pool } from '../config/database.js';

export const activityRepository = {
  async findTripById(id) {
    const [rows] = await pool.execute(
      'SELECT id FROM viagens WHERE id = ?',
      [id]
    );

    return rows[0] ?? null;
  },

  async create({ id, viagemId, nome, tipo, data, horario, local, duracaoMinutos, observacao }) {
    await pool.execute(
      `INSERT INTO atividades
      (id, viagem_id, nome, tipo, data, horario, local, duracao_minutos, observacao)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, viagemId, nome, tipo, data, horario, local, duracaoMinutos, observacao ?? null]
    );

    return this.findById(id);
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT
        id,
        viagem_id AS viagemId,
        nome,
        tipo,
        data,
        horario,
        local,
        duracao_minutos AS duracaoMinutos,
        observacao
      FROM atividades
      WHERE id = ?`,
      [id]
    );

    return rows[0] ?? null;
  },

  async listByTrip(viagemId, filters) {
    const clauses = ['viagem_id = ?'];
    const values = [viagemId];

    if (filters.dataInicio) {
      clauses.push('data >= ?');
      values.push(filters.dataInicio);
    }

    if (filters.dataFim) {
      clauses.push('data <= ?');
      values.push(filters.dataFim);
    }

    const where = clauses.join(' AND ');

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM atividades WHERE ${where}`,
      values
    );

    const [rows] = await pool.execute(
      `SELECT
        id,
        viagem_id AS viagemId,
        nome,
        tipo,
        data,
        horario,
        local,
        duracao_minutos AS duracaoMinutos,
        observacao
      FROM atividades
      WHERE ${where}
      ORDER BY data ASC, horario ASC
      LIMIT ? OFFSET ?`,
      [...values, filters.limit, (filters.page - 1) * filters.limit]
    );

    return {
      rows,
      total: Number(countRows[0].total),
    };
  },

  async update(id, input) {
    const mapping = {
      nome: 'nome',
      tipo: 'tipo',
      data: 'data',
      horario: 'horario',
      local: 'local',
      duracaoMinutos: 'duracao_minutos',
      observacao: 'observacao',
    };

    const fields = [];
    const values = [];

    for (const [key, column] of Object.entries(mapping)) {
      if (input[key] !== undefined) {
        fields.push(`${column} = ?`);
        values.push(input[key]);
      }
    }

    await pool.execute(
      `UPDATE atividades SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM atividades WHERE id = ?',
      [id]
    );

    return result.affectedRows === 1;
  },
};