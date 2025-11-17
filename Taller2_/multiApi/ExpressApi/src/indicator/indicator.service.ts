import prisma from '../prisma/prisma.service';

export class IndicatorService {

  async getIndicator(code: string) {
    return prisma.indicator.findUnique({
      where: { code },
    });
  }

  async getValueDate(code: string, date: Date) {
    return prisma.indicator_value.findUnique({
      where: {
        indicator_code_date: {
          indicator_code: code,
          date: date
        }
      }
    });
  }
}

export const indicatorService = new IndicatorService();
