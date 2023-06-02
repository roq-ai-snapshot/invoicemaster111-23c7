import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';

export interface OrganizationUserInterface {
  id?: string;
  organization_id: string;
  user_id: string;

  organization?: OrganizationInterface;
  user?: UserInterface;
  _count?: {};
}
