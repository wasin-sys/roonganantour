
// === Payment Management ===
const renderPayment = () => {
    const totalSelected = selectedPayments.reduce((sum, id) => {
        const payment = payments.find(p => p.id === id);
        return sum + (payment ? payment.totalAmount - payment.paidAmount : 0);
    }, 0);

    const handleTogglePayment = (id) => {
        setSelectedPayments(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handlePaymentGateway = () => {
        alert('Redirecting to Payment Gateway... (Mock)');
        setTimeout(() => {
            const newTransactions = selectedPayments.map((paymentId, idx) => {
                const payment = payments.find(p => p.id === paymentId);
                const remaining = payment.totalAmount - payment.paidAmount;
                return {
                    paymentId,
                    transaction: {
                        id: Date.now() + idx,
                        date: new Date().toLocaleDateString('en-CA'),
                        amount: remaining,
                        method: 'gateway',
                        receipt: 'auto_gateway.pdf',
                        status: 'verified',
                        verifiedBy: currentUser.id,
                        verifiedAt: new Date().toLocaleDateString('en-CA')
                    }
                };
            });

            setPayments(prev => prev.map(payment => {
                const newTx = newTransactions.find(t => t.paymentId === payment.id);
                if (newTx) {
                    return {
                        ...payment,
                        paidAmount: payment.totalAmount,
                        status: 'paid',
                        transactions: [...payment.transactions, newTx.transaction]
                    };
                }
                return payment;
            }));

            setSelectedPayments([]);
            alert('Payment verified automatically!');
        }, 1500);
    };

    const handleTransferUpload = () => {
        setIsPaymentModalOpen(true);
        setPaymentFormData({ method: 'transfer', amount: totalSelected, receipt: null, note: '' });
    };

    const submitTransferPayment = () => {
        if (!paymentFormData.receipt) {
            alert('Please upload a receipt!');
            return;
        }

        const newTransactions = selectedPayments.map((paymentId, idx) => {
            const payment = payments.find(p => p.id === paymentId);
            const remaining = payment.totalAmount - payment.paidAmount;
            return {
                paymentId,
                transaction: {
                    id: Date.now() + idx,
                    date: new Date().toLocaleDateString('en-CA'),
                    amount: paymentFormData.amount || remaining,
                    method: 'transfer',
                    receipt: paymentFormData.receipt,
                    note: paymentFormData.note,
                    status: 'pending',
                    verifiedBy: null,
                    verifiedAt: null
                }
            };
        });

        setPayments(prev => prev.map(payment => {
            const newTx = newTransactions.find(t => t.paymentId === payment.id);
            if (newTx) {
                const newPaidAmount = payment.paidAmount + newTx.transaction.amount;
                return {
                    ...payment,
                    paidAmount: newPaidAmount,
                    status: newPaidAmount >= payment.totalAmount ? 'paid' : 'partial',
                    transactions: [...payment.transactions, newTx.transaction]
                };
            }
            return payment;
        }));

        setSelectedPayments([]);
        setIsPaymentModalOpen(false);
        alert('Payment receipt uploaded! Waiting for verification.');
    };

    return (
        <div className="space-y-6 h-full flex flex-col animate-fade-in">
            <header className="mb-2">
                <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
                <p className="text-gray-500 text-sm">Process payments and track transactions</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Total Outstanding</p>
                            <p className="text-2xl font-bold text-red-600">
                                ฿{payments.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0).toLocaleString()}
                            </p>
                        </div>
                        <Clock className="text-red-400" size={32} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Paid This Month</p>
                            <p className="text-2xl font-bold text-[#37c3a5]">
                                ฿{payments.reduce((sum, p) => sum + p.paidAmount, 0).toLocaleString()}
                            </p>
                        </div>
                        <CheckCircle2 className="text-[#37c3a5]" size={32} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Pending Verification</p>
                            <p className="text-2xl font-bold text-[#fdcf1a]">
                                {payments.filter(p => p.transactions.some(t => t.status === 'pending')).length}
                            </p>
                        </div>
                        <Upload className="text-[#fdcf1a]" size={32} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Selected</p>
                            <p className="text-2xl font-bold text-[#03b8fa]">฿{totalSelected.toLocaleString()}</p>
                        </div>
                        <Wallet className="text-[#03b8fa]" size={32} />
                    </div>
                </div>
            </div>

            {selectedPayments.length > 0 && (
                <div className="bg-[#d9edf4] border border-[#03b8fa] rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="font-bold text-[#0279a9]">{selectedPayments.length} payment(s) selected</p>
                        <p className="text-sm text-gray-600">Total: ฿{totalSelected.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handlePaymentGateway} className="bg-[#37c3a5] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#2da88a] shadow-lg flex items-center gap-2">
                            <CreditCard size={20} /> Pay via Gateway (Mock)
                        </button>
                        <button onClick={handleTransferUpload} className="bg-[#03b8fa] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0279a9] shadow-lg flex items-center gap-2">
                            <Upload size={20} /> Upload Transfer Receipt
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Wallet size={18} /> Pending Payments ({payments.filter(p => p.status !== 'paid').length})</h3>
                </div>
                <div className="overflow-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 w-12">
                                    <input type="checkbox" className="w-4 h-4 cursor-pointer" onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedPayments(payments.filter(p => p.status !== 'paid').map(p => p.id));
                                        } else {
                                            setSelectedPayments([]);
                                        }
                                    }} checked={selectedPayments.length === payments.filter(p => p.status !== 'paid').length && payments.filter(p => p.status !== 'paid').length > 0} />
                                </th>
                                <th className="px-4 py-3">Booking ID</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Route</th>
                                <th className="px-4 py-3">Sale</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3 text-right">Paid</th>
                                <th className="px-4 py-3 text-right">Balance</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map(payment => {
                                const route = routes.find(r => r.id === payment.routeId);
                                const sale = appUsers.find(u => u.id === payment.saleId);
                                const balance = payment.totalAmount - payment.paidAmount;

                                return (
                                    <tr key={payment.id} className={`hover:bg-gray-50 ${selectedPayments.includes(payment.id) ? 'bg-[#d9edf4]' : ''}`}>
                                        <td className="px-4 py-3">
                                            <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={selectedPayments.includes(payment.id)} onChange={() => handleTogglePayment(payment.id)} disabled={payment.status === 'paid'} />
                                        </td>
                                        <td className="px-4 py-3 font-mono font-bold text-gray-700">#{payment.bookingId}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-800">{payment.contactName}</div>
                                            <div className="text-xs text-gray-400">{payment.createdAt}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="bg-[#d9edf4] text-[#0279a9] px-2 py-1 rounded text-xs font-bold">{route?.code}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{sale?.name}</td>
                                        <td className="px-4 py-3 text-right font-bold text-gray-800">฿{payment.totalAmount.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-[#37c3a5] font-bold">฿{payment.paidAmount.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-bold text-red-600">฿{balance.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    payment.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {payment.status === 'paid' ? 'Paid' : payment.status === 'partial' ? 'Partial' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isPaymentModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        <div className="bg-[#0279a9] text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
                            <h3 className="font-bold flex items-center gap-2"><Upload size={20} /> Upload Transfer Receipt</h3>
                            <button onClick={() => setIsPaymentModalOpen(false)} className="hover:bg-[#03b8fa] p-1 rounded"><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-2 block">Total Amount</label>
                                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
                                    <p className="text-3xl font-bold text-[#03b8fa]">฿{totalSelected.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 mt-1">{selectedPayments.length} payment(s) selected</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-2 block">Upload Receipt</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#03b8fa] transition cursor-pointer">
                                    <input type="file" className="hidden" id="receipt-upload" onChange={(e) => setPaymentFormData({ ...paymentFormData, receipt: e.target.files[0]?.name })} />
                                    <label htmlFor="receipt-upload" className="cursor-pointer">
                                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Click to upload receipt</p>
                                        {paymentFormData.receipt && <p className="text-xs text-[#03b8fa] mt-2 font-bold">✓ {paymentFormData.receipt}</p>}
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-2 block">Note (Optional)</label>
                                <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm" rows="3" placeholder="Additional notes..." value={paymentFormData.note} onChange={(e) => setPaymentFormData({ ...paymentFormData, note: e.target.value })} />
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t">
                            <button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                            <button onClick={submitTransferPayment} className="px-6 py-2 bg-[#03b8fa] text-white rounded-lg font-medium hover:bg-[#0279a9] flex items-center gap-2"><CheckCircle2 size={18} /> Submit Payment</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
        <aside className={`bg-white shadow-xl z-20 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <div className="p-4 flex items-center justify-between border-b border-gray-100 h-16">{isSidebarOpen ? (<div className="flex items-center gap-2 text-[#03b8fa] font-bold text-xl"><Plane className="fill-current" /> <span>Roonganan Tour<span className="text-[#0279a9] font-light ml-1">SYS</span></span></div>) : (<div className="mx-auto text-[#03b8fa]"><Plane /></div>)}<button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 lg:hidden"><Menu size={20} /></button></div>

            {/* User Switcher for RBAC Demo */}
            {isSidebarOpen && (
                <div className="px-4 pt-4 pb-2">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Current User (Demo)</div>
                    <div className="relative">
                        <select className="w-full border rounded-lg p-2 bg-gray-50 text-sm appearance-none cursor-pointer hover:bg-gray-100 transition" value={currentUser.id} onChange={(e) => {
                            const selected = appUsers.find(u => u.id === Number(e.target.value));
                            setCurrentUser(selected);
                        }}>
                            {appUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"><Settings size={14} /></div>
                    </div>
                </div>
            )}

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto"><SidebarItem icon={Users} label={isSidebarOpen ? "CRM & Blacklist" : ""} active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} /><SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? "Dashboard" : ""} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} /><SidebarItem icon={Calendar} label={isSidebarOpen ? "Bookings" : ""} active={activeTab === 'booking'} onClick={() => setActiveTab('booking')} /><SidebarItem icon={FileText} label={isSidebarOpen ? "Operations" : ""} active={activeTab === 'operation'} onClick={() => setActiveTab('operation')} /><SidebarItem icon={Wallet} label={isSidebarOpen ? "Payments" : ""} active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} /><SidebarItem icon={Settings} label={isSidebarOpen ? "Settings" : ""} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} /></nav>
            <div className="p-4 border-t border-gray-100"><SidebarItem icon={LogOut} label={isSidebarOpen ? "Logout" : ""} active={false} onClick={() => alert("Logged out")} /></div>
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden relative">
            <div className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:hidden"><button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button></div>
            <div className="flex-1 overflow-y-auto p-4 md:p-8">{activeTab === 'dashboard' && renderDashboard()}{activeTab === 'booking' && renderBooking()}{activeTab === 'operation' && renderOperation()}{activeTab === 'payment' && renderPayment()}{activeTab === 'crm' && renderCRM()}{activeTab === 'settings' && renderSettings()}</div>
            {isFormOpen && renderCustomerFormModal()}
        </main>
    </div>
);
}
