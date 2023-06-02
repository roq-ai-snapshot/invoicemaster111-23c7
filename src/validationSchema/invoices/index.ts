import * as yup from 'yup';
import { paymentValidationSchema } from 'validationSchema/payments';

export const invoiceValidationSchema = yup.object().shape({
  status: yup.string().required(),
  amount: yup.number().integer().required(),
  organization_id: yup.string().nullable().required(),
  client_id: yup.string().nullable().required(),
  payment: yup.array().of(paymentValidationSchema),
});
