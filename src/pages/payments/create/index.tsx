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
import { createPayment } from 'apiSdk/payments';
import { Error } from 'components/error';
import { paymentValidationSchema } from 'validationSchema/payments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { InvoiceInterface } from 'interfaces/invoice';
import { getInvoices } from 'apiSdk/invoices';
import { PaymentInterface } from 'interfaces/payment';

function PaymentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PaymentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPayment(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PaymentInterface>({
    initialValues: {
      amount: 0,
      payment_date: new Date(new Date().toDateString()),
      invoice_id: (router.query.invoice_id as string) ?? null,
    },
    validationSchema: paymentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Payment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
            <FormLabel>amount</FormLabel>
            <NumberInput
              name="amount"
              value={formik.values?.amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
          </FormControl>
          <FormControl id="payment_date" mb="4">
            <FormLabel>payment_date</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.payment_date}
              onChange={(value: Date) => formik.setFieldValue('payment_date', value)}
            />
          </FormControl>
          <AsyncSelect<InvoiceInterface>
            formik={formik}
            name={'invoice_id'}
            label={'invoice_id'}
            placeholder={'Select Invoice'}
            fetcher={getInvoices}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.organization_id}
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
  entity: 'payment',
  operation: AccessOperationEnum.CREATE,
})(PaymentCreatePage);
