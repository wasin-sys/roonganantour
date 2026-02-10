import React from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, Globe, Star } from 'lucide-react';

const CustomerLogin: React.FC = () => {
    const handleLineLogin = () => {
        // Mock Liff Login and navigate to dashboard
        window.history.pushState({}, '', '/customer');
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Sarabun',sans-serif]">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#008ac5]/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#16809a]/10 rounded-full blur-[100px] animate-pulse"></div>

            <div className="max-w-md w-full z-10">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-6 border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                        <Globe className="text-[#008ac5]" size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        ROONG A NAN <span className="text-[#008ac5]">TOUR</span>
                    </h1>
                    <p className="text-gray-500 font-medium">ยินดีต้อนรับสู่ระบบบริการลูกค้าอัจฉริยะ</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-10 border border-gray-100 backdrop-blur-sm relative overflow-hidden">
                    {/* Subtle patterns */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Star size={100} className="text-gray-400 rotate-12" />
                    </div>

                    <div className="relative">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <ShieldCheck className="text-green-500" size={24} />
                            เข้าสู่ระบบเพื่อดำเนินการต่อ
                        </h2>

                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            กรุณาเข้าสู่ระบบผ่าน LINE เพื่อตรวจสอบข้อมูลการจองทัวร์
                            เอกสารการเดินทาง และสถานะการชำระเงินของคุณ
                        </p>

                        {/* LINE Login Button */}
                        <button
                            onClick={handleLineLogin}
                            className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-green-500/20 active:scale-95 group"
                        >
                            <div className="bg-white p-1 rounded-lg">
                                <MessageCircle fill="#06C755" className="text-[#06C755]" size={20} />
                            </div>
                            <span>Login with LINE</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span>ตรวจสอบรายการจอง (Booking History)</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                <span>จัดการข้อมูลผู้เดินทาง (Pax Information)</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                                <span>ดาวน์โหลดใบรับเงิน/ใบวางบิล (Documents)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-gray-400 text-xs">
                    <p>© {new Date().getFullYear()} Roong A Nan Tour Co., Ltd. All rights reserved.</p>
                    <div className="mt-4 flex justify-center gap-6">
                        <a href="#" className="hover:text-[#008ac5] transition-colors">นโยบายความเป็นส่วนตัว</a>
                        <a href="#" className="hover:text-[#008ac5] transition-colors">ติดต่อสอบถาม</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
