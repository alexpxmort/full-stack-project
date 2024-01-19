import { Injectable } from '@nestjs/common';
import { getMonth, getYear, parseISO } from 'date-fns';
import { SubscriptionDTO } from 'src/dtos/subscription';

@Injectable()
export class MetricsService {
  hasNaN = (str: string) => str.includes('NaN-NaN');

  async calculateMRRMonthly(data: SubscriptionDTO[]) {
    const mrrPorMes: { [key: string]: number } = {};

    data.forEach((row: SubscriptionDTO) => {
      const dataInicio = row.dataInicio;
      const dataCancelamento = row.dataCancelamento;

      const mesAno = `${getYear(dataInicio)}-${getMonth(dataInicio) + 1}`;
      const mesAnoCancelamento = dataCancelamento
        ? `${getYear(parseISO(dataCancelamento))}-${getMonth(parseISO(dataCancelamento)) + 1}`
        : null;
      if (mesAnoCancelamento && parseISO(dataCancelamento) < new Date()) {
        const valor = row.valor;

        const roundedValor = parseFloat(
          (mrrPorMes[mesAnoCancelamento] || 0) + valor,
        ).toFixed(2);

        if (!this.hasNaN(mesAnoCancelamento)) {
          mrrPorMes[mesAnoCancelamento] = parseFloat(roundedValor);
        }
      } else {
        // Se a assinatura não foi cancelada, adicionar à receita usando a data de início
        const valor = row.valor;

        const roundedValor = parseFloat(
          (mrrPorMes[mesAno] || 0) + valor,
        ).toFixed(2);

        if (!this.hasNaN(mesAno)) {
          mrrPorMes[mesAno] = parseFloat(roundedValor);
        }
      }
    });

    const sortedMRR = Object.fromEntries(
      Object.entries(mrrPorMes).sort(([a], [b]) => {
        const [yearA, monthA] = a.split('-').map(Number);
        const [yearB, monthB] = b.split('-').map(Number);

        if (yearA !== yearB) {
          return yearA - yearB;
        }

        return monthA - monthB;
      }),
    );

    return sortedMRR;
  }

  calculateChurnRate(
    data: SubscriptionDTO[],
    mrrPorMes: { [key: string]: number },
  ) {
    const churnRatePorMes: { [key: string]: any } = {};

    data.forEach((row: SubscriptionDTO) => {
      const dataCancelamento = row.dataCancelamento;
      if (dataCancelamento) {
        const mesAnoCancelamento = `${getYear(new Date(dataCancelamento))}-${
          getMonth(new Date(dataCancelamento)) + 1
        }`;

        if (!this.hasNaN(mesAnoCancelamento)) {
          const value = (churnRatePorMes[mesAnoCancelamento] || 0) + 1;

          if (value) {
            churnRatePorMes[mesAnoCancelamento] = value;
          }
        }
      }
    });

    const churnRate = Object.fromEntries(
      Object.entries(churnRatePorMes).sort(([a], [b]) => {
        const [yearA, monthA] = a.split('-').map(Number);
        const [yearB, monthB] = b.split('-').map(Number);

        if (yearA !== yearB) {
          return yearA - yearB;
        }

        return monthA - monthB;
      }),
    );
    // Calcula o churn rate mensal
    for (const mesAno in churnRate) {
      const totalAssinaturasAtivas = mrrPorMes[mesAno];
      const cancelamentos = churnRate[mesAno];
      const rate = (cancelamentos / totalAssinaturasAtivas) * 100;
      if (rate) {
        churnRate[mesAno] = parseFloat(rate.toFixed(2));
      }
    }

    return churnRate;
  }
}
