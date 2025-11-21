import express from 'express';
import cors from 'cors';
import indicatorRoutes from './indicator/indicator.routes';

export const app = express();

// Habilitar CORS para todos los orígenes (solo desarrollo)
app.use(cors({
  origin: '*',        // o ['http://localhost:3000']
  credentials: true,
}));

app.get('/', (req, res) => {
  res.status(200).json({ service: 'Express Indicator API', status: 'Running' });
});

app.use(express.json());
app.use('/indicator', indicatorRoutes);
