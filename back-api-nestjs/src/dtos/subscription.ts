export interface SubscriptionDTO {
  quantidadeCobrancas: number;
  cobradaACadaXDias: number;
  dataInicio: string;
  status: string;
  dataStatus: string;
  dataCancelamento: string | null;
  valor: any;
  proximoCiclo: string;
  idAssinante: string;
}
