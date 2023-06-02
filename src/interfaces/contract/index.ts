import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';

export interface ContractInterface {
  id?: string;
  organization_id: string;
  client_id: string;
  start_date: Date;
  end_date: Date;

  organization?: OrganizationInterface;
  user?: UserInterface;
  _count?: {};
}
