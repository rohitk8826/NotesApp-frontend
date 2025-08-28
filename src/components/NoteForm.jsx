// src/components/NoteForm.jsx
import { useState, useEffect } from "react";

export default function NoteForm({ onSubmit, initialData, loading, onCancel }) {
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (initialData) {
      setForm({ title: initialData.title, content: initialData.content });
    } else {
      setForm({ title: "", content: "" });
    }
  }, [initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = form.title.trim();
    const trimmedContent = form.content.trim();
    if (!loading && trimmedTitle && trimmedContent) {
      onSubmit({ title: trimmedTitle, content: trimmedContent });

      // Reset form only when adding a new note
      if (!initialData) {
        setForm({ title: "", content: "" });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 border border-indigo-100"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {initialData ? "Edit Note ✏️" : "Add a New Note 📝"}
      </h2>

      <label className="sr-only" htmlFor="title">
        Title
      </label>
      <input
        id="title"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="p-3 border rounded-lg w-full mb-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        required
      />

      <label className="sr-only" htmlFor="content">
        Content
      </label>
      <textarea
        id="content"
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Content"
        rows="5"
        className="p-3 border rounded-lg w-full mb-4 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        required
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 rounded-lg font-semibold text-white bg-indigo-600 transition flex items-center justify-center ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : initialData ? (
            "Update Note"
          ) : (
            "Add Note"
          )}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
