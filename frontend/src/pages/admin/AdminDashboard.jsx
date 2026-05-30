import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Inbox, CalendarCheck, Users, FileText, Sparkles, MessageSquare, MoreVertical, Trash2, ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import SEO from "../../components/SEO";

const STATUS_COLORS = {
  new: "bg-gold/15 text-gold-dark", pending: "bg-gold/15 text-gold-dark",
  contacted: "bg-sage/20 text-earth", confirmed: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700", closed: "bg-beige text-ink-muted", cancelled: "bg-red-100 text-red-600",
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-beige shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`w-11 h-11 rounded-full flex items-center justify-center ${accent}`}><Icon size={20} strokeWidth={1.5} /></span>
        <span className="font-serif text-3xl text-ink">{value}</span>
      </div>
      <p className="mt-4 text-sm text-ink-soft">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  const loadAll = useCallback(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {});
    api.get("/admin/inquiries").then((r) => setInquiries(r.data)).catch(() => {});
    api.get("/admin/bookings").then((r) => setBookings(r.data)).catch(() => {});
    api.get("/admin/newsletter").then((r) => setSubscribers(r.data)).catch(() => {});
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const updateStatus = async (type, id, status) => {
    await api.patch(`/admin/${type}/${id}`, { status });
    toast.success("Status updated");
    loadAll();
  };
  const remove = async (type, id) => {
    await api.delete(`/admin/${type}/${id}`);
    toast.success("Deleted");
    loadAll();
  };

  const doLogout = async () => { await logout(); navigate("/admin/login"); };

  const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");

  return (
    <div className="min-h-screen bg-warmivory" data-testid="admin-dashboard">
      <SEO title="Admin Dashboard" />
      {/* Top bar */}
      <header className="bg-white border-b border-beige sticky top-0 z-40">
        <div className="container-px py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-semibold text-ink">Sparsh<span className="text-gold"> Pehla</span> <span className="text-ink-muted text-sm font-sans">· Admin</span></Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-soft hidden sm:inline">{user?.email}</span>
            <button onClick={doLogout} data-testid="admin-logout" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-destructive transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container-px py-10">
        <h1 className="font-serif text-3xl text-ink mb-8">Dashboard</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <StatCard icon={Inbox} label="Total Inquiries" value={stats.inquiries} accent="bg-gold/15 text-gold-dark" />
            <StatCard icon={CalendarCheck} label="Bookings" value={stats.bookings} accent="bg-peach text-gold-dark" />
            <StatCard icon={Users} label="Subscribers" value={stats.subscribers} accent="bg-lavender text-earth" />
            <StatCard icon={Sparkles} label="Services" value={stats.services} accent="bg-sage/20 text-earth" />
          </div>
        )}

        <Tabs defaultValue="inquiries">
          <TabsList className="bg-white border border-beige rounded-full p-1 mb-8">
            <TabsTrigger value="inquiries" data-testid="tab-inquiries" className="rounded-full data-[state=active]:bg-gold data-[state=active]:text-white">
              <MessageSquare size={15} className="mr-1.5" /> Inquiries
            </TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings" className="rounded-full data-[state=active]:bg-gold data-[state=active]:text-white">
              <CalendarCheck size={15} className="mr-1.5" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="subscribers" data-testid="tab-subscribers" className="rounded-full data-[state=active]:bg-gold data-[state=active]:text-white">
              <Users size={15} className="mr-1.5" /> Subscribers
            </TabsTrigger>
          </TabsList>

          {/* Inquiries */}
          <TabsContent value="inquiries">
            <div className="bg-white rounded-2xl border border-beige overflow-hidden">
              {inquiries.length === 0 ? <Empty label="No inquiries yet" /> : (
                <div className="divide-y divide-beige">
                  {inquiries.map((q) => (
                    <div key={q.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4" data-testid={`inquiry-row-${q.id}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-medium text-ink">{q.name}</p>
                          <Badge className={`${STATUS_COLORS[q.status] || "bg-beige"} border-0 capitalize`}>{q.status}</Badge>
                          {q.service && <span className="text-xs text-ink-muted">· {q.service}</span>}
                        </div>
                        <p className="text-sm text-ink-soft mt-1">{q.email}{q.phone ? ` · ${q.phone}` : ""}</p>
                        <p className="text-sm text-ink-soft mt-2 line-clamp-2">{q.message}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-ink-muted">{fmt(q.created_at)}</span>
                        <RowMenu onStatus={(s) => updateStatus("inquiries", q.id, s)} onDelete={() => remove("inquiries", q.id)} options={["new", "contacted", "closed"]} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            <div className="bg-white rounded-2xl border border-beige overflow-hidden">
              {bookings.length === 0 ? <Empty label="No bookings yet" /> : (
                <div className="divide-y divide-beige">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4" data-testid={`booking-row-${b.id}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-medium text-ink">{b.name}</p>
                          <Badge className={`${STATUS_COLORS[b.status] || "bg-beige"} border-0 capitalize`}>{b.status}</Badge>
                          <span className="text-xs text-gold-dark font-medium">· {b.service}</span>
                        </div>
                        <p className="text-sm text-ink-soft mt-1">{b.email} · {b.phone}</p>
                        <p className="text-sm text-ink-soft mt-1">Preferred: {b.preferred_date || "—"} {b.preferred_time}</p>
                        {b.message && <p className="text-sm text-ink-soft mt-1 line-clamp-1">{b.message}</p>}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-ink-muted">{fmt(b.created_at)}</span>
                        <RowMenu onStatus={(s) => updateStatus("bookings", b.id, s)} onDelete={() => remove("bookings", b.id)} options={["pending", "confirmed", "completed", "cancelled"]} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Subscribers */}
          <TabsContent value="subscribers">
            <div className="bg-white rounded-2xl border border-beige overflow-hidden">
              {subscribers.length === 0 ? <Empty label="No subscribers yet" /> : (
                <div className="divide-y divide-beige">
                  {subscribers.map((s) => (
                    <div key={s.id} className="p-5 flex items-center justify-between">
                      <p className="text-ink">{s.email}</p>
                      <span className="text-xs text-ink-muted">{fmt(s.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <p className="mt-8 text-sm text-ink-muted">
          Manage blogs, services & testimonials content directly in the database. <Link to="/" className="text-gold inline-flex items-center gap-1">View live site <ExternalLink size={13} /></Link>
        </p>
      </main>
    </div>
  );
}

function Empty({ label }) {
  return <div className="p-16 text-center text-ink-muted"><FileText className="mx-auto mb-3 opacity-40" /> {label}</div>;
}

function RowMenu({ onStatus, onDelete, options }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-9 h-9 rounded-full hover:bg-beige flex items-center justify-center text-ink-soft" data-testid="row-menu" aria-label="Actions">
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {options.map((o) => (
          <DropdownMenuItem key={o} onClick={() => onStatus(o)} className="capitalize cursor-pointer">
            Mark as {o}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={onDelete} className="text-destructive cursor-pointer">
          <Trash2 size={14} className="mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
