import * as yup from 'yup';

export const organizationUserValidationSchema = yup.object().shape({
  organization_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
