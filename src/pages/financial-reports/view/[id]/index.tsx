import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getFinancialReportById } from 'apiSdk/financial-reports';
import { Error } from 'components/error';
import { FinancialReportInterface } from 'interfaces/financial-report';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function FinancialReportViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FinancialReportInterface>(
    () => (id ? `/financial-reports/${id}` : null),
    () =>
      getFinancialReportById(id, {
        relations: ['organization'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Financial Report Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              report_date: {data?.report_date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              total_revenue: {data?.total_revenue}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              total_expenses: {data?.total_expenses}
            </Text>
            {hasAccess('organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                organization:{' '}
                <Link href={`/organizations/view/${data?.organization?.id}`}>{data?.organization?.name}</Link>
              </Text>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'financial_report',
  operation: AccessOperationEnum.READ,
})(FinancialReportViewPage);
