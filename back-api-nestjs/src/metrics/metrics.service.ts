import { Injectable } from '@nestjs/common';
import { getMonth, getYear, parseISO } from 'date-fns';
import { SubscriptionDTO } from 'src/dtos/subscription';

@Injectable()
export class MetricsService {
  async calculateMRRMonthly(data: SubscriptionDTO[]) {
    const mrrPorMes: { [key: string]: number } = {};

    const hasNaN = (str: string) => str.includes('NaN');

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

        if (!hasNaN(mesAnoCancelamento)) {
          mrrPorMes[mesAnoCancelamento] = parseFloat(roundedValor);
        }
      } else {
        // Se a assinatura não foi cancelada, adicionar à receita usando a data de início
        const valor = row.valor;

        const roundedValor = parseFloat(
          (mrrPorMes[mesAno] || 0) + valor,
        ).toFixed(2);

        if (!hasNaN(mesAno)) {
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
}
