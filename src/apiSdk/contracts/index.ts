import axios from 'axios';
import queryString from 'query-string';
import { ContractInterface } from 'interfaces/contract';
import { GetQueryInterface } from '../../interfaces';

export const getContracts = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/contracts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createContract = async (contract: ContractInterface) => {
  const response = await axios.post('/api/contracts', contract);
  return response.data;
};

export const updateContractById = async (id: string, contract: ContractInterface) => {
  const response = await axios.put(`/api/contracts/${id}`, contract);
  return response.data;
};

export const getContractById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/contracts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteContractById = async (id: string) => {
  const response = await axios.delete(`/api/contracts/${id}`);
  return response.data;
};
