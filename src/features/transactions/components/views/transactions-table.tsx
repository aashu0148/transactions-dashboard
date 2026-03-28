'use client';

import { InfiniteScrollWrapper } from '@/shared/components/infinite-scroll-wrapper';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader2, PackageOpen } from 'lucide-react';
import { useRef } from 'react';
import { Transaction } from '../../types/transaction.types';
import { TransactionCard } from '../common/transaction-card';
import { TransactionRow } from '../common/transaction-row';
import { TransactionCardSkeleton, TransactionSkeleton } from '../common/transaction-skeleton';

interface TransactionsTableProps {
	transactions: Transaction[];
	totalLoadedCount: number;
	isLoading: boolean;
	isError: boolean;
	isFetchingNextPage: boolean;
	hasNextPage: boolean;
	fetchNextPage: () => void;
}

const ROW_HEIGHT = 64;

const TABLE_HEADERS = [
	{ label: 'ID', className: 'w-16 shrink-0' },
	{ label: 'Name', className: 'flex-1' },
	{ label: 'Amount', className: 'w-32 shrink-0 text-right' },
	{ label: 'Category', className: 'w-28 shrink-0' },
	{ label: 'Status', className: 'w-24 shrink-0' },
	{ label: 'Date', className: 'w-32 shrink-0' },
];

const EndMessage = ({ label }: { label: string }) => (
	<div className="flex items-center justify-center border-t border-border py-4">
		<p className="text-xs text-muted-foreground">{label}</p>
	</div>
);

export function TransactionsTable({
	transactions,
	totalLoadedCount,
	isLoading,
	isError,
	isFetchingNextPage,
	hasNextPage,
	fetchNextPage,
}: TransactionsTableProps) {
	const isMobile = useIsMobile();
	const parentRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: transactions.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => ROW_HEIGHT,
		overscan: 6,
	});

	const virtualItems = virtualizer.getVirtualItems();

	if (isError) {
		return (
			<div className="flex items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 py-20 text-center">
				<p className="text-sm font-medium text-destructive">Failed to fetch data from the API</p>
			</div>
		);
	}

	/* ── Mobile card list ─────────────────────────────────────── */
	if (isMobile) {
		if (isLoading) {
			return <TransactionCardSkeleton cards={5} />;
		}

		return (
			<InfiniteScrollWrapper
				onNearEnd={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
				currentRecordsLength={totalLoadedCount}
				loadBefore={300}
			>
				{transactions.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border py-20 text-center">
						<PackageOpen className="size-10 text-muted-foreground/40" />
						<p className="text-sm text-muted-foreground">No transactions found</p>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{transactions.map((tx) => (
							<TransactionCard
								key={tx.id}
								transaction={tx}
							/>
						))}
					</div>
				)}

				{isFetchingNextPage && (
					<div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
						<Loader2 className="size-4 animate-spin" />
					</div>
				)}

				{!hasNextPage && !isFetchingNextPage && totalLoadedCount > 0 && (
					<div className="flex items-center justify-center py-4">
						<p className="text-xs text-muted-foreground">All transactions loaded</p>
					</div>
				)}
			</InfiniteScrollWrapper>
		);
	}

	/* ── Desktop virtualised table ────────────────────────────── */
	return (
		<div
			role="table"
			className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
		>
			<div
				role="row"
				className="flex items-center gap-4 border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
			>
				{TABLE_HEADERS.map((col) => (
					<span
						key={col.label}
						className={col.className}
					>
						{col.label}
					</span>
				))}
			</div>

			{isLoading && <TransactionSkeleton rows={10} />}

			{!isLoading && (
				<div
					ref={parentRef}
					className="overflow-auto"
					style={{ maxHeight: 640 }}
				>
					<InfiniteScrollWrapper
						onNearEnd={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
						currentRecordsLength={totalLoadedCount}
						loadBefore={300}
					>
						{transactions.length === 0 ? (
							<div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
								<PackageOpen className="size-10 text-muted-foreground/40" />
								<p className="text-sm text-muted-foreground">No transactions found</p>
							</div>
						) : (
							<div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
								{virtualItems.map((virtualRow) => {
									const tx = transactions[virtualRow.index];
									return (
										<TransactionRow
											key={tx.id}
											transaction={tx}
											isEven={virtualRow.index % 2 === 0}
											style={{
												position: 'absolute',
												top: virtualRow.start,
												left: 0,
												right: 0,
												height: ROW_HEIGHT,
											}}
										/>
									);
								})}
							</div>
						)}

						{isFetchingNextPage && (
							<div className="flex items-center justify-center gap-2 border-t border-border py-4 text-sm text-muted-foreground">
								<Loader2 className="size-4 animate-spin" />
							</div>
						)}

						{!hasNextPage && !isFetchingNextPage && totalLoadedCount > 0 && (
							<EndMessage label="All transactions loaded" />
						)}
					</InfiniteScrollWrapper>
				</div>
			)}
		</div>
	);
}
