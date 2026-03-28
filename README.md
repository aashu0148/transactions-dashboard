# Barter — Transaction Insights Dashboard

A performant dashboard for browsing, filtering, and aggregating financial transactions. Built with Next.js 16, React 19, and TanStack Query.

---

## Setup

**Requirements:** Node.js 18+, npm / pnpm / yarn

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Live demo:** [transactions-dashbaord.netlify.app](https://transactions-dashbaord.netlify.app)

---

## Architecture

### Directory structure

```
src/
├── app/                     # Next.js app router (layout, page)
├── features/
│   └── transactions/
│       ├── components/
│       │   ├── entry/       # TransactionsDashboard — top-level composition root
│       │   ├── views/       # Stateless layout components (table, filter bar, insights panel)
│       │   └── common/      # Reusable primitives (row, skeleton, badge, card)
│       ├── hooks/           # useTransactions, useTransactionInsights
│       ├── services/        # Fetch layer (fetchTransactionsPage)
│       ├── utils/           # Pure functions (format, filter, derive)
│       ├── types/           # Shared TypeScript interfaces
│       └── constants/       # PAGE_SIZE, filter options, default state
└── shared/
    ├── components/          # InfiniteScrollWrapper, shadcn UI primitives
    ├── hooks/               # useDebounce
    └── utils/               # cn (class merge helper)
```

### Data flow

```
API (paginated)
  └─▶ useInfiniteQuery         — fetches pages, caches with TanStack Query
        └─▶ allTransactions    — useMemo over pages.flat()
              └─▶ filteredTransactions  — useMemo: search + status + category + date range
                    ├─▶ InsightsPanel   — derived aggregations (count, amount, rate, top category)
                    └─▶ TransactionsTable — virtualised list + infinite scroll trigger
```

### Key decisions

**Client-side filtering**  
All filtering (search, status, category, date range) runs on already-loaded data rather than as API query parameters. MockAPI's filtering support is limited to exact field matches, which rules out date ranges and OR-based status queries. Client-side filtering also means the insights panel always reflects the current filter state without extra fetches.

**Virtual list (`@tanstack/react-virtual`)**  
Only the rows visible in the 640 px scrollable window are rendered to the DOM. This keeps DOM node count constant regardless of how many pages have loaded.

**Infinite scroll (`IntersectionObserver` + scroll fallback)**  
A sentinel element at the bottom of the list is observed. When it enters the viewport (with a 300 px early margin), the next page is fetched. A scroll-event fallback handles edge cases where the observer fires late (e.g. content shorter than the container after filtering).


---

## Trade-offs

| Decision | Benefit | Cost |
|---|---|---|
| Client-side filtering | Date range + multi-status work without API changes; insights stay in sync | All pages must be loaded before all matching rows are visible |
| Virtual list | Constant DOM size; smooth scrolling with thousands of rows | Absolute positioning means total list height must be estimated upfront |
| No debounce on search | Instant feedback — results update as you type | Re-runs the filter memo on every keystroke (negligible for typical dataset sizes) |
| `retry: false` on the query | Surfaces API errors immediately | A transient network failure requires a manual page reload |
