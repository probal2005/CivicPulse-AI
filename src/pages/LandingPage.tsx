import { Link } from 'react-router-dom';
import {
  Activity,
  MapPin,
  Upload,
  Brain,
  BarChart3,
  Shield,
  ArrowRight,
  Users,
  FileText,
  Eye,
  CheckCircle2,
  Zap,
  Github,
  Linkedin,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: 'Easy Issue Reporting',
    description: 'Citizens can report civic problems in seconds with photos, location, and descriptions — no technical knowledge needed.',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI-Powered Prioritization',
    description: 'Simulated AI analysis categorizes and prioritizes reports so urgent issues reach the right teams faster. (Demo — no real model connected yet.)',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Admin Command Center',
    description: 'A professional dashboard for administrators to search, filter, assign teams, and track every report from submission to resolution.',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Interactive Civic Map',
    description: 'See every reported issue plotted on an interactive map with category-coded markers and location details.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Transparent Tracking',
    description: 'Every report has a unique ID and visible status trail — Submitted, Under Review, Assigned, Resolved — so citizens always know where things stand.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Built for Scale',
    description: 'Designed with a clean service layer that can connect to a real backend and ML model when ready, without changing the interface.',
  },
];

const howItWorks = [
  {
    step: '01',
    icon: <FileText className="w-7 h-7" />,
    title: 'Report a Problem',
    description: 'A citizen spots a civic issue — pothole, garbage, waterlogging — and submits a report with a photo and location.',
  },
  {
    step: '02',
    icon: <Eye className="w-7 h-7" />,
    title: 'Review & Prioritize',
    description: 'The system categorizes the report and assigns a priority level. Admins review and verify the submission.',
  },
  {
    step: '03',
    icon: <Users className="w-7 h-7" />,
    title: 'Assign to Team',
    description: 'Administrators assign the report to the appropriate response team based on category and urgency.',
  },
  {
    step: '04',
    icon: <CheckCircle2 className="w-7 h-7" />,
    title: 'Resolve & Confirm',
    description: 'The field team fixes the issue, updates the status to Resolved, and the citizen is notified.',
  },
];

const teamMembers = [
  { name: 'Team Member 1', role: 'Project Lead & Full-Stack Developer', bio: 'Leads architecture and oversees the overall project direction and integration.' },
  { name: 'Team Member 2', role: 'Frontend Developer', bio: 'Builds the citizen-facing interface and ensures a smooth, responsive user experience.' },
  { name: 'Team Member 3', role: 'Backend & Data Engineer', bio: 'Designs the service layer and data models for future backend and database integration.' },
  { name: 'Team Member 4', role: 'AI/ML Researcher', bio: 'Works on the image analysis pipeline and plans the FastAPI prediction endpoint.' },
  { name: 'Team Member 5', role: 'UI/UX Designer', bio: 'Creates the visual design system, wireframes, and ensures accessibility across all pages.' },
];

export function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-700 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-teal-300 text-sm font-medium">University Hackathon Demo Project</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                Smarter Cities Start with <span className="text-teal-400">Citizen Voices</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
                CivicPulse AI is an AI-powered civic problem reporting and response platform. Citizens report issues like potholes, garbage overflow, and broken streetlights — administrators track, prioritize, and resolve them efficiently.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button to="/report" size="lg">
                  Report an Issue
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button to="/dashboard" size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10 hover:border-slate-500">
                  Open Dashboard
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-teal-400">10+</p>
                  <p className="text-sm text-slate-400">Demo Reports</p>
                </div>
                <div className="w-px h-10 bg-slate-700" />
                <div>
                  <p className="text-3xl font-bold text-teal-400">6</p>
                  <p className="text-sm text-slate-400">Issue Categories</p>
                </div>
                <div className="w-px h-10 bg-slate-700" />
                <div>
                  <p className="text-3xl font-bold text-teal-400">5</p>
                  <p className="text-sm text-slate-400">Response Teams</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block animate-fade-in">
              <div className="bg-navy-900/60 backdrop-blur rounded-2xl border border-navy-700/50 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-400" />
                    <span className="text-white font-semibold text-sm">Live Command Center</span>
                  </div>
                  <span className="text-xs text-slate-400">Demo Preview</span>
                </div>
                <div className="space-y-3">
                  {[
                    { cat: 'Pothole', loc: 'MG Road Junction', priority: 'High', color: 'bg-orange-400' },
                    { cat: 'Waterlogging', loc: 'Silk Board Flyover', priority: 'Critical', color: 'bg-red-500' },
                    { cat: 'Garbage', loc: 'Indiranagar 2nd Stage', priority: 'Medium', color: 'bg-amber-400' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/50 border border-navy-700/30 hover:border-teal-500/30 transition-colors"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.cat}</p>
                        <p className="text-slate-400 text-xs truncate">{item.loc}</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-300 px-2 py-0.5 rounded-md bg-navy-700/50">{item.priority}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-navy-800/50">
                    <p className="text-2xl font-bold text-white">10</p>
                    <p className="text-xs text-slate-400 mt-0.5">Total</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-navy-800/50">
                    <p className="text-2xl font-bold text-amber-400">5</p>
                    <p className="text-xs text-slate-400 mt-0.5">Pending</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-navy-800/50">
                    <p className="text-2xl font-bold text-green-400">2</p>
                    <p className="text-xs text-slate-400 mt-0.5">Resolved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900">How CivicPulse AI Works</h2>
            <p className="mt-4 text-slate-500 text-lg">From a citizen spotting a problem to a team fixing it — here's the full journey.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <Card key={step.step} hover className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-600">{step.icon}</div>
                  <span className="text-2xl font-bold text-slate-200">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900">Platform Features</h2>
            <p className="mt-4 text-slate-500 text-lg">Everything needed to report, track, and resolve civic issues in one place.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} hover className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-navy-900 text-teal-400 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Make Your City Better?</h2>
          <p className="mt-4 text-slate-300 text-lg max-w-2xl mx-auto">
            Report a civic issue you've noticed, or explore the admin dashboard to see how reports are managed end-to-end.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button to="/report" size="lg">
              Report an Issue
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button to="/admin" size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10 hover:border-slate-500">
              Explore Admin Center
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900">Meet the Team</h2>
            <p className="mt-4 text-slate-500 text-lg">Five passionate students building civic tech for a better tomorrow.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} hover className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center">
                  <Users className="w-9 h-9 text-teal-400" />
                </div>
                <h3 className="font-semibold text-navy-900 text-sm">{member.name}</h3>
                <p className="text-xs text-teal-600 font-medium mt-1">{member.role}</p>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{member.bio}</p>
                <div className="flex justify-center gap-3 mt-4">
                  <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors" aria-label="GitHub"><Github className="w-4 h-4" /></a>
                  <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/team" className="inline-flex items-center gap-1.5 text-teal-600 font-semibold text-sm hover:gap-2.5 transition-all">
              View full team page <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
