import {
  Users,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import { Card } from "@/components/ui/Card";

type TeamMember = {
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  github: string;
  linkedin: string;
  email: string;
};

const team: TeamMember[] = [
  {
    name: "TEAM MEMBER 1",
    role: "Project Lead & Full-Stack Developer",
    image: "/images/team/member-1.png",
    bio: "Leads the overall project architecture, coordinates development, and works across frontend, backend, database integration, and system design.",
    skills: ["React", "TypeScript", "System Design", "Git"],
    github: "#",
    linkedin: "#",
    email: "mailto:team.pie3.141@proton.me",
  },

  {
    name: "TEAM MEMBER 2",
    role: "Frontend Developer & UI Engineer",
    image: "/images/team/member-2.jpg",
    bio: "Designs and develops the citizen-facing interface with a focus on responsive layouts, accessibility, interactions, and a smooth user experience.",
    skills: ["React", "Tailwind CSS", "UI/UX", "Responsive Design"],
    github: "#",
    linkedin: "#",
    email: "mailto:team.pie3.141@proton.me",
  },

  {
    name: "TEAM MEMBER 3",
    role: "Backend & Data Engineer",
    image: "/images/team/member-3.jpg",
    bio: "Works on backend architecture, APIs, database design, data flow, and reliable service integration for the CivicPulse platform.",
    skills: ["Python", "FastAPI", "Supabase", "API Design"],
    github: "#",
    linkedin: "#",
    email: "mailto:team.pie3.141@proton.me",
  },

  {
    name: "TEAM MEMBER 4",
    role: "AI/ML Researcher",
    image: "/images/team/member-4.jpg",
    bio: "Researches AI and computer vision approaches for civic issue classification, intelligent analysis, and future AI-powered platform capabilities.",
    skills: ["Python", "Machine Learning", "Computer Vision", "AI"],
    github: "#",
    linkedin: "#",
    email: "mailto:team.pie3.141@proton.me",
  },
];

export function TeamPage() {
  return (
    <main className="min-h-screen">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="
              absolute
              left-[10%]
              top-10
              h-48
              w-48
              rounded-full
              bg-cyan-400/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              right-[10%]
              top-20
              h-56
              w-56
              rounded-full
              bg-blue-500/10
              blur-3xl
            "
          />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          {/* =================================================
              TEAM LOGO
          ================================================= */}

          <div
            className="
              mx-auto
              flex
              h-24
              w-24
              items-center
              justify-center
              overflow-hidden
              rounded-3xl
              border
              p-2
              shadow-xl
              shadow-cyan-500/20
              transition
              duration-300
              hover:scale-105
            "
            style={{
              background: "var(--cp-card)",
              borderColor: "var(--cp-border)",
            }}
          >
            <img
              src="/images/team/pie-31416-logo.png"
              alt="Pie-3.1416 Team Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Team name */}
          <h1
            className="
              mt-7
              text-4xl
              font-black
              tracking-tight
              sm:text-5xl
              lg:text-6xl
            "
            style={{ color: "var(--cp-text)" }}
          >
            Pie-3.1416
          </h1>

          {/* Tagline */}
          <div
            className="
              mt-4
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-bold
              tracking-[0.25em]
              sm:text-base
            "
            style={{ color: "var(--cp-primary)" }}
          >
            <span>HACK</span>

            <span style={{ color: "var(--cp-text-muted)" }}>
              •
            </span>

            <span>BUILD</span>

            <span style={{ color: "var(--cp-text-muted)" }}>
              •
            </span>

            <span>INNOVATE</span>
          </div>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-sm
              leading-7
              sm:text-base
            "
            style={{ color: "var(--cp-text-soft)" }}
          >
            A student technology team focused on building practical,
            innovative, and impactful digital solutions for real-world
            problems.
          </p>
        </div>
      </section>

      {/* =====================================================
          TEAM MEMBERS
      ===================================================== */}

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mb-8 flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
              "
              style={{
                background: "color-mix(in srgb, var(--cp-primary) 10%, transparent)",
                color: "var(--cp-primary)",
              }}
            >
              <Users className="h-5 w-5" />
            </div>

            <div>
              <h2
                className="text-xl font-black"
                style={{ color: "var(--cp-text)" }}
              >
                Meet the Team
              </h2>

              <p
                className="text-sm"
                style={{ color: "var(--cp-text-soft)" }}
              >
                The people behind Pie-3.1416
              </p>
            </div>
          </div>

          {/* =================================================
              2 MEMBERS PER ROW
          ================================================= */}

          <div className="grid gap-6 md:grid-cols-2">
            {team.map((member) => (
              <Card
                key={member.name}
                hover
                className="
                  group
                  overflow-hidden
                  p-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                "
              >
                {/* =================================================
                    MEMBER HEADER
                ================================================= */}

                <div className="flex items-start gap-4">
                  {/* Member image */}
                  <div
                    className="
                      h-20
                      w-20
                      shrink-0
                      overflow-hidden
                      rounded-2xl
                      border
                    "
                    style={{
                      background: "var(--cp-card)",
                      borderColor: "var(--cp-border)",
                    }}
                  >
                    <img
                      src={member.image}
                      alt={`${member.name} profile`}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-105
                      "
                      loading="lazy"
                    />
                  </div>

                  {/* Name + Role */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className="
                        truncate
                        text-lg
                        font-black
                      "
                      style={{ color: "var(--cp-text)" }}
                    >
                      {member.name}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                      "
                      style={{ color: "var(--cp-primary)" }}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* =================================================
                    BIO
                ================================================= */}

                <p
                  className="
                    mt-5
                    text-sm
                    leading-6
                  "
                  style={{ color: "var(--cp-text-soft)" }}
                >
                  {member.bio}
                </p>

                {/* =================================================
                    SKILLS
                ================================================= */}

                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles
                      className="h-4 w-4"
                      style={{ color: "var(--cp-primary)" }}
                    />

                    <span
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                      "
                      style={{ color: "var(--cp-text-muted)" }}
                    >
                      Skills
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="
                          rounded-full
                          border
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          transition
                          duration-200
                          hover:-translate-y-0.5
                        "
                        style={{
                          background:
                            "color-mix(in srgb, var(--cp-primary) 10%, transparent)",
                          borderColor:
                            "color-mix(in srgb, var(--cp-primary) 20%, transparent)",
                          color: "var(--cp-primary)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* =================================================
                    SOCIAL LINKS
                ================================================= */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    gap-3
                    border-t
                    pt-5
                  "
                  style={{
                    borderColor: "var(--cp-border)",
                  }}
                >
                  {/* GitHub */}
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} GitHub`}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      transition-all
                      duration-200
                      hover:-translate-y-1
                    "
                    style={{
                      background: "var(--cp-card)",
                      color: "var(--cp-text-soft)",
                      border: "1px solid var(--cp-border)",
                    }}
                  >
                    <Github className="h-4 w-4" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} LinkedIn`}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      transition-all
                      duration-200
                      hover:-translate-y-1
                    "
                    style={{
                      background: "var(--cp-card)",
                      color: "var(--cp-text-soft)",
                      border: "1px solid var(--cp-border)",
                    }}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>

                  {/* Email */}
                  <a
                    href={member.email}
                    aria-label={`Email ${member.name}`}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      transition-all
                      duration-200
                      hover:-translate-y-1
                    "
                    style={{
                      background: "var(--cp-card)",
                      color: "var(--cp-text-soft)",
                      border: "1px solid var(--cp-border)",
                    }}
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          TEAM INFORMATION
      ===================================================== */}

      <section
        className="
          relative
          mx-4
          mt-16
          mb-10
          overflow-hidden
          rounded-[28px]
          border
          px-6
          py-10
          sm:mx-6
          sm:px-10
          lg:mx-8
          lg:px-12
        "
        style={{
          background: "var(--cp-surface)",
          borderColor: "var(--cp-border)",
          color: "var(--cp-text)",
          boxShadow: "var(--cp-shadow)",
        }}
      >
        {/* Decorative glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
            opacity-20
            blur-3xl
          "
          style={{
            background:
              "radial-gradient(circle, var(--cp-primary), transparent 70%)",
          }}
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-24
            h-64
            w-64
            rounded-full
            opacity-10
            blur-3xl
          "
          style={{
            background:
              "radial-gradient(circle, var(--cp-accent), transparent 70%)",
          }}
        />

        <div className="relative z-10 text-center">
          {/* =================================================
              TEAM LOGO
          ================================================= */}

          <div
            className="
              mx-auto
              flex
              h-24
              w-24
              items-center
              justify-center
              overflow-hidden
              rounded-3xl
              border
              p-2
              shadow-xl
              transition
              duration-300
              hover:scale-105
            "
            style={{
              background: "var(--cp-card)",
              borderColor: "var(--cp-border)",
            }}
          >
            <img
              src="/images/team/pie-31416-logo.png"
              alt="Pie-3.1416 Team Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Team Name */}
          <h2
            className="
              mt-5
              text-2xl
              font-black
              tracking-tight
              sm:text-3xl
            "
            style={{ color: "var(--cp-text)" }}
          >
            Pie-3.1416
          </h2>

          {/* Tagline */}
          <p
            className="
              mt-2
              text-sm
              font-black
              uppercase
              tracking-[0.22em]
            "
            style={{ color: "var(--cp-primary)" }}
          >
            HACK • BUILD • INNOVATE
          </p>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-7
              sm:text-base
            "
            style={{ color: "var(--cp-text-soft)" }}
          >
            Explore our projects, follow our development journey, or get in
            touch with the Pie-3.1416 team.
          </p>

          {/* =================================================
              TEAM LINKS
          ================================================= */}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {/* GitHub */}
            <a
              href="https://github.com/Pie-3-1416"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                min-h-[48px]
                items-center
                justify-center
                gap-2
                rounded-2xl
                px-5
                py-3
                text-sm
                font-bold
                transition-all
                duration-300
                hover:-translate-y-1
              "
              style={{
                background: "var(--cp-card)",
                color: "var(--cp-text)",
                border: "1px solid var(--cp-border)",
              }}
            >
              <Github className="h-4 w-4" />
              Team GitHub
            </a>

            {/* Website */}
            <a
              href="https://pie-3.1416.versel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                min-h-[48px]
                items-center
                justify-center
                gap-2
                rounded-2xl
                px-5
                py-3
                text-sm
                font-bold
                transition-all
                duration-300
                hover:-translate-y-1
              "
              style={{
                background: "var(--cp-card)",
                color: "var(--cp-text)",
                border: "1px solid var(--cp-border)",
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Team Website
            </a>

            {/* Email */}
            <a
              href="mailto:team.pie3.141@proton.me"
              className="
                flex
                min-h-[48px]
                items-center
                justify-center
                gap-2
                rounded-2xl
                px-5
                py-3
                text-sm
                font-bold
                transition-all
                duration-300
                hover:-translate-y-1
              "
              style={{
                background: "var(--cp-card)",
                color: "var(--cp-text)",
                border: "1px solid var(--cp-border)",
              }}
            >
              <Mail className="h-4 w-4" />
              Contact Team
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
