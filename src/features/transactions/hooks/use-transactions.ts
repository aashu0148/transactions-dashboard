import { useInfiniteQuery } from '@tanstack/react-query';
import { PAGE_SIZE, TRANSACTIONS_QUERY_KEY } from '../constants/transactions.constants';
import { fetchTransactionsPage } from '../services/transactions.service';

export function useTransactions() {
	return useInfiniteQuery({
		queryKey: [TRANSACTIONS_QUERY_KEY],
		queryFn: ({ pageParam }) => fetchTransactionsPage(pageParam as number),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
		retry: false,
	});
}
