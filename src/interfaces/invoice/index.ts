import { PaymentInterface } from 'interfaces/payment';
import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';

export interface InvoiceInterface {
  id?: string;
  organization_id: string;
  client_id: string;
  status: string;
  amount: number;
  payment?: PaymentInterface[];
  organization?: OrganizationInterface;
  user?: UserInterface;
  _count?: {
    payment?: number;
  };
}
