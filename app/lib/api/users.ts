import { apiFetch } from "./client";

export const UsersAPI = {
  login: (email: string, password: string) =>
    apiFetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    }),

  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) =>
    apiFetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation,
      }),
    }),

  getAll: (page = 1, search = "") =>
    apiFetch(`/users?page=${page}&search=${search}`),

  getById: (id: number) =>
    apiFetch(`/users/${id}`),

  create: (data: any) =>
    apiFetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    apiFetch(`/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch(`/users/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }),
};

export const usersApi = UsersAPI;
export default UsersAPI;