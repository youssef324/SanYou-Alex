'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, AlertCircle, ShoppingBag, Shield, Sparkles, ArrowRight, User } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', adminCode: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminField, setShowAdminField] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Full identity is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) newErrors.email = 'Digital address is required'
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid digital identity'
    if (!formData.password) newErrors.password = 'A security key is essential'
    else if (formData.password.length < 8) newErrors.password = 'Security key must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Security keys do not match'
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
    setSuccessMessage('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (res.ok) {
        setSuccessMessage('✨ Your Sanctuary is ready.')
        setTimeout(() => router.push('/login?registered=true'), 2000)
      } else {
        setErrors({ form: data.error || 'The initiation failed.' })
      }
    } catch (err) {
      setErrors({ form: 'Digital network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2d1b2e] relative overflow-hidden py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#e8a4b8]/10 rounded-full blur-[120px] -ml-96 -mt-96" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#c9a96e]/5 rounded-full blur-[100px] -mr-64 -mb-64" />
      </div>

      <div className="relative z-10 w-full max-w-[520px] mx-auto px-6">
        <div className="text-center mb-12 fade-up">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-700">
              <Sparkles className="w-8 h-8 text-[#e8a4b8]" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-serif font-black tracking-tighter text-white uppercase leading-none mb-1">SanYou</span>
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#e8a4b8] opacity-80 leading-none">Initiation</span>
            </div>
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-12 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-serif font-bold text-white mb-2">Create a Sanctuary</h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Join the elegant circle</p>
          </div>

          {successMessage && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          )}

          {errors.form && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 ml-2 group-focus-within:text-[#e8a4b8] transition-colors">Identity</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/10 focus:ring-1 focus:ring-[#e8a4b8]/30 focus:border-[#e8a4b8]/50 transition-all text-sm italic"
                    placeholder="Full Name" />
                </div>
                {errors.name && <p className="text-red-400/80 text-[8px] font-black tracking-widest mt-2 ml-2">{errors.name}</p>}
              </div>

              <div className="group">
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 ml-2 group-focus-within:text-[#e8a4b8] transition-colors">Digital Path</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/10 focus:ring-1 focus:ring-[#e8a4b8]/30 focus:border-[#e8a4b8]/50 transition-all text-sm italic"
                  placeholder="email@example.com" />
                {errors.email && <p className="text-red-400/80 text-[8px] font-black tracking-widest mt-2 ml-2">{errors.email}</p>}
              </div>
            </div>

            <div className="group">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 ml-2 group-focus-within:text-[#e8a4b8] transition-colors">Security Key</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/10 focus:ring-1 focus:ring-[#e8a4b8]/30 focus:border-[#e8a4b8]/50 transition-all text-sm"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400/80 text-[8px] font-black tracking-widest mt-2 ml-2">{errors.password}</p>}
            </div>

            <div className="group">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 ml-2 group-focus-within:text-[#e8a4b8] transition-colors">Verify Key</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/10 focus:ring-1 focus:ring-[#e8a4b8]/30 focus:border-[#e8a4b8]/50 transition-all text-sm"
                placeholder="••••••••" />
              {errors.confirmPassword && <p className="text-red-400/80 text-[8px] font-black tracking-widest mt-2 ml-2">{errors.confirmPassword}</p>}
            </div>

            <div>
              <button type="button" onClick={() => setShowAdminField(!showAdminField)} className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/20 hover:text-[#e8a4b8] transition-all mb-4 ml-2">
                <Shield size={14} /> {showAdminField ? 'Conceal Key' : 'Privileged Access?'}
              </button>
              {showAdminField && (
                <input type="password" name="adminCode" value={formData.adminCode} onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/10 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm"
                  placeholder="Admin Secret Code" />
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-16 bg-[#e8a4b8] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Initiate Sanctuary <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            Already a member?{' '}
            <Link href="/login" className="text-[#e8a4b8] hover:text-white transition-colors">Enter Portal</Link>
          </p>
        </div>
      </div>
    </div>
  )
}