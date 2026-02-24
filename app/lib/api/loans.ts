import { apiFetch } from "./client";

export const LoansAPI = {
  getAll: () =>
    apiFetch("/loans"),

  getById: (id: number) =>
    apiFetch(`/loans/${id}`),

  create: (data: { user_id: number; loan_date: string; due_date: string; return_date?: string }) =>
    apiFetch("/loans", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  update: (id: number, data: { loan_date?: string; due_date?: string; return_date?: string }) =>
    apiFetch(`/loans/${id}`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch(`/loans/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }),
};

export const loansApi = LoansAPI;
export default LoansAPI;