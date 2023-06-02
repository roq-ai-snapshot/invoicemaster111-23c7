import * as yup from 'yup';
import { contractValidationSchema } from 'validationSchema/contracts';
import { financialReportValidationSchema } from 'validationSchema/financial-reports';
import { invoiceValidationSchema } from 'validationSchema/invoices';
import { organizationUserValidationSchema } from 'validationSchema/organization-users';

export const organizationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  contract: yup.array().of(contractValidationSchema),
  financial_report: yup.array().of(financialReportValidationSchema),
  invoice: yup.array().of(invoiceValidationSchema),
  organization_user: yup.array().of(organizationUserValidationSchema),
});
