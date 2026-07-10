import { apiClient } from "./api";

export interface MarketPricePoint {
  price: number;
  store: string;
  branch: string;
}

export interface MarketPriceItem {
  product_id: string;
  product_name: string;
  brand: string;
  subcategory: string;
  unit: string;
  branch_count: number;
  best: MarketPricePoint;
  worst: MarketPricePoint;
}

export interface MarketPriceItemList {
  category: string;
  stores: string[];
  total: number;
  skip: number;
  limit: number;
  items: MarketPriceItem[];
  fetched_at: string;
}

export interface MarketPriceBranchListing {
  product_id: string;
  product_name: string;
  brand: string;
  store: string;
  branch: string;
  emirate: string;
  price: number;
  unit: string;
  standardized_price: number;
  standardized_unit: string;
  subcategory: string;
}

export interface MarketPriceDetail {
  product_id: string;
  product_name: string;
  brand: string;
  subcategory: string;
  items: MarketPriceBranchListing[];
  fetched_at: string;
}

function qs(params: Record<string, string | number | null | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v != null && v !== "");
  return entries.length
    ? "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
    : "";
}

export const marketPricesService = {
  getItems(
    category: string,
    opts: { store?: string; search?: string; skip?: number; limit?: number } = {},
  ) {
    return apiClient.get<MarketPriceItemList>(
      `/market-prices/${category}${qs({
        store: opts.store,
        search: opts.search,
        skip: opts.skip,
        limit: opts.limit,
      })}`,
    );
  },

  getItemDetail(category: string, productId: string) {
    return apiClient.get<MarketPriceDetail>(`/market-prices/${category}/${productId}`);
  },
};
