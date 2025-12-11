import Link from 'next/link';
import { Heart } from 'lucide-react';

const footerLinks = {
  findHelp: [
    { href: '/navigator' as const, label: 'Start Navigator' },
    { href: '/crisis' as const, label: 'Crisis Resources' },
  ],
  resources: [
    { href: '/resources' as const, label: 'All Guides' },
  ],
  forProviders: [
    { href: '/for-providers' as const, label: 'List Your Practice' },
    { href: '/for-providers/claim' as const, label: 'Claim Your Profile' },
    { href: '/provider-panel/login' as const, label: 'Provider Login' },
    { href: '/admin/login' as const, label: 'Admin Login' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-800 py-12 text-white">
      <div className="container-app">
        {/* Crisis Banner */}
        <div className="mb-8 rounded-lg bg-neutral-700 p-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
            Crisis Help Always Available
          </p>
          <p className="mt-2 text-lg">
            Call{' '}
            <a href="tel:988" className="font-bold underline hover:text-primary-300">
              988
            </a>{' '}
            • Text HOME to{' '}
            <a href="sms:741741" className="font-bold underline hover:text-primary-300">
              741741
            </a>
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary-400" />
              <span className="font-bold">Baltimore MHN</span>
            </div>
            <p className="mt-2 text-sm text-neutral-400">
              A community resource for Baltimore residents seeking mental health
              support.
            </p>
          </div>

          {/* Find Help */}
          <div>
            <h4 className="font-semibold text-neutral-300">Find Help</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.findHelp.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-neutral-300">Resources</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="font-semibold text-neutral-300">For Providers</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.forProviders.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-neutral-700 pt-8 text-center text-sm text-neutral-400">
          <p>© {new Date().getFullYear()} Baltimore Mental Health Navigator. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
