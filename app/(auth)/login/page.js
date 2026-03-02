'use client'

import { useState, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, CheckCircle, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react'

function LoginContent() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Presence of email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'A valid digital identity is required'
    if (!formData.password) newErrors.password = 'Security key is required'
    return newErrors
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false
    })

    if (result.ok) {
      const session = await getSession()
      if (session?.user?.role === 1) router.push('/admin')
      else router.push('/')
    } else {
      setErrors({ form: 'The credentials provided do not match our archive.' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2d1b2e] relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#e8a4b8]/10 rounded-full blur-[120px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#c9a96e]/5 rounded-full blur-[100px] -ml-64 -mb-64" />
      </div>

      <div className="relative z-10 w-full max-w-[480px] mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-16 fade-up">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-700 group-hover:rotate-6">
              <Sparkles className="w-10 h-10 text-[#e8a4b8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-serif font-black tracking-tighter text-white uppercase leading-none mb-1">SanYou</span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8a4b8] opacity-80 leading-none">The Portal</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-12 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/40 text-sm italic">Enter your sanctuary</p>
          </div>

          {registered && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
              <CheckCircle className="w-5 h-5" />
              <span>Sanctuary Created. Please Enter.</span>
            </div>
          )}

          {errors.form && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 ml-2 group-focus-within:text-[#e8a4b8] transition-colors">Digital Identity</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:ring-2 focus:ring-[#e8a4b8]/30 focus:border-[#e8a4b8]/50 transition-all duration-500 italic text-sm"
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-red-400/80 text-[10px] uppercase font-black tracking-widest mt-3 ml-2">{errors.email}</p>}
            </div>

            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3 ml-2 group-focus-within:text-[#e8a4b8] transition-colors">Security Key</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:ring-2 focus:ring-[#e8a4b8]/30 focus:border-[#e8a4b8]/50 transition-all duration-500 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400/80 text-[10px] uppercase font-black tracking-widest mt-3 ml-2">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-[#e8a4b8] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-[#e8a4b8]/20 hover:shadow-[#e8a4b8]/40 hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Enter Sanctum <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            Seeking a new sanctuary?{' '}
            <Link href="/register" className="text-[#e8a4b8] hover:text-white transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#2d1b2e]">
        <div className="w-12 h-12 border-4 border-[#e8a4b8] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}