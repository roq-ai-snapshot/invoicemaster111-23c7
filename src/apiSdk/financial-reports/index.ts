import axios from 'axios';
import queryString from 'query-string';
import { FinancialReportInterface } from 'interfaces/financial-report';
import { GetQueryInterface } from '../../interfaces';

export const getFinancialReports = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/financial-reports${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFinancialReport = async (financialReport: FinancialReportInterface) => {
  const response = await axios.post('/api/financial-reports', financialReport);
  return response.data;
};

export const updateFinancialReportById = async (id: string, financialReport: FinancialReportInterface) => {
  const response = await axios.put(`/api/financial-reports/${id}`, financialReport);
  return response.data;
};

export const getFinancialReportById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/financial-reports/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteFinancialReportById = async (id: string) => {
  const response = await axios.delete(`/api/financial-reports/${id}`);
  return response.data;
};
