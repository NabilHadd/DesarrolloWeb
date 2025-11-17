import { Router } from 'express';
import { indicatorController } from './indicator.controller';

const router = Router();

router.get('/:code', indicatorController.getIndicator);
router.get('/:code/:date', indicatorController.getValueDate);

export default router;
