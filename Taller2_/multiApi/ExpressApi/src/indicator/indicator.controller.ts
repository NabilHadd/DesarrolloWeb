import { Request, Response } from 'express';
import { indicatorService } from './indicator.service';

class IndicatorController {

  async getIndicator(req: Request, res: Response) {
    const code = req.params.code;  // FIX

    const indicator = await indicatorService.getIndicator(code);
    return res.json(indicator);
  }

  async getValueDate(req: Request, res: Response) {
    const code = req.params.code;  // FIX
    const date = new Date(req.params.date);

    const value = await indicatorService.getValueDate(code, date);
    return res.json(value);
  }

}

export const indicatorController = new IndicatorController();
