// service/companyService.js
import { api } from "./api";

// Lấy danh sách công ty
export async function getCompanies(params) {
  const res = await api.get("/companies", { params });
  const data = res.data || {};

  // tuỳ backend: có thể trả về { items }, { data }, hoặc mảng
  return Array.isArray(data)
    ? data
    : data.items || data.data || data.results || [];
}

// Lấy chi tiết 1 công ty
export async function getCompanyDetail(id) {
  if (!id) throw new Error("Missing company id");
  const res = await api.get(`/companies/${id}`);
  const data = res.data || {};
  return data.data || data.item || data;
}
