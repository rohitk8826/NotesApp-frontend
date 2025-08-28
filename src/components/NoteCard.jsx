// src/components/NoteCard.jsx
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

export default function NoteCard({ note, display, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/notes/${note._id}`);
  };

  return (
    <li className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition-all border border-indigo-100 hover:border-indigo-300">
      {/* Note content (clickable area) */}
      <div className="cursor-pointer" onClick={handleCardClick}>
        <h2 className="font-semibold text-lg text-indigo-800 truncate">
          {display?.title || note.title || "Untitled Note"}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2 md:line-clamp-4">
          {display?.content || note.content || "No content"}
        </p>
        <small className="text-gray-400 block mt-3 text-xs">
          {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
        </small>
      </div>

      {/* Divider */}
      <hr className="my-3 border-gray-200" />

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevent navigation
              onEdit(note);
            }}
            aria-label={`Edit note: ${
              typeof note.title === "string" ? note.title : "note"
            }`}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
          >
            <Pencil size={14} /> Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevent navigation
              onDelete(note);
            }}
            aria-label={`Delete note: ${
              typeof note.title === "string" ? note.title : "note"
            }`}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            <Trash2 size={14} /> Delete
          </button>
        )}
      </div>
    </li>
  );
}
