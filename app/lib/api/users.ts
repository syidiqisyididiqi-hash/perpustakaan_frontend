import { apiFetch } from "./client";

export const UsersAPI = {
  getAll: (page = 1, search = "") =>
    apiFetch(`/users?page=${page}&search=${search}`),

  getById: (id: number) => apiFetch(`/users/${id}`),

  create: (data: any) =>
    apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch(`/users/${id}`, {
      method: "DELETE",
    }),
};

export const usersApi = UsersAPI;

export default UsersAPI;