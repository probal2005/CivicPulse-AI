import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  RefreshCw,
  Save,
  Send,
  Trash2,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type ComplaintStatus =
  | "pending"
  | "in_progress"
  | "resolved"
  | "rejected"
  | string;

type Complaint = {
  id: string;
  title: string | null;
  description: string | null;
  category: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  status: ComplaintStatus | null;
  priority: string | null;
  assigned_team: string | null;
  citizen_name: string | null;
  citizen_email: string | null;
  created_at: string | null;
  updated_at: string | null;
  feedback?: string | null;
  rating?: number | null;
};

type Tab = "overview" | "complaints" | "activity";

export function ProfilePage() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  const [feedbackComplaint, setFeedbackComplaint] =
    useState<Complaint | null>(null);

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [savingFeedback, setSavingFeedback] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const email = user?.email ?? "";

  const metadata = user?.user_metadata ?? {};

  const displayName =
    metadata.full_name ||
    metadata.name ||
    metadata.display_name ||
    profileName ||
    "Citizen";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    setProfileName(displayName);
    setProfilePhone(
      metadata.phone ||
        metadata.phone_number ||
        ""
    );
  }, [displayName, metadata.phone, metadata.phone_number]);

  useEffect(() => {
    if (user?.email) {
      loadComplaints();
    }
  }, [user?.email]);

  async function loadComplaints(showRefresh = false) {
    if (!user?.email) {
      setComplaints([]);
      setLoading(false);
      return;
    }

    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      /*
       * CivicPulse AI uses:
       * public.complaints
       *
       * Ownership field:
       * citizen_email
       */
      const { data, error: queryError } = await supabase
        .from("complaints")
        .select(`
          id,
          title,
          description,
          category,
          location,
          latitude,
          longitude,
          status,
          priority,
          assigned_team,
          citizen_name,
          citizen_email,
          created_at,
          updated_at,
          feedback,
          rating
        `)
        .eq("citizen_email", user.email)
        .order("created_at", { ascending: false });

      if (queryError) {
        console.error("CivicPulse complaints error:", queryError);
        throw queryError;
      }

      setComplaints((data as Complaint[]) || []);
    } catch (err: any) {
      console.error("Failed to load complaints:", err);

      setComplaints([]);

      setError(
        err?.message ||
          "Unable to load your reports. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleDeleteComplaint(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const { error: deleteError } = await supabase
        .from("complaints")
        .delete()
        .eq("id", id)
        .eq("citizen_email", email);

      if (deleteError) {
        console.error("Delete complaint error:", deleteError);
        throw deleteError;
      }

      setComplaints((current) =>
        current.filter((complaint) => complaint.id !== id)
      );

      if (selectedComplaint?.id === id) {
        setSelectedComplaint(null);
      }
    } catch (err: any) {
      console.error("Failed to delete complaint:", err);

      setError(
        err?.message ||
          "Unable to delete this complaint. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(
    complaint: Complaint,
    status: string
  ) {
    try {
      setUpdatingId(complaint.id);
      setError("");

      const { data, error: updateError } = await supabase
        .from("complaints")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", complaint.id)
        .eq("citizen_email", email)
        .select()
        .single();

      if (updateError) {
        console.error("Status update error:", updateError);
        throw updateError;
      }

      setComplaints((current) =>
        current.map((item) =>
          item.id === complaint.id
            ? {
                ...item,
                ...(data as Complaint),
                status,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      );

      if (selectedComplaint?.id === complaint.id) {
        setSelectedComplaint({
          ...selectedComplaint,
          status,
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error("Failed to update complaint:", err);

      setError(
        err?.message ||
          "Unable to update the complaint status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleSaveProfile() {
    try {
      setSavingProfile(true);
      setError("");

      const { error: updateError } =
        await supabase.auth.updateUser({
          data: {
            full_name: profileName.trim(),
            name: profileName.trim(),
            phone: profilePhone.trim(),
          },
        });

      if (updateError) {
        throw updateError;
      }

      setEditing(false);
    } catch (err: any) {
      console.error("Profile update error:", err);

      setError(
        err?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  function openFeedback(complaint: Complaint) {
    setFeedbackComplaint(complaint);
    setFeedback(complaint.feedback || "");
    setRating(complaint.rating || 0);
  }

  async function handleSaveFeedback() {
    if (!feedbackComplaint) return;

    try {
      setSavingFeedback(true);
      setError("");

      const { data, error: feedbackError } = await supabase
        .from("complaints")
        .update({
          feedback: feedback.trim() || null,
          rating: rating || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", feedbackComplaint.id)
        .eq("citizen_email", email)
        .select()
        .single();

      if (feedbackError) {
        console.error("Feedback update error:", feedbackError);
        throw feedbackError;
      }

      setComplaints((current) =>
        current.map((item) =>
          item.id === feedbackComplaint.id
            ? {
                ...item,
                ...(data as Complaint),
              }
            : item
        )
      );

      setFeedbackComplaint(null);
      setFeedback("");
      setRating(0);
    } catch (err: any) {
      console.error("Failed to save feedback:", err);

      setError(
        err?.message ||
          "Unable to save your feedback."
      );
    } finally {
      setSavingFeedback(false);
    }
  }

  const statistics = useMemo(() => {
    const normalize = (status: string | null | undefined) =>
      (status || "pending")
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

    const pending = complaints.filter((item) => {
      const status = normalize(item.status);

      return (
        status === "pending" ||
        status === "submitted" ||
        status === "open"
      );
    }).length;

    const inProgress = complaints.filter((item) => {
      const status = normalize(item.status);

      return (
        status === "in_progress" ||
        status === "processing" ||
        status === "under_review" ||
        status === "assigned"
      );
    }).length;

    const resolved = complaints.filter((item) => {
      const status = normalize(item.status);

      return (
        status === "resolved" ||
        status === "completed" ||
        status === "closed"
      );
    }).length;

    return {
      total: complaints.length,
      pending,
      inProgress,
      resolved,
    };
  }, [complaints]);

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                  <ArrowLeft size={16} />
                  Back
                </Link>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Citizen Account Center
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Manage your account, track your civic reports,
                submit updates and follow your contribution to
                the community.
              </p>
            </div>

            <Link
              to="/report-issue"
              className="hidden shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:inline-flex"
            >
              <Send size={17} />
              New Report
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div className="flex-1">
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>

            <button
              onClick={() => loadComplaints(true)}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold transition hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Profile Card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500" />

          <div className="px-5 pb-5 sm:px-7">
            <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-blue-600 text-2xl font-bold text-white shadow-lg">
                  {avatarLetter}
                </div>

                <div className="pb-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    {displayName}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={14} />
                Verified Citizen
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                <MapPin size={14} />
                Chandigarh
              </span>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<FileText size={21} />}
            label="Total Reports"
            value={statistics.total}
          />

          <StatCard
            icon={<Clock3 size={21} />}
            label="Pending"
            value={statistics.pending}
          />

          <StatCard
            icon={<Activity size={21} />}
            label="In Progress"
            value={statistics.inProgress}
          />

          <StatCard
            icon={<CheckCircle2 size={21} />}
            label="Resolved"
            value={statistics.resolved}
          />
        </section>

        {/* Tabs */}
        <section className="mt-6">
          <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </TabButton>

            <TabButton
              active={activeTab === "complaints"}
              onClick={() => setActiveTab("complaints")}
            >
              My Complaints
            </TabButton>

            <TabButton
              active={activeTab === "activity"}
              onClick={() => setActiveTab("activity")}
            >
              Activity
            </TabButton>
          </div>
        </section>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      My Complaints & Reports
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage every civic issue submitted from
                      your account.
                    </p>
                  </div>

                  <button
                    onClick={() => loadComplaints(true)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    title="Refresh"
                  >
                    <RefreshCw
                      size={18}
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />
                  </button>
                </div>

                <ComplaintList
                  complaints={recentComplaints}
                  loading={loading}
                  onSelect={setSelectedComplaint}
                  onDelete={handleDeleteComplaint}
                  onStatusChange={handleStatusChange}
                  onFeedback={openFeedback}
                  deletingId={deletingId}
                  updatingId={updatingId}
                />

                {!loading && complaints.length > 5 && (
                  <div className="border-t border-slate-100 p-4 text-center">
                    <button
                      onClick={() =>
                        setActiveTab("complaints")
                      }
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View all reports
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Contribution */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <TrendingUp size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Your Contribution
                    </h3>

                    <p className="text-xs text-slate-500">
                      Civic participation summary
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-slate-500">
                      Resolution rate
                    </span>

                    <span className="text-lg font-bold text-slate-900">
                      {statistics.total
                        ? Math.round(
                            (statistics.resolved /
                              statistics.total) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${
                          statistics.total
                            ? Math.round(
                                (statistics.resolved /
                                  statistics.total) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-900">
                  Quick Actions
                </h3>

                <div className="mt-4 space-y-2">
                  <Link
                    to="/report-issue"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                      <Send size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Report an Issue
                      </p>

                      <p className="text-xs text-slate-500">
                        Submit a new civic complaint
                      </p>
                    </div>
                  </Link>

                  <Link
                    to="/issue-map"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                      <MapPin size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Issue Map
                      </p>

                      <p className="text-xs text-slate-500">
                        Explore civic issues around you
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Complaints */}
        {activeTab === "complaints" && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  My Complaints & Reports
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Manage every civic issue submitted from your
                  account.
                </p>
              </div>

              <Link
                to="/report-issue"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Send size={16} />
                New Report
              </Link>
            </div>

            <ComplaintList
              complaints={complaints}
              loading={loading}
              onSelect={setSelectedComplaint}
              onDelete={handleDeleteComplaint}
              onStatusChange={handleStatusChange}
              onFeedback={openFeedback}
              deletingId={deletingId}
              updatingId={updatingId}
            />
          </section>
        )}

        {/* Activity */}
        {activeTab === "activity" && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <h3 className="text-lg font-bold text-slate-900">
                Account Activity
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Recent activity from your civic reports.
              </p>
            </div>

            {loading ? (
              <LoadingState />
            ) : complaints.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="divide-y divide-slate-100">
                {complaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className="flex gap-4 px-5 py-5 sm:px-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">
                        {complaint.title ||
                          "Civic issue reported"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {getStatusLabel(complaint.status)}
                        {complaint.category
                          ? ` • ${complaint.category}`
                          : ""}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        {formatDate(
                          complaint.created_at
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Edit Profile Modal */}
      {editing && (
        <Modal
          title="Edit Profile"
          onClose={() => setEditing(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                value={profileName}
                onChange={(event) =>
                  setProfileName(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <input
                value={email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone
              </label>

              <input
                value={profilePhone}
                onChange={(event) =>
                  setProfilePhone(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Phone number"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingProfile ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={16} />
                )}

                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <Modal
          title="Complaint Details"
          onClose={() => setSelectedComplaint(null)}
        >
          <ComplaintDetails
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
          />
        </Modal>
      )}

      {/* Feedback Modal */}
      {feedbackComplaint && (
        <Modal
          title="Give Feedback"
          onClose={() => setFeedbackComplaint(null)}
        >
          <div>
            <p className="text-sm text-slate-600">
              How was your experience with this civic issue?
            </p>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Rating
              </p>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl transition ${
                      star <= rating
                        ? "text-yellow-400"
                        : "text-slate-300 hover:text-yellow-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Feedback
              </label>

              <textarea
                value={feedback}
                onChange={(event) =>
                  setFeedback(event.target.value)
                }
                rows={5}
                placeholder="Tell us about your experience..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setFeedbackComplaint(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveFeedback}
                disabled={savingFeedback}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {savingFeedback ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <MessageSquare size={16} />
                )}

                Save Feedback
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   TABS
========================================================= */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   COMPLAINT LIST
========================================================= */

function ComplaintList({
  complaints,
  loading,
  onSelect,
  onDelete,
  onStatusChange,
  onFeedback,
  deletingId,
  updatingId,
}: {
  complaints: Complaint[];
  loading: boolean;
  onSelect: (complaint: Complaint) => void;
  onDelete: (id: string) => void;
  onStatusChange: (
    complaint: Complaint,
    status: string
  ) => void;
  onFeedback: (complaint: Complaint) => void;
  deletingId: string | null;
  updatingId: string | null;
}) {
  if (loading) {
    return <LoadingState />;
  }

  if (complaints.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="divide-y divide-slate-100">
      {complaints.map((complaint) => (
        <ComplaintRow
          key={complaint.id}
          complaint={complaint}
          onSelect={onSelect}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onFeedback={onFeedback}
          deletingId={deletingId}
          updatingId={updatingId}
        />
      ))}
    </div>
  );
}

/* =========================================================
   COMPLAINT ROW
========================================================= */

function ComplaintRow({
  complaint,
  onSelect,
  onDelete,
  onStatusChange,
  onFeedback,
  deletingId,
  updatingId,
}: {
  complaint: Complaint;
  onSelect: (complaint: Complaint) => void;
  onDelete: (id: string) => void;
  onStatusChange: (
    complaint: Complaint,
    status: string
  ) => void;
  onFeedback: (complaint: Complaint) => void;
  deletingId: string | null;
  updatingId: string | null;
}) {
  const isResolved = isResolvedStatus(complaint.status);

  return (
    <div className="p-5 transition hover:bg-slate-50 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <button
          onClick={() => onSelect(complaint)}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <FileText size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="truncate font-bold text-slate-900">
                  {complaint.title ||
                    "Untitled Civic Issue"}
                </h4>

                <StatusBadge
                  status={complaint.status}
                />
              </div>

              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {complaint.description ||
                  "No description provided."}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                {complaint.category && (
                  <span>
                    Category: {complaint.category}
                  </span>
                )}

                {complaint.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {complaint.location}
                  </span>
                )}

                {complaint.created_at && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={12} />
                    {formatDate(complaint.created_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </button>

        <div className="flex flex-wrap items-center gap-2 lg:max-w-xs lg:justify-end">
          {!isResolved && (
            <>
              <button
                disabled={updatingId === complaint.id}
                onClick={() =>
                  onStatusChange(
                    complaint,
                    "in_progress"
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
              >
                {updatingId === complaint.id ? (
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                ) : (
                  <Activity size={13} />
                )}

                Processing
              </button>

              <button
                disabled={updatingId === complaint.id}
                onClick={() =>
                  onStatusChange(
                    complaint,
                    "resolved"
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
              >
                <CheckCircle2 size={13} />
                Mark Solved
              </button>
            </>
          )}

          {isResolved && (
            <button
              onClick={() => onFeedback(complaint)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
            >
              <MessageSquare size={13} />
              Feedback
            </button>
          )}

          <button
            disabled={deletingId === complaint.id}
            onClick={() => onDelete(complaint.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {deletingId === complaint.id ? (
              <Loader2
                size={13}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={13} />
            )}

            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: string | null | undefined;
}) {
  const normalized = normalizeStatus(status);

  let classes =
    "bg-slate-100 text-slate-600";

  if (
    normalized === "resolved" ||
    normalized === "completed" ||
    normalized === "closed"
  ) {
    classes =
      "bg-emerald-50 text-emerald-700";
  } else if (
    normalized === "in_progress" ||
    normalized === "processing" ||
    normalized === "under_review" ||
    normalized === "assigned"
  ) {
    classes =
      "bg-blue-50 text-blue-700";
  } else if (
    normalized === "rejected"
  ) {
    classes =
      "bg-red-50 text-red-700";
  } else if (
    normalized === "pending" ||
    normalized === "open" ||
    normalized === "submitted"
  ) {
    classes =
      "bg-amber-50 text-amber-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${classes}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

/* =========================================================
   COMPLAINT DETAILS
========================================================= */

function ComplaintDetails({
  complaint,
  onClose,
}: {
  complaint: Complaint;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="mb-5">
        <StatusBadge status={complaint.status} />

        <h3 className="mt-3 text-xl font-bold text-slate-900">
          {complaint.title ||
            "Untitled Civic Issue"}
        </h3>

        {complaint.category && (
          <p className="mt-1 text-sm text-slate-500">
            {complaint.category}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <DetailItem
          label="Description"
          value={
            complaint.description ||
            "No description provided."
          }
        />

        <DetailItem
          label="Location"
          value={
            complaint.location ||
            "Location not provided."
          }
        />

        <DetailItem
          label="Priority"
          value={
            complaint.priority ||
            "Not assigned"
          }
        />

        <DetailItem
          label="Assigned Team"
          value={
            complaint.assigned_team ||
            "Not assigned"
          }
        />

        {complaint.latitude !== null &&
          complaint.longitude !== null && (
            <DetailItem
              label="GPS Coordinates"
              value={`${complaint.latitude}, ${complaint.longitude}`}
            />
          )}

        <DetailItem
          label="Submitted"
          value={formatDate(
            complaint.created_at
          )}
        />

        <DetailItem
          label="Last Updated"
          value={formatDate(
            complaint.updated_at
          )}
        />

        {complaint.feedback && (
          <DetailItem
            label="Your Feedback"
            value={complaint.feedback}
          />
        )}

        {complaint.rating ? (
          <DetailItem
            label="Your Rating"
            value={`${"★".repeat(
              complaint.rating
            )}${"☆".repeat(
              5 - complaint.rating
            )}`}
          />
        ) : null}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="font-bold text-slate-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center p-8">
      <Loader2
        size={30}
        className="animate-spin text-blue-600"
      />

      <p className="mt-3 text-sm font-medium text-slate-500">
        Loading your reports...
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
        <FileText size={28} />
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        No complaints yet
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        You have not submitted any civic reports from this
        account yet.
      </p>

      <Link
        to="/report-issue"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Send size={16} />
        Report an Issue
      </Link>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function normalizeStatus(
  status: string | null | undefined
) {
  return (status || "pending")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");
}

function getStatusLabel(
  status: string | null | undefined
) {
  const normalized = normalizeStatus(status);

  const labels: Record<string, string> = {
    pending: "Pending",
    submitted: "Submitted",
    open: "Open",
    in_progress: "In Progress",
    processing: "Processing",
    under_review: "Under Review",
    assigned: "Assigned",
    resolved: "Resolved",
    completed: "Completed",
    closed: "Closed",
    rejected: "Rejected",
  };

  return (
    labels[normalized] ||
    (status
      ? status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) =>
            char.toUpperCase()
          )
      : "Pending")
  );
}

function isResolvedStatus(
  status: string | null | undefined
) {
  const normalized = normalizeStatus(status);

  return [
    "resolved",
    "completed",
    "closed",
  ].includes(normalized);
}

function formatDate(
  date: string | null | undefined
) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}