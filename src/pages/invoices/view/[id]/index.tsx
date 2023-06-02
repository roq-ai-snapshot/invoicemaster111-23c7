import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getInvoiceById } from 'apiSdk/invoices';
import { Error } from 'components/error';
import { InvoiceInterface } from 'interfaces/invoice';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deletePaymentById } from 'apiSdk/payments';

function InvoiceViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InvoiceInterface>(
    () => (id ? `/invoices/${id}` : null),
    () =>
      getInvoiceById(id, {
        relations: ['organization', 'user', 'payment'],
      }),
  );

  const paymentHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePaymentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Invoice Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              status: {data?.status}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              amount: {data?.amount}
            </Text>
            {hasAccess('organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                organization:{' '}
                <Link href={`/organizations/view/${data?.organization?.id}`}>{data?.organization?.name}</Link>
              </Text>
            )}
            {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                user: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.email}</Link>
              </Text>
            )}
            {hasAccess('payment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Payment
                </Text>
                <Link href={`/payments/create?invoice_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>amount</Th>
                        <Th>payment_date</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.payment?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.amount}</Td>
                          <Td>{record.payment_date as unknown as string}</Td>
                          <Td>
                            <Button>
                              <Link href={`/payments/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/payments/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => paymentHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'invoice',
  operation: AccessOperationEnum.READ,
})(InvoiceViewPage);
