import axios from 'axios';
import queryString from 'query-string';
import { OrganizationUserInterface } from 'interfaces/organization-user';
import { GetQueryInterface } from '../../interfaces';

export const getOrganizationUsers = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/organization-users${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOrganizationUser = async (organizationUser: OrganizationUserInterface) => {
  const response = await axios.post('/api/organization-users', organizationUser);
  return response.data;
};

export const updateOrganizationUserById = async (id: string, organizationUser: OrganizationUserInterface) => {
  const response = await axios.put(`/api/organization-users/${id}`, organizationUser);
  return response.data;
};

export const getOrganizationUserById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/organization-users/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOrganizationUserById = async (id: string) => {
  const response = await axios.delete(`/api/organization-users/${id}`);
  return response.data;
};
