import { OrganizationInterface } from 'interfaces/organization';

export interface FinancialReportInterface {
  id?: string;
  organization_id: string;
  report_date: Date;
  total_revenue: number;
  total_expenses: number;

  organization?: OrganizationInterface;
  _count?: {};
}
