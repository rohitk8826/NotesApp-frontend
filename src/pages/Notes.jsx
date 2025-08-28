// src/pages/Notes.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { AuthContext } from "../context/AuthContext";
import NoteCard from "../components/NoteCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "react-hot-toast";
import { Search, Plus } from "lucide-react";

// ✅ Helper: highlight matches
function Highlight({ text, query }) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-indigo-200 text-indigo-900 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function Notes() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [fetching, setFetching] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    setFetching(true);
    try {
      const res = await api.get("/notes");
      setNotes(res.data || []);
    } catch (err) {
      toast.error(err.message);
      setNotes([]);
    } finally {
      setFetching(false);
    }
  };

  const confirmDelete = (note) => {
    setNoteToDelete(note);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    try {
      await api.delete(`/notes/${noteToDelete._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteToDelete._id));
      toast.success("Note deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setNoteToDelete(null);
      setConfirmOpen(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full p-6 bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Header with Add button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-indigo-800">📝 My Notes</h1>
        <button
          onClick={() => navigate("/notes/new")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Add Note
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-8">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* Notes Grid */}
      <div>
        {fetching ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-indigo-400 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p className="mb-2">
              No notes yet. Click "Add Note" to create one!
            </p>
            <span className="text-4xl">📂</span>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                display={{
                  title: <Highlight text={note.title} query={search} />,
                  content: <Highlight text={note.content} query={search} />,
                }}
                onDelete={() => confirmDelete(note)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete "${
          noteToDelete?.title || "this note"
        }"?`}
      />
    </div>
  );
}
