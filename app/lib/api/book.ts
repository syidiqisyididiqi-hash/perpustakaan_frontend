import { apiFetch } from "./client";

export const BooksAPI = {
  getAll: () =>
    apiFetch("/books"),

  getById: (id: number) =>
    apiFetch(`/books/${id}`),

  create: (data: FormData) =>
    apiFetch("/books", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: data,
    }),

  update: (id: number, data: FormData) => {
    data.append("_method", "PUT");

    return apiFetch(`/books/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: data,
    });
  },

  delete: (id: number) =>
    apiFetch(`/books/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }),
};

export const booksApi = BooksAPI;
export default BooksAPI;