'use client';

import SimpleDropdown, { DropdownOption } from '@/shared/components/simple-dropdown';
import { cn } from '@/shared/utils/cn';
import { Check, Search, SlidersHorizontal, X } from 'lucide-react';
import { ChangeEvent } from 'react';
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from '../../constants/transactions.constants';
import { TransactionFilters, TransactionStatus } from '../../types/transaction.types';

interface FilterBarProps {
	filters: TransactionFilters;
	rawSearch: string;
	onSearchChange: (value: string) => void;
	onFiltersChange: (patch: Partial<TransactionFilters>) => void;
	onReset: () => void;
}

const inputClass =
	'h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring';

const CheckIcon = () => <Check className="size-3.5" />;
const EmptyIcon = () => <span className="inline-block size-3.5" />;

export function FilterBar({
	filters,
	rawSearch,
	onSearchChange,
	onFiltersChange,
	onReset,
}: FilterBarProps) {
	const hasActiveFilters =
		rawSearch ||
		filters.statuses.length > 0 ||
		filters.category ||
		filters.dateFrom ||
		filters.dateTo;

	const activeFilterCount =
		(filters.category ? 1 : 0) + filters.statuses.length;

	function toggleStatus(status: TransactionStatus) {
		const next = filters.statuses.includes(status)
			? filters.statuses.filter((s) => s !== status)
			: [...filters.statuses, status];
		onFiltersChange({ statuses: next });
	}

	const dropdownOptions: DropdownOption[] = [
		{
			label: 'Category',
			value: '__category',
			subOptions: CATEGORY_OPTIONS.map((opt) => ({
				label: opt.label,
				value: opt.value || '__all',
				icon: filters.category === opt.value ? <CheckIcon /> : <EmptyIcon />,
				onClick: () => onFiltersChange({ category: opt.value }),
			})),
		},
		{
			label: 'Status',
			value: '__status',
			subOptions: STATUS_OPTIONS.map((opt) => ({
				label: opt.label,
				value: opt.value,
				icon: filters.statuses.includes(opt.value) ? <CheckIcon /> : <EmptyIcon />,
				onClick: () => toggleStatus(opt.value),
			})),
		},
	];

	return (
		<div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
			{/* Search */}
			<div className="relative w-full min-w-0 sm:min-w-48 sm:flex-1">
				<Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search by name or ID…"
					value={rawSearch}
					onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
					className={cn(inputClass, 'w-full pl-8 pr-3')}
				/>
			</div>

		{/* Date range */}
		<div className="flex w-full items-center gap-2 sm:w-auto">
			<label className="relative min-w-0 flex-1 sm:flex-none">
				<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">
					From
				</span>
				<input
					type="date"
					value={filters.dateFrom ?? ''}
					max={filters.dateTo ?? undefined}
					onChange={(e) => onFiltersChange({ dateFrom: e.target.value || null })}
					className={cn(inputClass, 'w-full pl-12 pr-2', !filters.dateFrom && '[&:not(:focus)]:text-transparent')}
				/>
			</label>
			<span className="shrink-0 text-xs text-muted-foreground">–</span>
			<label className="relative min-w-0 flex-1 sm:flex-none">
				<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">
					To
				</span>
				<input
					type="date"
					value={filters.dateTo ?? ''}
					min={filters.dateFrom ?? undefined}
					onChange={(e) => onFiltersChange({ dateTo: e.target.value || null })}
					className={cn(inputClass, 'w-full pl-8 pr-2', !filters.dateTo && '[&:not(:focus)]:text-transparent')}
				/>
			</label>
		</div>

			{/* Filters dropdown + Reset */}
			<div className="flex items-center gap-2">
				<SimpleDropdown
					options={dropdownOptions}
					dropdownAlign="end"
				>
					<button
						className={cn(
							'flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors',
							activeFilterCount > 0
								? 'border-primary bg-primary/10 text-primary'
								: 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
						)}
					>
						<SlidersHorizontal className="size-3.5 shrink-0" />
						<span>Filters</span>
						{activeFilterCount > 0 && (
							<span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
								{activeFilterCount}
							</span>
						)}
					</button>
				</SimpleDropdown>

				{hasActiveFilters && (
					<button
						onClick={onReset}
						className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					>
						<X className="size-3" />
						<span>Reset</span>
					</button>
				)}
			</div>
		</div>
	);
}
