import React, { useState, useEffect } from 'react';
import {
    Globe,
    Calendar,
    CreditCard,
    User,
    LogOut,
    Clock,
    CheckCircle2,
    FileText,
    Plane,
    ArrowLeft,
    Phone,
    Mail,
    StickyNote,
    Save
} from 'lucide-react';

import {
    MOCK_CUSTOMERS_DB,
    MOCK_BOOKINGS,
    MOCK_ROUTES,
    MOCK_ROUNDS,
    MOCK_BOOKING_GROUPS
} from '../mockData';

import logo from '../assets/roonganan_newlogo.png';

interface CustomerDashboardProps {
    targetCustomerId?: number;
    onBack?: () => void;
    isAdmin?: boolean;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ targetCustomerId = 4, onBack, isAdmin }) => {
    const [activeTab, setActiveTab] = useState('home');

    // Select user based on prop
    const REAL_USER_DATA = MOCK_CUSTOMERS_DB.find(c => c.id === targetCustomerId);
    const [remark, setRemark] = useState(REAL_USER_DATA?.remark || '');

    // Update remark state when user changes
    useEffect(() => {
        setRemark(REAL_USER_DATA?.remark || '');
    }, [targetCustomerId, REAL_USER_DATA]);

    // Derive bookings for this user
    const MOCK_MY_BOOKINGS = MOCK_BOOKINGS
        .filter(b => b.pax.some(p => p.id === targetCustomerId))
        .map(b => {
            const round = MOCK_ROUNDS.find(r => r.id === b.roundId);
            const route = MOCK_ROUTES.find(r => r.id === round?.routeId);
            const groupSummary = MOCK_BOOKING_GROUPS.find(g =>
                g.roundId === b.roundId &&
                b.pax.some(p => p.id === targetCustomerId && (p.groupName === g.name || b.contactName === g.name))
            );

            return {
                id: `BK-${b.id}`,
                tourName: route?.name || "Unknown Tour",
                tourCode: route?.code || "N/A",
                date: round?.date || "TBA",
                paymentStatus: b.status,
                totalAmount: groupSummary?.totalAmount || 0,
                paidAmount: groupSummary?.paidAmount || 0,
            };
        });

    const CUSTOMER_UI_DATA = {
        name: REAL_USER_DATA ? `${REAL_USER_DATA.firstNameTh} ${REAL_USER_DATA.lastNameTh}` : "Unknown User",
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${REAL_USER_DATA?.firstNameEn || 'User'}`,
        points: 1250,
        tier: "Platinum Member",
    };

    const renderBookingCard = (booking: any) => {
        const remaining = booking.totalAmount - booking.paidAmount;

        return (
            <div key={booking.id} className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-slate-100 overflow-hidden relative group">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#008ac5] bg-[#008ac5]/5 px-2.5 py-1 rounded-lg border border-[#008ac5]/10">
                        {booking.tourCode}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">#{booking.id}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-3">
                    {booking.tourName}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        <Calendar size={12} className="text-[#008ac5]" />
                        {booking.date}
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center mb-4 border border-slate-100/80">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                            <CreditCard size={14} className="text-[#008ac5]" />
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">สถานะชำระเงิน</p>
                            <p className={`text-[12px] font-bold ${remaining > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {remaining > 0 ? `คงเหลือ ฿${remaining.toLocaleString()}` : 'ชำระครบถ้วนแล้ว'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 bg-white border border-slate-100 py-3 rounded-2xl hover:bg-slate-50 transition-all text-[11px] font-bold text-slate-700 shadow-sm active:scale-95">
                        <FileText size={16} className="text-[#008ac5]" /> โปรแกรมทัวร์
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white border border-slate-100 py-3 rounded-2xl hover:bg-slate-50 transition-all text-[11px] font-bold text-slate-700 shadow-sm active:scale-95">
                        <Plane size={16} className="text-[#008ac5]" /> ใบเตรียมตัว
                    </button>
                </div>
            </div>
        );
    };

    const renderProfile = () => (
        <div className="animate-fade-in-up pb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-5 px-1 flex items-center gap-2">
                <div className="w-1 h-6 bg-[#008ac5] rounded-full"></div>
                ข้อมูลส่วนตัว
            </h2>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-[#008ac5]">
                            <User size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">ชื่อ-นามสกุล</p>
                            <p className="text-base font-bold text-slate-900">{CUSTOMER_UI_DATA.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Phone size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">เบอร์โทรศัพท์</p>
                            <p className="text-base font-bold text-slate-900">{REAL_USER_DATA?.phone || 'ไม่ระบุ'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <FileText size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">เลขพาสปอร์ต</p>
                            <p className="text-base font-bold text-slate-900">{REAL_USER_DATA?.passportNo || 'ไม่ระบุ'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Mail size={22} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">อีเมล</p>
                            <p className="text-base font-bold text-slate-900">{REAL_USER_DATA?.email || 'ไม่ระบุ'}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2 mb-3">
                            <StickyNote size={16} className="text-[#008ac5]" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">หมายเหตุ (ข้อมูลสำคัญ)</p>
                        </div>
                        <textarea
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            placeholder="ระบุความต้องการพิเศษ หรือแพ้อาหาร..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium text-slate-700 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#008ac5]/10 focus:border-[#008ac5] transition-all resize-none"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={() => alert('บันทึกเรียบร้อยแล้ว')}
                                className="bg-[#008ac5] text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-rt-dark transition-all flex items-center gap-2"
                            >
                                <Save size={12} /> บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => {
                    if (onBack) {
                        onBack();
                    } else {
                        const baseUrl = import.meta.env.BASE_URL;
                        const targetPath = baseUrl.endsWith('/') ? `${baseUrl}login` : `${baseUrl}/login`;
                        window.history.pushState({}, '', targetPath);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    }
                }}
                className="w-full bg-slate-100/80 text-slate-500 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
                <LogOut size={16} /> {isAdmin ? 'ออกจากการดูหน้าลูกค้า' : 'ออกจากระบบ'}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Sarabun',sans-serif] pb-24 max-w-lg mx-auto shadow-2xl relative overflow-x-hidden">
            {/* Premium Colorful Header */}
            <header className="bg-[#008ac5] bg-gradient-to-r from-[#008ac5] to-[#0174aa] px-6 py-4 sticky top-0 z-40 shadow-lg shadow-[#008ac5]/20">
                <div className="flex justify-between items-center max-w-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-white/10">
                            <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                        </div>
                        <div className="w-[1px] h-6 bg-white/20"></div>
                        <div>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] leading-none mb-1">ยินดีต้อนรับ</p>
                            <h1 className="text-lg font-black text-white tracking-tight leading-none">คุณ{CUSTOMER_UI_DATA.name.split(' ')[0]}</h1>
                        </div>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={onBack}
                            className="bg-white/15 backdrop-blur-md text-white h-9 px-4 rounded-xl flex items-center gap-2 hover:bg-white/25 transition-all border border-white/20 text-[11px] font-bold"
                        >
                            <ArrowLeft size={16} /> กลับ
                        </button>
                    )}
                </div>
            </header>

            <main className="px-6 pt-6">
                {activeTab === 'home' && (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center justify-between mb-5 px-1">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <div className="w-1 h-6 bg-[#008ac5] rounded-full"></div>
                                ทัวร์ของฉัน
                            </h2>
                            <span className="bg-[#008ac5]/10 text-[#008ac5] text-[10px] font-bold px-2.5 py-1 rounded-lg">
                                {MOCK_MY_BOOKINGS.length} รายการ
                            </span>
                        </div>
                        <div className="flex flex-col">
                            {MOCK_MY_BOOKINGS.map(renderBookingCard)}
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-lg font-bold text-slate-900 mb-5 px-1 flex items-center gap-2">
                            <div className="w-1 h-6 bg-slate-300 rounded-full"></div>
                            ประวัติการเดินทาง
                        </h2>
                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                            <Clock size={40} className="mx-auto mb-4 text-slate-200" />
                            <p className="font-bold text-slate-300 uppercase text-[10px] tracking-widest">ยังไม่มีข้อมูล</p>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && renderProfile()}
            </main>

            {/* Bottom Nav - Slimmer & More Modern */}
            <div className="fixed bottom-6 left-6 right-6 max-w-lg mx-auto z-50">
                <nav className="bg-white/80 backdrop-blur-xl rounded-2xl flex justify-between p-1.5 shadow-xl border border-white/50">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`flex flex-1 items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${activeTab === 'home' ? 'bg-[#008ac5] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Globe size={18} />
                        {activeTab === 'home' && <span className="text-[11px] font-bold uppercase tracking-wider">การจอง</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex flex-1 items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${activeTab === 'history' ? 'bg-[#008ac5] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Clock size={18} />
                        {activeTab === 'history' && <span className="text-[11px] font-bold uppercase tracking-wider">ประวัติ</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex flex-1 items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-[#008ac5] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <User size={18} />
                        {activeTab === 'profile' && <span className="text-[11px] font-bold uppercase tracking-wider">โปรไฟล์</span>}
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default CustomerDashboard;
