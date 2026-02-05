"use client";

import { useState } from "react";
import { Task, Category, CATEGORY_COLORS } from "@/types";

export function TaskEditor({ initialTasks }: { initialTasks: Task[] }) {
  const [taskList, setTaskList] = useState(initialTasks);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [message, setMessage] = useState("");

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setMessage("");
  }

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch("/api/admin/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, title: editTitle, description: editDesc }),
    });
    if (res.ok) {
      const data = await res.json();
      setTaskList((prev) =>
        prev.map((t) => (t.id === editingId ? data.task : t))
      );
      setEditingId(null);
      setMessage("Task updated!");
    }
  }

  return (
    <div>
      {message && <p className="text-sm text-emerald-600 mb-3">{message}</p>}
      <div className="space-y-2">
        {taskList.map((task) => {
          const colors = CATEGORY_COLORS[task.category as Category];
          const isEditing = editingId === task.id;

          return (
            <div key={task.id} className="bg-white border border-slate-200 rounded-lg p-3">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="text-xs px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs px-3 py-1 border border-slate-300 rounded hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-slate-900">{task.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full text-white ${colors.badge}`}>
                        {task.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                  </div>
                  <button
                    onClick={() => startEdit(task)}
                    className="text-xs px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 shrink-0 ml-2"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
