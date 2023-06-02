import * as yup from 'yup';

export const financialReportValidationSchema = yup.object().shape({
  report_date: yup.date().required(),
  total_revenue: yup.number().integer().required(),
  total_expenses: yup.number().integer().required(),
  organization_id: yup.string().nullable().required(),
});
