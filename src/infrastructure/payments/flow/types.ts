export type FlowCreatePaymentResponse = {
  url: string;
  token: string;
  flowOrder: number;
};

export type FlowPaymentStatusResponse = {
  flowOrder: number;
  commerceOrder: string;
  requestDate: string;
  status: number; // 1: pendiente, 2: pagada, 3: rechazada, 4: anulada
  subject: string;
  currency: string;
  amount: number;
  payer: string;
  optional?: Record<string, unknown>;
  pending_info?: Record<string, unknown>;
  paymentData?: Record<string, unknown>;
  merchantId?: string | null;
};

export type FlowPaymentGetResponse = FlowPaymentStatusResponse & {
  token: string;
  paymentData?: {
    media?: number;
    date?: string;
    amount?: number;
    fee?: number;
    taxes?: number;
    balance?: number;
    transferDate?: string;
    authCode?: string;
    cardType?: string;
    payer?: string;
    merchantId?: string | null;
  };
};
