import { Users, Github, Linkedin, Mail } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const team = [
  {
    name: 'Team Member 1',
    role: 'Project Lead & Full-Stack Developer',
    bio: 'Leads architecture and oversees the overall project direction and integration. Responsible for connecting frontend, service layer, and future backend systems.',
    skills: ['React', 'TypeScript', 'System Design'],
  },
  {
    name: 'Team Member 2',
    role: 'Frontend Developer',
    bio: 'Builds the citizen-facing interface and ensures a smooth, responsive user experience across all devices from mobile to desktop.',
    skills: ['React', 'Tailwind CSS', 'UI Development'],
  },
  {
    name: 'Team Member 3',
    role: 'Backend & Data Engineer',
    bio: 'Designs the service layer and data models for future backend and database integration. Plans the API contract for the real backend.',
    skills: ['Python', 'Databases', 'API Design'],
  },
  {
    name: 'Team Member 4',
    role: 'AI/ML Researcher',
    bio: 'Works on the image analysis pipeline and plans the FastAPI prediction endpoint. Researches computer vision models for civic issue classification.',
    skills: ['Python', 'TensorFlow', 'Computer Vision'],
  },
  {
    name: 'Team Member 5',
    role: 'UI/UX Designer',
    bio: 'Creates the visual design system, wireframes, and ensures accessibility across all pages. Focuses on clean, intuitive interfaces for citizens and admins.',
    skills: ['Figma', 'Design Systems', 'Accessibility'],
  },
];

export function TeamPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">Our Team</h1>
        <p className="mt-3 text-slate-500 text-lg">
          Five students passionate about civic technology and building tools that make cities better for everyone.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <Card key={member.name} hover className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 flex items-center justify-center shrink-0">
                <Users className="w-7 h-7 text-teal-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-navy-900">{member.name}</h3>
                <p className="text-sm text-teal-600 font-medium mt-0.5">{member.role}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500 leading-relaxed">{member.bio}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <span key={skill} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex gap-3">
              <a href="#" className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-colors" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-slate-400">
          Member names and social links are placeholders. Update them with real team information before presenting.
        </p>
      </div>
    </div>
  );
}
