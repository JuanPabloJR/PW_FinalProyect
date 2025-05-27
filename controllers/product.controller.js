const db = require('../lib/db.js');

exports.getAllProducts = (req, res) => {
  db.query('SELECT * FROM products', (err, result) => {
    if (err) return res.status(500).send({ message: 'Error retrieving products' });
    res.status(200).send(result);
  });
};

exports.searchProducts = (req, res) => {
  const search = req.params.query;
  db.query(
    'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?',
    [`%${search}%`, `%${search}%`],
    (err, result) => {
      if (err) return res.status(500).send({ message: 'Error searching products' });
      res.status(200).send(result);
    }
  );
};
