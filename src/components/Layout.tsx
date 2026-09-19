import {
  Bell,
  Check,
  ChevronDown,
  Grid2X2,
  LogIn,
  LogOut,
  Map,
  Menu,
  MessageSquarePlus,
  Palette,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

import {
  useTheme,
  type ThemeName,
} from "@/contexts/ThemeContext";


/* =========================================================
   TYPES
========================================================= */

interface LayoutProps {
  children: ReactNode;
}


/* =========================================================
   COMPONENT
========================================================= */

export function Layout({
  children,
}: LayoutProps) {

  const {
    user,
    signOut,
  } = useAuth();

  const {
    theme,
    setTheme,
    themes,
  } = useTheme();

  const location =
    useLocation();

  const navigate =
    useNavigate();


  /* =======================================================
     STATE
  ======================================================= */

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    themeOpen,
    setThemeOpen,
  ] = useState(false);


  /* =======================================================
     REFS
  ======================================================= */

  const menuRef =
    useRef<HTMLDivElement>(null);

  const profileRef =
    useRef<HTMLDivElement>(null);

  const themeRef =
    useRef<HTMLDivElement>(null);


  /* =======================================================
     ADMIN ROLE
  ======================================================= */

  const isAdmin =
    user?.app_metadata?.role ===
    "admin";


  /* =======================================================
     USER INFORMATION
  ======================================================= */

  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Citizen";

  const initial =
    fullName
      .charAt(0)
      .toUpperCase();


  /* =======================================================
     ACTIVE ROUTE
  ======================================================= */

  const isActive = (
    path: string,
  ) =>
    location.pathname === path;


  /* =======================================================
     NAVIGATION ITEMS
  ======================================================= */

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: Grid2X2,
      protected: true,
    },
    {
      label: "Report Issue",
      path: "/report",
      icon: MessageSquarePlus,
      protected: true,
    },
    {
      label: "Issue Map",
      path: "/map",
      icon: Map,
      protected: false,
    },
    {
      label: "AI Assistant",
      path: "/ai",
      icon: Sparkles,
      protected: false,
    },
    {
      label: "Our Team",
      path: "/team",
      icon: Users,
      protected: false,
    },
  ];


  /* =======================================================
     CLOSE OUTSIDE
  ======================================================= */

  useEffect(() => {

    const handleOutsideClick =
      (event: MouseEvent) => {

        const target =
          event.target as Node;


        if (
          menuOpen &&
          menuRef.current &&
          !menuRef.current.contains(
            target,
          )
        ) {
          setMenuOpen(false);
        }


        if (
          profileOpen &&
          profileRef.current &&
          !profileRef.current.contains(
            target,
          )
        ) {
          setProfileOpen(false);
        }


        if (
          themeOpen &&
          themeRef.current &&
          !themeRef.current.contains(
            target,
          )
        ) {
          setThemeOpen(false);
        }
      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };

  }, [
    menuOpen,
    profileOpen,
    themeOpen,
  ]);


  /* =======================================================
     CLOSE ON ROUTE CHANGE
  ======================================================= */

  useEffect(() => {

    setMenuOpen(false);
    setProfileOpen(false);
    setThemeOpen(false);

  }, [
    location.pathname,
  ]);


  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {

    const handleEscape =
      (event: KeyboardEvent) => {

        if (
          event.key === "Escape"
        ) {
          setMenuOpen(false);
          setProfileOpen(false);
          setThemeOpen(false);
        }
      };


    document.addEventListener(
      "keydown",
      handleEscape,
    );


    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };

  }, []);


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleNavigation = (
    path: string,
    protectedRoute = false,
  ) => {

    setMenuOpen(false);
    setProfileOpen(false);
    setThemeOpen(false);


    if (
      protectedRoute &&
      !user
    ) {
      navigate("/auth");
      return;
    }


    navigate(path);
  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout =
    async () => {

      setMenuOpen(false);
      setProfileOpen(false);
      setThemeOpen(false);


      try {

        await signOut();

        navigate("/");

      } catch (error) {

        console.error(
          "Logout error:",
          error,
        );

      }
    };


  /* =======================================================
     THEME
  ======================================================= */

  const handleThemeChange =
    (nextTheme: ThemeName) => {

      setTheme(nextTheme);

      setThemeOpen(false);

    };


  /* =======================================================
     CURRENT THEME
  ======================================================= */

  const currentTheme =
    themes.find(
      (item) =>
        item.id === theme,
    ) ?? themes[0];


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        civic-animated-bg
        min-h-screen
        bg-slate-50
        text-slate-900
      "
    >


      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-slate-200
          bg-white/95
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-[78px]
            max-w-[1500px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >


          {/* =================================================
    LOGO
================================================= */}

<Link
  to="/"
  onClick={() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setThemeOpen(false);
  }}
  className="
    group
    flex
    items-center
    gap-3
  "
>
  {/* Logo Icon */}
  <div
    className="
      flex
      h-11
      w-11
      shrink-0
      items-center
      justify-center
      overflow-hidden
      rounded-2xl
      transition
      duration-300
      group-hover:scale-105
    "
  >
    <img
      src="public/images/civicpulse-icon.png"
      alt="CivicPulse AI"
      className="
        h-full
        w-full
        object-contain
      "
    />
  </div>

  {/* Brand Text */}
  <div className="hidden sm:block">

    <div
      className="
        text-lg
        font-black
        leading-none
        text-slate-900
      "
    >
      CivicPulse{" "}

      <span className="text-cyan-500">
        AI
      </span>
    </div>

    <p
      className="
        mt-1
        text-[11px]
        font-medium
        text-slate-500
      "
    >
      Smarter Cities • Stronger Communities
    </p>

  </div>
</Link>


          {/* =================================================
              RIGHT CONTROLS
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-1.5
              sm:gap-2
            "
          >


            {/* =================================================
                NOTIFICATION
            ================================================= */}

            {user && (

              <button
                type="button"
                aria-label="Notifications"
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-600
                  transition
                  hover:bg-slate-100
                  hover:text-slate-900
                "
              >

                <Bell size={20} />

                <span
                  className="
                    absolute
                    right-2
                    top-1.5
                    h-2
                    w-2
                    animate-pulse
                    rounded-full
                    bg-red-500
                  "
                />

              </button>

            )}


            {/* =================================================
                THEME BUTTON
                DIRECTLY BESIDE NOTIFICATION
            ================================================= */}

            <div
              ref={themeRef}
              className="relative"
            >

              <button
                type="button"
                aria-label="Change appearance"
                aria-expanded={
                  themeOpen
                }
                onClick={() => {

                  setThemeOpen(
                    (current) =>
                      !current,
                  );

                  setProfileOpen(false);
                  setMenuOpen(false);

                }}
                className={`
                  group
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  transition
                  ${
                    themeOpen
                      ? "border-blue-300 bg-blue-50 text-blue-600"
                      : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
              >

                <Palette
                  size={19}
                  className="
                    transition-transform
                    duration-300
                    group-hover:rotate-12
                  "
                />

                {/* Current theme indicator */}

                <span
                  className="
                    absolute
                    bottom-1
                    right-1
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-blue-500
                  "
                />

              </button>


              {/* =================================================
                  THEME PANEL
              ================================================= */}

              {themeOpen && (

                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+12px)]
                    z-[100]
                    w-[330px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    shadow-slate-300/40
                  "
                >


                  {/* PANEL HEADER */}

                  <div
                    className="
                      border-b
                      border-slate-100
                      bg-slate-50
                      px-4
                      py-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <Palette
                            size={17}
                            className="text-blue-600"
                          />

                          <p
                            className="
                              text-sm
                              font-black
                              text-slate-900
                            "
                          >
                            Appearance
                          </p>

                        </div>


                        <p
                          className="
                            mt-1
                            text-[11px]
                            text-slate-500
                          "
                        >
                          Customize your CivicPulse experience
                        </p>

                      </div>


                      <div
                        className="
                          rounded-lg
                          bg-blue-50
                          px-2
                          py-1
                          text-[10px]
                          font-black
                          text-blue-600
                        "
                      >
                        {currentTheme.name}
                      </div>

                    </div>

                  </div>


                  {/* THEME OPTIONS */}

                  <div
                    className="
                      max-h-[430px]
                      space-y-1
                      overflow-y-auto
                      p-2
                    "
                  >

                    {themes.map(
                      (item) => {

                        const selected =
                          theme === item.id;

                        return (

                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              handleThemeChange(
                                item.id,
                              )
                            }
                            className={`
                              group
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-xl
                              p-2.5
                              text-left
                              transition
                              ${
                                selected
                                  ? "bg-slate-100 ring-1 ring-blue-200"
                                  : "hover:bg-slate-50"
                              }
                            `}
                          >


                            {/* PREVIEW */}

                            <div
                              className="
                                relative
                                h-11
                                w-11
                                shrink-0
                                overflow-hidden
                                rounded-xl
                                shadow-sm
                              "
                              style={{
                                background:
                                  item.preview,
                              }}
                            >

                              <div
                                className="
                                  absolute
                                  left-1.5
                                  top-2
                                  h-1
                                  w-5
                                  rounded-full
                                  bg-white/70
                                "
                              />

                              <div
                                className="
                                  absolute
                                  left-1.5
                                  top-4
                                  h-1
                                  w-7
                                  rounded-full
                                  bg-white/40
                                "
                              />

                              <div
                                className="
                                  absolute
                                  bottom-2
                                  right-1.5
                                  h-3
                                  w-3
                                  rounded-full
                                  bg-white/80
                                "
                              />

                            </div>


                            {/* INFO */}

                            <div className="min-w-0 flex-1">

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                "
                              >

                                <span className="text-sm">
                                  {item.icon}
                                </span>

                                <p
                                  className="
                                    truncate
                                    text-sm
                                    font-black
                                    text-slate-800
                                  "
                                >
                                  {item.name}
                                </p>

                              </div>


                              <p
                                className="
                                  mt-0.5
                                  truncate
                                  text-[11px]
                                  text-slate-500
                                "
                              >
                                {item.description}
                              </p>

                            </div>


                            {/* CHECK */}

                            {selected && (

                              <div
                                className="
                                  flex
                                  h-7
                                  w-7
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-blue-600
                                  text-white
                                "
                              >

                                <Check
                                  size={15}
                                  strokeWidth={3}
                                />

                              </div>

                            )}

                          </button>

                        );
                      },
                    )}

                  </div>


                  {/* FOOTER */}

                  <div
                    className="
                      border-t
                      border-slate-100
                      bg-slate-50
                      px-4
                      py-3
                    "
                  >

                    <p
                      className="
                        text-center
                        text-[10px]
                        font-medium
                        text-slate-400
                      "
                    >
                      Theme preference is saved automatically
                    </p>

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                PROFILE
            ================================================= */}

            {user ? (

              <div
                ref={profileRef}
                className="relative"
              >

                <button
                  type="button"
                  aria-label="Open profile menu"
                  aria-expanded={
                    profileOpen
                  }
                  onClick={() => {

                    setProfileOpen(
                      (current) =>
                        !current,
                    );

                    setMenuOpen(false);
                    setThemeOpen(false);

                  }}
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    px-2
                    py-1.5
                    pr-3
                    transition
                    ${
                      profileOpen
                        ? "border-blue-200 bg-blue-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-blue-600
                      to-cyan-500
                      font-bold
                      text-white
                    "
                  >
                    {initial}
                  </div>


                  <div
                    className="
                      hidden
                      text-left
                      sm:block
                    "
                  >

                    <p
                      className="
                        max-w-[130px]
                        truncate
                        text-sm
                        font-bold
                        text-slate-800
                      "
                    >
                      {fullName}
                    </p>


                    <p
                      className="
                        text-[11px]
                        text-slate-500
                      "
                    >
                      {isAdmin
                        ? "Administrator"
                        : "Citizen account"}
                    </p>

                  </div>


                  <ChevronDown
                    size={17}
                    className={`
                      hidden
                      text-slate-500
                      transition-transform
                      sm:block
                      ${
                        profileOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />

                </button>


                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                {profileOpen && (

                  <div
                    className="
                      absolute
                      right-0
                      top-[calc(100%+10px)]
                      z-[90]
                      w-80
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-2xl
                      shadow-slate-300/40
                    "
                  >

                    {/* USER HEADER */}

                    <div
                      className="
                        border-b
                        border-slate-100
                        bg-slate-50
                        px-4
                        py-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-blue-600
                            to-cyan-500
                            text-lg
                            font-black
                            text-white
                          "
                        >
                          {initial}
                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >

                          <p
                            className="
                              truncate
                              font-black
                              text-slate-900
                            "
                          >
                            {fullName}
                          </p>


                          <p
                            className="
                              truncate
                              text-xs
                              text-slate-500
                            "
                          >
                            {user.email}
                          </p>


                          {isAdmin && (

                            <div
                              className="
                                mt-1.5
                                flex
                                items-center
                                gap-1
                              "
                            >

                              <ShieldCheck
                                size={12}
                                className="text-emerald-600"
                              />

                              <span
                                className="
                                  text-[10px]
                                  font-black
                                  uppercase
                                  tracking-wider
                                  text-emerald-600
                                "
                              >
                                Administrator
                              </span>

                            </div>

                          )}

                        </div>

                      </div>

                    </div>


                    {/* LINKS */}

                    <div className="p-2">


                      {/* PROFILE */}

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                        className={`
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          text-sm
                          font-bold
                          transition
                          ${
                            isActive(
                              "/profile",
                            )
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:bg-slate-50"
                          }
                        `}
                      >

                        <UserRound size={18} />

                        My Profile

                      </button>


                      {/* DASHBOARD */}

                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/dashboard");
                        }}
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          text-sm
                          font-bold
                          text-slate-700
                          transition
                          hover:bg-slate-50
                        "
                      >

                        <Grid2X2 size={18} />

                        My Dashboard

                      </button>


                      {/* ADMIN */}

                      {isAdmin && (

                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            navigate("/admin");
                          }}
                          className={`
                            mt-1
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-left
                            text-sm
                            font-bold
                            transition
                            ${
                              isActive(
                                "/admin",
                              )
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                            }
                          `}
                        >

                          <ShieldCheck
                            size={18}
                          />

                          <div>

                            <p>
                              Admin Panel
                            </p>

                            <p
                              className="
                                text-[11px]
                                font-medium
                                text-slate-400
                              "
                            >
                              Command center
                            </p>

                          </div>

                        </button>

                      )}


                      {/* LOGOUT */}

                      <div
                        className="
                          my-2
                          border-t
                          border-slate-100
                        "
                      />

                      <button
                        type="button"
                        onClick={
                          handleLogout
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          text-sm
                          font-bold
                          text-red-600
                          transition
                          hover:bg-red-50
                        "
                      >

                        <LogOut size={18} />

                        Logout

                      </button>

                    </div>

                  </div>

                )}

              </div>

            ) : (

              /* LOGIN */

              <button
                type="button"
                onClick={() =>
                  navigate("/auth")
                }
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-blue-200
                  transition
                  hover:-translate-y-0.5
                  hover:bg-blue-700
                  sm:flex
                "
              >

                <LogIn size={17} />

                Login

              </button>

            )}


            {/* =================================================
                HAMBURGER
            ================================================= */}

            <div
              ref={menuRef}
              className="relative"
            >

              <button
                type="button"
                aria-label={
                  menuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={
                  menuOpen
                }
                onClick={() => {

                  setMenuOpen(
                    (current) =>
                      !current,
                  );

                  setProfileOpen(false);
                  setThemeOpen(false);

                }}
                className={`
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  transition
                  ${
                    menuOpen
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-100"
                  }
                `}
              >

                {menuOpen ? (
                  <X size={23} />
                ) : (
                  <Menu size={23} />
                )}

              </button>


              {/* =================================================
                  MOBILE MENU
              ================================================= */}

              {menuOpen && (

                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+10px)]
                    z-[80]
                    w-[310px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                    shadow-slate-300/40
                  "
                >

                  <div
                    className="
                      border-b
                      border-slate-100
                      bg-slate-50
                      px-4
                      py-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-400
                      "
                    >
                      Main Menu
                    </p>


                    <p
                      className="
                        mt-1
                        text-sm
                        font-black
                        text-slate-800
                      "
                    >
                      CivicPulse AI
                    </p>

                  </div>


                  <div className="p-2">

                    {navItems.map(
                      (item) => {

                        const Icon =
                          item.icon;

                        const active =
                          isActive(
                            item.path,
                          );

                        return (

                          <button
                            key={
                              item.path
                            }
                            type="button"
                            onClick={() =>
                              handleNavigation(
                                item.path,
                                item.protected,
                              )
                            }
                            className={`
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-3
                              text-left
                              transition
                              ${
                                active
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-slate-700 hover:bg-slate-50"
                              }
                            `}
                          >

                            <div
                              className={`
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                ${
                                  active
                                    ? "bg-blue-100"
                                    : "bg-slate-100"
                                }
                              `}
                            >

                              <Icon
                                size={18}
                              />

                            </div>


                            <div>

                              <p
                                className="
                                  text-sm
                                  font-bold
                                "
                              >
                                {item.label}
                              </p>


                              <p
                                className="
                                  text-[11px]
                                  text-slate-400
                                "
                              >

                                {item.path ===
                                  "/dashboard" &&
                                  "Your civic activity"}

                                {item.path ===
                                  "/report" &&
                                  "Submit a civic complaint"}

                                {item.path ===
                                  "/map" &&
                                  "Explore reported issues"}

                                {item.path ===
                                  "/ai" &&
                                  "Get AI-powered assistance"}

                                {item.path ===
                                  "/team" &&
                                  "Meet the CivicPulse team"}

                              </p>

                            </div>

                          </button>

                        );
                      },
                    )}


                    {/* =================================================
                        ADMIN — ADMIN ONLY
                    ================================================= */}

                    {isAdmin && (

                      <>

                        <div
                          className="
                            my-2
                            border-t
                            border-slate-100
                          "
                        />


                        <button
                          type="button"
                          onClick={() =>
                            handleNavigation(
                              "/admin",
                              true,
                            )
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-left
                            transition
                            ${
                              isActive(
                                "/admin",
                              )
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                            }
                          `}
                        >

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              bg-slate-100
                            "
                          >

                            <ShieldCheck
                              size={18}
                            />

                          </div>


                          <div>

                            <p
                              className="
                                text-sm
                                font-bold
                              "
                            >
                              Admin Panel
                            </p>


                            <p
                              className="
                                text-[11px]
                                text-slate-400
                              "
                            >
                              Administrator command center
                            </p>

                          </div>

                        </button>

                      </>

                    )}


                    {/* LOGIN */}

                    {!user && (

                      <>

                        <div
                          className="
                            my-2
                            border-t
                            border-slate-100
                          "
                        />


                        <button
                          type="button"
                          onClick={() =>
                            handleNavigation(
                              "/auth",
                            )
                          }
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            text-left
                            font-bold
                            text-blue-600
                            transition
                            hover:bg-blue-50
                          "
                        >

                          <LogIn
                            size={18}
                          />

                          <span
                            className="
                              text-sm
                            "
                          >
                            Login / Create Account
                          </span>

                        </button>

                      </>

                    )}

                  </div>


                  <div
                    className="
                      border-t
                      border-slate-100
                      bg-slate-50
                      px-4
                      py-3
                    "
                  >

                    <p
                      className="
                        text-center
                        text-[11px]
                        text-slate-400
                      "
                    >
                      Smarter Cities • Stronger Communities
                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div
          className="
            hidden
            border-t
            border-slate-100
            lg:block
          "
        >

          <nav
            className="
              mx-auto
              flex
              max-w-[1500px]
              items-center
              gap-1
              px-8
            "
          >

            {navItems.map(
              (item) => {

                const Icon =
                  item.icon;

                const active =
                  isActive(
                    item.path,
                  );

                return (

                  <button
                    key={
                      item.path
                    }
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        item.path,
                        item.protected,
                      )
                    }
                    className={`
                      relative
                      flex
                      items-center
                      gap-2
                      px-4
                      py-3
                      text-sm
                      font-bold
                      transition
                      ${
                        active
                          ? "text-blue-600"
                          : "text-slate-600 hover:text-blue-600"
                      }
                    `}
                  >

                    <Icon size={16} />

                    {item.label}


                    {active && (

                      <span
                        className="
                          absolute
                          bottom-0
                          left-3
                          right-3
                          h-0.5
                          rounded-full
                          bg-blue-600
                        "
                      />

                    )}

                  </button>

                );
              },
            )}


            {/* ADMIN — ADMIN ONLY */}

            {isAdmin && (

              <button
                type="button"
                onClick={() =>
                  handleNavigation(
                    "/admin",
                    true,
                  )
                }
                className={`
                  relative
                  ml-auto
                  flex
                  items-center
                  gap-2
                  px-4
                  py-3
                  text-sm
                  font-bold
                  transition
                  ${
                    isActive(
                      "/admin",
                    )
                      ? "text-emerald-600"
                      : "text-slate-600 hover:text-emerald-600"
                  }
                `}
              >

                <ShieldCheck
                  size={16}
                />

                Admin Panel


                {isActive(
                  "/admin",
                ) && (

                  <span
                    className="
                      absolute
                      bottom-0
                      left-3
                      right-3
                      h-0.5
                      rounded-full
                      bg-emerald-600
                    "
                  />

                )}

              </button>

            )}

          </nav>

        </div>

      </header>


      {/* ===================================================
          PAGE CONTENT
      =================================================== */}

      <main>
        {children}
      </main>

    </div>
  );
}
