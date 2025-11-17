import prisma from '../prisma/prisma.service';

export class IndicatorService {

  async getIndicator(code: string) {
    return await prisma.indicator.findUnique({
      where: { code },
    });
  }

  async getValueDate(code: string, date: Date) {
    return await prisma.indicator_value.findUnique({
      where: {
        indicator_code_date: {
          indicator_code: code,
          date: date
        }
      }
    });
  }

    async getAll(){
      const indicator = await prisma.indicator.findMany();
      return indicator.map(x => x.code)      
    }
}

export const indicatorService = new IndicatorService();
