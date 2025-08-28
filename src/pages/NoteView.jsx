// src/pages/NoteView.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { AuthContext } from "../context/AuthContext";
import NoteForm from "../components/NoteForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "react-hot-toast";

export default function NoteView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (user) fetchNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const fetchNote = async () => {
    setFetching(true);
    try {
      const res = await api.get(`/notes/${id}`);
      setNote(res.data || null);
    } catch (err) {
      toast.error(err.message || "Failed to fetch note");
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (form) => {
    setLoading(true);
    try {
      await api.put(`/notes/${id}`, form);
      toast.success("Note updated");
      navigate("/notes"); // ✅ return to list
    } catch (err) {
      toast.error(err.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/notes");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setConfirmOpen(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-yellow-400 border-dashed rounded-full animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center text-gray-600">
        Note not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {note.title || "Untitled"}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing((s) => !s)}
            className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
          >
            {editing ? "Close" : "Edit"}
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Content or Edit form */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 mb-6">
        {!editing ? (
          <>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
            <small className="text-gray-400 block mt-4">
              Created:{" "}
              {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
            </small>
          </>
        ) : (
          <NoteForm
            initialData={note}
            onSubmit={handleUpdate}
            loading={loading}
            onCancel={() => setEditing(false)}
          />
        )}
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        message={`Delete "${note.title || "this note"}"?`}
      />
    </div>
  );
}
