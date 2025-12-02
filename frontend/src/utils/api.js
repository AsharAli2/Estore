import { API_URL } from "../../utils/constant";

export const buildProductsUrl = ({ page = 1, pagesize = 10, category, search, sort }) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('pagesize', pagesize);
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);
  return `${API_URL}/products?${params.toString()}`;
};

export const fetchProducts = async (opts) => {
  const url = buildProductsUrl(opts);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data;
};
