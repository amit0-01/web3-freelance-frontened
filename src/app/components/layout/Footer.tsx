import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary font-display font-bold text-xl">
              <span className="w-8 h-8 bg-primary text-white rounded-md flex items-center justify-center">W3</span>
              <span>WorkWeb3</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A decentralized job marketplace for the Web3 ecosystem.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com" aria-label="GitHub" className="text-foreground/70 hover:text-primary transition" target="_blank" rel="noreferrer">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-foreground/70 hover:text-primary transition" target="_blank" rel="noreferrer">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-foreground/70 hover:text-primary transition" target="_blank" rel="noreferrer">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/jobs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {currentYear} WorkWeb3. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};