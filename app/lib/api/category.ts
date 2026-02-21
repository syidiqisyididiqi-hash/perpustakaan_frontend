import { apiFetch } from "./client";

export const CategoriesAPI = {
  getAll: (page = 1, search = "") =>
    apiFetch(`/categories?page=${page}&search=${search}`),

  getById: (id: number) =>
    apiFetch(`/categories/${id}`),

  create: (data: any) =>
    apiFetch("/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    apiFetch(`/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch(`/categories/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }),
};

export const categoriesApi = CategoriesAPI;
export default CategoriesAPI;