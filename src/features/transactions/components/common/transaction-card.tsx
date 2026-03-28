import { cn } from '@/shared/utils/cn';
import { Transaction } from '../../types/transaction.types';
import { capitalise, formatCurrency, formatDate, mapStatus } from '../../utils/transaction.utils';
import { StatusBadge } from './status-badge';

interface TransactionCardProps {
	transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
	const status = mapStatus(transaction.status);

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
			<div className="flex items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2.5">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={transaction.avatar}
						alt={transaction.name}
						width={32}
						height={32}
						className="size-8 shrink-0 rounded-full object-cover"
					/>
					<span className="truncate text-sm font-medium">{transaction.name}</span>
				</div>
				<StatusBadge status={status} />
			</div>

			<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
				<div className="flex flex-col gap-0.5">
					<p className="text-xs text-muted-foreground">Amount</p>
					<p className={cn('font-medium tabular-nums', transaction.status ? 'text-emerald-600' : '')}>
						{formatCurrency(transaction.amount, transaction.currency)}
					</p>
				</div>
				<div className="flex flex-col gap-0.5">
					<p className="text-xs text-muted-foreground">Category</p>
					<p>{capitalise(transaction.category)}</p>
				</div>
				<div className="flex flex-col gap-0.5">
					<p className="text-xs text-muted-foreground">Date</p>
					<p className="text-muted-foreground">{formatDate(transaction.createdAt)}</p>
				</div>
				<div className="flex flex-col gap-0.5">
					<p className="text-xs text-muted-foreground">ID</p>
					<p className="font-mono text-xs text-muted-foreground">#{transaction.id}</p>
				</div>
			</div>
		</div>
	);
}
