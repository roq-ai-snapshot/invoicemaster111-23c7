import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createFinancialReport } from 'apiSdk/financial-reports';
import { Error } from 'components/error';
import { financialReportValidationSchema } from 'validationSchema/financial-reports';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { FinancialReportInterface } from 'interfaces/financial-report';

function FinancialReportCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: FinancialReportInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createFinancialReport(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<FinancialReportInterface>({
    initialValues: {
      report_date: new Date(new Date().toDateString()),
      total_revenue: 0,
      total_expenses: 0,
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: financialReportValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Financial Report
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="report_date" mb="4">
            <FormLabel>report_date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.report_date}
              onChange={(value: Date) => formik.setFieldValue('report_date', value)}
            />
          </FormControl>
          <FormControl id="total_revenue" mb="4" isInvalid={!!formik.errors?.total_revenue}>
            <FormLabel>total_revenue</FormLabel>
            <NumberInput
              name="total_revenue"
              value={formik.values?.total_revenue}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('total_revenue', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.total_revenue && <FormErrorMessage>{formik.errors?.total_revenue}</FormErrorMessage>}
          </FormControl>
          <FormControl id="total_expenses" mb="4" isInvalid={!!formik.errors?.total_expenses}>
            <FormLabel>total_expenses</FormLabel>
            <NumberInput
              name="total_expenses"
              value={formik.values?.total_expenses}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('total_expenses', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.total_expenses && <FormErrorMessage>{formik.errors?.total_expenses}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'organization_id'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'financial_report',
  operation: AccessOperationEnum.CREATE,
})(FinancialReportCreatePage);
