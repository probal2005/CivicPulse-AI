import { Link } from 'react-router-dom';
import { Activity, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-600">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">CivicPulse</span>
                <span className="text-teal-400 font-bold text-lg"> AI</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              An AI-powered civic problem reporting and response platform built for transparent, responsive urban governance.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Citizen Dashboard</Link></li>
              <li><Link to="/report" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Report an Issue</Link></li>
              <li><Link to="/admin" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Admin Command Center</Link></li>
              <li><Link to="/map" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Civic Map</Link></li>
              <li><Link to="/ai" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">AI Intelligence</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-navy-800 text-slate-400 hover:text-teal-400 hover:bg-navy-700 transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-navy-800 text-slate-400 hover:text-teal-400 hover:bg-navy-700 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-navy-800 text-slate-400 hover:text-teal-400 hover:bg-navy-700 transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            CivicPulse AI is a university hackathon demo project. Predictions are simulated for demonstration.
          </p>
          <p className="text-slate-500 text-xs">Built with React, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
