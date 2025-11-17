import express from 'express';
import indicatorRoutes from './indicator/indicator.routes';

export const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ service: 'Express Indicator API', status: 'Running' });
});

app.use(express.json());
app.use('/indicator', indicatorRoutes);

// Si quieres export por defecto (opcional), descomenta la siguiente línea:
// export default app;
