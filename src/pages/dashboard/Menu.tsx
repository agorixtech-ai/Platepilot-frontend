import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpenText, RefreshCw, Search, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemAvatar } from "@/components/dashboard/ItemAvatar";
import { fmtCurrency } from "@/components/dashboard/shared";
import { dashboardService } from "@/services/dashboardService";

/** View-only menu: every item the restaurant sells and its selling price. */
function MenuPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["dashboard", "menu-engineering"],
    queryFn: () => dashboardService.getMenuEngineering(),
  });

  const all = data?.items ?? [];
  const items = useMemo(() => {
    const q = search.toLowerCase();
    return (data?.items ?? [])
      .filter((i) => !q || i.dish.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      .sort((a, b) => a.category.localeCompare(b.category) || a.dish.localeCompare(b.dish));
  }, [data, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-[20px] font-bold tracking-tight text-foreground">
            <BookOpenText className="h-5 w-5 text-primary" />
            Menu
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            What you sell to customers — {all.length || "…"} items · selling prices in AED
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-[11px]"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
        </Button>
      </div>

      <Card className="border border-border/60 bg-card shadow-sm">
        <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-[13px] font-bold text-foreground">Menu items</CardTitle>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu…"
                className="h-8 w-44 pl-8 text-[11.5px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-2 pt-0">
          {isLoading ? (
            <div className="space-y-2 px-5 py-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-11 animate-pulse rounded bg-secondary" />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              icon={TriangleAlert}
              title="Couldn't load the menu"
              description="Check that the backend is running, then retry"
              action={{ label: "Retry", onClick: () => refetch() }}
            />
          ) : !items.length ? (
            <EmptyState
              icon={BookOpenText}
              title={all.length ? "No items match your search" : "No menu items yet"}
              description={
                all.length
                  ? "Try a different search term"
                  : "Menu items will appear here once recipes are added"
              }
            />
          ) : (
            <div className="divide-y divide-border/30">
              {items.map((item, idx) => {
                const newCategory = idx === 0 || items[idx - 1].category !== item.category;
                return (
                  <div key={item.id}>
                    {newCategory && (
                      <p className="bg-muted/40 px-5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {item.category || "Uncategorised"}
                      </p>
                    )}
                    <div className="flex items-center gap-3 px-5 py-2.5">
                      <ItemAvatar name={item.dish} size="sm" variant="photo" />
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-foreground">
                        {item.dish}
                      </span>
                      <span className="shrink-0 text-[13px] font-black tabular-nums text-foreground">
                        {fmtCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MenuPage;
