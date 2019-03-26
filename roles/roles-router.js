const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/roles.db3'
  },
  useNullAsDefault: true
  // debug: true
};

const db = knex(knexConfig);

router.get('/', async (req, res) => {
  // returns a promise that resolves to all records in the table
  try {
    const roles = await db('roles');
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const role = await db('roles')
      .where({ id })
      .first();
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const [id] = await db('roles').insert(req.body);
    const role = await db('roles')
      .where({ id })
      .first();
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const count = await db('roles')
      .where({ id: req.params.id })
      .update(req.body);
    if (count > 0) {
      const role = await db('roles')
        .where({ id: req.params.id })
        .first();
      res.status(200).json(role);
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const count = await db('roles')
      .where({ id: req.params.id })
      .del();
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
