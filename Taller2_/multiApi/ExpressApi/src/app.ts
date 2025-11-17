import express from 'express';
import indicatorRoutes from './indicator/indicator.routes';

export const app = express();

app.use(express.json());
app.use('/indicator', indicatorRoutes);

// Si quieres export por defecto (opcional), descomenta la siguiente línea:
// export default app;
