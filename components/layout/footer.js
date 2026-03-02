import Link from 'next/link'
import { ShoppingBag, Sparkles, Instagram, Facebook, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#2d1b2e] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#e8a4b8]/10 rounded-full blur-[100px] -ml-40 -mt-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#e8a4b8] transition-all duration-500">
                <Sparkles className="w-6 h-6 text-[#e8a4b8] group-hover:text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-serif font-black tracking-tighter text-white uppercase leading-none mb-1">SanYou</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#e8a4b8] opacity-80 leading-none">The Essence of Elegance</span>
              </div>
            </Link>
            <p className="text-white/50 text-base leading-relaxed max-w-sm italic font-serif">
              "SanYou is not just Make-up or Skincare - it's a feeling of elegance you can wear everyday."
            </p>
            <div className="flex gap-4 mt-10">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button key={i} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#e8a4b8] transition-all border border-white/5">
                  <Icon className="w-5 h-5 text-white/50 hover:text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#e8a4b8] opacity-80">Collection</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><Link href="/?category=1" className="hover:text-white transition-colors">Skin Sanctuary</Link></li>
              <li><Link href="/?category=2" className="hover:text-white transition-colors">Haute Hair</Link></li>
              <li><Link href="/?category=3" className="hover:text-white transition-colors">Gilded Nails</Link></li>
              <li><Link href="/?category=4" className="hover:text-white transition-colors">Baby Elegance</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#e8a4b8] opacity-80">Identity</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><Link href="/account/profile" className="hover:text-white transition-colors">Your Portal</Link></li>
              <li><Link href="/account/profile" className="hover:text-white transition-colors">Curated History</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Concierge */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#e8a4b8] opacity-80">Boutique News</h4>
            <div className="relative group">
              <input
                type="email"
                placeholder="Join the mailing group"
                className="w-full pl-6 pr-14 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-0 focus:border-[#e8a4b8] transition-all placeholder:text-white/20 italic"
              />
              <button className="absolute right-2 top-2 bottom-2 aspect-square bg-[#e8a4b8] text-white rounded-[1.2rem] flex items-center justify-center shadow-lg hover:bg-white hover:text-[#2d1b2e] transition-all">
                <Mail className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-black text-center">Receive 10% discount on your first tour</p>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">© 2026 SanYou Elegance System. All Rights Reserved.</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/20">
            <Link href="/" className="hover:text-[#e8a4b8] transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-[#e8a4b8] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}