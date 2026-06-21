import { Bell, LogOut, UserRound } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "./Button.jsx";
import { useAuthStore } from "../store/authStore.js";
import { cx } from "../utils/format.js";
import { notificationApi } from "../api/queries.js";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/internships", label: "Internships" },
  { to: "/tracker", label: "Tracker" },
  { to: "/analytics", label: "Analytics" }
];

export function AppShell() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notifications = useQuery({ queryKey: ["notifications"], queryFn: notificationApi.list });
  const markRead = useMutation({ mutationFn: notificationApi.markRead, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }) });
  const items = notifications.data?.notifications || [];
  const unread = items.filter((item) => !item.read).length;
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-moss">CareerPilot AI</p>
            <h1 className="text-xl font-black">Agentic Internship CRM</h1>
          </div>
          <div className="flex items-center gap-3">
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-bold">
                <Bell size={16} />{unread ? <span className="rounded bg-coral px-1.5 py-0.5 text-xs text-white">{unread}</span> : null}
              </summary>
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-ink/10 bg-white p-3 shadow-soft">
                {items.length === 0 ? <p className="text-sm text-ink/60">No notifications yet.</p> : items.slice(0, 6).map((item) => (
                  <button key={item._id} onClick={() => !item.read && markRead.mutate(item._id)} className="block w-full rounded-md p-2 text-left hover:bg-ink/5">
                    <p className="text-sm font-black">{item.title}</p>
                    <p className="text-xs text-ink/65">{item.message}</p>
                  </button>
                ))}
              </div>
            </details>
            <div className="hidden items-center gap-2 text-sm font-semibold sm:flex"><UserRound size={18} />{user?.name}</div>
            <Button variant="secondary" onClick={() => { logout(); navigate("/login"); }}><LogOut size={16} />Logout</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <nav className="card flex gap-2 p-3 lg:block lg:space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end className={({ isActive }) => cx("block rounded-md px-3 py-2 text-sm font-bold", isActive ? "bg-ink text-white" : "hover:bg-ink/5")}>{item.label}</NavLink>
          ))}
        </nav>
        <main><Outlet /></main>
      </div>
    </div>
  );
}
