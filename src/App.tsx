import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";

import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { LandingPage } from "@/pages/LandingPage";
import { CitizenDashboard } from "@/pages/CitizenDashboard";
import { ReportIssuePage } from "@/pages/ReportIssuePage";
import { AdminCommandCenter } from "@/pages/AdminCommandCenter";

/* CivicMapPage uses DEFAULT export */
import CivicMapPage from "@/pages/CivicMapPage";

/* These pages use NAMED exports */
import { AIIntelligencePage } from "@/pages/AIIntelligencePage";
import { TeamPage } from "@/pages/TeamPage";
import { AuthPage } from "@/pages/AuthPage";
import { ProfilePage } from "@/pages/ProfilePage";

import { supabase } from "@/lib/supabase";

/* =========================================================
   ADMIN PROTECTED ROUTE

   Only users with:

   user.app_metadata.role === "admin"

   can access /admin
========================================================= */

function AdminOnlyRoute({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdminAccess = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (error) {
          console.error(
            "Admin access verification error:",
            error
          );

          setIsAdmin(false);
          return;
        }

        const admin =
          user?.app_metadata?.role === "admin";

        setIsAdmin(admin);
      } catch (error) {
        console.error(
          "Admin access verification error:",
          error
        );

        if (mounted) {
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAdminAccess();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <div
            className="
              mx-auto
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-blue-600
            "
          />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Verifying administrator access...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     NOT ADMIN
  ======================================================= */

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  /* =======================================================
     ADMIN
  ======================================================= */

  return <>{children}</>;
}

/* =========================================================
   APPLICATION
========================================================= */

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* =================================================
              PUBLIC ROUTES
          ================================================= */}

          {/* Landing Page */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          {/* Authentication */}
          <Route
            path="/auth"
            element={<AuthPage />}
          />

          {/* Civic Map */}
          <Route
            path="/map"
            element={<CivicMapPage />}
          />

          {/* AI Intelligence */}
          <Route
            path="/ai"
            element={<AIIntelligencePage />}
          />

          {/* Team */}
          <Route
            path="/team"
            element={<TeamPage />}
          />

          {/* =================================================
              AUTHENTICATED CITIZEN ROUTES
          ================================================= */}

          {/* Citizen Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />

          {/* Report Civic Issue */}
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportIssuePage />
              </ProtectedRoute>
            }
          />

          {/* User Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN ONLY ROUTE
          ================================================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminOnlyRoute>
                  <AdminCommandCenter />
                </AdminOnlyRoute>
              </ProtectedRoute>
            }
          />

          {/* =================================================
              404 — PAGE NOT FOUND
          ================================================= */}

          <Route
            path="*"
            element={
              <div className="flex min-h-[60vh] items-center justify-center px-6">
                <div className="w-full max-w-lg text-center">

                  {/* 404 Icon */}
                  <div
                    className="
                      mx-auto
                      flex
                      h-20
                      w-20
                      items-center
                      justify-center
                      rounded-3xl
                      bg-blue-50
                    "
                  >
                    <span className="text-3xl font-black text-blue-600">
                      404
                    </span>
                  </div>

                  {/* Title */}
                  <h1
                    className="
                      mt-6
                      text-4xl
                      font-black
                      tracking-tight
                      text-slate-900
                      sm:text-5xl
                    "
                  >
                    Page Not Found
                  </h1>

                  {/* Description */}
                  <p
                    className="
                      mx-auto
                      mt-3
                      max-w-md
                      text-sm
                      leading-6
                      text-slate-500
                      sm:text-base
                    "
                  >
                    The page you are looking for does not
                    exist or may have been moved to another
                    location.
                  </p>

                  {/* Back Home */}
                  <a
                    href="/"
                    className="
                      mt-7
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-600
                      px-6
                      py-3
                      text-sm
                      font-bold
                      text-white
                      shadow-lg
                      shadow-blue-200
                      transition
                      hover:bg-blue-700
                    "
                  >
                    Back to Home
                  </a>

                </div>
              </div>
            }
          />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;