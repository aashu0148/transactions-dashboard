'use client';

import { useMemo, useState } from 'react';
import { DEFAULT_FILTERS } from '../../constants/transactions.constants';
import { useTransactionInsights } from '../../hooks/use-transaction-insights';
import { useTransactions } from '../../hooks/use-transactions';
import { TransactionFilters } from '../../types/transaction.types';
import { filterTransactions } from '../../utils/transaction.utils';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { FilterBar } from '../views/filter-bar';
import { InsightsPanel } from '../views/insights-panel';
import { TransactionsTable } from '../views/transactions-table';

export function TransactionsDashboard() {
	const [rawSearch, setRawSearch] = useState('');
	const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);

	const debouncedSearch = useDebounce(rawSearch, 300);

	const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useTransactions();
 
	const allTransactions = useMemo(() => data?.pages.flat() ?? [], [data]);

	const filteredTransactions = useMemo(
		() => filterTransactions(allTransactions, { ...filters, search: debouncedSearch }),
		[allTransactions, filters, debouncedSearch]
	);

	const insights = useTransactionInsights(filteredTransactions);

	function handleFiltersChange(patch: Partial<TransactionFilters>) {
		setFilters((prev) => ({ ...prev, ...patch }));
	}

	function handleReset() {
		setRawSearch('');
		setFilters(DEFAULT_FILTERS);
	}

	return (
		<div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 sm:gap-6 sm:p-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-xl font-bold tracking-tight sm:text-2xl">Transaction Insights</h1>
				<p className="text-sm text-muted-foreground">Financial activity</p>
			</div>

			<InsightsPanel
				insights={insights}
				isLoading={isLoading}
			/>

			<FilterBar
				filters={filters}
				rawSearch={rawSearch}
				onSearchChange={setRawSearch}
				onFiltersChange={handleFiltersChange}
				onReset={handleReset}
			/>

			<TransactionsTable
				transactions={filteredTransactions}
				totalLoadedCount={allTransactions.length}
				isLoading={isLoading}
				isError={isError}
				isFetchingNextPage={isFetchingNextPage}
				hasNextPage={hasNextPage ?? false}
				fetchNextPage={fetchNextPage}
			/>
		</div>
	);
}
