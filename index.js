const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.routes.js');
const adminRouter = require('./routes/admin.routes.js');
const ordersRouter = require('./routes/orders.routes.js');
const productRouter = require('./routes/product.routes.js');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/orders', ordersRouter);
app.use('/products', productRouter);

app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));