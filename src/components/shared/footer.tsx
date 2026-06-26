import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

const FOOTER_LINKS = {
  jewelry: [
    { label: "Temple Jewelry", href: "/jewelry?category=temple-jewelry" },
    { label: "Kundan Jewelry", href: "/jewelry?category=kundan-jewelry" },
    { label: "Jadau Jewelry", href: "/jewelry?category=jadau-jewelry" },
    { label: "Silver Jewelry", href: "/jewelry?category=silver-jewelry" },
    { label: "Brass Jewelry", href: "/jewelry?category=brass-jewelry" },
    { label: "Gemstone Jewelry", href: "/jewelry?category=gemstone-jewelry" },
  ],
  about: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/stories" },
    { label: "Collections", href: "/collections" },
    { label: "Contact Us", href: "/contact" },
  ],
  support: [
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Care Instructions", href: "/care" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-serif text-white tracking-wider mb-4">RATNAGIRI</h3>
            <p className="text-sm leading-relaxed mb-6">
              Curating India&apos;s finest handcrafted jewelry traditions since time immemorial. Each piece tells a story
              of heritage, artistry, and timeless beauty.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#C9A84C] transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-[#C9A84C] transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-[#C9A84C] transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-[#C9A84C] transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-widest uppercase text-[#C9A84C] mb-4 font-medium">Jewelry</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.jewelry.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest uppercase text-[#C9A84C] mb-4 font-medium">About</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest uppercase text-[#C9A84C] mb-4 font-medium">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe for exclusive collections and craft stories.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-sm px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#C9A84C]"
              />
              <button
                type="submit"
                className="bg-[#C9A84C] text-white px-4 py-2 rounded-sm text-sm hover:bg-[#B8973A] transition-colors"
              >
                Subscribe
              </button>
            </form>

            <h4 className="text-xs tracking-widest uppercase text-[#C9A84C] mt-8 mb-4 font-medium">Support</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-neutral-500">&copy; {new Date().getFullYear()} Ratnagiri. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-xs text-neutral-500 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-neutral-500 hover:text-white transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="text-xs text-neutral-500 hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}