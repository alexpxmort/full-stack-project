import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { SubscriptionDTO } from 'src/dtos/subscription';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsService],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateMRRMonthly', () => {
    it('should calculate MRR monthly correctly', async () => {
      const data: SubscriptionDTO[] = [
        {
          quantidadeCobrancas: 1,
          cobradaACadaXDias: 30,
          dataInicio: '2022-01-01',
          status: 'ativo',
          dataStatus: '2022-01-01',
          dataCancelamento: null,
          valor: 100,
          proximoCiclo: '2022-02-01',
          idAssinante: '1',
        },
      ];

      const result = await service.calculateMRRMonthly(data);
      expect(result).toBeDefined();
    });
  });

  describe('calculateChurnRate', () => {
    it('should calculate churn rate correctly', async () => {
      const data: SubscriptionDTO[] = [
        {
          quantidadeCobrancas: 1,
          cobradaACadaXDias: 30,
          dataInicio: '2022-01-01',
          status: 'ativo',
          dataStatus: '2022-01-01',
          dataCancelamento: '2022-02-15',
          valor: 100,
          proximoCiclo: '2022-02-01',
          idAssinante: '1',
        },
      ];

      const mrrResult = await service.calculateMRRMonthly(data);
      const result = service.calculateChurnRate(data, mrrResult);

      expect(result).toBeDefined();
    });
  });
});
