import { cn } from '@/shared/utils/cn';
import { Transaction } from '../../types/transaction.types';
import {
	capitalise,
	formatCurrency,
	formatDate,
	mapStatus,
} from '../../utils/transaction.utils';
import { StatusBadge } from './status-badge';

interface TransactionRowProps {
	transaction: Transaction;
	style: React.CSSProperties;
	isEven: boolean;
}

const COL = {
	id: 'w-16 shrink-0 font-mono text-xs text-muted-foreground',
	name: 'min-w-0 flex-1 flex items-center gap-2.5',
	amount: 'w-32 shrink-0 text-right font-medium tabular-nums',
	category: 'w-28 shrink-0',
	status: 'w-24 shrink-0',
	date: 'w-32 shrink-0 text-sm text-muted-foreground',
};

export function TransactionRow({ transaction, style, isEven }: TransactionRowProps) {
	const status = mapStatus(transaction.status);

	return (
		<div
			style={style}
			role="row"
			className={cn(
				'flex items-center gap-4 border-b border-border/50 px-4 text-sm transition-colors hover:bg-muted/40',
				isEven ? 'bg-background' : 'bg-muted/20'
			)}
		>
			<span className={COL.id}>#{transaction.id}</span>

			<span className={COL.name}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={transaction.avatar}
					alt={transaction.name}
					width={28}
					height={28}
					className="size-7 shrink-0 rounded-full object-cover"
				/>
				<span className="truncate font-medium">{transaction.name}</span>
			</span>

			<span className={cn(COL.amount, transaction.status ? 'text-emerald-600' : '')}>
				{formatCurrency(transaction.amount, transaction.currency)}
			</span>

			<span className={COL.category}>{capitalise(transaction.category)}</span>

			<span className={COL.status}>
				<StatusBadge status={status} />
			</span>

			<span className={COL.date}>{formatDate(transaction.createdAt)}</span>
		</div>
	);
}
