import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-saffron-400 rounded-xl flex items-center justify-center">
                <span className="text-forest-900 text-sm font-bold">D</span>
              </div>
              <span className="font-display font-bold text-lg">DelishDrop</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Connecting food lovers with their favorite cuisines. Fresh, fast, and absolutely delicious.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-saffron-400 hover:text-forest-900 transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display font-semibold mb-4 text-sm">Quick Links</p>
            <div className="space-y-2">
              {[['/', 'Home'], ['/menu', 'Menu'], ['/booking', 'Book a Table'], ['/cart', 'Cart']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-white/50 text-sm hover:text-saffron-400 transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display font-semibold mb-4 text-sm">Categories</p>
            <div className="space-y-2 text-white/50 text-sm">
              {['Burgers & Fries', 'Pizza', 'Salads', 'Desserts', 'Drinks'].map(c => (
                <p key={c} className="hover:text-saffron-400 cursor-pointer transition-colors">{c}</p>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display font-semibold mb-4 text-sm">Contact</p>
            <div className="space-y-3">
              {[
                [Phone, '+91 98765 43210'],
                [Mail, 'hello@delishdrop.in'],
                [MapPin, 'Sector 18, Noida, UP'],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-white/50 text-sm">
                  <Icon size={13} className="text-saffron-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2024 DelishDrop. All rights reserved.</p>
          <div className="flex gap-4 text-white/30 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
