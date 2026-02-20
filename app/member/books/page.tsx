"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function MemberBooksPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const books = [
    {
      id: 1,
      title: "Clean Code",
      author: "Robert C. Martin",
      stock: 5,
      image: "https://images-na.ssl-images-amazon.com/images/I/41SH-SvWPxL._SX374_BO1,204,203,200_.jpg",
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      stock: 2,
      image: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
    },
    {
      id: 3,
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      stock: 4,
      image: "https://images-na.ssl-images-amazon.com/images/I/51A5cHQhSqL._SX380_BO1,204,203,200_.jpg",
    },
    {
      id: 4,
      title: "Deep Work",
      author: "Cal Newport",
      stock: 3,
      image: "https://images-na.ssl-images-amazon.com/images/I/41-6i2sY+QL._SX331_BO1,204,203,200_.jpg",
    },
    {
      id: 5,
      title: "Design Patterns",
      author: "Erich Gamma",
      stock: 1,
      image: "https://images-na.ssl-images-amazon.com/images/I/81gtKoapHFL.jpg",
    },
    {
      id: 6,
      title: "Refactoring",
      author: "Martin Fowler",
      stock: 6,
      image: "https://images-na.ssl-images-amazon.com/images/I/51k+7wXvZLL._SX396_BO1,204,203,200_.jpg",
    },
    {
      id: 7,
      title: "You Don't Know JS",
      author: "Kyle Simpson",
      stock: 5,
      image: "https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg",
    },
    {
      id: 8,
      title: "Code Complete",
      author: "Steve McConnell",
      stock: 2,
      image: "https://images-na.ssl-images-amazon.com/images/I/51W0IH0rjSL._SX404_BO1,204,203,200_.jpg",
    },
  ];

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const perPage = 6;
  const totalPages = Math.ceil(filtered.length / perPage);

  const start = (page - 1) * perPage;
  const currentBooks = filtered.slice(start, start + perPage);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Library Books</h1>
        <p className="opacity-90 mt-1">
          Browse and borrow available books
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
        <FiSearch className="text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full outline-none"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {currentBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            <img
              src={book.image}
              alt={book.title}
              className="h-56 w-full object-cover"
            />

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-gray-500 text-sm mb-2">
                {book.author}
              </p>

              <p className="text-sm text-gray-600 mb-4">
                Stock:{" "}
                <span className="font-semibold">{book.stock}</span>
              </p>

              <button
                className={`mt-auto w-full py-2 rounded-lg font-semibold transition ${
                  book.stock > 0
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={book.stock === 0}
              >
                {book.stock > 0 ? "Borrow Book" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 pt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded ${
              page === i + 1
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
