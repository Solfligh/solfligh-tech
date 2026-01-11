import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-3">
        {/* BRAND */}
        <div>
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10">
              <Image
                src="/logo.png"
                alt="SOLFLIGH TECH"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-slate-950">
                SOLFLIGH TECH
              </div>
              <div className="text-xs font-semibold text-slate-600">
                Technology · Innovation · Getting you back your time
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700 max-w-sm">
            Building intelligent, scalable software solutions across web,
            mobile, automation, and AI systems.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <div className="font-bold text-slate-950 mb-3">Explore</div>
          <ul className="space-y-2 text-sm font-semibold text-slate-700">
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/investors">Investors</Link></li>
            <li><Link href="/partner">Partner With Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="font-bold text-slate-950">
            Ready to build something serious?
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            Tell us about your idea, timeline, or partnership goals.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-500 no-underline"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="border-t border-slate-200 py-4">
        <div className="mx-auto max-w-6xl px-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs font-semibold text-slate-600">
            © 2019 SOLFLIGH TECH. All rights reserved.
          </div>

          {/* LEGAL LINKS */}
          <div className="flex gap-4 text-xs font-semibold text-slate-600">
            <Link
              href="/privacy"
              className="hover:text-slate-900 no-underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-900 no-underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
