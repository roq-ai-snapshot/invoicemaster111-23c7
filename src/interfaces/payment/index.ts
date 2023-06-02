import { InvoiceInterface } from 'interfaces/invoice';

export interface PaymentInterface {
  id?: string;
  invoice_id: string;
  amount: number;
  payment_date: Date;

  invoice?: InvoiceInterface;
  _count?: {};
}
