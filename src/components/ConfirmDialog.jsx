// src/components/ConfirmDialog.jsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog({ open, onClose, onConfirm, message }) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleConfirm = async () => {
    try {
      await onConfirm?.();
    } catch (err) {
      console.error("Error during confirm:", err);
    } finally {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full border border-indigo-100"
          >
            <p className="text-lg mb-6 text-gray-800 font-medium">
              {message || "Are you sure?"}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
