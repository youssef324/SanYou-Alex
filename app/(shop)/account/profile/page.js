'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { User, Mail, Shield, MapPin, Camera, Save, Plus, Trash2, Key, Package, Heart, ArrowRight, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')

    // Order & Wishlist States
    const [orders, setOrders] = useState([])
    const [wishlist, setWishlist] = useState([])

    // Form States
    const [profileForm, setProfileForm] = useState({ name: '', image: '' })
    const [passwordForm, setPasswordForm] = useState({ new: '', confirm: '' })
    const [addressForm, setAddressForm] = useState({
        fullName: '', address: '', city: '', state: '', postalCode: '', phone: ''
    })
    const [showAddressForm, setShowAddressForm] = useState(false)

    useEffect(() => {
        fetchProfileData()
    }, [])

    const fetchProfileData = async () => {
        try {
            const [profileRes, ordersRes, favsRes] = await Promise.all([
                fetch('/api/user/profile').then(r => r.json()),
                fetch('/api/orders').then(r => r.json()),
                fetch('/api/favourites').then(r => r.json())
            ])

            setUser(profileRes)
            setProfileForm({ name: profileRes.name || '', image: profileRes.image || '' })
            setOrders(ordersRes.orders || [])
            setWishlist(favsRes.favourites || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        const res = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileForm)
        })
        if (res.ok) {
            await update({ name: profileForm.name, image: profileForm.image })
            await fetchProfileData()
            alert('Profile excellence updated!')
        }
        setSaving(false)
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (passwordForm.new !== passwordForm.confirm) return alert('Passwords do not match')
        setSaving(true)
        const res = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword: passwordForm.new })
        })
        if (res.ok) {
            setPasswordForm({ new: '', confirm: '' })
            alert('Password changed successfully')
        }
        setSaving(false)
    }

    const handleAddAddress = async (e) => {
        e.preventDefault()
        setSaving(true)
        const res = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isAddingAddress: true, address: addressForm })
        })
        if (res.ok) {
            setAddressForm({ fullName: '', address: '', city: '', state: '', postalCode: '', phone: '' })
            setShowAddressForm(false)
            await fetchProfileData()
        }
        setSaving(false)
    }

    if (loading) return (
        <div className="pt-32 text-center h-screen bg-[#fdf8f6]/30">
            <div className="w-12 h-12 border-4 border-[#e8a4b8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
    )

    return (
        <div className="pt-32 pb-20 bg-[#fdf8f6]/30 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar */}
                    <aside className="lg:w-80 shrink-0">
                        <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-purple-50 sticky top-32">
                            <div className="text-center mb-8">
                                <div className="relative w-24 h-24 mx-auto mb-4 group">
                                    <div className="w-full h-full bg-[#2d1b2e] rounded-3xl flex items-center justify-center text-[#e8a4b8] text-3xl font-bold overflow-hidden shadow-xl">
                                        {user?.image ? <img src={user.image} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 bg-[#e8a4b8] text-white p-2 rounded-xl shadow-lg border-4 border-white transition-all hover:scale-110">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-serif font-bold text-[#2d1b2e] uppercase tracking-tighter">{user?.name}</h2>
                                <p className="text-xs text-[#e8a4b8] font-black tracking-widest mt-1 opacity-60 uppercase">{user?.role === 1 ? 'Administrator' : 'Exclusive Member'}</p>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { id: 'profile', icon: User, label: 'Profile' },
                                    { id: 'orders', icon: Package, label: 'Order History', count: orders.length },
                                    { id: 'wishlist', icon: Heart, label: 'Your Favorites', count: wishlist.length },
                                    { id: 'security', icon: Key, label: 'Security' },
                                    { id: 'addresses', icon: MapPin, label: 'Addresses' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-widest ${activeTab === tab.id ? 'bg-[#2d1b2e] text-white shadow-xl translate-x-1' : 'text-gray-400 hover:bg-[#fdf8f6]'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <tab.icon className="w-4 h-4" /> {tab.label}
                                        </div>
                                        {tab.count !== undefined && (
                                            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[9px] ${activeTab === tab.id ? 'bg-[#e8a4b8] text-[#2d1b2e]' : 'bg-gray-100 text-gray-400'}`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-50 transition-all font-bold text-[11px] uppercase tracking-widest mt-4"
                                >
                                    <X className="w-4 h-4" /> Exit Boutique
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 space-y-8">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-sm border border-purple-50 space-y-12 animate-in fade-in duration-700">
                                <div className="space-y-4 text-center lg:text-left">
                                    <h1 className="text-4xl font-serif font-bold text-[#2d1b2e]">Profile Excellence</h1>
                                    <p className="text-gray-400 max-w-lg leading-relaxed font-medium">Your personal boutique credentials. Every detail contributes to your journey of elegance.</p>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Display Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.name}
                                                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                                className="w-full px-8 py-5 bg-gray-50 border-0 rounded-3xl focus:ring-2 focus:ring-[#e8a4b8]/20 transition-all font-bold text-gray-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Essence</label>
                                            <input
                                                type="text"
                                                readOnly
                                                value={user?.email}
                                                className="w-full px-8 py-5 bg-gray-50/50 border-0 rounded-3xl text-gray-300 font-bold cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Avatar Signature URL</label>
                                            <input
                                                type="text"
                                                value={profileForm.image}
                                                onChange={e => setProfileForm({ ...profileForm, image: e.target.value })}
                                                placeholder="https://example.com/avatar.jpg"
                                                className="w-full px-8 py-5 bg-gray-50 border-0 rounded-3xl focus:ring-2 focus:ring-[#e8a4b8]/20 transition-all font-medium text-[10px] font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="bg-[#2d1b2e] text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {saving ? 'Updating...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
                                {orders.length === 0 ? (
                                    <div className="bg-white rounded-[3rem] p-20 text-center border border-purple-50">
                                        <Package className="w-16 h-16 text-purple-100 mx-auto mb-6" />
                                        <h3 className="text-2xl font-serif font-bold text-[#2d1b2e] mb-2">No collections yet.</h3>
                                        <p className="text-gray-400 mb-10 max-w-xs mx-auto text-sm">Your journey with SanYou starts with your first choice.</p>
                                        <Link href="/" className="bg-[#2d1b2e] text-white px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl">
                                            Begin Boutique Tour
                                        </Link>
                                    </div>
                                ) : (
                                    orders.map(order => (
                                        <div key={order.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-purple-50 group hover:shadow-xl transition-all">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-[#e8a4b8] tracking-widest mb-1">Receipt: {order.orderNumber}</p>
                                                    <p className="text-xl font-serif font-bold text-[#2d1b2e]">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="px-5 py-2.5 bg-purple-50 text-purple-600 rounded-full text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                                                    <p className="text-2xl font-serif font-bold">LE {order.total.toFixed(0)}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                                {order.items?.map(item => (
                                                    <div key={item.id} className="w-20 h-20 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden shadow-inner border border-purple-50/10">
                                                        <img src={item.product?.image} className="w-full h-full object-cover" alt="" title={item.product?.name} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="grid md:grid-cols-2 gap-8 animate-in delay-100 fade-in duration-700">
                                {wishlist.length === 0 ? (
                                    <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border border-purple-50">
                                        <Heart className="w-16 h-16 text-pink-100 mx-auto mb-6" />
                                        <h3 className="text-2xl font-serif font-bold text-[#2d1b2e] mb-2">Your wishlist is empty.</h3>
                                        <p className="text-gray-400 mb-10 text-sm">Capture your favorite moments of beauty for later.</p>
                                        <Link href="/" className="bg-[#e8a4b8] text-white px-10 py-5 rounded-full font-black text-[11px] uppercase tracking-widest">Discover Elegance</Link>
                                    </div>
                                ) : (
                                    wishlist.map(fav => (
                                        <Link href={`/products/${fav.product?.id}`} key={fav.id} className="bg-white rounded-[2.5rem] p-6 border border-purple-50 group hover:shadow-2xl transition-all relative">
                                            <div className="w-full aspect-square bg-gray-50 rounded-[2rem] overflow-hidden mb-6 shadow-inner border border-purple-50/10">
                                                <img src={fav.product?.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                            </div>
                                            <h3 className="text-lg font-serif font-bold text-[#2d1b2e] truncate">{fav.product?.name}</h3>
                                            <div className="flex items-center justify-between mt-4">
                                                <p className="text-xl font-serif font-bold text-[#e8a4b8]">LE {fav.product?.price}</p>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#e8a4b8] transition-all" />
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white rounded-[3rem] p-16 shadow-sm border border-purple-50 space-y-12 animate-in slide-in-from-right duration-700">
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-serif font-bold text-[#2d1b2e]">Protected Access</h1>
                                    <p className="text-gray-400 font-medium max-w-lg leading-relaxed">Update your credentials. We recommend a unique signature for your boutique security.</p>
                                </div>
                                <form onSubmit={handleChangePassword} className="space-y-8 max-w-md">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.new}
                                                onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                                className="w-full px-8 py-5 bg-gray-50 border-0 rounded-3xl focus:ring-2 focus:ring-[#e8a4b8]/20 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Confirm Signature</label>
                                            <input
                                                type="password"
                                                value={passwordForm.confirm}
                                                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                                className="w-full px-8 py-5 bg-gray-50 border-0 rounded-3xl focus:ring-2 focus:ring-[#e8a4b8]/20 transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-[#2d1b2e] text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all disabled:opacity-50"
                                    >
                                        Update Credentials
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-[3rem] p-16 shadow-sm border border-purple-50 space-y-12 animate-in zoom-in duration-500">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-4xl font-serif font-bold text-[#2d1b2e]">Boutique Destinations</h1>
                                    {!showAddressForm && (
                                        <button onClick={() => setShowAddressForm(true)} className="bg-purple-50 text-[#e8a4b8] p-5 rounded-3xl hover:bg-[#e8a4b8] hover:text-white transition-all shadow-sm">
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>

                                {showAddressForm ? (
                                    <form onSubmit={handleAddAddress} className="bg-gray-50 p-10 rounded-[2.5rem] space-y-8 animate-in fade-in transition-all">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient Full Name</label>
                                                <input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} className="w-full px-6 py-4 bg-white border-0 rounded-2xl" placeholder="Amani Jones" />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Elegant Street Address</label>
                                                <input type="text" required value={addressForm.address} onChange={e => setAddressForm({ ...addressForm, address: e.target.value })} className="w-full px-6 py-4 bg-white border-0 rounded-2xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</label>
                                                <input type="text" required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full px-6 py-4 bg-white border-0 rounded-2xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Pulse</label>
                                                <input type="text" required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} className="w-full px-6 py-4 bg-white border-0 rounded-2xl" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-6 pt-4">
                                            <button type="button" onClick={() => setShowAddressForm(false)} className="px-8 py-4 text-gray-400 font-bold text-[11px] uppercase tracking-widest">Cancel</button>
                                            <button type="submit" disabled={saving} className="bg-[#2d1b2e] text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl">Activate Address</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {user?.addresses?.map(addr => (
                                            <div key={addr.id} className="p-8 bg-gray-50/50 border border-purple-50 rounded-[2.5rem] relative group hover:border-[#e8a4b8] transition-all">
                                                <h4 className="font-serif font-bold text-lg text-[#2d1b2e] mb-2">{addr.fullName}</h4>
                                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{addr.address}, {addr.city}</p>
                                                <p className="text-[10px] font-black text-[#e8a4b8] mt-4 uppercase tracking-[0.2em]">{addr.phone}</p>
                                                <button className="absolute top-6 right-6 p-2 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {user?.addresses?.length === 0 && (
                                            <div className="md:col-span-2 py-20 text-center border border-dashed border-purple-100 rounded-[3rem]">
                                                <MapPin className="w-12 h-12 text-purple-100 mx-auto mb-4" />
                                                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">No Destinations Found</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
