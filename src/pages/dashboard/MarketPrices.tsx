import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Droplet,
  AlertTriangle,
  Store,
  ArrowRight,
  Check,
  Wheat,
  Milk,
  Bean,
  Candy,
  Egg,
  Sandwich,
  Drumstick,
  Package,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { paletteColor } from "@/components/dashboard/shared";
import { marketPricesService, type MarketPriceItem } from "@/services/marketPricesService";

const CATEGORIES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "cooking-oil", label: "Cooking Oil", icon: Droplet },
  { id: "wheat", label: "Wheat", icon: Wheat },
  { id: "rice", label: "Rice", icon: Package },
  { id: "dairy", label: "Dairy", icon: Milk },
  { id: "legumes", label: "Legumes", icon: Bean },
  { id: "sugar", label: "Sugar", icon: Candy },
  { id: "eggs", label: "Eggs", icon: Egg },
  { id: "bread", label: "Bread", icon: Sandwich },
  { id: "chicken", label: "Chicken", icon: Drumstick },
];
const PAGE_SIZE = 25;

function fmtAed(value: number): string {
  return `AED ${value.toFixed(2)}`;
}

function CategorySwitcher({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter by category"
      className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1"
    >
      {CATEGORIES.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={cn(
              "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[12px] font-semibold",
              "transition-all duration-200 ease-out",
              isActive
                ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_12px_var(--color-primary-soft)]"
                : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function StoreSwitcher({
  stores,
  active,
  onChange,
}: {
  stores: string[];
  active: string;
  onChange: (store: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter by store"
      className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1"
    >
      <button
        role="tab"
        aria-selected={active === "all"}
        onClick={() => onChange("all")}
        className={cn(
          "flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12px] font-semibold",
          "transition-all duration-200 ease-out",
          active === "all"
            ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_12px_var(--color-primary-soft)]"
            : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground",
        )}
      >
        <Store className="h-3.5 w-3.5" />
        All Stores
      </button>

      {stores.map((store, idx) => {
        const isActive = active === store;
        const color = paletteColor(idx);
        return (
          <button
            key={store}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(store)}
            style={{ "--store-color": color } as React.CSSProperties}
            className={cn(
              "flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12px] font-semibold",
              "transition-all duration-200 ease-out",
              isActive
                ? "text-foreground border-[color-mix(in_oklch,var(--store-color)_60%,transparent)] bg-[color-mix(in_oklch,var(--store-color)_14%,transparent)]"
                : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-[color-mix(in_oklch,var(--store-color)_45%,var(--color-border))]",
            )}
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            {store}
          </button>
        );
      })}
    </div>
  );
}

function ItemRow({ item, onCompare }: { item: MarketPriceItem; onCompare: () => void }) {
  const hasSpread = item.worst.price > item.best.price;
  return (
    <tr onClick={onCompare} className="cursor-pointer hover:bg-secondary/30 transition-colors">
      <td className="px-4 py-2.5">
        <p className="font-semibold text-foreground">{item.product_name}</p>
        <p className="text-[10px] text-muted-foreground">{item.brand || "—"}</p>
      </td>
      <td className="px-4 py-2.5">
        <Badge
          variant="outline"
          className="rounded-full border-border/60 bg-muted/60 text-[10px] font-semibold text-foreground"
        >
          {item.subcategory}
        </Badge>
      </td>
      <td className="px-4 py-2.5">
        <p className="font-bold tabular-nums text-success">
          {fmtAed(item.best.price)}
          <span className="ml-1 text-[10px] font-normal text-muted-foreground">/{item.unit}</span>
        </p>
        <p className="text-[10px] text-muted-foreground">at {item.best.store}</p>
      </td>
      <td className="px-4 py-2.5">
        {hasSpread ? (
          <>
            <p className="font-bold tabular-nums text-destructive">
              {fmtAed(item.worst.price)}
              <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                /{item.unit}
              </span>
            </p>
            <p className="text-[10px] text-muted-foreground">at {item.worst.store}</p>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground">Same everywhere</span>
        )}
      </td>
      <td className="px-4 py-2.5 text-center">
        <Badge
          variant="outline"
          className="rounded-full border-primary/30 bg-primary/10 text-[10px] font-bold text-primary"
        >
          {item.branch_count} branches
        </Badge>
      </td>
      <td className="px-4 py-2.5 text-right">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
          Compare <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </td>
    </tr>
  );
}

function CompareDialog({
  category,
  productId,
  onClose,
}: {
  category: string;
  productId: string | null;
  onClose: () => void;
}) {
  const detailQuery = useQuery({
    queryKey: ["market-prices", category, "detail", productId],
    queryFn: () => marketPricesService.getItemDetail(category, productId as string),
    enabled: !!productId,
    staleTime: 15 * 60_000,
  });

  const detail = detailQuery.data;
  const cheapestPrice = detail?.items[0]?.standardized_price;

  return (
    <Dialog open={!!productId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-border bg-card shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-extrabold text-foreground">
            {detail?.product_name ?? "Loading..."}
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground">
            {detail
              ? `${detail.brand} · ${detail.subcategory} · every branch that carries this item, cheapest first`
              : "Fetching branch comparison..."}
          </DialogDescription>
        </DialogHeader>

        {detailQuery.isLoading ? (
          <div className="space-y-2 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-lg bg-secondary" />
            ))}
          </div>
        ) : !detail?.items.length ? (
          <EmptyState icon={Droplet} title="No branch data" />
        ) : (
          <div className="mt-2 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-[11.5px]">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  {["STORE", "BRANCH", "EMIRATE", "PRICE", "PER UNIT"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {detail.items.map((row, idx) => {
                  const isCheapest = row.standardized_price === cheapestPrice;
                  return (
                    <tr
                      key={`${row.store}-${row.branch}-${idx}`}
                      className={isCheapest ? "bg-success-soft/20" : undefined}
                    >
                      <td className="px-3 py-2 font-semibold text-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          {isCheapest && <Check className="h-3.5 w-3.5 text-success" />}
                          {row.store}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{row.branch || "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.emirate}</td>
                      <td className="px-3 py-2 font-semibold tabular-nums text-foreground">
                        {fmtAed(row.price)}
                        <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                          /{row.unit.trim()}
                        </span>
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2 font-bold tabular-nums",
                          isCheapest ? "text-success" : "text-foreground",
                        )}
                      >
                        {fmtAed(row.standardized_price)}
                        <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                          /{row.standardized_unit}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MarketPrices() {
  const [category, setCategory] = useState("cooking-oil");
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [store, setStore] = useState("all");
  const [compareId, setCompareId] = useState<string | null>(null);

  const categoryLabel = CATEGORIES.find((c) => c.id === category)?.label ?? category;

  // Debounce so every keystroke doesn't fire a request and flash the table
  // to a loading skeleton mid-type.
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const query = useQuery({
    queryKey: ["market-prices", category, store, search, page],
    queryFn: () =>
      marketPricesService.getItems(category, {
        store: store === "all" ? undefined : store,
        search: search || undefined,
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    staleTime: 15 * 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const data = query.data;
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const cheapest = data?.items[0]?.best;

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">Market Prices</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Every {categoryLabel.toLowerCase()} item on the UAE Ministry of Economy's platform —
            pick one to compare its price across every branch that stocks it
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={query.isFetching}
          onClick={() => query.refetch()}
          className="h-9 gap-1.5 text-[12px]"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${query.isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <CategorySwitcher
        active={category}
        onChange={(c) => {
          setCategory(c);
          setStore("all");
          setSearchInput("");
          setSearch("");
          setPage(0);
        }}
      />

      {data?.stores.length ? (
        <StoreSwitcher
          stores={data.stores}
          active={store}
          onChange={(s) => {
            setStore(s);
            setPage(0);
          }}
        />
      ) : null}

      {query.isError ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <div className="p-6 flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="text-[12px] font-bold text-destructive">Could not load market prices</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                The government price platform may be unavailable. Try refreshing.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border border-border/60 bg-card shadow-sm overflow-hidden">
          <CardHeader className="px-5 pb-3 pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-[14px] font-bold text-foreground">
                  {data
                    ? `${data.total.toLocaleString()} items${store !== "all" ? ` at ${store}` : ""}`
                    : "Items"}
                </CardTitle>
                {cheapest != null && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Cheapest:{" "}
                    <span className="font-semibold text-success">
                      {fmtAed(cheapest.price)}/{data?.items[0]?.unit}
                    </span>
                  </p>
                )}
              </div>
              <div className="relative min-w-[220px]">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search product or brand..."
                  className="h-8 w-full rounded-lg border border-border/60 bg-background pl-9 pr-3 text-[11px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition"
                />
              </div>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-[11.5px]">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  {["ITEM", "SUBCATEGORY", "BEST PRICE", "HIGHEST PRICE", "BRANCHES", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {query.isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-4 py-2.5">
                        <div className="h-4 w-full animate-pulse rounded bg-secondary" />
                      </td>
                    </tr>
                  ))
                ) : !data?.items.length ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon={Droplet}
                        title="No items found"
                        description={
                          search || store !== "all"
                            ? "Try a different search term or store."
                            : `${categoryLabel} prices will appear here once the platform returns data.`
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  data.items.map((item) => (
                    <ItemRow
                      key={item.product_id}
                      item={item}
                      onCompare={() => setCompareId(item.product_id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/40 px-4 py-2.5">
              <p className="text-[11px] text-muted-foreground tabular-nums">
                Page {page + 1} of {totalPages} &middot; {data?.total} items
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {data && (
        <p className="text-[10px] text-muted-foreground">
          Source: UAE Ministry of Economy — Essential Goods Prices Platform. Fetched{" "}
          {new Date(data.fetched_at).toLocaleString()}.
        </p>
      )}

      <CompareDialog category={category} productId={compareId} onClose={() => setCompareId(null)} />
    </div>
  );
}

export default MarketPrices;
