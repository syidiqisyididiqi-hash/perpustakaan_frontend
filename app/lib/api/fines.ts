import { apiFetch } from "./client";

export const FinesAPI = {
  getAll: () =>
    apiFetch("/fines"),

  getById: (id: number) =>
    apiFetch(`/fines/${id}`),

  create: (data: {
    loan_id: number;
    overdue_days: number;
    status: string;
  }) =>
    apiFetch("/fines", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: {
      overdue_days?: number;
      status?: string;
    }
  ) =>
    apiFetch(`/fines/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch(`/fines/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }),
};

export const finesApi = FinesAPI;
export default FinesAPI;