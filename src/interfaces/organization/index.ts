import { ContractInterface } from 'interfaces/contract';
import { FinancialReportInterface } from 'interfaces/financial-report';
import { InvoiceInterface } from 'interfaces/invoice';
import { OrganizationUserInterface } from 'interfaces/organization-user';
import { UserInterface } from 'interfaces/user';

export interface OrganizationInterface {
  id?: string;
  name: string;
  user_id: string;
  contract?: ContractInterface[];
  financial_report?: FinancialReportInterface[];
  invoice?: InvoiceInterface[];
  organization_user?: OrganizationUserInterface[];
  user?: UserInterface;
  _count?: {
    contract?: number;
    financial_report?: number;
    invoice?: number;
    organization_user?: number;
  };
}
