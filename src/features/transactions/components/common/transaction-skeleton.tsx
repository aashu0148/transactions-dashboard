import { cn } from '@/shared/utils/cn';

interface TransactionSkeletonProps {
	rows?: number;
}

function SkeletonPulse({ className }: { className?: string }) {
	return <div className={cn('animate-pulse rounded bg-muted', className)} />;
}

function SkeletonRow({ isEven }: { isEven: boolean }) {
	return (
		<div
			role="row"
			className={cn(
				'flex items-center gap-4 border-b border-border/50 px-4',
				isEven ? 'bg-background' : 'bg-muted/20',
				'h-16'
			)}
		>
			<SkeletonPulse className="h-3.5 w-8 shrink-0" />
			<div className="flex min-w-0 flex-1 items-center gap-2.5">
				<SkeletonPulse className="size-7 shrink-0 rounded-full" />
				<SkeletonPulse className="h-4 w-32" />
			</div>
			<SkeletonPulse className="h-4 w-20 shrink-0" />
			<SkeletonPulse className="h-4 w-16 shrink-0" />
			<SkeletonPulse className="h-5 w-14 shrink-0 rounded-full" />
			<SkeletonPulse className="h-4 w-24 shrink-0" />
		</div>
	);
}

function SkeletonCard() {
	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<SkeletonPulse className="size-8 shrink-0 rounded-full" />
					<SkeletonPulse className="h-4 w-32" />
				</div>
				<SkeletonPulse className="h-5 w-14 rounded-full" />
			</div>
			<div className="grid grid-cols-2 gap-x-4 gap-y-2">
				<div className="flex flex-col gap-1">
					<SkeletonPulse className="h-3 w-12" />
					<SkeletonPulse className="h-4 w-20" />
				</div>
				<div className="flex flex-col gap-1">
					<SkeletonPulse className="h-3 w-14" />
					<SkeletonPulse className="h-4 w-16" />
				</div>
				<div className="flex flex-col gap-1">
					<SkeletonPulse className="h-3 w-8" />
					<SkeletonPulse className="h-4 w-24" />
				</div>
				<div className="flex flex-col gap-1">
					<SkeletonPulse className="h-3 w-6" />
					<SkeletonPulse className="h-4 w-16" />
				</div>
			</div>
		</div>
	);
}

export function TransactionSkeleton({ rows = 10 }: TransactionSkeletonProps) {
	return (
		<>
			{Array.from({ length: rows }, (_, i) => (
				<SkeletonRow
					key={i}
					isEven={i % 2 === 0}
				/>
			))}
		</>
	);
}

export function TransactionCardSkeleton({ cards = 5 }: { cards?: number }) {
	return (
		<div className="flex flex-col gap-3">
			{Array.from({ length: cards }, (_, i) => (
				<SkeletonCard key={i} />
			))}
		</div>
	);
}
