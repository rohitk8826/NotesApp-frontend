// src/pages/AddNote.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import NoteForm from "../components/NoteForm";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function AddNote() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      await api.post("/notes", form); // interceptor unwraps data if backend returns {success,data}
      toast.success("Note added successfully!");
      navigate("/notes");
    } catch (err) {
      toast.error(err.message || "Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">➕ Add Note</h1>
      </div>

      {/* Note form card */}
      <div className="mb-6 bg-white shadow-lg rounded-xl p-6 border border-indigo-100">
        <NoteForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
