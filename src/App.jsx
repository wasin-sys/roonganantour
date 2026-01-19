import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  Plane,
  AlertTriangle,
  CheckCircle,
  Search,
  Plus,
  MoreVertical,
  Printer,
  FileDown,
  Tags,
  Menu,
  X,
  CreditCard,
  UserCheck,
  Edit2,
  Trash2,
  Save,
  UserPlus,
  ShieldAlert,
  Ban,
  ArrowLeft,
  CheckSquare,
  Square,
  MapPin,
  Image as ImageIcon,
  Globe,
  List,
  DollarSign,
  FileText as FileIcon,
  Download,
  UserPlus as UserIcon,
  ArrowRight,
  Wallet,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  Gift,
  Bed,
  ShoppingBag,
  FileCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Pin
} from 'lucide-react';

import {
  MOCK_USERS as USERS,
  MOCK_ROUTES,
  MOCK_ROUNDS,
  MOCK_CUSTOMERS_DB,
  MOCK_PAX_IN_ROUND_101,
  MOCK_PAX_IN_ROUND_102,
  MOCK_PAX_IN_ROUND_201,
  MOCK_PAX_IN_ROUND_301,
  MOCK_PAX_IN_ROUND_103,
  MOCK_PAX_IN_ROUND_401,
  MOCK_PAX_IN_ROUND_402,
  INITIAL_PAYMENTS,
  INITIAL_BLACKLIST_DATA,
  INITIAL_CUSTOMER_STATE,
  MOCK_BANK_ACCOUNTS,
  MOCK_BOOKINGS,
  // Document Management System
  BOOKING_TYPES,
  MOCK_BOOKING_GROUPS,
  INITIAL_BILLING_NOTES,
  INITIAL_RECEIPTS,
  INITIAL_TAX_INVOICES,
  PAYMENT_METHODS,
  DOCUMENT_STATUS,
  PAYMENT_GATEWAY_CONFIG,
  generateTaxInvoiceNumber
} from './mockData';

const INDIVIDUAL_TASKS = [
  { key: 'passport', label: 'Passport', icon: FileText, color: 'text-[#03b8fa]', bg: 'bg-[#d9edf4]' },
  { key: 'visa', label: 'Visa', icon: ShieldAlert, color: 'text-[#37c3a5]', bg: 'bg-green-50' },
  { key: 'ticket', label: 'ตั๋วบิน', icon: Plane, color: 'text-purple-500', bg: 'bg-purple-50' },
  { key: 'insurance', label: 'Ins.', icon: UserCheck, color: 'text-[#fdcf1a]', bg: 'bg-yellow-50' },
  { key: 'prepDoc', label: 'ใบเตรียมตัว', icon: FileIcon, color: 'text-orange-500', bg: 'bg-orange-50' },
  { key: 'payment', label: 'Payment', icon: Wallet, color: 'text-green-600', bg: 'bg-green-50' }
];



// --- Components ---

const AlertBadge = ({ type, message }) => {
  const styles = type === 'danger' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#fdcf1a]/20 text-[#0279a9] border-[#fdcf1a]/30';
  const Icon = type === 'danger' ? AlertTriangle : UserCheck;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-md border ${styles} text-sm font-medium animate-pulse`}>
      <Icon size={16} />
      {message}
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${active ? 'bg-[#d9edf4] text-[#03b8fa] border-r-4 border-[#03b8fa]' : 'text-gray-600 hover:bg-gray-50'}`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className={`text-xs mt-2 font-medium ${color === 'green' ? 'text-green-600' : 'text-blue-600'}`}>{subtext}</p>
    </div>
    <div className={`p-3 rounded-lg ${color === 'green' ? 'bg-green-50 text-green-600' : color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-[#d9edf4] text-[#03b8fa]'}`}>
      <Icon size={24} />
    </div>
  </div>
);

// --- Main App ---

export default function TourSystemApp() {
  const [appUsers, setAppUsers] = useState(USERS);
  const [currentUser, setCurrentUser] = useState(USERS[0]); // Default to Admin

  // Lifted MOCK data to state for Manager editing
  const [routes, setRoutes] = useState(MOCK_ROUTES);
  const [rounds, setRounds] = useState(MOCK_ROUNDS);

  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [bookingDetails, setBookingDetails] = useState({ contactName: '', specialRequest: '', discount: 0, tourCode: '' });
  const [activeTab, setActiveTab] = useState('operation');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS_DB);
  const [blacklist, setBlacklist] = useState(INITIAL_BLACKLIST_DATA);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_CUSTOMER_STATE);
  const [formMode, setFormMode] = useState('create');
  const [alerts, setAlerts] = useState([]);
  const [crmSubTab, setCrmSubTab] = useState('customers');
  const [isBlacklistFormOpen, setIsBlacklistFormOpen] = useState(false);
  const [blacklistFormData, setBlacklistFormData] = useState({ name: '', passport: '', reason: '' });
  const [operationView, setOperationView] = useState('list');
  const [operationTab, setOperationTab] = useState('upcoming'); // 'upcoming' | 'ongoing' | 'completed'
  const [selectedOpRound, setSelectedOpRound] = useState(null);
  const [showTagPreview, setShowTagPreview] = useState(false);
  const [paxTaskStatus, setPaxTaskStatus] = useState({});
  const [guideTaskStatus, setGuideTaskStatus] = useState({}); // { [roundId]: { ticket: boolean, hotel: boolean } }
  const [blacklistSearchTerm, setBlacklistSearchTerm] = useState('');
  const [showBlacklistSearch, setShowBlacklistSearch] = useState(false);

  // Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState(MOCK_BANK_ACCOUNTS);
  const [isBankFormOpen, setIsBankFormOpen] = useState(false);
  const [bankFormData, setBankFormData] = useState({ bank: '', accountName: '', accountNumber: '', branch: '', color: 'bg-blue-600' });
  const [selectedBankForTransfer, setSelectedBankForTransfer] = useState(''); // For payment modal
  const [settingsTab, setSettingsTab] = useState('bank'); // 'users' or 'bank'

  // Payment Confirmation State
  const [billingInfo, setBillingInfo] = useState({ type: 'individual', name: '', taxId: '', address: '', email: '', phone: '' });
  const [paymentStep, setPaymentStep] = useState(1);

  // Payment States
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [paymentFormData, setPaymentFormData] = useState({ method: '', amount: 0, receipt: null, note: '' });
  const [paymentSubTab, setPaymentSubTab] = useState('billing'); // 'billing', 'receipt', 'tax'

  // New States for Booking Improvements
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [selectedPaxForBooking, setSelectedPaxForBooking] = useState([]); // Array of IDs to confirm
  const [bookingPaxList, setBookingPaxList] = useState([]); // Passengers added to current booking session
  const [bookingPaxMetadata, setBookingPaxMetadata] = useState({}); // { [paxId]: { addedBy: userId, timestamp: ... } }

  const [isBookingConfirmationModalOpen, setIsBookingConfirmationModalOpen] = useState(false);
  const [viewingSaleId, setViewingSaleId] = useState(null); // ID of sale user to view details
  const [viewingPaymentId, setViewingPaymentId] = useState(null); // ID of payment to view details

  // User Management State
  const [isUserFormModalOpen, setIsUserFormModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({ name: '', role: 'SALE', commissionRank: 2, avatar: 'https://i.pravatar.cc/150?u=99', id: null });

  // === Document Management States ===
  const [billingNotes, setBillingNotes] = useState(INITIAL_BILLING_NOTES);
  const [receipts, setReceipts] = useState(INITIAL_RECEIPTS);
  const [taxInvoices, setTaxInvoices] = useState(INITIAL_TAX_INVOICES);
  const [bookingGroups, setBookingGroups] = useState(MOCK_BOOKING_GROUPS);

  // Booking Type Selection (Individual vs Group)
  const [bookingAddMode, setBookingAddMode] = useState(null); // 'individual' or 'group'
  const [showBookingTypeModal, setShowBookingTypeModal] = useState(false);
  const [currentGroupName, setCurrentGroupName] = useState('');

  // Document Preview/Creation Modal
  const [viewingBillingNote, setViewingBillingNote] = useState(null);
  const [selectedBillingBankId, setSelectedBillingBankId] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [viewingTaxInvoice, setViewingTaxInvoice] = useState(null);
  const [isCreatingBillingNote, setIsCreatingBillingNote] = useState(false);
  const [isCreatingReceipt, setIsCreatingReceipt] = useState(false);
  const [isCreatingTaxInvoice, setIsCreatingTaxInvoice] = useState(false);
  const [selectedItemsForBilling, setSelectedItemsForBilling] = useState([]);
  const [billingAmount, setBillingAmount] = useState(0); // ยอดที่ต้องการวางบิล
  const [selectedReceiptForTaxInvoice, setSelectedReceiptForTaxInvoice] = useState(null);
  const [taxInvoiceFormData, setTaxInvoiceFormData] = useState({ customerType: 'individual' });

  // Commission Ranks State
  const [commissionRanks, setCommissionRanks] = useState([
    { id: 1, name: 'Rank 1 (อาวุโส)', defaultAmount: 500, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
    { id: 2, name: 'Rank 2 (ทั่วไป)', defaultAmount: 300, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' }
  ]);
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [rankFormData, setRankFormData] = useState({ name: '', defaultAmount: 0, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', id: null });

  const getPaxForRound = (roundId) => {
    // Get unique passengers from actual bookings for this round
    // This serves as the Single Source of Truth, preventing duplicates from mixing raw MOCK data with MOCK_BOOKINGS
    const realPax = bookings
      .filter(b => (b.round?.id || b.roundId) === roundId) // Match round ID
      .flatMap(b => b.pax.map(p => ({
        ...p,
        room: p.room || 'Unassigned',
        bookingId: b.id,
        // Composite ID to prevent key conflicts with mock data if same user booked
        uniqueId: `${p.id}-${b.id}`
      })));

    return realPax;
  };

  const calculateEstimatedProgress = (roundId) => {
    const paxList = getPaxForRound(roundId);
    if (!paxList || paxList.length === 0) return 0;

    let totalScore = 0;
    // 6 Tasks: Passport, Visa, Ticket, Insurance, PrepDoc, Payment
    const maxScore = paxList.length * 6;

    paxList.forEach(pax => {
      // 1. Passport (Assumed true if passportNo exists)
      if (pax.passportNo) totalScore += 1;
      // 2. Visa (Auto for THAI, or check attachment)
      if (pax.nationality === 'THAI' || pax.attachments?.visa) totalScore += 1;
      // 3. Ticket (Check attachment)
      if (pax.attachments?.ticket) totalScore += 1;
      // 4. Insurance (Check attachment)
      if (pax.attachments?.insurance) totalScore += 1;
      // 5. Prep Doc (Check attachment)
      if (pax.attachments?.prepDoc) totalScore += 1;
      // 6. Payment (Check status)
      if (pax.paymentStatus === 'paid') totalScore += 1;
    });

    return Math.round((totalScore / maxScore) * 100);
  };

  useEffect(() => {
    if (selectedOpRound) {
      setPaxTaskStatus(prev => {
        const paxList = getPaxForRound(selectedOpRound.id);
        const newStatus = { ...prev };
        let hasChanges = false;

        paxList.forEach(pax => {
          if (!newStatus[pax.id]) {
            // Auto-check payment if status is 'paid'
            const isPaid = pax.paymentStatus === 'paid';
            newStatus[pax.id] = {
              passport: { checked: true, file: 'scanned_passport.pdf' },
              visa: { checked: pax.nationality === 'THAI', file: null },
              ticket: { checked: false, file: null },
              insurance: { checked: false, file: null },
              prepDoc: { checked: false, file: null },
              payment: { checked: isPaid, file: isPaid ? 'receipt.pdf' : null }
            };
            hasChanges = true;
          }
        });

        return hasChanges ? newStatus : prev;
      });
    }
  }, [selectedOpRound]);

  const togglePaxTask = (paxId, taskKey) => {
    setPaxTaskStatus(prev => {
      const task = prev[paxId][taskKey];
      const newChecked = !task.checked;
      let newFile = task.file;

      if (newChecked && !task.file) {
        // Mock File Upload
        const mockFile = window.prompt("Simulate File Upload: Enter filename (or leave empty)", `doc_${paxId}_${taskKey}.pdf`);
        newFile = mockFile || 'attached_file.pdf';
      }

      return { ...prev, [paxId]: { ...prev[paxId], [taskKey]: { checked: newChecked, file: newFile } } };
    });
  };

  const toggleGuideTask = (roundId, key) => {
    setGuideTaskStatus(prev => ({
      ...prev,
      [roundId]: {
        ...prev[roundId],
        [key]: !prev[roundId]?.[key]
      }
    }));
  };

  // Handle Tour Approval by Manager
  const handleApproveRound = (roundId) => {
    if (currentUser.role !== 'MANAGER') {
      alert('เฉพาะ Manager เท่านั้นที่สามารถอนุมัติทัวร์ได้');
      return;
    }

    const round = rounds.find(r => r.id === roundId);
    if (!round) return;

    const confirmMessage = `ยืนยันการอนุมัติทัวร์ ${routes.find(r => r.id === round.routeId)?.code || ''} วันที่ ${round.date}?`;
    if (window.confirm(confirmMessage)) {
      setRounds(prev => prev.map(r =>
        r.id === roundId
          ? {
            ...r,
            approved: true,
            approvedBy: currentUser.id,
            approvedAt: new Date().toISOString().split('T')[0]
          }
          : r
      ));
      alert('✅ อนุมัติทัวร์เรียบร้อยแล้ว');
    }
  };

  const operationProgress = useMemo(() => {
    // Default safe return
    const safeBreakdown = { passport: 0, visa: 0, ticket: 0, insurance: 0, prepDoc: 0, payment: 0 };
    if (!selectedOpRound || Object.keys(paxTaskStatus).length === 0) {
      return { total: 0, completed: 0, percent: 0, breakdown: safeBreakdown, paxCount: 0 };
    }
    let totalTasks = 0, completedTasks = 0;
    const breakdown = { passport: 0, visa: 0, ticket: 0, insurance: 0, prepDoc: 0, payment: 0 };
    const paxCount = Object.keys(paxTaskStatus).length;
    Object.values(paxTaskStatus).forEach(tasks => {
      Object.entries(tasks).forEach(([key, task]) => { totalTasks++; if (task.checked) { completedTasks++; breakdown[key]++; } });
    });
    return { total: totalTasks, completed: completedTasks, percent: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100), breakdown, paxCount };
  }, [paxTaskStatus, selectedOpRound]);

  const validatePassport = (paxData) => {
    const newAlerts = [];
    const today = new Date();
    const expireDate = new Date(paxData.passportExpire);
    const isBlacklisted = blacklist.some(b => (paxData.passportNo.length > 3 && b.passport.includes(paxData.passportNo)) || (paxData.firstNameEn.length > 3 && b.name.toLowerCase().includes(paxData.firstNameEn.toLowerCase())));
    if (isBlacklisted) newAlerts.push({ type: 'danger', msg: 'BLACKLIST DETECTED! Do not proceed.' });
    if (paxData.nationality !== 'THAI') newAlerts.push({ type: 'warning', msg: 'FOREIGN PASSPORT: Check China Visa Requirements.' });
    if (paxData.passportExpire) {
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(today.getMonth() + 6);
      if (expireDate < sixMonthsFromNow) newAlerts.push({ type: 'warning', msg: 'PASSPORT EXPIRING SOON (< 6 Months)' });
    }
    setAlerts(newAlerts);
  };

  const handleFormChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    if (['passportNo', 'firstNameEn', 'nationality', 'passportExpire'].includes(field)) validatePassport(updatedData);
  };

  const handleFileAttach = (type, file) => {
    // Mock file upload
    if (file) {
      setFormData(prev => ({
        ...prev,
        attachments: { ...prev.attachments, [type]: file.name }
      }));
    }
  };

  const openCustomerForm = (customer = null) => {
    // Determine permissions for this specific customer
    // Manager & Head: Full Access
    // Owner: Edit Access
    // Others: View Only
    // Note: 'Head' check requires knowledge of the current round context, which might be tricky if we open from CRM list.
    // For CRM list, we might just check Owner/Manager. For Operations, we check Head too.

    // Simple global check for CRM context:
    const isOwner = customer && customer.ownerId === currentUser.id;
    const isManager = currentUser.role === 'MANAGER';

    // If opening largely from Booking context, it's usually editable (draft).
    // If opening from Operation/CRM, strict rules apply.

    // We'll pass a 'readOnly' flag to the state or just handle it in UI render
    // For now, let's just open. renderCustomerFormModal will handle the UI state.

    if (customer) {
      const baseData = { ...INITIAL_CUSTOMER_STATE, ...customer };
      // Documents are NOT loaded from global customer but can be loaded from local pax context
      if (bookingStep === 3 || activeTab === 'operation') {
        baseData.attachments = customer.attachments || { passport: null, visa: null, birthCert: null };
      }
      setFormData(baseData);
      setFormMode('edit');
      validatePassport(baseData);
    }
    else {
      setFormData({
        ...INITIAL_CUSTOMER_STATE,
        ownerId: currentUser.id,
        attachments: (bookingStep === 3) ? { passport: null, visa: null, birthCert: null } : null
      });
      setFormMode('create');
      setAlerts([]);
    }
    setIsFormOpen(true);
  };

  const saveCustomer = () => {
    if (!formData.firstNameEn || !formData.passportNo) { alert("Please fill in at least Name and Passport No."); return; }

    // Normalize Data - Strip attachments for global database
    const { attachments, ...globalData } = formData;
    const finalGlobalData = { ...globalData, ownerId: formData.ownerId || currentUser.id };

    if (formMode === 'create') {
      const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
      const newCustomer = { ...finalGlobalData, id: newId };

      setCustomers(prev => [...prev, newCustomer]);

      // If we are in booking step 3, add with attachments to the booking session
      if (bookingStep === 3 && selectedRound) {
        const paxWithAttachments = { ...newCustomer, attachments: attachments || {}, roundId: selectedRound.id };
        setBookingPaxList(prev => [...prev, paxWithAttachments]);
        setSelectedPaxForBooking(prev => [...prev, newId]);
      }
    } else {
      setCustomers(customers.map(c => c.id === formData.id ? finalGlobalData : c));
      // If we are editing from Booking/Operation context, we might want to update the local instance with attachments
      if (bookingStep === 3) {
        setBookingPaxList(prev => prev.map(p => p.id === formData.id ? { ...p, ...formData } : p));
      }
      if (activeTab === 'operation') {
        // Update attachments in paxTaskStatus or bookings state if needed
        // For simplicity in this mock, we assume paxList in Operation is derived or we update the relevant context
        // If we update paxTaskStatus, it covers the file check
      }
    }
    setIsFormOpen(false);
  };

  const deleteCustomer = (id) => { if (window.confirm("Are you sure you want to delete this customer?")) setCustomers(customers.filter(c => c.id !== id)); };
  const handleBlacklistSubmit = () => {
    if (!blacklistFormData.name || !blacklistFormData.passport) { alert("Name and Passport are required."); return; }
    setBlacklist([...blacklist, { ...blacklistFormData, id: blacklist.length + 1, name: blacklistFormData.name.toUpperCase(), passport: blacklistFormData.passport.toUpperCase() }]);
    setIsBlacklistFormOpen(false); setBlacklistFormData({ name: '', passport: '', reason: '' });
  };
  const deleteBlacklist = (id) => { if (window.confirm("Remove this person from Blacklist?")) setBlacklist(blacklist.filter(b => b.id !== id)); };

  const renderCustomerFormModal = () => {
    // Permission Check
    const isManager = currentUser.role === 'MANAGER';
    const isOwner = formData.ownerId === currentUser.id;
    const isHead = false; // We can't easily check head here without context, but let's assume broad permissions for now or pass context later. 
    // Actually, we can check if currentUser is a manager or owner. Head logic is mostly for the list view action buttons.
    // But if a Head opens this, they should be able to edit. 
    // For simplicity in this modal: If you can OPEN it in 'edit' mode, you can probably Save, 
    // EXCEPT that we want to restrict fields or disable Save if generic view.

    // Let's rely on the fact that the "Edit" button in the list view won't be clickable if they don't have permission.
    // However, for extra safety:
    const canEdit = isManager || isOwner || formMode === 'create'; // Head logic usually handled by caller enabling the button.

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
          <div className="bg-[#0279a9] text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              {formMode === 'create' ? <UserPlus size={20} /> : <Edit2 size={20} />}
              {formMode === 'create' ? 'เพิ่มลูกค้าใหม่' : 'แก้ไขข้อมูลลูกค้า'}
              {!canEdit && <span className="text-xs bg-white/20 px-2 py-0.5 rounded ml-2">ดูข้อมูลเท่านั้น</span>}
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="hover:bg-[#03b8fa] p-1 rounded"><X size={24} /></button>
          </div>
          <div className={`p-6 space-y-6 ${!canEdit ? 'opacity-80 pointer-events-none' : ''}`}>
            {alerts.length > 0 && <div className="space-y-2 mb-4">{alerts.map((alert, idx) => <AlertBadge key={idx} type={alert.type} message={alert.msg} />)}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">ข้อมูลส่วนตัว</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">คำนำหน้า</label><select className="w-full border rounded p-2 text-sm" value={formData.title} onChange={e => handleFormChange('title', e.target.value)}><option value="MR">MR</option><option value="MS">MS</option><option value="MRS">MRS</option><option value="MSTR">MSTR</option><option value="MISS">MISS</option></select></div>
                  <div><label className="text-xs text-gray-500 font-medium">เพศ</label><select className="w-full border rounded p-2 text-sm" value={formData.gender} onChange={e => handleFormChange('gender', e.target.value)}><option value="M">ชาย</option><option value="F">หญิง</option></select></div>
                  <div><label className="text-xs text-gray-500 font-medium">วันเกิด (วว/ดด/ปปปป)</label><input type="date" className="w-full border rounded p-2 text-sm" value={formData.dob} onChange={e => handleFormChange('dob', e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">ชื่อ (อังกฤษ)</label><input type="text" className="w-full border rounded p-2 text-sm uppercase" placeholder="SOMCHAI" value={formData.firstNameEn} onChange={e => handleFormChange('firstNameEn', e.target.value.toUpperCase())} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">นามสกุล (อังกฤษ)</label><input type="text" className="w-full border rounded p-2 text-sm uppercase" placeholder="JAIDEE" value={formData.lastNameEn} onChange={e => handleFormChange('lastNameEn', e.target.value.toUpperCase())} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">ชื่อ (ไทย)</label><input type="text" className="w-full border rounded p-2 text-sm" placeholder="สมชาย" value={formData.firstNameTh} onChange={e => handleFormChange('firstNameTh', e.target.value)} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">นามสกุล (ไทย)</label><input type="text" className="w-full border rounded p-2 text-sm" placeholder="ใจดี" value={formData.lastNameTh} onChange={e => handleFormChange('lastNameTh', e.target.value)} /></div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">ข้อมูลพาสปอร์ต & วีซ่า</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">เลขที่พาสปอร์ต</label><input type="text" className="w-full border rounded p-2 text-sm font-mono uppercase" placeholder="AA1234567" value={formData.passportNo} onChange={e => handleFormChange('passportNo', e.target.value.toUpperCase())} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">สัญชาติ</label><select className="w-full border rounded p-2 text-sm" value={formData.nationality} onChange={e => handleFormChange('nationality', e.target.value)}><option value="THAI">THAI</option><option value="USA">USA</option><option value="CHINA">CHINA</option><option value="UK">UK</option><option value="OTHER">OTHER</option></select></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">วันที่ออก</label><input type="date" className="w-full border rounded p-2 text-sm" value={formData.passportIssue} onChange={e => handleFormChange('passportIssue', e.target.value)} /></div>
                  <div><label className="text-xs text-gray-500 font-medium text-[#03b8fa]">วันหมดอายุ</label><input type="date" className="w-full border border-primary-200 bg-[#d9edf4] rounded p-2 text-sm" value={formData.passportExpire} onChange={e => handleFormChange('passportExpire', e.target.value)} /></div>
                </div>
                <div><label className="text-xs text-gray-500 font-medium">สถานที่เกิด (จังหวัด/เมือง)</label><input type="text" className="w-full border rounded p-2 text-sm uppercase" placeholder="BANGKOK" value={formData.birthplace} onChange={e => handleFormChange('birthplace', e.target.value.toUpperCase())} /><p className="text-[10px] text-gray-400">จำเป็นสำหรับการขอวีซ่าจีน</p></div>
              </div>
              {(bookingStep === 3 || activeTab === 'operation') && (
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div className="flex justify-between items-end border-b pb-2">
                    <h4 className="font-bold text-gray-800">เอกสารแนบ (เฉพาะทริปนี้)</h4>
                    <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 flex items-center gap-1">
                      <Clock size={10} /> ระบบจะเก็บไฟล์ไว้เพียง 5 วันหลังจบวันทัวร์
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {/* Calculate age from DOB to determine if birthCert needed */}
                    {(() => {
                      const calculateAge = (dob) => {
                        if (!dob) return 99;
                        const birthDate = new Date(dob);
                        const today = new Date();
                        return today.getFullYear() - birthDate.getFullYear();
                      };
                      const age = calculateAge(formData.dob);
                      const isUnder15 = age < 15;

                      // Include birthCert if under 15
                      const docTypes = isUnder15
                        ? ['passport', 'birthCert', 'visa']
                        : ['passport', 'visa'];
                      const docLabels = {
                        passport: 'หน้าพาสปอร์ต',
                        visa: 'วีซ่า',
                        birthCert: 'สูติบัตร'
                      };

                      return docTypes.map((docType) => (
                        <div key={docType} className={`border rounded-lg p-3 flex flex-col items-center text-center ${docType === 'birthCert' ? 'bg-pink-50 border-pink-200' : 'bg-gray-50'}`}>
                          <div className={`mb-2 p-2 rounded-full shadow-sm ${docType === 'birthCert' ? 'bg-pink-100' : 'bg-white'}`}>
                            {formData.attachments?.[docType] ? <FileText size={20} className="text-green-600" /> : <Plus size={20} className={docType === 'birthCert' ? 'text-pink-400' : 'text-gray-400'} />}
                          </div>
                          <label className={`text-xs font-bold uppercase mb-1 ${docType === 'birthCert' ? 'text-pink-600' : 'text-gray-600'}`}>{docLabels[docType] || docType}</label>
                          {docType === 'birthCert' && <div className="text-[9px] text-pink-500 mb-1">(อายุต่ำกว่า 15 ปี)</div>}
                          <div className="text-[10px] text-gray-400 truncate w-full mb-2">
                            {formData.attachments?.[docType] ? formData.attachments[docType] : 'ไม่มีไฟล์'}
                          </div>
                          <div className="flex gap-1 w-full justify-center">
                            <label className={`cursor-pointer border px-2 py-1 rounded text-[10px] hover:opacity-80 ${docType === 'birthCert' ? 'bg-pink-100 border-pink-300 text-pink-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                              อัปโหลด
                              <input type="file" className="hidden" onChange={(e) => handleFileAttach(docType, e.target.files[0])} />
                            </label>
                            {formData.attachments?.[docType] && (
                              <button
                                onClick={() => window.alert(`Opening ${formData.attachments[docType]}...`)}
                                className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded text-[10px] hover:bg-blue-100"
                              >
                                ดูไฟล์
                              </button>
                            )}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              <div className="col-span-1 md:col-span-2 space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">ข้อมูลการติดต่อ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div><label className="text-xs text-gray-500 font-medium">เบอร์โทรศัพท์</label><input type="tel" className="w-full border rounded p-2 text-sm" placeholder="08X-XXX-XXXX" value={formData.phone} onChange={e => handleFormChange('phone', e.target.value)} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">อีเมล</label><input type="email" className="w-full border rounded p-2 text-sm" placeholder="user@example.com" value={formData.email} onChange={e => handleFormChange('email', e.target.value)} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">ไลน์ (Line ID)</label><input type="text" className="w-full border rounded p-2 text-sm" placeholder="@lineid" value={formData.lineId} onChange={e => handleFormChange('lineId', e.target.value)} /></div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">พนักงานผู้ดูแล</label>
                    {isManager ? (
                      <select
                        className="w-full border rounded p-2 text-sm bg-blue-50 font-bold text-[#0279a9]"
                        value={formData.ownerId || ''}
                        onChange={e => handleFormChange('ownerId', Number(e.target.value))}
                      >
                        {appUsers.filter(u => u.role !== 'GUIDE').map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded border border-gray-100 text-sm font-bold text-gray-600">
                        {appUsers.find(u => u.id === (formData.ownerId || currentUser.id))?.name || 'Unknown'}
                      </div>
                    )}
                  </div>
                </div>
                <div><label className="text-xs text-gray-500 font-medium">หมายเหตุ (แพ้อาหาร, วีลแชร์, ฯลฯ)</label><textarea className="w-full border rounded p-2 text-sm h-20" placeholder="e.g. ไม่ทานเนื้อ, ขอนั่งริมทางเดิน" value={formData.remark} onChange={e => handleFormChange('remark', e.target.value)}></textarea></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t">
            <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">ยกเลิก</button>
            {canEdit && <button onClick={saveCustomer} disabled={alerts.some(a => a.type === 'danger')} className="px-6 py-2 bg-[#03b8fa] text-white rounded-lg font-medium hover:bg-[#0279a9] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"><Save size={18} /> บันทึกข้อมูล</button>}
          </div>
        </div>
      </div>
    );
  };

  const renderCRM = () => (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex justify-between items-center mb-2">
        <div><h1 className="text-2xl font-bold text-gray-800">ฐานข้อมูลลูกค้า</h1><p className="text-gray-500 text-sm">Customer Database and Security Management</p></div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setCrmSubTab('customers')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${crmSubTab === 'customers' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>รายชื่อลูกค้า</button>
          <button onClick={() => setCrmSubTab('blacklist')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${crmSubTab === 'blacklist' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><ShieldAlert size={14} /> บัญชีดำ</button>
        </div>
      </header>
      {crmSubTab === 'customers' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col animate-fade-in">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="ค้นหาลูกค้า..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#6bc8e9] w-64" /></div>
            <button onClick={() => openCustomerForm()} className="bg-[#03b8fa] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#0279a9] flex items-center gap-2"><Plus size={16} /> เพิ่มลูกค้าใหม่</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200"><tr><th className="px-6 py-3 font-medium text-[12px] uppercase tracking-wider">ชื่อ-นามสกุล</th><th className="px-6 py-3 font-medium text-[12px] uppercase tracking-wider">ข้อมูลพาสปอร์ต</th><th className="px-6 py-3 font-medium text-[12px] uppercase tracking-wider">ส่วนตัว</th><th className="px-6 py-3 font-medium text-[12px] uppercase tracking-wider">ติดต่อ</th><th className="px-6 py-3 font-medium text-[12px] uppercase tracking-wider">หมายเหตุ</th><th className="px-6 py-3 font-medium text-[12px] uppercase tracking-wider">ผู้ดูแล</th><th className="px-6 py-3 font-medium text-[12px] uppercase tracking-wider text-right">จัดการ</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map(customer => {
                  const owner = appUsers.find(u => u.id === customer.ownerId);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4"><div className="font-bold text-gray-800">{customer.title} {customer.firstNameEn} {customer.lastNameEn}</div><div className="text-gray-500 text-xs">{customer.firstNameTh} {customer.lastNameTh}</div></td>
                      <td className="px-6 py-4"><div className="font-mono text-gray-700">{customer.passportNo}</div><div className="text-xs text-gray-500">Exp: <span className={new Date(customer.passportExpire) < new Date('2025-06-01') ? 'text-[#03b8fa] font-bold' : ''}>{customer.passportExpire}</span></div>{customer.nationality !== 'THAI' && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded">{customer.nationality}</span>}</td>
                      <td className="px-6 py-4"><div className="text-gray-600">{customer.gender === 'M' ? 'Male' : 'Female'}, Age: {new Date().getFullYear() - new Date(customer.dob).getFullYear()}</div><div className="text-xs text-gray-400">DOB: {customer.dob}</div></td>
                      <td className="px-6 py-4"><div className="text-gray-600">{customer.phone}</div></td>
                      <td className="px-6 py-4">
                        {customer.remark ? (
                          <div className="text-xs text-amber-600 font-medium flex items-center gap-1 bg-amber-50 px-2 py-1 rounded border border-amber-100 truncate max-w-[150px]" title={customer.remark}>
                            <Pin size={10} /> {customer.remark}
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {owner ? (
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0279a9] text-[10px] font-bold border border-blue-100">
                            {owner.name}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => openCustomerForm(customer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button><button onClick={() => deleteCustomer(customer.id)} className="p-2 text-[#03b8fa] hover:bg-[#d9edf4] rounded"><Trash2 size={16} /></button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between"><span>แสดงบัญชี: {customers.length} รายการ</span><span>Database v1.0.2</span></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-red-200 flex-1 overflow-hidden flex flex-col animate-fade-in relative">
          {isBlacklistFormOpen && (
            <div className="absolute inset-0 bg-white/95 z-20 flex items-center justify-center p-8">
              <div className="w-full max-w-md bg-white border border-red-100 shadow-xl rounded-xl p-6 relative">
                <button onClick={() => setIsBlacklistFormOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2"><Ban size={24} /> เพิ่มรายชื่อบัญชีดำ</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">ค้นหาจากฐานข้อมูลลูกค้า (ระบุชื่อ หรือ Passport)</label>
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:border-red-500 transition">
                      <div className="pl-3 text-gray-400"><Search size={16} /></div>
                      <input
                        type="text"
                        className="px-3 py-2 text-sm outline-none w-full"
                        placeholder="พิมพ์ชื่อ หรือ เลขพาสปอร์ต..."
                        value={blacklistSearchTerm}
                        onChange={(e) => {
                          setBlacklistSearchTerm(e.target.value);
                          setShowBlacklistSearch(true);
                        }}
                        onFocus={() => setShowBlacklistSearch(true)}
                      />
                      {blacklistSearchTerm && <button onClick={() => setBlacklistSearchTerm('')} className="pr-2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
                    </div>
                    {showBlacklistSearch && blacklistSearchTerm && (
                      <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-48 overflow-y-auto">
                        {customers.filter(c =>
                          c.firstNameEn.toLowerCase().includes(blacklistSearchTerm.toLowerCase()) ||
                          c.passportNo.includes(blacklistSearchTerm.toUpperCase())
                        ).map(c => (
                          <div key={c.id} className="p-3 hover:bg-red-50 cursor-pointer border-b border-gray-50 last:border-0" onClick={() => {
                            setBlacklistFormData({
                              ...blacklistFormData,
                              name: `${c.firstNameEn} ${c.lastNameEn}`.toUpperCase(),
                              passport: c.passportNo
                            });
                            setBlacklistSearchTerm('');
                            setShowBlacklistSearch(false);
                          }}>
                            <div className="font-bold text-sm text-gray-800">{c.firstNameEn} {c.lastNameEn}</div>
                            <div className="text-xs text-gray-500">{c.passportNo} | {c.nationality}</div>
                          </div>
                        ))}
                        {customers.filter(c => c.firstNameEn.toLowerCase().includes(blacklistSearchTerm.toLowerCase())).length === 0 && (
                          <div className="p-3 text-center text-gray-400 text-sm">ไม่พบข้อมูลลูกค้า</div>
                        )}
                      </div>
                    )}
                    {showBlacklistSearch && <div className="fixed inset-0 z-40" onClick={() => setShowBlacklistSearch(false)}></div>}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">ชื่อ-นามสกุล (Auto)</label>
                      <input type="text" className="w-full bg-transparent border-b border-gray-300 py-1 text-sm font-bold text-gray-800 outline-none" placeholder="-" value={blacklistFormData.name} readOnly />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase">Passport / ID (Auto)</label>
                      <input type="text" className="w-full bg-transparent border-b border-gray-300 py-1 text-sm font-mono text-gray-600 outline-none" placeholder="-" value={blacklistFormData.passport} readOnly />
                    </div>
                  </div>
                  <div><label className="text-sm font-medium text-gray-700">สาเหตุที่โดนแบน</label><textarea className="w-full border p-2 rounded focus:border-red-500 outline-none" placeholder="ระบุสาเหตุ..." value={blacklistFormData.reason} onChange={(e) => setBlacklistFormData({ ...blacklistFormData, reason: e.target.value })}></textarea></div>
                  <div className="flex justify-end gap-3 pt-2"><button onClick={() => setIsBlacklistFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button><button onClick={handleBlacklistSubmit} disabled={!blacklistFormData.name} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed">ยืนยัน Blacklist</button></div>
                </div>
              </div>
            </div>
          )}
          <div className="p-4 bg-red-50 border-b border-red-100 flex justify-between items-center"><div className="flex items-center gap-2 text-red-800 font-bold"><ShieldAlert size={20} /> รายชื่อบุคคลเฝ้าระวัง ({blacklist.length})</div><button onClick={() => setIsBlacklistFormOpen(true)} className="bg-white border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50 flex items-center gap-2"><Plus size={16} /> เพิ่ม Blacklist</button></div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200"><tr><th className="px-6 py-3 font-medium">ชื่อ-นามสกุล</th><th className="px-6 py-3 font-medium">ID / Passport</th><th className="px-6 py-3 font-medium">สาเหตุ</th><th className="px-6 py-3 font-medium text-right">ลบ</th></tr></thead>
              <tbody className="divide-y divide-gray-100">{blacklist.map(person => (<tr key={person.id} className="hover:bg-red-50 group transition-colors"><td className="px-6 py-4 font-bold text-gray-800">{person.name}</td><td className="px-6 py-4 font-mono text-gray-600">{person.passport}</td><td className="px-6 py-4 text-red-600">{person.reason}</td><td className="px-6 py-4 text-right"><button onClick={() => deleteBlacklist(person.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button></td></tr>))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => {
    // === SALE DASHBOARD ===
    if (currentUser.role === 'SALE') {
      // 1. Calculate Stats
      const myPayments = payments.filter(p => p.saleId === currentUser.id);
      const myTotalSales = myPayments.reduce((sum, p) => sum + p.totalAmount, 0);

      let myTotalCommission = 0;
      let myTotalPax = 0;

      myPayments.filter(p => p.status === 'paid').forEach(p => {
        const route = routes.find(r => r.id === p.routeId);
        const paxCount = p.paxIds?.length || 1;
        myTotalPax += paxCount;
        const rankKey = `rank${currentUser.commissionRank || 1}Com`;
        myTotalCommission += (route?.[rankKey] || 0) * paxCount;
      });

      // 2. Identify Active Rounds for this Sale
      // Keep track of rounds where I have passengers
      const myRoundsMap = new Map();
      bookings.filter(b => b.saleId === currentUser.id).forEach(b => {
        if (!myRoundsMap.has(b.roundId)) {
          const round = rounds.find(r => r.id === b.roundId);
          if (round) myRoundsMap.set(b.roundId, { round, paxCount: 0, customers: [] });
        }
        if (myRoundsMap.has(b.roundId)) {
          const entry = myRoundsMap.get(b.roundId);
          entry.paxCount += b.pax.length;
          entry.customers.push(...b.pax);
        }
      });

      const myActiveRounds = Array.from(myRoundsMap.values()).sort((a, b) => new Date(a.round.date) - new Date(b.round.date));

      return (
        <div className="space-y-6 animate-fade-in">
          <header className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ภาพรวมงานขาย (My Performance)</h1>
              <p className="text-gray-500 text-sm">ติดตามสถานะลูกค้า, เอกสาร, และค่าคอมมิชชั่น</p>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-600 shadow-sm flex items-center gap-2">
                <span className="text-gray-400">Commission Rank:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${commissionRanks.find(r => r.id === currentUser.commissionRank)?.bg || 'bg-gray-100'} ${commissionRanks.find(r => r.id === currentUser.commissionRank)?.color || 'text-gray-700'}`}>
                  {commissionRanks.find(r => r.id === currentUser.commissionRank)?.name || 'None'}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('booking')}
                className="bg-[#03b8fa] text-white px-4 py-2 rounded-lg hover:bg-[#0279a9] shadow-sm flex items-center gap-2"
              >
                <Plus size={18} /> จองทัวร์ใหม่
              </button>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Wallet size={24} /></div>
              <div>
                <p className="text-sm text-gray-500">ค่าคอมมิชชั่นสะสม</p>
                <h3 className="text-2xl font-bold text-green-600">฿{myTotalCommission.toLocaleString()}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><ShoppingBag size={24} /></div>
              <div>
                <p className="text-sm text-gray-500">ยอดขายรวม</p>
                <h3 className="text-2xl font-bold text-blue-600">฿{myTotalSales.toLocaleString()}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Users size={24} /></div>
              <div>
                <p className="text-sm text-gray-500">ลูกค้าที่ดูแล (Pax)</p>
                <h3 className="text-2xl font-bold text-gray-800">{myTotalPax} ท่าน</h3>
              </div>
            </div>
          </div>

          {/* Active Job Tracking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-[#03b8fa]" /> รายการที่ต้องติดตาม (Job Tracking)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">เส้นทาง / วันที่</th>
                    <th className="px-6 py-3 font-medium text-center">ลูกค้าของคุณ</th>
                    <th className="px-6 py-3 font-medium text-center">ค่าคอมฯ (Paid)</th>
                    <th className="px-6 py-3 font-medium text-center">สถานะทัวร์</th>
                    <th className="px-6 py-3 font-medium text-center">สถานะอนุมัติ</th>
                    <th className="px-6 py-3 font-medium">ติดตามเอกสาร & การจ่ายเงิน</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myActiveRounds.map((item) => {
                    const { round, paxCount, customers } = item;
                    const route = routes.find(r => r.id === round.routeId);

                    // Detailed Check Logic
                    let unpaidPax = 0;
                    const missingSummary = {};

                    customers.forEach(c => {
                      const missing = [];
                      // 1. Check Passport
                      if (!c.passportNo) missing.push('Passport');

                      // 2. Check Visa (Mock: Non-Thai needs Visa) - assuming default is THAI if undefined
                      if (c.nationality && c.nationality !== 'THAI' && !c.visa) {
                        missing.push('Visa');
                      }

                      // 3. Check Payment
                      if (c.paymentStatus !== 'paid') unpaidPax++;

                      // Attach to object for display
                      c._missingDocs = missing;

                      // Aggregate stats
                      missing.forEach(doc => {
                        missingSummary[doc] = (missingSummary[doc] || 0) + 1;
                      });
                    });

                    const isExpanded = dashboardExpandedRow === round.id;
                    const hasMissingDocs = Object.keys(missingSummary).length > 0;

                    return (
                      <React.Fragment key={round.id}>
                        <tr className={`hover:bg-gray-50 cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/50' : ''}`} onClick={() => setDashboardExpandedRow(isExpanded ? null : round.id)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                className={`p-1 rounded-full hover:bg-gray-200 transition ${isExpanded ? 'bg-blue-100 text-[#03b8fa]' : 'text-gray-400'}`}
                                onClick={(e) => { e.stopPropagation(); setDashboardExpandedRow(isExpanded ? null : round.id); }}
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                              <div>
                                <div className="font-bold text-[#03b8fa]">{route?.code}</div>
                                <div className="text-xs text-gray-500">{round.date}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-gray-700">
                            {paxCount} ท่าน
                          </td>
                          <td className="px-6 py-4 text-center font-mono">
                            {(() => {
                              const paidPaxCount = customers.filter(c => c.paymentStatus === 'paid').length;
                              const rankKey = `rank${currentUser.commissionRank || 1}Com`;
                              const comPerHead = route?.[rankKey] || 0;
                              const earned = paidPaxCount * comPerHead;
                              return earned > 0 ? (
                                <div className="flex flex-col items-center">
                                  <span className="text-green-600 font-bold">฿{earned.toLocaleString()}</span>
                                  <span className="text-[10px] text-gray-400">({paidPaxCount} pax)</span>
                                </div>
                              ) : <span className="text-gray-300">-</span>;
                            })()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs border ${round.status === 'Full' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                              {round.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {round.approved ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                                  <CheckCircle size={10} /> อนุมัติแล้ว
                                </span>
                                <span className="text-[9px] text-gray-400">
                                  {round.approvedAt}
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                                <Clock size={10} /> รอดำเนินการ
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              {/* Payment Status */}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">การชำระเงิน:</span>
                                {unpaidPax === 0 ?
                                  <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={10} /> ครบถ้วน</span> :
                                  <span className="text-red-500 font-bold">{unpaidPax} ค้างชำระ</span>
                                }
                              </div>
                              {/* Doc Status Breakdown */}
                              <div className="flex items-start justify-between text-xs">
                                <span className="text-gray-500 whitespace-nowrap mr-2">เอกสาร:</span>
                                {!hasMissingDocs ?
                                  <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={10} /> ครบถ้วน</span> :
                                  <div className="text-right">
                                    {Object.entries(missingSummary).map(([doc, count]) => (
                                      <div key={doc} className="text-orange-600 font-bold text-[10px]">
                                        ขาด {doc} ({count})
                                      </div>
                                    ))}
                                  </div>
                                }
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {(unpaidPax > 0 || hasMissingDocs) && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>}
                          </td>
                        </tr>

                        {/* Expandable Row with Passenger List */}
                        {isExpanded && (
                          <tr className="bg-gray-50 border-t border-gray-100 shadow-inner animate-fade-in relative z-10">
                            <td colSpan={6} className="px-8 py-6">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                <div className="px-4 py-3 border-b border-gray-100 bg-blue-50/30 flex justify-between items-center">
                                  <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2"><Users size={16} /> รายชื่อลูกค้าในความดูแล ({customers.length})</h4>
                                  <button onClick={() => setDashboardExpandedRow(null)} className="text-xs text-gray-500 hover:text-gray-700">ปิด</button>
                                </div>
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                    <tr>
                                      <th className="px-4 py-2 w-10">#</th>
                                      <th className="px-4 py-2">ชื่อ-นามสกุล</th>
                                      <th className="px-4 py-2">Passport</th>
                                      <th className="px-4 py-2">หมายเหตุ</th>
                                      <th className="px-4 py-2 text-center">สถานะการเงิน</th>
                                      <th className="px-4 py-2">เอกสารที่ขาด</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {customers.map((c, idx) => (
                                      <tr key={c.id || idx} className="hover:bg-blue-50/20">
                                        <td className="px-4 py-2 text-gray-400">{idx + 1}</td>
                                        <td className="px-4 py-2">
                                          <div className="font-bold text-gray-700">{c.firstNameEn} {c.lastNameEn}</div>
                                          <div className="text-xs text-gray-500">{c.phone || '-'}</div>
                                        </td>
                                        <td className="px-4 py-2 font-mono text-xs text-gray-600">
                                          {c.passportNo || <span className="text-red-400 italic">Pending</span>}
                                        </td>
                                        <td className="px-4 py-2">
                                          <div className="flex flex-col gap-0.5 max-w-[150px]">
                                            {c.customerNote && (
                                              <div className="text-[10px] text-gray-400 italic truncate" title={`DB Note: ${c.customerNote}`}>
                                                📌 {c.customerNote}
                                              </div>
                                            )}
                                            {c.remark && (
                                              <div className="text-[10px] text-[#03b8fa] font-medium truncate" title={`Booking Note: ${c.remark}`}>
                                                📝 {c.remark}
                                              </div>
                                            )}
                                            {!c.customerNote && !c.remark && <span className="text-gray-300 text-[10px]">-</span>}
                                          </div>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                          {c.paymentStatus === 'paid' ?
                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold"><CheckCircle size={10} /> PAID</span> :
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold">PENDING</span>
                                          }
                                        </td>
                                        <td className="px-4 py-2">
                                          {c._missingDocs && c._missingDocs.length > 0 ? (
                                            <div className="flex gap-1 flex-wrap">
                                              {c._missingDocs.map(doc => (
                                                <span key={doc} className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold border border-red-200">
                                                  {doc}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-green-500 flex items-center gap-1 text-xs"><CheckCircle size={14} /> ครบถ้วน</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {myActiveRounds.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">ยังไม่มีงานขายที่กำลังดำเนินการ</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } // End Sale Dashboard

    // === EXECUTIVE DASHBOARD (Original) ===
    // Dynamic Stats Calculation
    const totalSales = payments.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalRevenue = payments.reduce((sum, p) => sum + p.paidAmount, 0);

    // Count tours by status
    const ongoingTours = rounds.filter(r => r.status === 'Full').length;
    const completedTours = rounds.filter(r => r.status === 'Completed').length;

    return (
      <div className="space-y-6 animate-fade-in">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">แผงควบคุมผู้บริหาร</h1>
            <p className="text-gray-500 text-sm">ยินดีต้อนรับ, {currentUser.name}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
              <Calendar size={16} className="text-gray-400" />
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="date"
                  className="bg-transparent outline-none text-gray-600 cursor-pointer"
                  defaultValue="2026-01-01"
                />
                <span className="text-gray-400">ถึง</span>
                <input
                  type="date"
                  className="bg-transparent outline-none text-gray-600 cursor-pointer"
                  defaultValue="2026-12-31"
                />
              </div>
              <button className="ml-2 text-xs bg-[#03b8fa] text-white px-2 py-1 rounded hover:bg-[#0279a9] transition">
                กรอง
              </button>
            </div>
            <button className="bg-[#03b8fa] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#0279a9] transition flex items-center gap-2" onClick={() => setActiveTab('booking')}>
              <Plus size={18} /> จองทัวร์ใหม่
            </button>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="ยอดขายรวม (Booking Value)" value={`฿${totalSales.toLocaleString()}`} subtext="ยอดรวมจากการจองทั้งหมด" icon={CreditCard} color="green" />
          <StatCard title="ยอดรับชำระแล้ว" value={`฿${totalRevenue.toLocaleString()}`} subtext="เงินสดที่ได้รับแล้ว" icon={Wallet} color="blue" />
          <StatCard title="ทัวร์ที่กำลังออกเดินทาง" value={`${ongoingTours} กรุ๊ป`} subtext="อยู่ในระหว่างดำเนินการ" icon={Plane} />
          <StatCard title="ทัวร์ที่เสร็จสิ้นแล้ว" value={`${completedTours} กรุ๊ป`} subtext="เดินทางเสร็จสิ้นแล้ว" icon={CheckCircle} color="green" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-[#fdcf1a]" /> ทัวร์ที่กำลังจะถึง (รอดำเนินการ)
            </h3>
            <span className="text-xs text-blue-600 cursor-pointer hover:underline" onClick={() => { setActiveTab('operation'); setOperationTab('upcoming'); }}>ดูทั้งหมด →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">เส้นทาง</th>
                  <th className="px-6 py-3 font-medium">วันที่</th>
                  <th className="px-6 py-3 font-medium">ลูกทัวร์</th>
                  <th className="px-6 py-3 font-medium">OP Staff</th>
                  <th className="px-6 py-3 font-medium">ความคืบหน้า</th>
                  <th className="px-6 py-3 font-medium text-center">สถานะอนุมัติ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rounds.filter(r => r.status === 'Selling' || r.status === 'Full').map(round => {
                  const route = routes.find(r => r.id === round.routeId);
                  const progress = round.status === 'Completed' ? 100 : calculateEstimatedProgress(round.id);
                  const approver = appUsers.find(u => u.id === round.approvedBy);
                  return (
                    <tr key={round.id} className="hover:bg-gray-50 cursor-pointer group" onClick={() => { setSelectedOpRound(round); setOperationView('detail'); setActiveTab('operation'); }} title="Click to view passenger manifest">
                      <td className="px-6 py-4 font-medium text-gray-800 group-hover:text-[#03b8fa] transition-colors">{route?.code}</td>
                      <td className="px-6 py-4 text-gray-600">{round.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${round.sold === round.seats ? 'bg-red-100 text-[#0279a9]' : 'bg-green-100 text-green-700'}`}>
                          {round.sold}/{round.seats}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{round.head}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${progress > 80 ? 'bg-[#37c3a5]' : progress > 50 ? 'bg-[#fdcf1a]' : 'bg-[#0279a9]'}`} style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        {round.approved ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                              <CheckCircle size={12} /> อนุมัติแล้ว
                            </span>
                            <span className="text-[10px] text-gray-400">โดย {approver?.name || 'Admin'}</span>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveRound(round.id);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200 transition-colors"
                          >
                            <ShieldCheck size={14} /> อนุมัติทัวร์
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>


        {/* Commission Report Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><Wallet size={18} /> รายงานค่าคอมมิชชั่น (Sales Commission)</h3>
            <span className="text-xs text-gray-400">คำนวณจากจำนวนลูกทัวร์ที่ชำระเงินแล้ว × ค่าคอมต่อหัวของเส้นทาง</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">พนักงานขาย</th>
                  <th className="px-6 py-3 font-medium text-right">ยอดขายรวม</th>
                  <th className="px-6 py-3 font-medium text-right">ยอดรับชำระแล้ว</th>
                  <th className="px-6 py-3 font-medium text-center">Rank</th>
                  <th className="px-6 py-3 font-medium text-center">จำนวน Pax (ชำระแล้ว)</th>
                  <th className="px-6 py-3 font-bold text-[#37c3a5] text-right">ค่าคอมมิชชั่น</th>
                  <th className="px-6 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appUsers.filter(u => u.role === 'SALE').map(user => {
                  // Aggregate sales for this user
                  const userPayments = payments.filter(p => p.saleId === user.id);
                  const totalSales = userPayments.reduce((sum, p) => sum + p.totalAmount, 0);
                  const totalPaid = userPayments.reduce((sum, p) => sum + p.paidAmount, 0);

                  // Calculate commission based on Rank and route-specific amounts
                  let totalCommission = 0;
                  let totalPaxCount = 0;
                  userPayments.filter(p => p.status === 'paid').forEach(p => {
                    const route = routes.find(r => r.id === p.routeId);
                    const paxCount = p.paxIds?.length || 1;
                    totalPaxCount += paxCount;
                    const rankKey = `rank${user.commissionRank || 1}Com`;
                    totalCommission += (route?.[rankKey] || 0) * paxCount;
                  });

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-gray-600">฿{totalSales.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-blue-600">฿{totalPaid.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${commissionRanks.find(r => r.id === user.commissionRank)?.bg || 'bg-gray-100'} ${commissionRanks.find(r => r.id === user.commissionRank)?.color || 'text-gray-700'}`}>
                          {commissionRanks.find(r => r.id === user.commissionRank)?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-700">{totalPaxCount} คน</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-[#37c3a5]">฿{totalCommission.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setViewingSaleId(user.id)} className="p-2 text-gray-400 hover:text-[#03b8fa] hover:bg-blue-50 rounded-full transition">
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {appUsers.filter(u => u.role === 'SALE').length === 0 && (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-400">ไม่พบข้อมูลพนักงานขาย</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* Sale Detail Modal */}
        {
          viewingSaleId && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                {(() => {
                  const user = appUsers.find(u => u.id === viewingSaleId);
                  const userPayments = payments.filter(p => p.saleId === viewingSaleId);

                  // Calculate total commission based on Rank
                  let totalCommission = 0;
                  let totalPaxCount = 0;
                  userPayments.filter(p => p.status === 'paid').forEach(p => {
                    const route = routes.find(r => r.id === p.routeId);
                    const paxCount = p.paxIds?.length || 1;
                    totalPaxCount += paxCount;
                    const rankKey = `rank${user.commissionRank || 1}Com`;
                    totalCommission += (route?.[rankKey] || 0) * paxCount;
                  });

                  return (
                    <>
                      <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2"><Wallet size={20} /> รายละเอียดยอดขาย: {user?.name}</h3>
                          <p className="text-gray-400 text-xs flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${commissionRanks.find(r => r.id === user?.commissionRank)?.bg || 'bg-gray-600'} ${commissionRanks.find(r => r.id === user?.commissionRank)?.color || 'text-white'}`}>
                              {commissionRanks.find(r => r.id === user?.commissionRank)?.name || 'N/A'}
                            </span>
                            | Total Pax: {totalPaxCount} คน | Total Earned: ฿{totalCommission.toLocaleString()}
                          </p>
                        </div>
                        <button onClick={() => setViewingSaleId(null)} className="hover:bg-gray-700 p-1 rounded"><X size={20} /></button>
                      </header>
                      <div className="p-6 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-500 border-b">
                            <tr>
                              <th className="px-4 py-3">วันที่ / รายการจ่าย</th>
                              <th className="px-4 py-3 md:table-cell hidden">เส้นทาง</th>
                              <th className="px-4 py-3">ลูกค้า</th>
                              <th className="px-4 py-3 text-center">Pax</th>
                              <th className="px-4 py-3 text-right">Com/หัว</th>
                              <th className="px-4 py-3 text-right text-[#37c3a5] font-bold">คอมมิชชั่น</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {userPayments.length > 0 ? userPayments.map(p => {
                              const route = routes.find(r => r.id === p.routeId);
                              const paxCount = p.paxIds?.length || 1;
                              const rankKey = `rank${user.commissionRank || 1}Com`;
                              const comPerHead = route?.[rankKey] || 0;
                              const comm = p.status === 'paid' ? comPerHead * paxCount : 0;
                              return (
                                <tr key={p.id} className={p.status !== 'paid' ? 'opacity-50' : ''}>
                                  <td className="px-4 py-3">
                                    <div className="font-mono text-xs text-gray-500">{p.createdAt}</div>
                                    <div className="text-xs text-blue-600">ID: #{p.id}</div>
                                    {p.status !== 'paid' && <span className="text-xs text-orange-500">(รอชำระ)</span>}
                                  </td>
                                  <td className="px-4 py-3 md:table-cell hidden">
                                    <div className="font-medium text-gray-800">{route?.code}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{route?.name}</div>
                                  </td>
                                  <td className="px-4 py-3 text-gray-700">{p.customerName}</td>
                                  <td className="px-4 py-3 text-center font-mono text-gray-600">{paxCount} คน</td>
                                  <td className="px-4 py-3 text-right font-mono text-gray-500">฿{comPerHead.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-right font-mono font-bold text-[#37c3a5]">฿{comm.toLocaleString()}</td>
                                </tr>
                              );
                            }) : (
                              <tr><td colSpan="6" className="text-center py-8 text-gray-400">ยังไม่มีรายการขายที่ชำระเงินแล้ว</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
                        <button onClick={() => setViewingSaleId(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">ปิดหน้าต่าง</button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )
        }
      </div >
    );
  };

  // --- Helper for Complex Pricing ---
  const formatPrice = (p) => p ? `฿${p.toLocaleString()}` : '-';

  const renderRouteEditor = () => {
    const isNew = !editorRoute.id;

    const handleSaveRouteDetails = () => {
      if (!editorRoute.name || !editorRoute.code) return alert("กรุณาระบุชื่อและรหัสเส้นทาง");
      if (isNew) {
        const newRoute = { ...editorRoute, id: Date.now() };
        setRoutes([...routes, newRoute]);
        setEditorRoute(newRoute);
        alert("สร้างเส้นทางเรียบร้อย! สามารถเพิ่มรอบเดินทางได้แล้ว");
      } else {
        setRoutes(routes.map(r => r.id === editorRoute.id ? editorRoute : r));
        alert("บันทึกข้อมูลเรียบร้อย");
      }
    };

    const handleAddRound = () => {
      if (isNew && !routes.find(r => r.id === editorRoute.id)) return alert("กรุณาบันทึกข้อมูลทั่วไปก่อนเพิ่มรอบ");
      const newRound = {
        id: Date.now(),
        routeId: editorRoute.id,
        date: '10-15 JAN 2026',
        airline: 'TG',
        flight: 'TG600',
        seats: 25,
        sold: 0,
        status: 'Selling',
        head: 'Unassigned',
        headId: 0,
        price: { adultTwin: 29900, adultSingle: 34900, adultTriple: 29900, childBed: 27900, childNoBed: 25900 }
      };
      setRounds([...rounds, newRound]);
    };

    const updateRound = (id, field, value) => {
      setRounds(rounds.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const updateRoundPrice = (id, field, value) => {
      setRounds(rounds.map(r => r.id === id ? { ...r, price: { ...r.price, [field]: Number(value) } } : r));
    };

    const filteredRounds = rounds.filter(r => r.routeId === editorRoute.id);

    return (
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 h-full flex flex-col animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => { setBookingMode('wizard'); setEditorRoute(null); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition"><ArrowLeft size={20} /></button>
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">{isNew ? 'สร้างเส้นทางใหม่' : 'แก้ไขเส้นทาง'} <span className="text-xs font-normal bg-red-100 text-[#03b8fa] px-2 py-0.5 rounded-full">{isNew ? 'Draft' : 'Live'}</span></h2>
              <p className="text-xs text-gray-400">ตั้งค่ารายละเอียดเส้นทาง, ราคา, และรอบเดินทาง</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium">ยกเลิก</button>
            <button onClick={handleSaveRouteDetails} className="bg-[#03b8fa] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-200 hover:bg-[#0279a9] transition flex items-center gap-2"><Save size={18} /> บันทึกข้อมูล</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* 1. Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-700"><Globe size={18} /> ข้อมูลทั่วไป</div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ชื่อเส้นทาง</label>
                    <input type="text" className="w-full text-lg font-bold border-b-2 border-gray-200 focus:border-[#03b8fa] outline-none py-2 bg-transparent placeholder-gray-300" placeholder="e.g. GRAND JAPAN - TOKYO FUJI NIKKO" value={editorRoute.name} onChange={e => setEditorRoute({ ...editorRoute, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">รหัสเส้นทาง</label>
                      <input type="text" className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 font-mono" placeholder="JP-TYO01" value={editorRoute.code} onChange={e => setEditorRoute({ ...editorRoute, code: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ระยะเวลา</label>
                      <input type="text" className="w-full border rounded-lg p-2.5 text-sm" placeholder="e.g. 6 Days 5 Nights" value={editorRoute.duration || ''} onChange={e => setEditorRoute({ ...editorRoute, duration: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ไฮไลท์ / รายละเอียด</label>
                    <textarea className="w-full border rounded-lg p-3 text-sm h-24" placeholder="Briefly describe the highlights..." value={editorRoute.description || ''} onChange={e => setEditorRoute({ ...editorRoute, description: e.target.value })}></textarea>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <label className="block text-xs font-bold text-green-700 uppercase mb-3 flex items-center gap-2"><Wallet size={14} /> ค่าคอมมิชชั่นต่อหัว (บาท)</label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {commissionRanks.map(rank => (
                        <div key={rank.id}>
                          <label className={`text-xs font-medium ${rank.color}`}>{rank.name}</label>
                          <div className="relative mt-1">
                            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${rank.color}`}>฿</span>
                            <input
                              type="number"
                              className={`w-full border ${rank.border} rounded-lg pl-7 pr-3 py-2 text-sm bg-white font-mono font-bold ${rank.color}`}
                              placeholder={rank.defaultAmount.toString()}
                              value={editorRoute['rank' + rank.id + 'Com'] !== undefined ? editorRoute['rank' + rank.id + 'Com'] : rank.defaultAmount}
                              onChange={e => setEditorRoute({ ...editorRoute, ['rank' + rank.id + 'Com']: Number(e.target.value) })}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-green-600 mt-2">* ค่าคอมมิชชั่นที่พนักงานขายจะได้รับต่อลูกค้า 1 คนที่ชำระเงินแล้ว</p>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">รูปภาพปก</label>
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 relative group border-2 border-dashed border-gray-200 hover:border-[#6bc8e9] transition">
                    {editorRoute.image ? <img src={editorRoute.image} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-gray-400"><ImageIcon size={32} /><span className="text-xs mt-2">No Image</span></div>}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <input type="text" className="w-11/12 bg-white rounded p-2 text-xs" placeholder="Paste Image URL" value={editorRoute.image} onChange={e => setEditorRoute({ ...editorRoute, image: e.target.value })} onClick={e => e.stopPropagation()} />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 text-center">Recommended Size: 800x600px</p>
                </div>
              </div>
            </div>

            {/* 2. Rounds & Pricing Config */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-gray-700"><DollarSign size={18} /> บริหารจัดการรอบ & ราคา</div>
                <button onClick={handleAddRound} className="text-xs bg-[#03b8fa] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#0279a9] transition shadow flex items-center gap-1"><Plus size={14} /> เพิ่มรอบเดินทาง</button>
              </div>

              <div className="p-6">
                {filteredRounds.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                    <h3 className="text-gray-500 font-bold">ยังไม่ได้เพิ่มรอบเดินทาง</h3>
                    <p className="text-sm text-gray-400 mb-4">Add travel dates to start selling this tour.</p>
                    <button onClick={handleAddRound} className="text-[#03b8fa] font-bold text-sm hover:underline">เริ่มสร้างรอบแรก</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredRounds.map((round, idx) => (
                      <div key={round.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition duration-300 group">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4 border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">#{idx + 1}</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">วันที่เดินทาง</label><input type="text" className="block w-40 font-bold text-gray-800 border-b border-gray-200 focus:border-[#03b8fa] outline-none text-sm py-0.5" value={round.date} onChange={e => updateRound(round.id, 'date', e.target.value)} /></div>
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">สายการบิน</label><input type="text" className="block w-20 font-bold text-gray-800 border-b border-gray-200 focus:border-[#03b8fa] outline-none text-sm py-0.5" value={round.airline} onChange={e => updateRound(round.id, 'airline', e.target.value)} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">เที่ยวบิน</label><input type="text" className="block w-20 text-gray-600 border-b border-gray-200 focus:border-[#03b8fa] outline-none text-sm py-0.5" value={round.flight} onChange={e => updateRound(round.id, 'flight', e.target.value)} /></div>
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">ที่นั่ง</label><input type="number" className="block w-16 text-gray-800 border-b border-gray-200 focus:border-[#03b8fa] outline-none text-sm py-0.5" value={round.seats} onChange={e => updateRound(round.id, 'seats', Number(e.target.value))} /></div>
                            </div>
                            <div className="pl-4 border-l border-gray-200 ml-2">
                              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">OP Staff</label>
                              <select
                                className="block w-32 text-sm border-b border-gray-200 focus:border-[#03b8fa] outline-none py-0.5 bg-transparent"
                                value={round.headId || 0}
                                onChange={(e) => {
                                  const selectedUser = appUsers.find(u => u.id === Number(e.target.value));
                                  updateRound(round.id, 'headId', Number(e.target.value));
                                  updateRound(round.id, 'head', selectedUser ? selectedUser.name : 'Unassigned');
                                }}
                              >
                                <option value={0}>Unassigned</option>
                                {appUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                              </select>
                            </div>
                          </div>
                          <button onClick={() => setRounds(rounds.filter(r => r.id !== round.id))} className="text-gray-300 hover:text-[#03b8fa] transition"><Trash2 size={16} /></button>
                        </div>

                        <div className="bg-gray-50/50 rounded-lg p-4">
                          <label className="text-xs font-bold text-gray-400 uppercase mb-3 block flex items-center gap-2"><DollarSign size={14} /> กำหนดราคาขาย (บาท)</label>
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                              { s: 'ผู้ใหญ่ (พักคู่)', k: 'adultTwin' }, { s: 'ผู้ใหญ่ (พักเดี่ยว)', k: 'adultSingle' }, { s: 'ผู้ใหญ่ (พัก 3 ท่าน)', k: 'adultTriple' },
                              { s: 'เด็ก (มีเตียง)', k: 'childBed' }, { s: 'เด็ก (ไม่มีเตียง)', k: 'childNoBed' }
                            ].map(item => (
                              <div key={item.k} className="relative">
                                <div className="text-[10px] text-gray-500 mb-1">{item.s}</div>
                                <div className="relative">
                                  <span className="absolute left-2 top-1.5 text-gray-400 text-xs">฿</span>
                                  <input type="number" className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded text-sm font-bold text-gray-700 focus:border-red-400 outline-none"
                                    value={round.price?.[item.k] || 0}
                                    onChange={e => updateRoundPrice(round.id, item.k, e.target.value)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Assets & Docs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-700"><FileIcon size={18} /> เอกสาร & ไฟล์แนบ</div>
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer" onClick={() => {
                  const fileName = prompt("Enter File Name to simulate upload (e.g. Program_Full.pdf):");
                  if (fileName) setEditorRoute({ ...editorRoute, attachment: fileName });
                }}>
                  <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3"><Download size={24} /></div>
                  <h3 className="text-gray-800 font-bold">อัปโหลดโปรแกรมทัวร์</h3>
                  <p className="text-sm text-gray-400 mb-4">แนบไฟล์โปรแกรมทัวร์เพื่อให้ฝ่ายขายดาวน์โหลดไปใช้งาน</p>
                  {editorRoute.attachment ? (
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
                      <FileIcon size={16} /> {editorRoute.attachment}
                      <button onClick={(e) => { e.stopPropagation(); setEditorRoute({ ...editorRoute, attachment: null }); }} className="ml-2 hover:text-[#03b8fa]"><X size={14} /></button>
                    </div>
                  ) : (
                    <button className="text-sm text-blue-600 font-bold hover:underline">Browse Files</button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const [bookingMode, setBookingMode] = useState('wizard'); // 'wizard' or 'editor'
  const [dashboardExpandedRow, setDashboardExpandedRow] = useState(null);
  const [editorRoute, setEditorRoute] = useState(null);

  const renderBooking = () => {
    if (bookingMode === 'editor') return renderRouteEditor();

    return (
      <div className="space-y-6 h-full flex flex-col">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">จองทัวร์ใหม่</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span className={`px-2 py-1 rounded ${bookingStep >= 1 ? 'bg-red-100 text-[#0279a9] font-bold' : ''}`}>1. เลือกเส้นทาง</span>
              <span>→</span>
              <span className={`px-2 py-1 rounded ${bookingStep >= 2 ? 'bg-red-100 text-[#0279a9] font-bold' : ''}`}>2. เลือกรอบเดินทาง</span>
              <span>→</span>
              <span className={`px-2 py-1 rounded ${bookingStep >= 3 ? 'bg-red-100 text-[#0279a9] font-bold' : ''}`}>3. ข้อมูลผู้เดินทาง</span>
            </div>
          </div>
        </header>

        {bookingStep === 1 && (
          <div className="flex-1 overflow-y-auto p-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-gray-800">เลือกเส้นทางทัวร์</h2>
              {currentUser.role === 'MANAGER' && (
                <button
                  onClick={() => {
                    setEditorRoute({ name: '', code: '', image: 'https://source.unsplash.com/random/300x200?travel', price: 0 });
                    setBookingMode('editor');
                  }}
                  className="bg-[#03b8fa] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0279a9] shadow-md transition"
                >
                  <Plus size={16} /> สร้างเส้นทางใหม่
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {routes.map(route => (
                <div key={route.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer group flex flex-col relative" onClick={() => { setSelectedRoute(route); setBookingStep(2); }}>
                  <div className="h-40 overflow-hidden relative">
                    <img src={route.image} alt={route.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-bold rounded shadow">{route.code}</div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-[#03b8fa] transition">{route.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{route.description}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold w-fit flex items-center gap-1">
                          <Clock size={12} /> {route.duration}
                        </span>
                        <span className="text-xs text-gray-400 font-medium pl-1">
                          {rounds.filter(r => r.routeId === route.id && r.status !== 'Full').length} รอบที่เปิดจอง
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 font-normal mb-[-2px]">เริ่มต้นที่</div>
                        <span className="font-bold text-[#03b8fa] text-lg">฿{route.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setBookingStep(1)} className="text-gray-400 hover:text-gray-600">← ย้อนกลับ</button>
                <h2 className="font-bold text-lg">เลือกรอบเดินทางสำหรับ <span className="text-[#03b8fa]">{selectedRoute.code}</span></h2>
              </div>
              <div className="flex items-center gap-2">
                {/* Download Attachment Button */}
                {selectedRoute.attachment && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Simulate download - in real app this would be a real file URL
                      window.alert(`กำลังดาวน์โหลด: ${selectedRoute.attachment}\n\n(Demo: ไฟล์จะถูกดาวน์โหลดในระบบจริง)`);
                    }}
                    className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-green-100 shadow-sm transition"
                  >
                    <Download size={14} /> ดาวน์โหลดโปรแกรมทัวร์
                  </button>
                )}
                {/* Manager Actions for this Route */}
                {currentUser.role === 'MANAGER' && (
                  <button
                    onClick={() => {
                      setEditorRoute(selectedRoute); // Edit current route
                      setBookingMode('editor');
                    }}
                    className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition"
                  >
                    <Settings size={14} /> จัดการเส้นทาง / รอบ
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {/* Header Row */}
              <div className="hidden md:flex items-center justify-between px-5 py-3 bg-gray-100 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="flex-1 min-w-[60px]">สายการบิน</div>
                <div className="flex-1 min-w-[100px]">วันที่เดินทาง</div>
                <div className="flex-1 min-w-[80px] text-center">ผู้ใหญ่ (คู่)</div>
                <div className="flex-1 min-w-[70px] text-center">พักเดี่ยว</div>
                <div className="flex-1 min-w-[80px] text-center">OP Staff</div>
                <div className="flex-1 min-w-[50px] text-center">ที่นั่ง</div>
                <div className="flex-1 min-w-[60px] text-center text-green-600">ชำระแล้ว</div>
                <div className="flex-1 min-w-[60px] text-center text-orange-500">รอชำระ</div>
                <div className="flex-1 min-w-[60px] text-center text-yellow-600">บางส่วน</div>
                <div className="flex-1 min-w-[70px] text-center">อนุมัติ</div>
                <div className="flex-1 min-w-[60px] text-right">สถานะ</div>
              </div>

              {rounds.filter(r => r.routeId === selectedRoute.id).map(round => {
                const isFull = round.sold >= round.seats;
                const prices = round.price || selectedRoute.price || {};

                return (
                  <div key={round.id} className="border border-gray-200 rounded-lg group hover:border-[#03b8fa] hover:shadow-md transition-all duration-200">
                    {/* Main Row */}
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-5 py-4 cursor-pointer" onClick={() => {
                      setSelectedRound({ ...round, price: prices });
                      setBookingDetails(prev => ({ ...prev, contactName: round.head || '' }));
                      // Auto-populate unpaid pax to bookingPaxList
                      const allPax = getPaxForRound(round.id);
                      const unpaidPax = allPax.filter(p => p.paymentStatus === 'pending' || p.paymentStatus === 'partial');
                      setBookingPaxList(unpaidPax);
                      setSelectedPaxForBooking(unpaidPax.map(p => p.id));
                      setBookingStep(3);
                    }}>
                      <div className="flex-1 min-w-[60px] font-bold text-[#03b8fa] text-lg">{round.airline}</div>
                      <div className="flex-1 min-w-[100px] font-medium text-gray-800 text-sm">{round.date}</div>
                      <div className="flex-1 min-w-[80px] text-center font-mono font-bold text-[#03b8fa] text-lg">{prices.adultTwin?.toLocaleString()}</div>
                      <div className="flex-1 min-w-[70px] text-center font-mono text-gray-400 text-sm">{prices.adultSingle?.toLocaleString()}</div>
                      <div className="flex-1 min-w-[80px] text-center text-sm text-gray-600 truncate" title={round.head}>{round.head || '-'}</div>
                      <div className="flex-1 min-w-[50px] text-center text-sm font-bold text-gray-700">{round.seats}</div>
                      <div className="flex-1 min-w-[60px] text-center">
                        <span className="inline-block min-w-[28px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{round.paidCount || 0}</span>
                      </div>
                      <div className="flex-1 min-w-[60px] text-center">
                        <span className="inline-block min-w-[28px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">{round.pendingCount || 0}</span>
                      </div>
                      <div className="flex-1 min-w-[60px] text-center">
                        <span className="inline-block min-w-[28px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">{round.partialCount || 0}</span>
                      </div>
                      <div className="flex-1 min-w-[70px] text-center">
                        {round.approved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                            <CheckCircle size={10} /> อนุมัติ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            <Clock size={10} /> รอ
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-[60px] text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFull ? 'text-red-600 bg-red-50 border border-red-200' : 'text-green-600 bg-green-50 border border-green-200'}`}>
                          {isFull ? 'เต็ม' : 'ว่าง'}
                        </span>
                      </div>
                    </div>
                    {/* Expanded Details */}
                    <div className="bg-gray-50 px-5 py-3 text-xs border-t border-gray-100 flex flex-wrap md:flex-nowrap items-center gap-6 text-gray-500">
                      <div>ผู้ใหญ่ (3 ท่าน): <strong className="text-gray-700">{formatPrice(prices.adultTriple)}</strong></div>
                      <div>เด็ก (มีเตียง): <strong className="text-gray-700">{formatPrice(prices.childBed)}</strong></div>
                      <div>เด็ก (ไม่มีเตียง): <strong className="text-gray-700">{formatPrice(prices.childNoBed)}</strong></div>
                      <div className="flex-1 text-right text-[#03b8fa] font-medium cursor-pointer hover:underline">คลิกเพื่อเลือกรอบนี้ →</div>
                    </div>
                  </div>
                )
              })}

              {rounds.filter(r => r.routeId === selectedRoute.id).length === 0 && (
                <div className="text-center py-10 text-gray-400">ไม่มีรอบเดินทางที่เปิดจอง ติดต่อ Manager</div>
              )}
            </div>
          </div>
        )}

        {bookingStep === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setBookingStep(2)} className="text-gray-400 hover:text-gray-600">← Back</button>
                <div>
                  <h2 className="font-bold text-lg">ข้อมูลผู้โดยสาร</h2>
                  <div className="text-xs text-gray-500">
                    รอบเดินทาง: {selectedRound.date} | ราคาเริ่มต้น: <span className="font-bold text-[#03b8fa]">฿{selectedRound.price?.adultTwin?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 relative">
                {/* Add Customer Button - Opens Modal */}
                <button
                  onClick={() => setShowBookingTypeModal(true)}
                  className="bg-[#03b8fa] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0279a9] transition shadow-sm"
                >
                  <Plus size={16} /> เพิ่มลูกค้า
                </button>
              </div>
            </div>

            {/* Passengers are now shown in their respective Individual or Group tables below */}

            {/* Booking Customization Area */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">OP Staff ผู้ดูแล</label>
                  <input
                    type="text"
                    className={`w-full border p-2 rounded text-sm bg-white ${currentUser.role !== 'MANAGER' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                    placeholder="ระบุชื่อ OP Staff ที่ดูแลเส้นทางนี้"
                    value={bookingDetails.contactName}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, contactName: e.target.value })}
                    disabled={currentUser.role !== 'MANAGER'}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">รหัสทัวร์ (ถ้ามี)</label>
                  <input type="text" className="w-full border p-2 rounded text-sm bg-white font-mono uppercase" placeholder="e.g. RNAT250662" value={bookingDetails.tourCode} onChange={(e) => setBookingDetails({ ...bookingDetails, tourCode: e.target.value.toUpperCase() })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">หมายเหตุ / บันทึกภายใน</label>
                <input type="text" className="w-full border p-2 rounded text-sm bg-white" placeholder="ส่วนลด? คำขอพิเศษ?" value={bookingDetails.specialRequest} onChange={(e) => setBookingDetails({ ...bookingDetails, specialRequest: e.target.value })} />
              </div>

              {/* Empty State - Show when no passengers added */}
              {bookingPaxList.length === 0 && !bookingAddMode && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed mb-4">
                  <Users size={40} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-4">ยังไม่มีลูกค้าในรายการจอง</p>
                  <p className="text-sm text-gray-400">กดปุ่ม "เพิ่มลูกค้า" ด้านบนเพื่อเริ่มต้น</p>
                </div>
              )}



              {/* === INDIVIDUAL PASSENGERS TABLE === */}
              {bookingPaxList.filter(p => p.bookingType === 'individual').length > 0 && (
                <div className="mb-6 border border-blue-200 rounded-xl overflow-hidden">
                  <div className="bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <UserIcon size={14} /> รายชื่อลูกค้าเดี่ยว ({bookingPaxList.filter(p => p.bookingType === 'individual').length} ท่าน)
                    </span>
                    <span className="text-xs font-normal text-blue-500">เลือกได้ทีละ 1 รายการเท่านั้น</span>
                  </div>
                  <div className="bg-white">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-blue-50 text-blue-700">
                        <tr>
                          <th className="px-4 py-2 w-12"></th>
                          <th className="px-4 py-2">#</th>
                          <th className="px-4 py-2">ชื่อ-นามสกุล</th>
                          <th className="px-4 py-2">ประเภทห้อง</th>
                          <th className="px-4 py-2">หมายเหตุ</th>
                          <th className="px-4 py-2 text-right">ยอดจอง</th>
                          <th className="px-4 py-2 text-right">ค้างชำระ</th>
                          <th className="px-4 py-2 text-center">สถานะ</th>
                          <th className="px-4 py-2 text-center">วันที่ชำระ</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookingPaxList.filter(p => p.bookingType === 'individual').map((pax, idx) => {
                          const total = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                          const paid = pax.paidAmount || 0;
                          const balance = total - paid;
                          const isFullyPaid = paid >= total && total > 0;
                          const isSelected = selectedPaxForBooking.includes(pax.id) && selectedPaxForBooking.length === 1;

                          // Status logic based on billingNoteId and paymentStatus:
                          // - No billingNoteId = "จองแล้ว" (gray, just added, no billing note yet)
                          // - Has billingNoteId with paymentStatus 'pending' = "รอชำระ" (orange, billing created but not paid)
                          // - Has billingNoteId with paymentStatus 'partial' = "บางส่วน" (yellow)
                          // - Has billingNoteId with paymentStatus 'paid' = "ชำระแล้ว" (green, receipt issued)
                          let statusText = 'จองแล้ว';
                          let statusClass = 'bg-gray-100 text-gray-600';

                          if (pax.billingNoteId || pax.paymentStatus) {
                            // Has billing note created or starting payment
                            if (pax.paymentStatus === 'paid' || isFullyPaid) {
                              statusText = 'ชำระแล้ว';
                              statusClass = 'bg-green-100 text-green-700';
                            } else if (pax.paymentStatus === 'partial' || (paid > 0 && !isFullyPaid)) {
                              statusText = 'ชำระมัดจำแล้ว';
                              statusClass = 'bg-yellow-100 text-yellow-700';
                            } else {
                              statusText = 'รอชำระ';
                              statusClass = 'bg-orange-100 text-orange-700';
                            }
                          }

                          return (
                            <tr key={`ind-${pax.id}-${idx}`} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''} ${isFullyPaid ? 'bg-green-50/30' : ''}`}>
                              <td className="px-4 py-3">
                                <input
                                  type="radio"
                                  name="selectedBooking"
                                  className={`w-4 h-4 accent-[#03b8fa] ${isFullyPaid ? 'opacity-30 cursor-not-allowed' : ''}`}
                                  checked={isSelected}
                                  disabled={isFullyPaid}
                                  onChange={() => !isFullyPaid && setSelectedPaxForBooking([pax.id])}
                                />
                              </td>
                              <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-gray-800">{pax.firstNameEn} {pax.lastNameEn}</div>
                                <div className="text-xs text-gray-500">{pax.passportNo}</div>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  className="text-xs border rounded px-2 py-1 bg-white"
                                  value={pax.roomType || 'adultTwin'}
                                  disabled={isFullyPaid}
                                  onChange={(e) => setBookingPaxList(prev => prev.map(c => c.id === pax.id ? { ...c, roomType: e.target.value } : c))}
                                >
                                  <option value="adultTwin">ผู้ใหญ่ (พักคู่)</option>
                                  <option value="adultSingle">ผู้ใหญ่ (พักเดี่ยว)</option>
                                  <option value="adultTriple">ผู้ใหญ่ (พัก 3 ท่าน)</option>
                                  <option value="childBed">เด็ก (มีเตียง)</option>
                                  <option value="childNoBed">เด็ก (ไม่มีเตียง)</option>
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-col gap-1">
                                  {pax.customerNote && (
                                    <div className="text-[10px] text-gray-400 flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 italic" title="Database Note (Read-only)">
                                      <Pin size={10} className="text-gray-400" /> {pax.customerNote}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Edit2 size={10} className="text-[#03b8fa]" />
                                    <input
                                      type="text"
                                      className="bg-transparent border-b border-dashed border-gray-200 focus:border-[#03b8fa] outline-none text-[11px] w-full"
                                      placeholder="เพิ่มหมายเหตุ..."
                                      value={pax.remark || ''}
                                      onChange={(e) => {
                                        const newVal = e.target.value;
                                        setBookingPaxList(prev => prev.map(p => p.id === pax.id ? { ...p, remark: newVal } : p));
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-[#03b8fa] font-bold">฿{total.toLocaleString()}</td>
                              <td className={`px-4 py-3 text-right font-mono font-bold ${balance > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                {balance > 0 ? `฿${balance.toLocaleString()}` : '฿0'}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusClass}`}>{statusText}</span>
                              </td>
                              <td className="px-4 py-3 text-center font-mono text-xs text-gray-500">
                                {pax.paymentDate || (isFullyPaid ? new Date().toISOString().split('T')[0] : '-')}
                              </td>
                              <td className="px-4 py-3">
                                {!isFullyPaid && (
                                  <button onClick={() => setBookingPaxList(prev => prev.filter(c => c.id !== pax.id))} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* === GROUP BOOKINGS TABLE (Multiple Groups Supported) === */}
              {(() => {
                const groupPax = bookingPaxList.filter(p => p.bookingType === 'group');
                if (groupPax.length === 0) return null;

                // Group by groupName
                const grouped = groupPax.reduce((acc, p) => {
                  const name = p.groupName || 'กรุ๊ปไม่มีชื่อ';
                  if (!acc[name]) acc[name] = [];
                  acc[name].push(p);
                  return acc;
                }, {});

                return Object.entries(grouped).map(([groupName, members]) => {
                  const groupTotal = members.reduce((sum, pax) => sum + (selectedRound.price?.[pax.roomType || 'adultTwin'] || 0), 0);
                  const groupPaid = members.reduce((sum, pax) => sum + (pax.paidAmount || 0), 0);
                  const groupBalance = groupTotal - groupPaid;

                  // Status Logic - check if group has billing note
                  const hasBillingNote = members.some(m => m.billingNoteId || m.paymentStatus);
                  let statusText = 'จองแล้ว';
                  let statusColor = 'bg-gray-100 text-gray-600';

                  if (hasBillingNote) {
                    // Group status logic:
                    // 1. If sum of paidAmount >= group total -> 'ชำระแล้ว'
                    // 2. If sum of paidAmount > 0 but < total -> 'ชำระมัดจำแล้ว'
                    // 3. Otherwise -> 'รอชำระ'
                    const isFullyPaid = groupPaid >= (groupTotal - 1) && groupTotal > 0;
                    if (isFullyPaid) {
                      statusText = 'ชำระแล้ว';
                      statusColor = 'bg-green-100 text-green-700';
                    } else if (groupPaid > 0) {
                      statusText = 'ชำระมัดจำแล้ว';
                      statusColor = 'bg-yellow-100 text-yellow-700';
                    } else {
                      statusText = 'รอชำระ';
                      statusColor = 'bg-orange-100 text-orange-700';
                    }
                  }

                  const isSelected = selectedPaxForBooking.includes(`group:${groupName}`);

                  return (
                    <div key={groupName} className="mb-6 border-2 border-purple-200 rounded-xl overflow-hidden shadow-sm">
                      {/* Group Header */}
                      <div className="bg-purple-50 px-4 py-3 text-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-purple-200">
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                          <span className="font-bold text-purple-700 flex items-center gap-2">
                            <Users size={16} />
                            <span className="whitespace-nowrap">กลุ่ม:</span>
                          </span>

                          {/* Group Name Display/Edit */}
                          <div className="relative group/edit flex-1 md:flex-none">
                            <input
                              type="text"
                              value={groupName}
                              onChange={(e) => {
                                const newName = e.target.value;
                                if (!newName) return;
                                // Rename logic: update all members of this group to new name
                                setBookingPaxList(prev => prev.map(p =>
                                  p.groupName === groupName ? { ...p, groupName: newName } : p
                                ));
                                // If this was the current active group in modal, update that too
                                if (currentGroupName === groupName) setCurrentGroupName(newName);
                                // Also update selection if selected
                                if (isSelected) setSelectedPaxForBooking([`group:${newName}`]);
                              }}
                              className="bg-purple-100/50 hover:bg-white border-b border-dashed border-purple-300 focus:border-purple-500 focus:bg-white outline-none px-2 py-0.5 text-purple-800 font-bold w-full md:w-auto md:min-w-[150px] transition-colors rounded-t"
                            />
                            <Edit2 size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-400 opacity-0 group-hover/edit:opacity-100 transition pointer-events-none" />
                          </div>

                          <span className="font-bold text-purple-700 whitespace-nowrap">({members.length} ท่าน)</span>
                          <span className={`${statusColor} px-2 py-0.5 ml-2 rounded text-xs font-bold border border-white/50 whitespace-nowrap`}>
                            {statusText}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium pl-6 md:pl-0">
                          <div className="text-gray-600">
                            ยอดจอง: <span className="font-bold text-gray-800">฿{groupTotal.toLocaleString()}</span>
                          </div>
                          <div className="text-red-600 bg-white px-2 py-1 rounded border border-purple-100 shadow-sm">
                            ค้างชำระ: <span className="font-bold">฿{groupBalance.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Group Members Table */}
                      <div className="bg-white">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-purple-50 text-purple-700">
                            <tr>
                              <th className="px-4 py-2 w-12"></th>
                              <th className="px-4 py-2">#</th>
                              <th className="px-4 py-2">ชื่อ-นามสกุล</th>
                              <th className="px-4 py-2">ประเภทห้อง</th>
                              <th className="px-4 py-2">หมายเหตุ</th>
                              <th className="px-4 py-2 text-right">ยอดจอง</th>
                              <th className="px-4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {members.map((pax, idx) => {
                              const total = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                              const paid = pax.paidAmount || 0;
                              const isFullyPaid = paid >= total && total > 0;

                              // Status logic per member
                              let memberStatus = 'จองแล้ว';
                              let memberStatusClass = 'bg-gray-100 text-gray-600';

                              if (pax.billingNoteId || pax.paymentStatus) {
                                if (pax.paymentStatus === 'paid' || isFullyPaid) {
                                  memberStatus = 'ชำระแล้ว';
                                  memberStatusClass = 'bg-green-100 text-green-700';
                                } else if (pax.paymentStatus === 'partial' || (paid > 0 && !isFullyPaid)) {
                                  memberStatus = 'ชำระมัดจำแล้ว';
                                  memberStatusClass = 'bg-yellow-100 text-yellow-700';
                                } else {
                                  memberStatus = 'รอชำระ';
                                  memberStatusClass = 'bg-orange-100 text-orange-700';
                                }
                              }

                              return (
                                <tr key={pax.id} className={`hover:bg-gray-50 ${groupPaid >= groupTotal && groupTotal > 0 ? 'bg-green-50/30' : ''}`}>
                                  {idx === 0 && (
                                    <td className="px-4 py-3" rowSpan={members.length}>
                                      <input
                                        type="radio"
                                        name="selectedBooking"
                                        className={`w-4 h-4 accent-purple-500 ${statusText === 'ชำระแล้ว' ? 'opacity-30 cursor-not-allowed' : ''}`}
                                        checked={isSelected}
                                        disabled={statusText === 'ชำระแล้ว'}
                                        onChange={() => {
                                          setSelectedPaxForBooking([`group:${groupName}`]);
                                          setCurrentGroupName(groupName);
                                          setBookingAddMode('group');
                                        }}
                                      />
                                    </td>
                                  )}
                                  <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                                  <td className="px-4 py-3 font-medium text-gray-800">
                                    {pax.firstNameEn} {pax.lastNameEn}
                                    <div className="text-[10px] text-gray-400">{pax.passportNo}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <select
                                      className={`border border-gray-200 rounded px-2 py-1 text-xs outline-none focus:border-purple-400 ${groupPaid >= groupTotal && groupTotal > 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                      value={pax.roomType || 'adultTwin'}
                                      disabled={groupPaid >= groupTotal && groupTotal > 0}
                                      onChange={(e) => {
                                        setBookingPaxList(prev => prev.map(p => p.id === pax.id ? { ...p, roomType: e.target.value } : p));
                                      }}
                                    >
                                      <option value="adultTwin">ผู้ใหญ่ (พักคู่)</option>
                                      <option value="adultSingle">ผู้ใหญ่ (พักเดี่ยว)</option>
                                      <option value="childBed">เด็ก (มีเตียง)</option>
                                      <option value="childNoBed">เด็ก (ไม่มีเตียง)</option>
                                    </select>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex flex-col gap-1">
                                      {pax.customerNote && (
                                        <div className="text-[10px] text-gray-400 flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 italic" title="Database Note (Read-only)">
                                          <Pin size={10} className="text-gray-400" /> {pax.customerNote}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-1">
                                        <Edit2 size={10} className="text-[#03b8fa]" />
                                        <input
                                          type="text"
                                          className="bg-transparent border-b border-dashed border-gray-200 focus:border-[#03b8fa] outline-none text-[11px] w-full"
                                          placeholder="เพิ่มหมายเหตุ..."
                                          value={pax.remark || ''}
                                          onChange={(e) => {
                                            const newVal = e.target.value;
                                            setBookingPaxList(prev => prev.map(p => p.id === pax.id ? { ...p, remark: newVal } : p));
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right font-mono font-bold text-gray-700">฿{total.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-right">
                                    {!(groupPaid >= groupTotal && groupTotal > 0) && (
                                      <button
                                        onClick={() => setBookingPaxList(prev => prev.filter(p => p.id !== pax.id))}
                                        className="text-gray-400 hover:text-red-500 transition"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                });
              })()}

              {/* Bottom Bar - Selected Item Summary */}
              {(selectedPaxForBooking.length > 0 || (bookingAddMode && bookingPaxList.length > 0)) && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold mt-3 text-[#03b8fa] mb-4">
                    <span>
                      {selectedPaxForBooking.some(s => String(s).startsWith('group:'))
                        ? 'ยอดกลุ่มที่ต้องชำระ:'
                        : selectedPaxForBooking.length === 1
                          ? 'ยอดที่ต้องชำระ:'
                          : 'กรุณาเลือก 1 รายการเพื่อชำระ'}
                    </span>
                    <span>
                      {(() => {
                        const groupSelect = selectedPaxForBooking.find(s => String(s).startsWith('group:'));
                        if (groupSelect) {
                          const gName = groupSelect.split(':')[1];
                          const gMembers = bookingPaxList.filter(p => p.groupName === gName);
                          const gTotal = gMembers.reduce((sum, pax) => sum + (selectedRound.price?.[pax.roomType || 'adultTwin'] || 0), 0);
                          const gPaid = gMembers.reduce((sum, pax) => sum + (pax.paidAmount || 0), 0);
                          const gBalance = gTotal - gPaid;
                          return `฿${gBalance.toLocaleString()}`;
                        } else if (selectedPaxForBooking.length === 1) {
                          const pax = bookingPaxList.find(c => c.id === selectedPaxForBooking[0]);
                          if (pax) {
                            const total = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                            const paid = pax.paidAmount || 0;
                            const balance = total - paid;
                            return `฿${balance.toLocaleString()}`;
                          }
                        }
                        return '-';
                      })()}
                    </span>
                  </div>
                  <button
                    className="w-full bg-[#03b8fa] text-white py-3 rounded-lg font-bold hover:bg-[#0279a9] shadow-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={selectedPaxForBooking.length === 0}
                    onClick={() => setIsBookingConfirmationModalOpen(true)}
                  >
                    {(() => {
                      const groupSelect = selectedPaxForBooking.find(s => String(s).startsWith('group:'));
                      if (groupSelect) {
                        return `ดำเนินการชำระเงิน - กลุ่ม ${groupSelect.split(':')[1]}`;
                      }
                      return selectedPaxForBooking.length === 1
                        ? 'ดำเนินการชำระเงิน - 1 ท่าน'
                        : 'กรุณาเลือกรายการที่ต้องการชำระ';
                    })()}
                  </button>
                </div>
              )}
            </div >
          </div >
        )}
      </div >
    );
  };



  // --- Helper ---
  const isChild = (dob) => {
    if (!dob) return false;
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    return age < 15;
  };

  const renderOperation = () => {
    const isManager = currentUser.role === 'MANAGER';
    const isHead = selectedOpRound && currentUser.id === selectedOpRound.headId;
    // canManageAll = Manager OR Head. They can delete/edit anyone.
    const canManageAll = isManager || isHead;
    // Guide role gets view-only access
    const canEdit = currentUser.role !== 'GUIDE';

    if (operationView === 'list') {
      // Filter rounds based on tab
      // For demo purposes:
      // - upcoming: status = 'Selling' (still open for booking)
      // - ongoing: status = 'Full' and date is in the future or current
      // - completed: marked as completed (we'll use a simple check)
      const today = new Date();

      const getFilteredRounds = () => {
        switch (operationTab) {
          case 'upcoming':
            // Rounds that are still selling (not full yet)
            return rounds.filter(r => r.status === 'Selling');
          case 'ongoing':
            // Rounds that are full AND 100% ready (passed all checklists)
            return rounds.filter(r => r.status === 'Full' && calculateEstimatedProgress(r.id) === 100);
          case 'completed':
            // For demo: no completed rounds yet (could add a 'Completed' status in future)
            return rounds.filter(r => r.status === 'Completed');
          default:
            return rounds;
        }
      };

      const filteredRounds = getFilteredRounds();

      const tabs = [
        { key: 'upcoming', label: 'ทัวร์ที่กำลังจะถึง', icon: Calendar, count: rounds.filter(r => r.status === 'Selling').length },
        { key: 'ongoing', label: 'กำลังออกเดินทาง', icon: Plane, count: rounds.filter(r => r.status === 'Full' && calculateEstimatedProgress(r.id) === 100).length },
        { key: 'completed', label: 'เสร็จสิ้นแล้ว', icon: CheckCircle, count: rounds.filter(r => r.status === 'Completed').length }
      ];

      return (
        <div className="space-y-6 animate-fade-in">
          <header className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ศูนย์ปฏิบัติการทัวร์</h1>
              <p className="text-gray-500 text-sm">Overview of all active tour groups and assignments</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="ค้นหาทัวร์..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#6bc8e9] outline-none" />
              </div>
            </div>
          </header>

          {/* Tab Switcher */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 inline-flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setOperationTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${operationTab === tab.key
                  ? 'bg-[#03b8fa] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${operationTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tour Cards Grid */}
          {filteredRounds.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                {operationTab === 'upcoming' && <Calendar size={48} className="mx-auto opacity-50" />}
                {operationTab === 'ongoing' && <Plane size={48} className="mx-auto opacity-50" />}
                {operationTab === 'completed' && <CheckCircle size={48} className="mx-auto opacity-50" />}
              </div>
              <h3 className="text-lg font-bold text-gray-600 mb-2">
                {operationTab === 'upcoming' && 'ไม่มีทัวร์ที่กำลังจะถึง'}
                {operationTab === 'ongoing' && 'ไม่มีทัวร์ที่กำลังออกเดินทาง'}
                {operationTab === 'completed' && 'ไม่มีทัวร์ที่เสร็จสิ้น'}
              </h3>
              <p className="text-gray-400 text-sm">
                {operationTab === 'upcoming' && 'ทัวร์ที่ยังเปิดรับจองจะแสดงที่นี่'}
                {operationTab === 'ongoing' && 'ทัวร์ที่ที่นั่งเต็มและพร้อมออกเดินทางจะแสดงที่นี่'}
                {operationTab === 'completed' && 'ทัวร์ที่เดินทางเสร็จสิ้นแล้วจะแสดงที่นี่'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRounds.map(round => {
                const route = routes.find(r => r.id === round.routeId);
                // Progress: ongoing (Full) and completed rounds should be 100%
                const progress = round.status === 'Completed' ? 100 : calculateEstimatedProgress(round.id);
                const isFull = round.sold === round.seats;
                return (
                  <div
                    key={round.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                    onClick={() => { setSelectedOpRound(round); setOperationView('detail'); }}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-[#d9edf4] text-[#0279a9] px-2 py-1 rounded text-xs font-bold">{route?.code}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isFull ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {round.status === 'Selling' ? 'เปิดจอง' : round.status === 'Full' ? 'เต็ม' : round.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-[#0279a9] transition">{route?.name}</h3>
                      <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                        <Calendar size={14} /> {round.date}
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">OP Staff:</span>
                        <span className={`font-medium ${round.head === 'Unassigned' ? 'text-[#03b8fa] italic' : 'text-gray-800'}`}>{round.head}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Pax:</span>
                        <span className="font-medium text-gray-800">{round.sold}/{round.seats}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">สถานะอนุมัติ:</span>
                        {round.approved ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                            <CheckCircle size={10} /> อนุมัติแล้ว
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            <Clock size={10} /> รออนุมัติ
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>ความคืบหน้า</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${progress > 80 ? 'bg-[#37c3a5]' : 'bg-[#fdcf1a]'}`} style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    if (!selectedOpRound) {
      // Fallback if state is lost or invalid
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
          <AlertTriangle size={48} className="text-[#03b8fa]" />
          <h3 className="text-xl font-bold">ยังไม่ได้เลือกทัวร์</h3>
          <p>กรุณากลับไปที่หน้ารายการ เพื่อเลือกกรุ๊ปทัวร์ที่ต้องการจัดการ</p>
          <button onClick={() => setOperationView('list')} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">กลับหน้าหลัก</button>
        </div>
      );
    }

    const currentRoute = routes.find(r => r.id === selectedOpRound.routeId);
    const paxList = getPaxForRound(selectedOpRound.id) || [];

    const toggleAllTask = (taskKey) => {
      const allChecked = paxList.every(pax => paxTaskStatus[pax.id]?.[taskKey]?.checked);
      const newStatus = { ...paxTaskStatus };

      paxList.forEach(pax => {
        if (!newStatus[pax.id]) newStatus[pax.id] = {};
        // Preserve existing file if any, or init
        const currentFile = newStatus[pax.id][taskKey]?.file || null;
        newStatus[pax.id][taskKey] = {
          checked: !allChecked,
          file: currentFile
        };
      });

      setPaxTaskStatus(newStatus);
    };

    return (
      <div className="h-full flex flex-col animate-fade-in">
        <header className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setOperationView('list')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">พื้นที่จัดการทัวร์</h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span>{selectedOpRound.date} • {currentRoute?.code || 'N/A'}</span>
                {/* Approval Status Badge */}
                {selectedOpRound.approved ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle size={10} /> อนุมัติแล้ว
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                    <Clock size={10} /> รออนุมัติ
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Manager Approval Button */}
            {currentUser.role === 'MANAGER' && !selectedOpRound.approved && (
              <button
                onClick={() => handleApproveRound(selectedOpRound.id)}
                className="bg-amber-500 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-amber-600 shadow-sm"
              >
                <ShieldCheck size={16} /> อนุมัติทัวร์นี้
              </button>
            )}
            <button
              className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"
              onClick={() => {
                if (selectedOpRound.prepDocument) {
                  alert(`กำลังดาวน์โหลดใบเตรียมตัว: ${selectedOpRound.prepDocument}\n\n(ระบบจริงจะดาวน์โหลดไฟล์ PDF ที่อัปโหลดไว้)`);
                } else {
                  alert("ยังไม่ได้อัปโหลดใบเตรียมตัวการเดินทางสำหรับกรุ๊ปนี้");
                }
              }}
            >
              <FileText size={16} className="text-orange-500" /> ดาวน์โหลดใบเตรียมตัว
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
              <FileDown size={16} /> ดาวน์โหลดรายชื่อ
            </button>
            <button onClick={() => setShowTagPreview(true)} className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
              <Tags size={16} /> สร้างป้ายกระเป๋า
            </button>
          </div>
        </header>

        {/* === PROMINENT ALERT CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* 1. Birthday Alert */}
          {(() => {
            const birthdayPax = paxList.filter(p => {
              if (!p.dob) return false;
              const dobMonth = new Date(p.dob).getMonth();
              // Check if tour date range might include birthday (simplified check)
              const tourMonth = selectedOpRound.date?.split(' ')[1]?.toLowerCase();
              const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
              return dobMonth === monthMap[tourMonth?.slice(0, 3)?.toLowerCase()];
            });

            const getMonthName = (dateStr) => {
              const d = new Date(dateStr);
              return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
            };

            return birthdayPax.length > 0 ? (
              <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200 shadow-sm relative overflow-hidden group">
                {/* Decorative Icon Background */}
                <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12 group-hover:rotate-45 transition-all duration-700">
                  <Gift size={80} className="text-pink-400" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-pink-200/50 p-2 rounded-full text-pink-600">
                      <Gift size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-pink-800">🎂 วันเกิดลูกทัวร์!</h4>
                      <p className="text-xs text-pink-600 font-medium">{birthdayPax.length} ท่านมีวันเกิดในทริปนี้</p>
                    </div>
                  </div>

                  <div className="flex-1 max-h-[85px] overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
                    <div className="flex flex-wrap gap-1.5">
                      {birthdayPax.map((p, idx) => (
                        <div key={`${p.id}-${idx}`} className="bg-white/90 border border-pink-100 px-2 py-1 rounded shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105">
                          <span className="text-[10px] font-bold text-pink-700">{p.firstNameEn}</span>
                          <span className="text-[9px] bg-pink-100 text-pink-500 px-1 rounded-full font-bold">{getMonthName(p.dob)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] mt-3 text-pink-400 flex items-center gap-1">
                    <AlertTriangle size={10} /> แนะนำ: เตรียมเค้กหรือเซอร์ไพรส์พิเศษ
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 text-gray-400 opacity-60">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Gift size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">วันเกิดลูกทัวร์</h4>
                    <p className="text-xs">ไม่มีวันเกิดในช่วงทริปนี้</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. Travel Prep Document - Per Passenger Progress */}
          {(() => {
            const prepDocCount = Object.values(paxTaskStatus).filter(t => t.prepDoc?.checked).length;
            const totalPax = paxList.length;
            const percent = totalPax > 0 ? Math.round((prepDocCount / totalPax) * 100) : 0;
            const isComplete = prepDocCount === totalPax && totalPax > 0;
            return (
              <div className={`rounded-xl p-4 border transition-all shadow-sm ${isComplete ? 'bg-emerald-50 border-emerald-200' : percent > 0 ? 'bg-amber-50 border-amber-200' : 'bg-orange-50/50 border-orange-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                    {isComplete ? <CheckCircle size={24} /> : <FileIcon size={24} />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm ${isComplete ? 'text-emerald-800' : 'text-orange-800'}`}>
                      ใบเตรียมตัวเดินทาง
                    </h4>
                    <p className={`text-[11px] font-medium ${isComplete ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {isComplete ? '✅ ส่งครบทุกคนแล้ว' : `⚠️ ส่งแล้ว ${prepDocCount}/${totalPax} ท่าน`}
                    </p>
                  </div>
                  <span className={`text-xl font-black ${isComplete ? 'text-emerald-500' : 'text-orange-500'}`}>{percent}%</span>
                </div>
                <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-emerald-500' : 'bg-orange-400'}`} style={{ width: `${percent}%` }}></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 italic italic opacity-80">คลิกที่คอลัมน์ "ใบเตรียมตัว" เพื่อบันทึกผล</p>
              </div>
            );
          })()}

          {/* 3. Flight Ticket - Per Passenger Progress */}
          {(() => {
            const ticketCount = Object.values(paxTaskStatus).filter(t => t.ticket?.checked).length;
            const totalPax = paxList.length;
            const percent = totalPax > 0 ? Math.round((ticketCount / totalPax) * 100) : 0;
            const isComplete = ticketCount === totalPax && totalPax > 0;
            return (
              <div className={`rounded-xl p-4 border transition-all shadow-sm ${isComplete ? 'bg-sky-50 border-sky-200' : percent > 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-rose-50 border-rose-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${isComplete ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'}`}>
                    {isComplete ? <CheckCircle size={24} /> : <Plane size={24} />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm ${isComplete ? 'text-sky-800' : 'text-rose-800'}`}>
                      ตั๋วเครื่องบิน
                    </h4>
                    <p className={`text-[11px] font-medium ${isComplete ? 'text-sky-600' : 'text-rose-600'}`}>
                      {isComplete ? '✅ แนบตั๋วครบทุกคนแล้ว' : `❌ แนบแล้ว ${ticketCount}/${totalPax} ท่าน`}
                    </p>
                  </div>
                  <span className={`text-xl font-black ${isComplete ? 'text-sky-500' : 'text-rose-500'}`}>{percent}%</span>
                </div>
                <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-sky-500' : 'bg-rose-400'}`} style={{ width: `${percent}%` }}></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 italic opacity-80">คลิกที่คอลัมน์ "ตั๋วบิน" เพื่ออัปโหลดไฟล์</p>
              </div>
            );
          })()}

        </div>

        {/* PDPA & Data Security Notice */}
        <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 shadow-sm mb-6 flex items-center gap-4 animate-fade-in">
          <div className="bg-sky-100 p-2 rounded-full text-[#03b8fa]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Tour Privacy & PDPA Notice:</h4>
            <p className="text-xs text-gray-600">
              เอกสารสำคัญของลูกทัวร์ (พาสปอร์ต/วีซ่า/ตั๋ว) จะถูกจัดเก็บเฉพาะกิจสำหรับกรุ๊ปทัวร์นี้ และจะถูก <span className="text-red-600 font-bold uppercase underline">ลบทิ้งถาวรภายใน 5 วัน</span> หลังจบวันทัวร์ เพื่อความปลอดภัยของข้อมูลลูกค้า
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-bold text-gray-800">ความคืบหน้าภาพรวม</h3>
                <span className="text-2xl font-bold text-[#03b8fa]">{operationProgress.percent}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-6 relative overflow-hidden">
                <div
                  className="bg-[#03b8fa] h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${operationProgress.percent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">รายละเอียดงาน</h4>
                {INDIVIDUAL_TASKS.map(task => (
                  <div key={task.key} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-transparent hover:border-[#d9edf4] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${task.bg} ${task.color}`}>
                        <task.icon size={14} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{task.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {operationProgress.breakdown[task.key]}/{operationProgress.paxCount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* OP Staff Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><UserCheck size={18} /> OP Staff ผู้ดูแล</h3>
              <p className="text-sm text-gray-600 mb-3">ผู้รับผิดชอบเอกสาร: <strong className="text-[#03b8fa]">{selectedOpRound.head}</strong></p>
              {isManager && <button className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded border border-gray-200 hover:bg-gray-100">เปลี่ยน OP Staff</button>}
            </div>

            {/* Tour Guide Section */}
            <div className="bg-[#d9edf4] rounded-xl p-6 border border-[#6bc8e9]">
              <h3 className="font-bold text-[#0279a9] mb-2 flex items-center gap-2"><Users size={18} /> ไกด์ / หัวหน้าทัวร์</h3>
              <p className="text-sm text-[#03b8fa] mb-3">ไกด์นำเที่ยว: <strong>{selectedOpRound.guide || 'ยังไม่กำหนด'}</strong></p>
              {isManager && (
                <select
                  className="text-xs bg-white text-[#03b8fa] px-3 py-1.5 rounded border border-[#6bc8e9] w-full outline-none focus:border-[#03b8fa]"
                  value={selectedOpRound.guideId || ''}
                  onChange={(e) => {
                    const guideId = Number(e.target.value) || null;
                    const guideName = appUsers.find(u => u.id === guideId)?.name || 'ยังไม่กำหนด';
                    setRounds(prev => prev.map(r => r.id === selectedOpRound.id ? { ...r, guideId, guide: guideName } : r));
                    setSelectedOpRound(prev => ({ ...prev, guideId, guide: guideName }));
                  }}
                >
                  <option value="">-- เลือกไกด์ --</option>
                  {appUsers.filter(u => u.role === 'GUIDE' || u.role === 'SALE').map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              )}

              {/* Guide Checkboxes */}
              {selectedOpRound.guideId && (
                <div className="mt-4 pt-4 border-t border-[#6bc8e9] space-y-3">
                  <div className="flex items-center justify-between group cursor-pointer"
                    onClick={() => toggleGuideTask(selectedOpRound.id, 'ticket')}>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded transition-colors ${guideTaskStatus[selectedOpRound.id]?.ticket ? 'bg-green-100 text-green-600' : 'bg-white/50 text-[#03b8fa]'}`}>
                        <Plane size={14} />
                      </div>
                      <span className="text-sm font-medium text-[#0279a9]">ตั๋วเครื่องบิน</span>
                    </div>
                    {guideTaskStatus[selectedOpRound.id]?.ticket ? <CheckSquare size={18} className="text-green-600" /> : <Square size={18} className="text-[#03b8fa]" />}
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer"
                    onClick={() => toggleGuideTask(selectedOpRound.id, 'hotel')}>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded transition-colors ${guideTaskStatus[selectedOpRound.id]?.hotel ? 'bg-green-100 text-green-600' : 'bg-white/50 text-[#03b8fa]'}`}>
                        <Bed size={14} />
                      </div>
                      <span className="text-sm font-medium text-[#0279a9]">ที่พัก / โรงแรม</span>
                    </div>
                    {guideTaskStatus[selectedOpRound.id]?.hotel ? <CheckSquare size={18} className="text-green-600" /> : <Square size={18} className="text-[#03b8fa]" />}
                  </div>
                </div>
              )}
            </div>

            {/* Travel Preparation Document Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FileText size={18} /> ใบเตรียมตัวการเดินทาง
              </h3>

              {selectedOpRound.prepDocument ? (
                // Document exists - Show download option
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">{selectedOpRound.prepDocument}</p>
                        <p className="text-xs text-green-600">อัปโหลดแล้ว</p>
                      </div>
                    </div>
                    <button
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 flex items-center gap-1"
                      onClick={() => {
                        alert(`กำลังดาวน์โหลด: ${selectedOpRound.prepDocument}\n\n(Demo: ไฟล์จะถูกดาวน์โหลดในระบบจริง)`);
                      }}
                    >
                      <Download size={14} /> ดาวน์โหลด
                    </button>
                  </div>

                  {/* Replace option for Manager/Head */}
                  {(isManager || currentUser.id === selectedOpRound.headId) && (
                    <label className="block text-center text-xs text-gray-500 hover:text-[#03b8fa] cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            const fileName = e.target.files[0].name;
                            setRounds(prev => prev.map(r => r.id === selectedOpRound.id ? { ...r, prepDocument: fileName } : r));
                            setSelectedOpRound(prev => ({ ...prev, prepDocument: fileName }));
                            alert(`อัปโหลดสำเร็จ: ${fileName}`);
                          }
                        }}
                      />
                      เปลี่ยนไฟล์
                    </label>
                  )}
                </div>
              ) : (
                // No document yet
                <div className="space-y-3">
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">ยังไม่มีใบเตรียมตัวการเดินทาง</p>
                  </div>

                  {/* Upload option for Manager/Head only */}
                  {(isManager || currentUser.id === selectedOpRound.headId) ? (
                    <label className="block w-full bg-[#03b8fa] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#0279a9] cursor-pointer text-center transition">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            const fileName = e.target.files[0].name;
                            setRounds(prev => prev.map(r => r.id === selectedOpRound.id ? { ...r, prepDocument: fileName } : r));
                            setSelectedOpRound(prev => ({ ...prev, prepDocument: fileName }));
                            alert(`อัปโหลดสำเร็จ: ${fileName}`);
                          }
                        }}
                      />
                      <Upload size={14} className="inline mr-1" /> อัปโหลดใบเตรียมตัว
                    </label>
                  ) : (
                    <p className="text-xs text-gray-400 text-center">รอ Manager หรือ OP Staff อัปโหลด</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-gray-800">รายชื่อลูกทัวร์ & สถานะเอกสาร ({paxList.length} ท่าน)</h3><div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search pax..." className="pl-9 pr-4 py-1 border border-gray-200 rounded-full text-sm outline-none focus:border-[#6bc8e9]" /></div></div>
            <div className="overflow-auto flex-1 p-2">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10 text-xs uppercase tracking-wider font-semibold shadow-sm">
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-3 py-3 w-12 text-center align-bottom border-b-2 border-gray-100">#</th>
                    <th className="px-4 py-3 min-w-[200px] align-bottom border-b-2 border-gray-100 text-left">ชื่อ-นามสกุล / พาสปอร์ต</th>
                    <th className="px-4 py-3 min-w-[150px] align-bottom border-b-2 border-gray-100 text-left">หมายเหตุ</th>
                    {INDIVIDUAL_TASKS.map((task, idx) => (
                      <th
                        key={task.key}
                        className={`px-2 py-3 text-center w-24 align-bottom border-b-2 border-gray-100 ${idx === 0 ? 'border-l-2 border-gray-200' : ''}`}
                      >
                        <div className="flex flex-col items-center justify-end gap-1 h-full min-h-[30px]">
                          <span className={`${task.key === 'insurance' ? 'mb-0' : 'mb-1'}`}>{task.label}</span>
                          {task.key === 'insurance' && (
                            <button
                              onClick={() => toggleAllTask('insurance')}
                              className={`text-[9px] px-2 py-0.5 rounded-full border transition-all transform active:scale-95 ${paxList.every(pax => paxTaskStatus[pax.id]?.insurance?.checked)
                                ? 'bg-green-100 text-green-700 border-green-200 shadow-sm'
                                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                }`}
                              title={paxList.every(pax => paxTaskStatus[pax.id]?.insurance?.checked) ? "Uncheck All" : "Check All"}
                            >
                              {paxList.every(pax => paxTaskStatus[pax.id]?.insurance?.checked) ? 'ALL ✓' : 'ALL'}
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center w-20 align-bottom border-b-2 border-gray-100 border-l border-gray-200">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">{paxList.map((pax, index) => (
                  <tr key={pax.uniqueId || pax.id} className={`hover:bg-gray-50 ${pax.nationality !== 'THAI' ? 'bg-orange-50/30 border-l-4 border-orange-400' : ''}`}>
                    <td className="px-3 py-3 text-center font-bold text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 cursor-pointer hover:text-[#03b8fa] flex items-center gap-2" onClick={() => openCustomerForm(pax)}>
                            {pax.firstNameEn} {pax.lastNameEn}
                            {pax.nationality !== 'THAI' && (
                              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-orange-300">
                                <Globe size={10} />
                                {pax.nationality}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                            {pax.passportNo}
                            {pax.nationality !== 'THAI' && (
                              <span className="text-orange-600 font-bold">⚠️ ต่างชาติ</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 max-w-[200px]">
                        {/* 1. Database Note (Read-only) */}
                        {pax.customerNote && (
                          <div className="flex items-start gap-1 p-1.5 rounded bg-amber-50 border border-amber-100 group/note relative" title={`Note from DB: ${pax.customerNote}`}>
                            <Pin size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-[10px] text-amber-700 italic leading-tight font-medium">{pax.customerNote}</span>
                            <div className="absolute -top-2 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded-full opacity-0 group-hover/note:opacity-100 transition-opacity uppercase font-black">DB</div>
                          </div>
                        )}

                        {/* 2. Tour Specific Note (Editable) */}
                        <div className="flex items-start gap-1 p-1.5 rounded bg-[#f0f9ff] border border-[#d9edf4] group/edit relative">
                          <Edit2 size={12} className="text-[#03b8fa] mt-0.5 flex-shrink-0" />
                          <textarea
                            className="w-full bg-transparent text-[11px] text-[#0279a9] outline-none font-medium leading-tight resize-none min-h-[20px]"
                            placeholder="หมายเหตุเฉพาะทริป..."
                            rows={1}
                            value={pax.remark || ''}
                            onChange={(e) => {
                              const newVal = e.target.value;
                              // Update rounds/bookings state directly since it's Operation view
                              setBookings(prev => prev.map(b => b.id === pax.bookingId ? {
                                ...b,
                                pax: b.pax.map(px => px.id === pax.id ? { ...px, remark: newVal } : px)
                              } : b));
                            }}
                          />
                          <div className="absolute -top-2 -right-1 bg-[#03b8fa] text-white text-[8px] px-1 rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity uppercase font-black">Trip</div>
                        </div>
                      </div>
                    </td>
                    {
                      INDIVIDUAL_TASKS.map(task => {
                        const status = paxTaskStatus[pax.id]?.[task.key] || { checked: false, file: null };
                        const isChildPax = isChild(pax.dob);

                        // Render Child Cert Button for passport column if child
                        if (task.key === 'passport' && isChildPax) {
                          return (
                            <td key={task.key} className="px-2 py-3 text-center">
                              <button onClick={() => togglePaxTask(pax.id, task.key)} className={`flex flex-col items-center justify-center p-1.5 rounded transition-colors group relative ${status.checked ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}>
                                {status.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                                <span className="text-[10px] uppercase font-bold mt-0.5">Birth Cert</span>
                                {status.file && <div className="absolute top-0 right-0 bg-blue-500 w-2 h-2 rounded-full border border-white"></div>}
                              </button>
                            </td>
                          );
                        }

                        // Render Payment Status - Auto-check if paid
                        if (task.key === 'payment') {
                          const paymentStatus = pax.paymentStatus || 'pending';
                          const isPaid = paymentStatus === 'paid';
                          const isPartial = paymentStatus === 'partial';
                          return (
                            <td key={task.key} className="px-2 py-3 text-center">
                              <div className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${isPaid ? 'bg-green-100 text-green-700' : isPartial ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {isPaid ? <CheckCircle size={12} /> : isPartial ? <Clock size={12} /> : <XCircle size={12} />}
                                {isPaid ? 'Paid' : isPartial ? 'Partial' : 'Pending'}
                              </div>
                            </td>
                          );
                        }

                        // Standard Task Button
                        return (
                          <td key={task.key} className="px-2 py-3 text-center relative">
                            <button
                              onClick={() => togglePaxTask(pax.id, task.key)}
                              className={`p-1.5 rounded transition-colors relative group ${status.checked ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-300 hover:text-gray-400'}`}
                            >
                              {status.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                            </button>
                            {(status.file || pax.attachments?.[task.key]) && (
                              <button
                                onClick={(e) => { e.stopPropagation(); window.alert("Opening Attachment: " + (pax.attachments?.[task.key] || status.file)); }}
                                className="absolute top-1 right-2 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center shadow hover:bg-blue-600"
                                title="View Attached Doc"
                              >
                                <FileText size={8} />
                              </button>
                            )}
                          </td>
                        );
                      })
                    }
                    <td className="px-4 py-3 text-center text-gray-400 cursor-pointer hover:text-gray-600">
                      {/* Edit Button: Manager, Head, or Owner */}
                      {(canManageAll || pax.ownerId === currentUser.id) ? (
                        <div className="flex justify-center gap-2">
                          {/* Delete Button: ONLY Manager or Head */}
                          {canManageAll ? (
                            <button onClick={() => window.confirm(`Remove ${pax.firstNameEn} from this tour?`) && alert("Removed (Mock)")} className="hover:text-[#03b8fa]"><Trash2 size={16} /></button>
                          ) : (
                            <span className="text-gray-200 cursor-not-allowed" title="Sales cannot delete pax"><Trash2 size={16} /></span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 italic">ดูข้อมูลเท่านั้น</span>
                      )}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {!canEdit && <div className="bg-yellow-50 text-yellow-800 text-xs p-2 text-center border-t border-yellow-100">ดูข้อมูลเท่านั้น / จำกัดสิทธิ์ (สำหรับฝ่ายขาย)</div>}
          </div>
        </div>
        {showTagPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              {/* Mock Tag Preview Content */}
              <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><Printer size={18} /> ตัวอย่างพิมพ์: ป้ายติดกระเป๋า</h3><button onClick={() => setShowTagPreview(false)}><X size={20} /></button></div>
              <div className="p-6 bg-gray-100 max-h-[60vh] overflow-y-auto"><div className="bg-white shadow-lg p-4 mx-auto w-full aspect-[1/1.414] text-xs flex flex-col gap-2"><div className="border-2 border-dashed border-gray-300 rounded p-2 flex flex-col bg-white"><div className="bg-[#0279a9] text-white text-center font-bold py-1">BJ-US | 12-16 OCT</div><div className="p-2"><div className="font-bold text-lg">MR. SOMCHAI JAIDEE</div><div className="text-gray-500">คุณ สมชาย ใจดี</div><div className="mt-2 flex items-center gap-2 font-bold"><span className="bg-gray-200 px-1 rounded">TG</span> TG614</div></div></div><div className="text-center text-gray-400 mt-4 italic">... Mock Tags ...</div></div></div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3"><button onClick={() => setShowTagPreview(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button><button className="px-4 py-2 bg-[#03b8fa] text-white rounded-lg hover:bg-[#0279a9] flex items-center gap-2" onClick={() => alert("Printing sent to printer!")}><Printer size={16} /> สั่งพิมพ์ทันที</button></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUserFormModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
        <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2"><UserPlus size={20} /> {userFormData.id ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}</h3>
          <button onClick={() => setIsUserFormModalOpen(false)}><X size={20} /></button>
        </header>
        <div className="p-6 space-y-4">
          <div className="flex justify-center mb-4">
            <img src={userFormData.avatar} className="w-20 h-20 rounded-full border-4 border-gray-100 shadow-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">ชื่อ-นามสกุล</label>
            <input type="text" className="w-full border p-2 rounded text-sm focus:border-[#03b8fa] outline-none" value={userFormData.name} onChange={e => setUserFormData({ ...userFormData, name: e.target.value })} placeholder="เช่น สมชาย ใจดี" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">ตำแหน่ง (Role)</label>
            <select className="w-full border p-2 rounded text-sm focus:border-[#03b8fa] outline-none bg-white" value={userFormData.role} onChange={e => setUserFormData({ ...userFormData, role: e.target.value })}>
              <option value="SALE">Sale (ฝ่ายขาย)</option>
              <option value="MANAGER">Manager (ผู้จัดการ)</option>
              <option value="GUIDE">Guide (ไกด์/Ops)</option>
            </select>
          </div>
          {userFormData.role === 'SALE' && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Commission Rank</label>
              <select
                className={`w-full border p-2 rounded text-sm focus:border-[#03b8fa] outline-none bg-white font-bold ${commissionRanks.find(r => r.id === userFormData.commissionRank)?.color || 'text-gray-700'}`}
                value={userFormData.commissionRank || 1}
                onChange={e => setUserFormData({ ...userFormData, commissionRank: Number(e.target.value) })}
              >
                {commissionRanks.map(rank => (
                  <option key={rank.id} value={rank.id}>{rank.name}</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 mt-1">ได้รับค่าคอมมิชชั่นตามสิทธิ์ที่ผูกกับประเภทพนักงาน</p>
            </div>
          )}
          <button onClick={() => {
            if (!userFormData.name) return alert("กรุณาระบุชื่อพนักงาน");

            if (userFormData.id) {
              // Update existing user
              setAppUsers(prev => prev.map(u => u.id === userFormData.id ? userFormData : u));
            } else {
              // Add new user
              const newUser = {
                ...userFormData,
                id: Date.now()
              };
              setAppUsers([...appUsers, newUser]);
            }
            setIsUserFormModalOpen(false);
          }} className="w-full bg-[#03b8fa] text-white py-2 rounded-lg font-bold hover:bg-[#0279a9] transition shadow-lg mt-2">
            {userFormData.id ? 'บันทึกการแก้ไข' : 'บันทึกพนักงานใหม่'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-2">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="text-[#03b8fa]" />
          {settingsTab === 'users' ? 'จัดการผู้ใช้งาน และ ค่าคอมมิชชั่น' : 'บัญชีธนาคารรับเงิน'}
        </h1>
        <p className="text-gray-500 text-sm">
          {settingsTab === 'users' ? 'Manage staff roles and commission ranks' : 'Manage company bank accounts for customer transfers'}
        </p>
      </header>

      <div className="space-y-6">
        {/* Users Management Section */}
        {settingsTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">รายชื่อผู้ใช้งานทั้งหมด</h3>
              </div>
              <button
                onClick={() => {
                  setUserFormData({ name: '', role: 'SALE', commissionRank: 2, avatar: 'https://i.pravatar.cc/150?u=99', id: null });
                  setIsUserFormModalOpen(true);
                }}
                className="bg-[#03b8fa] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#029bc4]"
              >
                <UserPlus size={16} /> เพิ่มผู้ใช้งาน
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="p-3 rounded-tl-lg">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Commission Class</th>
                    <th className="p-3 text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {appUsers.map(user => (
                    <tr key={user.id} className="group hover:bg-gray-50 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-gray-200" />
                          <div>
                            <p className="font-bold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email || 'user@tour.com'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'MANAGER' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'GUIDE' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3">
                        {user.role === 'SALE' ? (
                          <select
                            className={`border rounded px-2 py-1 text-xs font-bold ${commissionRanks.find(r => r.id === user.commissionRank)?.bg || 'bg-gray-50'} ${commissionRanks.find(r => r.id === user.commissionRank)?.color || 'text-gray-700'} ${commissionRanks.find(r => r.id === user.commissionRank)?.border || 'border-gray-200'}`}
                            value={user.commissionRank || 1}
                            onChange={(e) => {
                              const newRank = Number(e.target.value);
                              setAppUsers(users => users.map(u => u.id === user.id ? { ...u, commissionRank: newRank } : u));
                            }}
                          >
                            {commissionRanks.map(rank => (
                              <option key={rank.id} value={rank.id}>{rank.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setUserFormData(user);
                              setIsUserFormModalOpen(true);
                            }}
                            className="p-1 text-gray-400 hover:text-[#03b8fa] hover:bg-blue-50 rounded"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete user?')) {
                                setAppUsers(users => users.filter(u => u.id !== user.id));
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
              <strong>Note on Commission Ranks:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                {commissionRanks.map(rank => (
                  <li key={rank.id}><strong>{rank.name}:</strong> ได้รับค่าคอมมิชชั่นตามที่กำหนดในแต่ละเส้นทาง (ค่าเริ่มต้น ฿{rank.defaultAmount.toLocaleString()})</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Commission Ranks Management Section (Manager Only) */}
        {settingsTab === 'users' && currentUser.role === 'MANAGER' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Wallet size={20} className="text-green-600" /> ตั้งค่าเลเวลพนักงาน และ ค่าคอมมิชชั่นหลัก
                </h3>
                <p className="text-xs text-gray-500 mt-1">กำหนดชื่อ Rank และ ยอดเงินรางวัลมาตรฐานต่อหัว</p>
              </div>
              <button
                onClick={() => {
                  setRankFormData({ name: '', defaultAmount: 0, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', id: null });
                  setIsRankModalOpen(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 shadow-sm"
              >
                <Plus size={16} /> เพิ่ม Rank
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commissionRanks.map(rank => (
                <div key={rank.id} className={`border rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-md ${rank.bg} ${rank.border}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${rank.bg} ${rank.color} border border-current opacity-70`}>Level {rank.id}</span>
                    <div className="flex gap-1">
                      <button onClick={() => { setRankFormData(rank); setIsRankModalOpen(true); }} className="p-1 hover:bg-white/50 rounded text-gray-400 hover:text-gray-600"><Edit2 size={14} /></button>
                      <button onClick={() => {
                        if (window.confirm(`ลบ Rank ${rank.name}? ผู้ใช้ที่อยู่ใน Rank นี้จะถูกรีเซ็ต`)) {
                          setCommissionRanks(ranks => ranks.filter(r => r.id !== rank.id));
                        }
                      }} className="p-1 hover:bg-white/50 rounded text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-bold text-lg ${rank.color}`}>{rank.name}</h4>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-mono font-bold text-gray-800">฿{rank.defaultAmount.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 font-medium">/ หัว</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-3">* ยอดนี้คือค่าเริ่มต้นเมื่อสร้างเส้นทางใหม่</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Bank Accounts Section */}
        {settingsTab === 'bank' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">บัญชีธนาคารรับเงิน</h3>
                <p className="text-gray-500 text-sm">Manage company bank accounts for customer transfers</p>
              </div>
              <button
                onClick={() => {
                  setBankFormData({ bank: '', accountName: '', accountNumber: '', branch: '', color: 'bg-blue-600', id: null });
                  setIsBankFormOpen(true);
                }}
                className="bg-[#03b8fa] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#029bc4]"
              >
                <Plus size={16} /> เพิ่มบัญชี
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankAccounts.map(acc => (
                <div key={acc.id} className="border border-gray-200 rounded-xl p-4 flex items-start justify-between bg-gray-50 hover:border-[#03b8fa] transition group">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-sm ${acc.color || 'bg-gray-400'}`}>
                      {acc.bank.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        {acc.bank}
                        <span className="text-xs font-normal text-gray-500 bg-white border px-1.5 rounded">{acc.branch}</span>
                      </h4>
                      <p className="font-mono font-bold text-[#0279a9] my-1 text-lg">{acc.accountNumber}</p>
                      <p className="text-xs text-gray-500">{acc.accountName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setBankFormData(acc);
                        setIsBankFormOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#03b8fa] hover:bg-white rounded-full transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this account?')) {
                          setBankAccounts(prev => prev.filter(a => a.id !== acc.id));
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bank Form Modal */}
      {isBankFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="font-bold text-lg mb-4">{bankFormData.id ? 'แก้ไขข้อมูลบัญชี' : 'เพิ่มบัญชีใหม่'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">ธนาคาร</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={bankFormData.bank}
                  onChange={e => setBankFormData({ ...bankFormData, bank: e.target.value })}
                  placeholder="เช่น กสิกรไทย"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">ชื่อบัญชี</label>
                  <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={bankFormData.accountName}
                    onChange={e => setBankFormData({ ...bankFormData, accountName: e.target.value })}
                    placeholder="บจก. รุ่งอนันต์ ทัวร์"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">สาขา</label>
                  <input
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={bankFormData.branch}
                    onChange={e => setBankFormData({ ...bankFormData, branch: e.target.value })}
                    placeholder="พหลโยธิน"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">เลขที่บัญชี</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm font-mono font-bold text-[#0279a9]"
                  value={bankFormData.accountNumber}
                  onChange={e => setBankFormData({ ...bankFormData, accountNumber: e.target.value })}
                  placeholder="012-3-45678-9"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsBankFormOpen(false)} className="px-4 py-2 text-gray-400 hover:text-gray-600 font-medium">ยกเลิก</button>
              <button onClick={() => {
                if (!bankFormData.bank || !bankFormData.accountNumber) return alert("กรุณาระบุเลขที่บัญชีและชื่อธนาคาร");
                if (bankFormData.id) {
                  setBankAccounts(prev => prev.map(a => a.id === bankFormData.id ? bankFormData : a));
                } else {
                  setBankAccounts([...bankAccounts, { ...bankFormData, id: Date.now() }]);
                }
                setIsBankFormOpen(false);
              }} className="px-6 py-2 bg-[#03b8fa] text-white rounded-lg font-bold hover:bg-[#0279a9] shadow-lg">บันทึกข้อมูล</button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Rank Modal */}
      {isRankModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="font-bold text-lg mb-4">{rankFormData.id ? 'แก้ไขข้อมูล Rank' : 'เพิ่ม Rank ใหม่'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">ชื่อ Rank</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="e.g. Rank 3 (พิเศษ)" value={rankFormData.name} onChange={e => setRankFormData({ ...rankFormData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">ยอดคอมมิชชั่นมาตรฐาน (฿)</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm font-mono font-bold" placeholder="500" value={rankFormData.defaultAmount} onChange={e => setRankFormData({ ...rankFormData, defaultAmount: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsRankModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-gray-600 font-medium">ยกเลิก</button>
              <button onClick={() => {
                if (!rankFormData.name) return alert("กรุณาระบุชื่อ Rank");
                if (rankFormData.id) {
                  setCommissionRanks(ranks => ranks.map(r => r.id === rankFormData.id ? rankFormData : r));
                } else {
                  const newRank = { ...rankFormData, id: commissionRanks.length > 0 ? Math.max(...commissionRanks.map(r => r.id)) + 1 : 1 };
                  setCommissionRanks([...commissionRanks, newRank]);
                }
                setIsRankModalOpen(false);
              }} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg">บันทึกข้อมูล</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPayment = () => {
    // Get data based on active tab
    const getBillingStats = () => {
      const unpaid = billingNotes.filter(b => b.status !== 'paid');
      // Calculate remaining balance for each billing note
      const total = unpaid.reduce((sum, b) => {
        const paidFromBilling = b.paidAmount || 0;
        const remaining = b.billingAmount - paidFromBilling;
        return sum + (remaining > 0 ? remaining : 0);
      }, 0);
      return { count: unpaid.length, total };
    };

    const getReceiptStats = () => {
      const issued = receipts.filter(r => r.status === 'issued');
      const total = issued.reduce((sum, r) => sum + r.receiptAmount, 0);
      return { count: issued.length, total };
    };

    const getTaxStats = () => {
      const issued = taxInvoices.filter(t => t.status === 'issued');
      const total = issued.reduce((sum, t) => sum + t.totalAmount, 0);
      return { count: issued.length, total };
    };

    const billingStats = getBillingStats();
    const receiptStats = getReceiptStats();
    const taxStats = getTaxStats();

    return (
      <div className="space-y-6 h-full flex flex-col animate-fade-in">
        <header className="mb-1 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">การชำระเงิน (Payments & Documents)</h1>
            <p className="text-sm text-gray-500">จัดการใบวางบิล, ใบรับเงิน, และใบกำกับภาษี</p>
          </div>
        </header>

        {/* System Blue Theme Tabs */}
        <div className="flex gap-3 mb-2 border-b border-gray-100 pb-2">
          <button
            onClick={() => setPaymentSubTab('billing')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${paymentSubTab === 'billing' ? 'bg-[#d9edf4] text-[#03b8fa]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText size={18} />
            1. ใบวางบิล ({billingStats.count})
          </button>
          <button
            onClick={() => setPaymentSubTab('receipt')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${paymentSubTab === 'receipt' ? 'bg-[#d9edf4] text-[#03b8fa]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileCheck size={18} />
            2. ใบรับเงิน ({receiptStats.count})
          </button>
          <button
            onClick={() => setPaymentSubTab('tax')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${paymentSubTab === 'tax' ? 'bg-[#d9edf4] text-[#03b8fa]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ShieldCheck size={18} />
            3. ใบกำกับภาษี ({taxStats.count})
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-6">
          <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block font-bold text-gray-700">
                {paymentSubTab === 'billing' ? 'รายการรอวางบิล' : paymentSubTab === 'receipt' ? 'ใบรับเงินที่ออกแล้ว' : 'ใบกำกับภาษีที่ออกแล้ว'}
              </span>
              <span className="text-gray-400 text-xs uppercase">Total Items</span>
            </div>
            <span className="text-3xl font-bold text-gray-800">
              {paymentSubTab === 'billing' ? billingStats.count : paymentSubTab === 'receipt' ? receiptStats.count : taxStats.count}
            </span>
          </div>
          <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block font-bold text-gray-700">
                {paymentSubTab === 'billing' ? 'ยอดรอชำระ' : paymentSubTab === 'receipt' ? 'ยอดรับชำระแล้ว' : 'ยอดออกใบกำกับภาษี'}
              </span>
              <span className="text-gray-400 text-xs uppercase">Total Amount</span>
            </div>
            <span className="text-3xl font-bold text-[#03b8fa]">
              ฿{(paymentSubTab === 'billing' ? billingStats.total : paymentSubTab === 'receipt' ? receiptStats.total : taxStats.total).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Data Table - Tab Specific */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
          {/* Billing Notes Tab */}
          {paymentSubTab === 'billing' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">เลขที่ใบวางบิล</th>
                  <th className="px-6 py-4">ลูกค้า / กลุ่ม</th>
                  <th className="px-6 py-4 text-center">ประเภท</th>
                  <th className="px-6 py-4 text-right">ยอดวางบิล</th>
                  <th className="px-6 py-4 text-right text-green-600">ชำระแล้ว</th>
                  <th className="px-6 py-4 text-right text-orange-600">คงค้าง</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                  <th className="px-6 py-4 text-center">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {billingNotes.map(bill => {
                  const route = routes.find(r => r.id === bill.routeId);
                  // paidSoFar = previousPaid + paidAmount (จากใบวางบิลนี้)
                  const paidFromBilling = bill.paidAmount || 0;
                  const totalPaid = (bill.previousPaid || 0) + paidFromBilling;
                  // remaining = billingAmount - paidAmount (ยอดคงค้างของใบวางบิลนี้)
                  const remaining = bill.billingAmount - paidFromBilling;

                  return (
                    <tr key={bill.id} className={`hover:bg-gray-50 transition ${bill.status === 'paid' ? 'bg-green-50/30' : ''}`}>
                      <td className="px-6 py-4 font-mono font-bold text-[#03b8fa]">{bill.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{bill.customerName}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${bill.billingType === 'group' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {bill.billingType === 'group' ? 'กลุ่ม' : 'เดี่ยว'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-gray-600">฿{bill.billingAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-green-600">
                        {paidFromBilling > 0 ? `฿${paidFromBilling.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-orange-600">
                        {remaining > 0 ? `฿${remaining.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bill.status === 'paid' ? 'bg-green-100 text-green-700' : bill.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'}`}>
                          {bill.status === 'pending' ? 'รอชำระ' : bill.status === 'partial' ? 'บางส่วน' : 'ชำระแล้ว'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => setViewingBillingNote(bill)} className="text-[#03b8fa] hover:bg-[#d9edf4] px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition">
                            <Printer size={14} /> ออกใบวางบิล
                          </button>
                          {bill.status !== 'paid' && (
                            <button onClick={() => {
                              // Create receipt from this billing note
                              setIsCreatingReceipt(true);
                              setViewingBillingNote(bill);
                              // Set default amount to remaining balance
                              setBillingAmount(remaining > 0 ? remaining : bill.billingAmount);
                            }} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition">
                              <CheckCircle size={14} /> ชำระเงิน
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {billingNotes.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-10 text-gray-400">ไม่มีรายการใบวางบิล</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* Receipts Tab */}
          {paymentSubTab === 'receipt' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">เลขที่ใบรับเงิน</th>
                  <th className="px-6 py-4">ลูกค้า</th>
                  <th className="px-6 py-4 text-center">ช่องทาง</th>
                  <th className="px-6 py-4 text-right">จำนวนเงิน</th>
                  <th className="px-6 py-4 text-center">วันที่</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                  <th className="px-6 py-4 text-center">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {receipts.map(receipt => (
                  <tr key={receipt.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-[#03b8fa]">{receipt.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{receipt.customerName}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${receipt.paymentMethod === 'cash' ? 'bg-green-100 text-green-700' : receipt.paymentMethod === 'transfer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {receipt.paymentMethod === 'cash' ? 'เงินสด' : receipt.paymentMethod === 'transfer' ? 'โอนเงิน' : 'QR Code'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[#37c3a5]">฿{receipt.receiptAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">{receipt.createdAt}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${receipt.usedForTaxInvoice ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {receipt.usedForTaxInvoice ? 'ออกใบกำกับแล้ว' : 'ออกใบรับเงินแล้ว'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setViewingReceipt(receipt)} className="text-[#03b8fa] hover:bg-[#d9edf4] px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition">
                          <Printer size={14} /> ออกใบรับเงิน
                        </button>
                        {!receipt.usedForTaxInvoice && currentUser.role === 'MANAGER' && (
                          <button onClick={() => {
                            setSelectedReceiptForTaxInvoice(receipt);
                            setTaxInvoiceFormData({ customerType: 'individual', customerName: receipt.customerName });
                            setIsCreatingTaxInvoice(true);
                          }} className="text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition">
                            <ShieldCheck size={14} /> ออกใบกำกับ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {receipts.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">ไม่มีรายการใบรับเงิน</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* Tax Invoices Tab */}
          {paymentSubTab === 'tax' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-bold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">เลขที่ใบกำกับภาษี</th>
                  <th className="px-6 py-4">ลูกค้า / บริษัท</th>
                  <th className="px-6 py-4 text-center">เลขผู้เสียภาษี</th>
                  <th className="px-6 py-4 text-right">ยอดรวม (รวม VAT)</th>
                  <th className="px-6 py-4 text-center">วันที่ออก</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                  <th className="px-6 py-4 text-center">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {taxInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono font-bold text-purple-600">{inv.runningNumber}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{inv.customerName}</td>
                    <td className="px-6 py-4 text-center font-mono text-gray-500">{inv.taxId}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-700">฿{inv.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">{inv.issuedAt}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'issued' ? 'bg-green-100 text-green-700' : inv.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {inv.status === 'issued' ? 'ออกแล้ว' : inv.status === 'cancelled' ? 'ยกเลิก' : 'ฉบับร่าง'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => setViewingTaxInvoice(inv)} className="text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition mx-auto">
                        <Printer size={14} /> พิมพ์ใบกำกับภาษี
                      </button>
                    </td>
                  </tr>
                ))}
                {taxInvoices.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">ไม่มีรายการใบกำกับภาษี</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        {viewingPaymentId && (() => {
          const payment = payments.find(p => p.id === viewingPaymentId);
          const booking = bookings.find(b => b.id === payment?.bookingId);
          const route = routes.find(r => r.id === payment?.routeId);
          const round = rounds.find(r => r.id === payment?.roundId);

          // Get pax list: prioritize paxIds (for new bookings), then roundId (for mock data), then booking.pax
          let paxList = [];
          if (payment?.paxIds && payment.paxIds.length > 0) {
            // For new bookings: filter customers by paxIds
            paxList = customers.filter(c => payment.paxIds.includes(c.id));
          } else if (payment?.roundId) {
            // For mock data: get all pax in round
            paxList = getPaxForRound(payment.roundId);
          } else if (booking?.pax) {
            paxList = booking.pax;
          }

          return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
                <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2"><FileText size={20} /> รายละเอียดการชำระเงิน</h3>
                  <button onClick={() => setViewingPaymentId(null)}><X size={20} /></button>
                </header>
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">เส้นทาง</div>
                      <div className="font-bold text-[#03b8fa] text-lg">{route?.code || 'N/A'}</div>
                      <div className="text-sm text-gray-600">{route?.name || '-'}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">สถานะการชำระ</div>
                      <div className={`font-bold text-lg ${payment?.status === 'paid' ? 'text-green-600' : payment?.status === 'partial' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {payment?.status === 'paid' ? 'ชำระแล้ว' : payment?.status === 'partial' ? 'ชำระบางส่วน' : 'รอชำระ'}
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">ยอดชำระแล้ว</div>
                      <div className="font-bold text-[#37c3a5] text-xl">฿{payment?.paidAmount?.toLocaleString()}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase font-bold mb-1">ยอดรวมทั้งหมด</div>
                      <div className="font-bold text-gray-800 text-xl">฿{payment?.totalAmount?.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Users size={16} /> รายชื่อลูกทัวร์ ({paxList.length} ท่าน)</h4>
                    {paxList.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-sm">ไม่พบข้อมูลลูกทัวร์ (อาจเป็น Mock Data)</div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 text-left">ชื่อ-นามสกุล</th>
                            <th className="px-3 py-2 text-left">Passport</th>
                            <th className="px-3 py-2 text-left">ประเภทห้อง</th>
                            <th className="px-3 py-2 text-left">หมายเหตุ</th>
                            <th className="px-3 py-2 text-right">ยอดจอง</th>
                            <th className="px-3 py-2 text-left">ผู้ขาย</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paxList.map(p => {
                            const seller = appUsers.find(u => u.id === p.bookedBy);
                            const paxPrice = round?.price?.[p.roomType || 'adultTwin'] || 0;
                            return (
                              <tr key={p.id || p.uniqueId} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium">{p.firstNameEn} {p.lastNameEn}</td>
                                <td className="px-3 py-2 font-mono text-gray-500">{p.passportNo}</td>
                                <td className="px-3 py-2 text-xs text-gray-600">{p.roomType || 'adultTwin'}</td>
                                <td className="px-3 py-2">
                                  <div className="flex flex-col gap-0.5 max-w-[120px]">
                                    {p.customerNote && <div className="text-[10px] text-amber-600 font-medium truncate">📌 {p.customerNote}</div>}
                                    {p.remark && <div className="text-[10px] text-blue-500 truncate">📝 {p.remark}</div>}
                                    {!p.customerNote && !p.remark && <span className="text-gray-300">-</span>}
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-right font-mono font-bold text-[#03b8fa]">
                                  ฿{paxPrice.toLocaleString()}
                                </td>
                                <td className="px-3 py-2 text-xs">
                                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{seller?.name || 'N/A'}</span>
                                </td>
                              </tr>
                            );
                          })}
                          {/* Total Row */}
                          <tr className="bg-gray-100 font-bold">
                            <td className="px-3 py-2 text-gray-600" colSpan={4}>รวมยอดจอง ({paxList.length} ท่าน)</td>
                            <td className="px-3 py-2 text-right font-mono text-[#0279a9]">
                              ฿{paxList.reduce((sum, p) => sum + (round?.price?.[p.roomType || 'adultTwin'] || 0), 0).toLocaleString()}
                            </td>
                            <td className="px-3 py-2"></td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Payment Slip Attachment Section - Show only for partial/pending */}
                  {payment?.status !== 'paid' && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Upload size={16} /> แนบสลิปการชำระเงิน
                      </h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
                        <p className="text-sm text-yellow-700">
                          ยอดค้างชำระ: <strong className="text-red-600">฿{((payment?.totalAmount || 0) - (payment?.paidAmount || 0)).toLocaleString()}</strong>
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">ช่องทางการชำระ</label>
                          <select
                            className="w-full border rounded px-3 py-2 text-sm bg-white"
                            value={paymentFormData.method || 'transfer'} // Use temp state if available, but here we modify directly? Ideally use a state.
                            // Since this is inline, let's assume valid change handler or controlled component logic if extended.
                            // Actually, the user wants bank selection for "Transfer".
                            // We need to capture the selected method to conditionally show bank dropdown.
                            onChange={(e) => {
                              // Assuming we have state management for this form section now...
                              // But wait, the original code didn't use state for these inputs! It was just a static view.
                              // We need to add state to make this interactive as requested.
                              // Let's use `paymentFormData` state which already exists in line 157 but wasn't seemingly used here.
                              setPaymentFormData(prev => ({ ...prev, method: e.target.value }));
                            }}
                          >
                            <option value="transfer">โอนเงิน</option>
                            <option value="cash">เงินสด</option>
                          </select>
                          {/* Conditional Bank Selection for Transfer */}
                          {paymentFormData.method === 'transfer' && (
                            <div className="mt-2 animate-fade-in">
                              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">โอนเข้าบัญชี</label>
                              <select
                                className="w-full border rounded px-3 py-2 text-sm bg-gray-50 text-gray-700"
                                value={selectedBankForTransfer}
                                onChange={(e) => setSelectedBankForTransfer(e.target.value)}
                              >
                                <option value="">-- เลือกบัญชีธนาคาร --</option>
                                {bankAccounts.map(acc => (
                                  <option key={acc.id} value={acc.id}>
                                    {acc.bank} - {acc.accountNumber} ({acc.accountName})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase block mb-1">จำนวนเงินที่ชำระ</label>
                          <input
                            type="number"
                            className="w-full border rounded px-3 py-2 text-sm font-mono"
                            placeholder="0.00"
                            value={paymentFormData.amount || ''}
                            onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: parseFloat(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">แนบหลักฐานการชำระ (สลิป)</label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#03b8fa] hover:bg-blue-50 transition">
                            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">คลิกเพื่ออัปโหลดสลิป</span>
                            <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => {
                              if (e.target.files[0]) {
                                alert(`ไฟล์ที่เลือก: ${e.target.files[0].name}`);
                              }
                            }} />
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">หมายเหตุ (ถ้ามี)</label>
                        <input
                          type="text"
                          className="w-full border rounded px-3 py-2 text-sm"
                          placeholder="เช่น ชำระผ่านธนาคาร xxx เวลา xx:xx"
                          value={paymentFormData.note || ''}
                          onChange={(e) => setPaymentFormData({ ...paymentFormData, note: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          className="px-4 py-2 bg-[#37c3a5] text-white rounded-lg font-bold hover:bg-green-600 transition flex items-center gap-2"
                          onClick={() => {
                            const newPaidAmount = (payment.paidAmount || 0) + (paymentFormData.amount || 0);
                            const isFullyPaid = newPaidAmount >= payment.totalAmount;

                            // Bank Info
                            const bankInfo = paymentFormData.method === 'transfer' && selectedBankForTransfer
                              ? bankAccounts.find(b => b.id === Number(selectedBankForTransfer))
                              : null;

                            // Update payment status
                            setPayments(prev => prev.map(p =>
                              p.id === payment.id
                                ? {
                                  ...p,
                                  status: isFullyPaid ? 'paid' : 'partial',
                                  paidAmount: newPaidAmount,
                                  transactions: [
                                    ...(p.transactions || []),
                                    {
                                      id: Date.now(),
                                      date: new Date().toISOString().split('T')[0],
                                      amount: paymentFormData.amount,
                                      method: paymentFormData.method || 'transfer',
                                      bankId: bankInfo?.id,
                                      bankName: bankInfo?.bank,
                                      note: paymentFormData.note,
                                      receipt: 'slip_uploaded.jpg',
                                      status: 'verified',
                                      verifiedBy: currentUser.id,
                                      verifiedAt: new Date().toISOString().split('T')[0]
                                    }
                                  ]
                                }
                                : p
                            ));

                            alert('บันทึกการชำระเงินเรียบร้อย!');
                            setViewingPaymentId(null);
                          }}
                        >
                          <CheckCircle size={16} /> ยืนยันการชำระเงิน
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
                  <button onClick={() => setViewingPaymentId(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">ปิดหน้าต่าง</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Billing Note Preview Modal */}
        {viewingBillingNote && !isCreatingReceipt && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
              <header className="bg-[#03b8fa] text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><FileText size={20} /> ใบวางบิล (Billing Note)</h3>
                <button onClick={() => setViewingBillingNote(null)}><X size={20} /></button>
              </header>
              <div className="p-6">
                {/* PDF Preview Style */}
                <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50 relative">
                  {(() => {
                    const roundForBill = rounds.find(r => r.id === viewingBillingNote.roundId);
                    const routeForBill = routes.find(r => r.id === roundForBill?.routeId);
                    return (
                      <div className="flex justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800">บจก. รุ่งอนันต์ ทัวร์</h2>
                          <p className="text-sm text-gray-500">123/45 ถนนพหลโยธิน แขวงลาดยาว กรุงเทพฯ 10900</p>

                          {/* Route Info */}
                          <div className="mt-4 bg-white/50 border border-gray-200 rounded-lg px-3 py-2 inline-block">
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">เส้นทาง / โปรแกรมทัวร์</div>
                            <div className="text-sm font-bold text-[#03b8fa]">{routeForBill?.code || 'N/A'} - {routeForBill?.name || '-'}</div>
                            <div className="text-[11px] text-gray-600 flex items-center gap-2">
                              <Calendar size={12} className="text-gray-400" />
                              รอบการเดินทาง: <span className="font-bold">{roundForBill?.date || '-'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">เลขที่ใบวางบิล</p>
                          <p className="font-mono font-bold text-xl text-[#03b8fa]">{viewingBillingNote.id}</p>
                          <p className="text-sm text-gray-400 mt-1">วันที่: {viewingBillingNote.createdAt}</p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="border-t border-b border-gray-300 py-4 my-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">ลูกค้า / กลุ่ม</p>
                        <p className="font-bold text-gray-800 text-lg uppercase">{viewingBillingNote.customerName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Passenger Detail Table */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 uppercase mb-2">รายละเอียดรายการ (Passenger Breakdown)</p>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200 text-gray-600 text-xs uppercase font-semibold">
                        <tr>
                          <th className="px-2 py-1 text-left">#</th>
                          <th className="px-2 py-1 text-left">ผู้เดินทาง</th>
                          <th className="px-2 py-1 text-left">ประเภท</th>
                          <th className="px-2 py-1 text-right">ราคา</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 border-b border-gray-200 bg-white">
                        {(() => {
                          // Calculate pax data for the bill
                          const roundForBill = rounds.find(r => r.id === viewingBillingNote.roundId);
                          let billPax = [];
                          if (roundForBill) {
                            // Try to find from live bookings first
                            const booking = bookings.find(b => b.id === viewingBillingNote.bookingId);
                            if (booking && booking.pax) {
                              billPax = booking.pax;
                            } else if (viewingBillingNote.paxIds) {
                              const allPax = getPaxForRound(roundForBill.id) || [];
                              billPax = allPax.filter(p => viewingBillingNote.paxIds.includes(p.id));
                            }
                          }

                          if (billPax.length === 0) return <tr><td colSpan="4" className="text-center py-2 text-gray-400">ไม่พบรายชื่อผู้เดินทาง</td></tr>;

                          return billPax.map((p, idx) => {
                            const price = roundForBill?.price?.[p.roomType || 'adultTwin'] || 0;
                            return (
                              <tr key={p.id}>
                                <td className="px-2 py-1.5 text-gray-500">{idx + 1}</td>
                                <td className="px-2 py-1.5 font-medium">{p.firstNameEn} {p.lastNameEn}</td>
                                <td className="px-2 py-1.5 text-gray-500 text-xs">{p.roomType}</td>
                                <td className="px-2 py-1.5 text-right font-mono">฿{price.toLocaleString()}</td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ยอดรวมทั้งหมด:</span>
                      <span className="font-mono">฿{viewingBillingNote.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ชำระแล้ว:</span>
                      <span className="font-mono text-green-600">฿{viewingBillingNote.previousPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                      <span>ยอดวางบิลครั้งนี้:</span>
                      <span className="text-[#03b8fa]">฿{viewingBillingNote.billingAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Footer: Bank Details */}
                  <div className="mt-8 pt-4 border-t border-dashed border-gray-300 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">ช่องทางการชำระเงิน (PAYMENT CHANNEL)</p>
                      <div className="flex items-center gap-2 bg-[#d9edf4] px-2 py-1 rounded border border-[#03b8fa]/30">
                        <label className="text-[10px] font-bold text-[#03b8fa] whitespace-nowrap uppercase">เลือกบัญชี:</label>
                        <select
                          className="text-[10px] bg-transparent border-none focus:ring-0 font-bold text-[#0279a9] cursor-pointer outline-none p-0"
                          value={selectedBillingBankId || (bankAccounts[0]?.id)}
                          onChange={(e) => setSelectedBillingBankId(e.target.value)}
                        >
                          <option value="">-- เลือกบัญชี --</option>
                          {bankAccounts.map(b => (
                            <option key={b.id} value={b.id}>{b.bank} - {b.accountNumber}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {(() => {
                      const bankToShow = bankAccounts.find(b => String(b.id) === String(selectedBillingBankId)) || bankAccounts[0];
                      if (bankToShow) {
                        return (
                          <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm transition-all">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-inner ${bankToShow.color || 'bg-gray-500'}`}>
                              {bankToShow.bank}
                            </div>
                            <div>
                              <p className="font-black text-[#0279a9] text-sm uppercase">{bankToShow.bank} - {bankToShow.accountNumber}</p>
                              <p className="text-xs text-gray-500 font-medium">{bankToShow.accountName} (สาขา {bankToShow.branch})</p>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="p-3 border-2 border-dashed border-red-200 rounded-lg text-red-400 text-center text-xs font-bold">
                          กรุณาเลือกบัญชีธนาคารสำหรับรับโอนเงิน
                        </div>
                      );
                    })()}
                  </div>

                  {viewingBillingNote.note && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      <strong>หมายเหตุ:</strong> {viewingBillingNote.note}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
                <button onClick={() => setViewingBillingNote(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">ปิด</button>
                <button onClick={() => alert('กำลังดาวน์โหลด PDF...')} className="px-6 py-2 bg-[#03b8fa] text-white rounded-lg font-bold hover:bg-[#029bc4] flex items-center gap-2">
                  <Download size={16} /> ดาวน์โหลด PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Preview Modal */}
        {viewingReceipt && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
              <header className="bg-[#37c3a5] text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><FileCheck size={20} /> ใบรับเงิน (Receipt)</h3>
                <button onClick={() => setViewingReceipt(null)}><X size={20} /></button>
              </header>
              <div className="p-6">
                <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">บจก. รุ่งอนันต์ ทัวร์</h2>
                      <p className="text-sm text-gray-500">123/45 ถนนพหลโยธิน แขวงลาดยาว กรุงเทพฯ 10900</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">เลขที่ใบรับเงิน</p>
                      <p className="font-mono font-bold text-xl text-[#37c3a5]">{viewingReceipt.id}</p>
                      <p className="text-sm text-gray-400 mt-1">วันที่: {viewingReceipt.createdAt}</p>
                    </div>
                  </div>

                  <div className="border-t border-b border-gray-300 py-4 my-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">ได้รับเงินจาก</p>
                        <p className="font-bold text-gray-800">{viewingReceipt.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">ช่องทางชำระ</p>
                        <p className="font-bold text-gray-800">
                          {viewingReceipt.paymentMethod === 'cash' ? 'เงินสด' : viewingReceipt.paymentMethod === 'transfer' ? 'โอนเงิน' : 'QR Code'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 mb-2">จำนวนเงินที่รับ</p>
                    <p className="text-4xl font-bold text-[#37c3a5]">฿{viewingReceipt.receiptAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-2">(บาทถ้วน)</p>
                  </div>

                  {viewingReceipt.note && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                      <strong>หมายเหตุ:</strong> {viewingReceipt.note}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
                <button onClick={() => setViewingReceipt(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">ปิด</button>
                <button onClick={() => alert('กำลังดาวน์โหลด PDF...')} className="px-6 py-2 bg-[#37c3a5] text-white rounded-lg font-bold hover:bg-green-600 flex items-center gap-2">
                  <Download size={16} /> ดาวน์โหลด PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tax Invoice Preview Modal */}
        {viewingTaxInvoice && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
              <header className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><ShieldCheck size={20} /> ใบกำกับภาษี (Tax Invoice)</h3>
                <button onClick={() => setViewingTaxInvoice(null)}><X size={20} /></button>
              </header>
              <div className="p-6">
                <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">บจก. รุ่งอนันต์ ทัวร์</h2>
                      <p className="text-sm text-gray-500">เลขผู้เสียภาษี: 0105566012345</p>
                      <p className="text-sm text-gray-500">123/45 ถนนพหลโยธิน แขวงลาดยาว กรุงเทพฯ 10900</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">เลขที่ใบกำกับภาษี</p>
                      <p className="font-mono font-bold text-xl text-purple-600">{viewingTaxInvoice.runningNumber}</p>
                      <p className="text-sm text-gray-400 mt-1">วันที่ออก: {viewingTaxInvoice.issuedAt}</p>
                    </div>
                  </div>

                  <div className="border-t border-b border-gray-300 py-4 my-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">ชื่อผู้ซื้อ</p>
                        <p className="font-bold text-gray-800">{viewingTaxInvoice.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">เลขประจำตัวผู้เสียภาษี</p>
                        <p className="font-mono text-gray-800">{viewingTaxInvoice.taxId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">ที่อยู่</p>
                        <p className="text-gray-800 text-sm">{viewingTaxInvoice.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">มูลค่าสินค้า/บริการ (ก่อน VAT):</span>
                      <span className="font-mono">฿{viewingTaxInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ภาษีมูลค่าเพิ่ม 7%:</span>
                      <span className="font-mono">฿{viewingTaxInvoice.vatAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                      <span>รวมทั้งสิ้น:</span>
                      <span className="text-purple-600">฿{viewingTaxInvoice.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
                <button onClick={() => setViewingTaxInvoice(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">ปิด</button>
                <button onClick={() => alert('กำลังดาวน์โหลด PDF...')} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2">
                  <Download size={16} /> ดาวน์โหลด PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment/Receipt Creation Modal */}
        {isCreatingReceipt && viewingBillingNote && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <header className="bg-[#37c3a5] text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard size={20} /> ชำระเงิน</h3>
                <button onClick={() => { setIsCreatingReceipt(false); setViewingBillingNote(null); }}><X size={20} /></button>
              </header>
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-700">{viewingBillingNote.customerName}</p>
                  <p className="text-2xl font-bold text-[#03b8fa]">฿{viewingBillingNote.billingAmount.toLocaleString()}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-2">จำนวนเงินที่ชำระ</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-3 font-mono text-lg"
                    value={billingAmount || viewingBillingNote.billingAmount}
                    onChange={(e) => setBillingAmount(Number(e.target.value))}
                  />
                  {billingAmount < viewingBillingNote.billingAmount && billingAmount > 0 && (
                    <p className="text-sm text-orange-600 mt-1">* ชำระมัดจำแล้ว - ยอดคงเหลือ ฿{(viewingBillingNote.billingAmount - billingAmount).toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-2">ช่องทางชำระ</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentFormData({ ...paymentFormData, method: 'cash' })}
                      className={`p-3 rounded-lg border-2 text-center font-bold text-sm transition ${paymentFormData.method === 'cash' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      💵 เงินสด
                    </button>
                    <button
                      onClick={() => setPaymentFormData({ ...paymentFormData, method: 'transfer' })}
                      className={`p-3 rounded-lg border-2 text-center font-bold text-sm transition ${paymentFormData.method === 'transfer' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      🏦 โอนเงิน
                    </button>
                    <button
                      onClick={() => setPaymentFormData({ ...paymentFormData, method: 'qr_code' })}
                      className={`p-3 rounded-lg border-2 text-center font-bold text-sm transition ${paymentFormData.method === 'qr_code' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      📱 QR Code
                    </button>
                  </div>
                </div>

                {paymentFormData.method === 'transfer' && (
                  <div className="animate-fade-in space-y-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-1">เลือกบัญชีรับโอน</label>
                      <select
                        className="w-full border rounded-lg px-4 py-2 text-sm"
                        value={selectedBankForTransfer}
                        onChange={(e) => setSelectedBankForTransfer(e.target.value)}
                      >
                        <option value="">-- เลือกบัญชี --</option>
                        {bankAccounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.bank} - {acc.accountNumber}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-1">แนบสลิปการโอน</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer transition">
                        <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">คลิกเพื่ออัปโหลดสลิป</span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentFormData.method === 'qr_code' && (
                  <div className="animate-fade-in text-center p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">QR Code สำหรับชำระเงิน</p>
                    <div className="w-40 h-40 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-400">[QR Code Placeholder]</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">PromptPay: {PAYMENT_GATEWAY_CONFIG.merchantId}</p>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
                <button onClick={() => { setIsCreatingReceipt(false); setViewingBillingNote(null); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">ยกเลิก</button>
                <button
                  onClick={() => {
                    // Calculate paid amount
                    const paidAmount = billingAmount || viewingBillingNote.billingAmount;

                    // Create receipt
                    const newReceipt = {
                      id: `RCP-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(receipts.length + 1).padStart(3, '0')}`,
                      billingNoteId: viewingBillingNote.id,
                      paymentId: viewingBillingNote.paymentId,
                      roundId: viewingBillingNote.roundId,
                      routeId: viewingBillingNote.routeId,
                      customerName: viewingBillingNote.customerName,
                      paxIds: viewingBillingNote.paxIds,
                      totalAmount: viewingBillingNote.billingAmount,
                      receiptAmount: paidAmount,
                      paymentMethod: paymentFormData.method || 'cash',
                      bankAccountId: selectedBankForTransfer ? Number(selectedBankForTransfer) : null,
                      status: 'issued',
                      createdAt: new Date().toISOString().split('T')[0],
                      createdBy: currentUser.id,
                      note: '',
                      usedForTaxInvoice: false,
                      taxInvoiceId: null
                    };
                    setReceipts(prev => [newReceipt, ...prev]);

                    // Calculate new status for billing note
                    const existingPaid = viewingBillingNote.paidAmount || 0;
                    const totalPaidSoFar = existingPaid + paidAmount;
                    const remainingBalance = viewingBillingNote.billingAmount - totalPaidSoFar;
                    const newStatus = remainingBalance <= 0 ? 'paid' : 'partial';

                    // Update billing note status
                    setBillingNotes(prev => prev.map(b =>
                      b.id === viewingBillingNote.id
                        ? {
                          ...b,
                          status: newStatus,
                          paidAmount: totalPaidSoFar,
                          paymentMethod: paymentFormData.method || 'cash',
                          bankAccountId: selectedBankForTransfer ? Number(selectedBankForTransfer) : null,
                          paidAt: new Date().toISOString().split('T')[0]
                        }
                        : b
                    ));

                    // Update related payment record
                    if (viewingBillingNote.paymentId) {
                      setPayments(prev => prev.map(p =>
                        p.id === viewingBillingNote.paymentId
                          ? {
                            ...p,
                            paidAmount: (p.paidAmount || 0) + paidAmount,
                            status: remainingBalance <= 0 ? 'paid' : 'partial'
                          }
                          : p
                      ));
                    }

                    const paymentDate = new Date().toISOString().split('T')[0];
                    if (viewingBillingNote.roundId && viewingBillingNote.paxIds) {
                      const shareOfPaid = paidAmount / viewingBillingNote.paxIds.length;
                      const roundPrice = rounds.find(r => r.id === viewingBillingNote.roundId)?.price || {};

                      setBookings(prev => prev.map(booking => {
                        if (booking.roundId === viewingBillingNote.roundId) {
                          return {
                            ...booking,
                            pax: booking.pax.map(p => {
                              if (viewingBillingNote.paxIds.includes(p.id)) {
                                const newPaid = (p.paidAmount || 0) + shareOfPaid;
                                const targetPrice = roundPrice[p.roomType || 'adultTwin'] || 0;
                                const isFinalPaid = newPaid >= (targetPrice - 1);

                                return {
                                  ...p,
                                  paymentStatus: isFinalPaid ? 'paid' : 'partial',
                                  paymentDate: isFinalPaid ? paymentDate : p.paymentDate,
                                  paidAmount: newPaid
                                };
                              }
                              return p;
                            }),
                            status: remainingBalance <= 0 ? (remainingBalance <= 0 ? 'paid' : 'partial') : 'partial'
                            // Note: booking.status update here is simplified, groupPaid check is more reliable in UI
                          };
                        }
                        return booking;
                      }));

                      // Also update bookingPaxList state (for current booking session)
                      setBookingPaxList(prev => prev.map(p => {
                        if (viewingBillingNote.paxIds.includes(p.id)) {
                          const newPaid = (p.paidAmount || 0) + shareOfPaid;
                          const targetPrice = roundPrice[p.roomType || 'adultTwin'] || 0;
                          const isFinalPaid = newPaid >= (targetPrice - 1);

                          return {
                            ...p,
                            paymentStatus: isFinalPaid ? 'paid' : 'partial',
                            paymentDate: isFinalPaid ? paymentDate : p.paymentDate,
                            paidAmount: newPaid
                          };
                        }
                        return p;
                      }));
                    }

                    alert(`✅ สร้างใบรับเงินเรียบร้อย!\n\nเลขที่: ${newReceipt.id}\nยอดชำระ: ฿${paidAmount.toLocaleString()}\nสถานะ: ${newStatus === 'paid' ? 'ชำระครบแล้ว' : 'ชำระมัดจำแล้ว'}`);
                    setIsCreatingReceipt(false);
                    setViewingBillingNote(null);
                    setBillingAmount(0);
                    setPaymentFormData({ method: '', amount: 0, receipt: null, note: '' });
                    setSelectedBankForTransfer('');
                    setPaymentSubTab('receipt');
                  }}
                  className="px-6 py-2 bg-[#37c3a5] text-white rounded-lg font-bold hover:bg-green-600 flex items-center gap-2"
                >
                  <CheckCircle size={16} /> ยืนยันการชำระเงิน
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tax Invoice Creation Modal - Manager Only */}
        {isCreatingTaxInvoice && selectedReceiptForTaxInvoice && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              <header className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><ShieldCheck size={20} /> ออกใบกำกับภาษี</h3>
                <button onClick={() => { setIsCreatingTaxInvoice(false); setSelectedReceiptForTaxInvoice(null); }}><X size={20} /></button>
              </header>
              <div className="p-6 space-y-4">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">จากใบรับเงิน:</span>
                    <span className="font-mono font-bold">{selectedReceiptForTaxInvoice.id}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-purple-700">จำนวนเงิน:</span>
                    <span className="font-bold text-purple-700">฿{selectedReceiptForTaxInvoice.receiptAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">ประเภทผู้ซื้อ</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTaxInvoiceFormData({ ...taxInvoiceFormData, customerType: 'individual' })}
                      className={`flex-1 p-2 rounded-lg border-2 text-sm font-bold transition ${taxInvoiceFormData.customerType === 'individual' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200'}`}
                    >
                      บุคคลธรรมดา
                    </button>
                    <button
                      onClick={() => setTaxInvoiceFormData({ ...taxInvoiceFormData, customerType: 'juridical' })}
                      className={`flex-1 p-2 rounded-lg border-2 text-sm font-bold transition ${taxInvoiceFormData.customerType === 'juridical' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200'}`}
                    >
                      นิติบุคคล
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                    {taxInvoiceFormData.customerType === 'juridical' ? 'ชื่อบริษัท' : 'ชื่อ-นามสกุล'}
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder={taxInvoiceFormData.customerType === 'juridical' ? 'บริษัท... จำกัด' : 'นาย/นาง/นางสาว...'}
                    value={taxInvoiceFormData.customerName || ''}
                    onChange={(e) => setTaxInvoiceFormData({ ...taxInvoiceFormData, customerName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">เลขประจำตัวผู้เสียภาษี</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 font-mono"
                    placeholder="0000000000000"
                    maxLength={13}
                    value={taxInvoiceFormData.taxId || ''}
                    onChange={(e) => setTaxInvoiceFormData({ ...taxInvoiceFormData, taxId: e.target.value.replace(/[^0-9]/g, '') })}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">ที่อยู่สำหรับออกใบกำกับภาษี</label>
                  <textarea
                    className="w-full border rounded-lg px-4 py-2 text-sm"
                    rows={2}
                    placeholder="เลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                    value={taxInvoiceFormData.address || ''}
                    onChange={(e) => setTaxInvoiceFormData({ ...taxInvoiceFormData, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
                <button onClick={() => { setIsCreatingTaxInvoice(false); setSelectedReceiptForTaxInvoice(null); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">ยกเลิก</button>
                <button
                  onClick={() => {
                    // Generate running number at issue time
                    const runningNumber = generateTaxInvoiceNumber(taxInvoices);
                    const subtotal = selectedReceiptForTaxInvoice.receiptAmount / 1.07;
                    const vatAmount = selectedReceiptForTaxInvoice.receiptAmount - subtotal;

                    const newTaxInvoice = {
                      id: `TAX-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(taxInvoices.length + 1).padStart(3, '0')}`,
                      runningNumber: runningNumber,
                      receiptIds: [selectedReceiptForTaxInvoice.id],
                      paymentId: selectedReceiptForTaxInvoice.paymentId,
                      roundId: selectedReceiptForTaxInvoice.roundId,
                      routeId: selectedReceiptForTaxInvoice.routeId,
                      customerType: taxInvoiceFormData.customerType || 'individual',
                      customerName: taxInvoiceFormData.customerName || selectedReceiptForTaxInvoice.customerName,
                      taxId: taxInvoiceFormData.taxId || '',
                      address: taxInvoiceFormData.address || '',
                      subtotal: Math.round(subtotal * 100) / 100,
                      vatAmount: Math.round(vatAmount * 100) / 100,
                      totalAmount: selectedReceiptForTaxInvoice.receiptAmount,
                      status: 'issued',
                      createdAt: new Date().toISOString().split('T')[0],
                      createdBy: currentUser.id,
                      issuedAt: new Date().toISOString().split('T')[0],
                      note: ''
                    };
                    setTaxInvoices(prev => [newTaxInvoice, ...prev]);

                    // Mark receipt as used
                    setReceipts(prev => prev.map(r =>
                      r.id === selectedReceiptForTaxInvoice.id
                        ? { ...r, usedForTaxInvoice: true, taxInvoiceId: newTaxInvoice.id }
                        : r
                    ));

                    alert(`ออกใบกำกับภาษีเรียบร้อย!\nเลขที่: ${runningNumber}`);
                    setIsCreatingTaxInvoice(false);
                    setSelectedReceiptForTaxInvoice(null);
                    setTaxInvoiceFormData({});
                    setPaymentSubTab('tax');
                  }}
                  disabled={!taxInvoiceFormData.customerName || !taxInvoiceFormData.taxId}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ShieldCheck size={16} /> ออกใบกำกับภาษี
                </button>
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

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          <SidebarItem icon={Users} label={isSidebarOpen ? "ระบบจัดการลูกค้า" : ""} active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} />
          <SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? "ภาพรวม" : ""} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Calendar} label={isSidebarOpen ? "จองทัวร์" : ""} active={activeTab === 'booking'} onClick={() => setActiveTab('booking')} />
          <SidebarItem icon={FileText} label={isSidebarOpen ? "ระบบจัดการทัวร์" : ""} active={activeTab === 'operation'} onClick={() => setActiveTab('operation')} />
          <SidebarItem icon={Wallet} label={isSidebarOpen ? "การชำระเงิน" : ""} active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} />

          {/* Settings with Sub-menu */}
          <div>
            <SidebarItem icon={Settings} label={isSidebarOpen ? "ตั้งค่าระบบ" : ""} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            {activeTab === 'settings' && isSidebarOpen && (
              <div className="ml-8 mt-1 space-y-1 animate-fade-in">
                <button
                  onClick={() => setSettingsTab('users')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${settingsTab === 'users' ? 'bg-[#d9edf4] text-[#03b8fa] font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  ผู้ใช้งาน & คอมมิชชั่น
                </button>
                <button
                  onClick={() => setSettingsTab('bank')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${settingsTab === 'bank' ? 'bg-[#d9edf4] text-[#03b8fa] font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  บัญชีธนาคาร
                </button>
              </div>
            )}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100"><SidebarItem icon={LogOut} label={isSidebarOpen ? "ออกจากระบบ" : ""} active={false} onClick={() => alert("Logged out")} /></div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:hidden"><button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button></div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{activeTab === 'dashboard' && renderDashboard()}{activeTab === 'booking' && renderBooking()}{activeTab === 'operation' && renderOperation()}{activeTab === 'payment' && renderPayment()}{activeTab === 'crm' && renderCRM()}{activeTab === 'settings' && renderSettings()}</div>
        {isFormOpen && renderCustomerFormModal()}
        {isUserFormModalOpen && renderUserFormModal()}

        {/* Add Customer Modal - Multi-step */}
        {showBookingTypeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">

              {/* Step 1: Choose Booking Type (if not selected yet) */}
              {!bookingAddMode && (
                <>
                  <header className="bg-[#03b8fa] text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2"><UserPlus size={20} /> เพิ่มลูกค้า</h3>
                    <button onClick={() => setShowBookingTypeModal(false)}><X size={20} /></button>
                  </header>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">เลือกประเภทการเพิ่มลูกค้า</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setBookingAddMode('individual')}
                        className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition text-center group"
                      >
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition">
                          <UserIcon size={28} className="text-blue-600" />
                        </div>
                        <h4 className="font-bold text-blue-700 mb-1">เพิ่มแบบเดี่ยว</h4>
                        <p className="text-xs text-blue-500">ลูกค้าแต่ละคนคำนวณยอดค้างแยกกัน</p>
                      </button>
                      <button
                        onClick={() => {
                          setBookingAddMode('group');
                          // If there's already a group name set (e.g. continuing to add to same group), don't ask again.
                          // But if it's empty, the new UI block below will handle it.
                        }}
                        className="p-6 bg-purple-50 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition text-center group"
                      >
                        <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition">
                          <Users size={28} className="text-purple-600" />
                        </div>
                        <h4 className="font-bold text-purple-700 mb-1">เพิ่มแบบกลุ่ม</h4>
                        <p className="text-xs text-purple-500">ยอดค้างรวมกันเป็นก้อนเดียว</p>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Step 1.5: Enter/Select Group Name (Only for Group Mode if name invalid) */}
              {bookingAddMode === 'group' && !currentGroupName && (
                <>
                  <header className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Users size={20} /> ระบุชื่อกรุ๊ปทัวร์</h3>
                    <button onClick={() => { setShowBookingTypeModal(false); setBookingAddMode(null); }}><X size={20} /></button>
                  </header>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-2">เลือกกรุ๊ปที่มีอยู่แล้ว</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                        {(() => {
                          // Get unique existing group names from bookingPaxList
                          const groupPassengers = bookingPaxList.filter(p => p.bookingType === 'group');
                          const existingGroupNames = [...new Set(groupPassengers.map(p => p.groupName).filter(Boolean))];

                          // Also check if there's a group without a name (from currentGroupName state)
                          const hasUnnamedGroup = groupPassengers.length > 0 && groupPassengers.some(p => !p.groupName);

                          if (existingGroupNames.length === 0 && !hasUnnamedGroup) {
                            return <div className="text-sm text-gray-400 text-center py-2">ไม่มีกรุ๊ปที่สร้างไว้</div>;
                          }

                          return (
                            <>
                              {/* Existing named groups */}
                              {existingGroupNames.map(name => {
                                const count = groupPassengers.filter(p => p.groupName === name).length;
                                return (
                                  <button
                                    key={name}
                                    onClick={() => setCurrentGroupName(name)}
                                    className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded text-purple-700 font-bold text-sm transition flex justify-between items-center"
                                  >
                                    <span>{name}</span>
                                    <span className="bg-purple-100 text-[10px] px-2 py-0.5 rounded-full">{count} ท่าน</span>
                                  </button>
                                );
                              })}

                              {/* Unnamed group (active currentGroupName) */}
                              {hasUnnamedGroup && (
                                <button
                                  onClick={() => {
                                    // Use existing passengers' implicit group - prompt user to name it
                                    const existingCount = groupPassengers.filter(p => !p.groupName).length;
                                    const nameIt = prompt(`กรุ๊ปนี้มี ${existingCount} ท่านแล้ว กรุณาตั้งชื่อกรุ๊ป:`);
                                    if (nameIt && nameIt.trim()) {
                                      setCurrentGroupName(nameIt.trim());
                                      // Also update existing passengers
                                      setBookingPaxList(prev => prev.map(p =>
                                        p.bookingType === 'group' && !p.groupName
                                          ? { ...p, groupName: nameIt.trim() }
                                          : p
                                      ));
                                    }
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-yellow-50 rounded text-yellow-700 font-bold text-sm transition flex justify-between items-center border border-dashed border-yellow-300"
                                >
                                  <span>กรุ๊ปที่ยังไม่มีชื่อ ({groupPassengers.filter(p => !p.groupName).length} ท่าน)</span>
                                  <span className="bg-yellow-100 text-[10px] px-2 py-0.5 rounded-full">ตั้งชื่อ</span>
                                </button>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">หรือ สร้างกรุ๊ปใหม่</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-2">ชื่อกรุ๊ปใหม่ (New Group Name)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="newGroupNameInput"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                          placeholder="เช่น ครอบครัวตัวอย่าง"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) setCurrentGroupName(e.target.value.trim());
                          }}
                        />
                        <button
                          onClick={() => {
                            const val = document.getElementById('newGroupNameInput').value;
                            if (val.trim()) setCurrentGroupName(val.trim());
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold"
                        >
                          ถัดไป
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Search or Add Customer (after mode is selected AND group name is set if applicable) */}
              {bookingAddMode && (bookingAddMode === 'individual' || (bookingAddMode === 'group' && currentGroupName)) && (
                <>
                  <header className={`${bookingAddMode === 'individual' ? 'bg-blue-500' : 'bg-purple-600'} text-white px-6 py-4 flex justify-between items-center`}>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {bookingAddMode === 'individual' ? <UserIcon size={20} /> : <Users size={20} />}
                      {bookingAddMode === 'individual' ? 'เพิ่มลูกค้าเดี่ยว' : `กลุ่ม: ${currentGroupName}`}
                    </h3>
                    <button onClick={() => { setShowBookingTypeModal(false); }}><X size={20} /></button>
                  </header>
                  <div className="p-6 space-y-4">
                    {/* Search */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-2">ค้นหาลูกค้าจากระบบ</label>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:border-[#03b8fa] transition">
                        <div className="pl-3 text-gray-400"><Search size={16} /></div>
                        <input
                          type="text"
                          className="px-3 py-2.5 text-sm outline-none w-full"
                          placeholder="พิมพ์ชื่อหรือเลขพาสปอร์ต..."
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          autoFocus
                        />
                        {customerSearchTerm && <button onClick={() => setCustomerSearchTerm('')} className="pr-3 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
                      </div>
                    </div>

                    {/* Search Results */}
                    {customerSearchTerm && (
                      <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
                        {(() => {
                          const availableCustomers = MOCK_CUSTOMERS_DB.filter(c => {
                            if (bookingPaxList.find(p => p.id === c.id)) return false;
                            return c.firstNameEn.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                              (c.passportNo && c.passportNo.toLowerCase().includes(customerSearchTerm.toLowerCase()));
                          }).slice(0, 10); // Limit to 10 results

                          if (availableCustomers.length === 0) {
                            return <div className="p-4 text-center text-gray-400 text-sm">ไม่พบลูกค้าที่ค้นหา</div>;
                          }

                          return availableCustomers.map(c => (
                            <div
                              key={c.id}
                              className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                              onClick={() => {
                                // Check again to prevent duplicates
                                if (bookingPaxList.find(p => p.id === c.id)) {
                                  alert('ลูกค้านี้ถูกเพิ่มในรายการแล้ว');
                                  return;
                                }
                                const newPax = {
                                  ...c,
                                  customerNote: c.remark || '', // Copy original DB remark to customerNote
                                  remark: '', // Reset remark for new booking-specific note
                                  // NO paymentStatus initially - will be set after payment process
                                  // bookingId will be set after confirmation
                                  bookingType: bookingAddMode,
                                  groupId: bookingAddMode === 'group' ? `GRP-${selectedRound?.id || 0}-${Date.now()}` : null,
                                  groupName: bookingAddMode === 'group' ? currentGroupName : null,
                                  paidAmount: 0 // Initialize paid amount
                                };
                                setBookingPaxList(prev => [...prev, newPax]);
                                setCustomerSearchTerm('');
                                // Don't close modal if adding to group - allow adding more
                                if (bookingAddMode === 'individual') {
                                  setShowBookingTypeModal(false);
                                }
                              }}
                            >
                              <div>
                                <div className="font-bold text-sm text-gray-800">{c.firstNameEn} {c.lastNameEn}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 font-mono">{c.passportNo}</span>
                                  {c.remark && (
                                    <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1 leading-none">
                                      <Pin size={8} /> {c.remark}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Plus size={16} className="text-[#03b8fa]" />
                            </div>
                          ));
                        })()}
                      </div>
                    )}

                    {/* Added Customers Count (for Group) */}
                    {bookingAddMode === 'group' && bookingPaxList.filter(p => p.bookingType === 'group').length > 0 && (
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-sm text-purple-700 flex justify-between items-center">
                        <span>เพิ่มในกลุ่มแล้ว: <strong>{bookingPaxList.filter(p => p.bookingType === 'group').length}</strong> ท่าน</span>
                        <span className="text-xs text-purple-500">ค้นหาเพื่อเพิ่มอีก หรือ กดปิดเมื่อเสร็จ</span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 border-t border-gray-200"></div>
                      <span className="text-xs text-gray-400">หรือ</span>
                      <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* Add New Customer */}
                    <button
                      onClick={() => {
                        setShowBookingTypeModal(false);
                        openCustomerForm();
                      }}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#03b8fa] hover:text-[#03b8fa] transition flex items-center justify-center gap-2"
                    >
                      <UserPlus size={18} /> เพิ่มลูกค้าใหม่ (กรอกข้อมูลทั้งหมด)
                    </button>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
                    <button onClick={() => { setBookingAddMode(null); setCurrentGroupName(''); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">← เปลี่ยนประเภท</button>
                    <button
                      onClick={() => setShowBookingTypeModal(false)}
                      className={`px-6 py-2 ${bookingAddMode === 'individual' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg font-bold`}
                    >
                      {bookingPaxList.length > 0 ? 'เสร็จสิ้น' : 'ปิด'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Booking Confirmation & Payment Modal (Simplified) */}
        {isBookingConfirmationModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
              <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard size={20} /> ยืนยันยอดชำระเงิน</h3>
                <button onClick={() => setIsBookingConfirmationModalOpen(false)}><X size={20} /></button>
              </header>
              <div className="p-6">
                {(() => {
                  // Detect group selection
                  const groupSelect = selectedPaxForBooking.find(s => String(s).startsWith('group:'));
                  const groupName = groupSelect ? groupSelect.split(':')[1] : null;

                  // 1. Calculate Total Amount
                  const selectedPax = groupSelect
                    ? bookingPaxList.filter(p => p.bookingType === 'group' && p.groupName === groupName)
                    : bookingPaxList.filter(p => selectedPaxForBooking.includes(p.id));

                  const totalAmount = selectedPax.reduce((sum, pax) =>
                    sum + (selectedRound.price?.[pax.roomType || 'adultTwin'] || 0), 0);

                  // 2. Identify Payer Name
                  let payerName = "ลูกค้าทั่วไป";
                  if (groupSelect) {
                    payerName = groupName || "Group Booking";
                  } else if (selectedPax.length === 1) {
                    payerName = `${selectedPax[0].firstNameEn} ${selectedPax[0].lastNameEn}`;
                  }

                  // 3. Paid Amount Calculation
                  const previouslyPaid = selectedPax.reduce((sum, pax) => sum + (pax.paidAmount || 0), 0);

                  const netAmount = totalAmount - previouslyPaid;

                  return (
                    <div className="space-y-6">

                      {/* Payer Info */}
                      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1"><UserCheck size={20} /></div>
                        <div>
                          <div className="text-xs text-blue-500 font-bold uppercase">ขื่อผู้จอง / ชื่อกลุ่ม</div>
                          <div className="font-bold text-blue-900 text-lg">{payerName}</div>
                          <div className="text-xs text-blue-400 mt-1">
                            {selectedPaxForBooking.includes('group')
                              ? `จำนวน ${bookingPaxList.filter(p => p.bookingType === 'group').length} ท่าน`
                              : `จำนวน ${selectedPaxForBooking.length} ท่าน`}
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-gray-500 text-sm mb-1">ยอดชำระสุทธิ (Net Amount)</div>
                        <div className="text-4xl font-bold text-[#03b8fa] mb-4">
                          ฿{netAmount.toLocaleString()}
                        </div>
                      </div>

                      {/* Payment Actions - Combined Flow */}
                      <div className="space-y-3 mt-6">

                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                          <label className="text-sm font-bold text-gray-700 mb-3 block flex justify-between items-center">
                            <span>ระบุยอดที่ต้องการชำระ</span>
                            <span className="text-xs text-blue-500 cursor-pointer hover:underline" onClick={() => {
                              document.getElementById('manualPaidAmountInput').value = 0;
                              document.getElementById('manualPaidAmountInput').dispatchEvent(new Event('input', { bubbles: true }));
                            }}>เคลียร์ค่า (0)</span>
                          </label>

                          {/* Quick Amount Buttons */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <button
                              onClick={() => {
                                const input = document.getElementById('manualPaidAmountInput');
                                input.value = netAmount;
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                              }}
                              className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:border-[#03b8fa] hover:text-[#03b8fa] transition"
                            >
                              เต็มจำนวน ({Math.round(netAmount / 100) / 10}k)
                            </button>
                            <button
                              onClick={() => {
                                const input = document.getElementById('manualPaidAmountInput');
                                input.value = Math.floor(netAmount / 2);
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                              }}
                              className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:border-[#03b8fa] hover:text-[#03b8fa] transition"
                            >
                              มัดจำ 50%
                            </button>
                            <button
                              onClick={() => {
                                const input = document.getElementById('manualPaidAmountInput');
                                input.value = 0;
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                              }}
                              className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:border-[#03b8fa] hover:text-[#03b8fa] transition"
                            >
                              วางบิล (0฿)
                            </button>
                          </div>

                          <div className="flex gap-2 mb-4 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">฿</span>
                            <input
                              type="number"
                              className="w-full border border-gray-300 p-3 pl-8 rounded-lg text-2xl font-bold text-right text-gray-800 outline-none focus:border-[#03b8fa] focus:ring-4 focus:ring-blue-50/50 transition bg-white"
                              defaultValue={netAmount}
                              id="manualPaidAmountInput"
                              onChange={(e) => {
                                // Simplified logic: No dynamic changes needed
                              }}
                            />
                          </div>

                          <button
                            id="btn-confirm-payment"
                            onClick={() => {
                              const inputAmount = Number(document.getElementById('manualPaidAmountInput').value);

                              if (inputAmount <= 0) return alert("กรุณาระบุยอดชำระที่มากกว่า 0 บาท");

                              // Detect if group is selected
                              const groupSelect = selectedPaxForBooking.find(s => String(s).startsWith('group:'));

                              // Create Booking
                              const finalPax = bookingPaxList
                                .filter(p => {
                                  if (groupSelect) {
                                    const gName = groupSelect.split(':')[1];
                                    return p.bookingType === 'group' && p.groupName === gName;
                                  }
                                  return selectedPaxForBooking.includes(p.id);
                                })
                                .map(p => ({
                                  ...p,
                                  groupName: p.bookingType === 'group' ? (p.groupName || currentGroupName) : p.groupName
                                }));

                              // Update current bookings if it exists, otherwise create new
                              const existingBookingId = finalPax.find(p => p.bookingId)?.bookingId;
                              const bookingId = existingBookingId || Date.now();

                              if (!existingBookingId) {
                                const newBooking = {
                                  id: bookingId,
                                  roundId: selectedRound.id,
                                  routeId: selectedRoute.id,
                                  saleId: currentUser.id,
                                  saleName: currentUser.name,
                                  status: 'pending',
                                  pax: finalPax,
                                  customerName: payerName,
                                  contactName: payerName,
                                  contactPhone: '',
                                  details: bookingDetails
                                };
                                setBookings(prev => [...prev, newBooking]);
                              }

                              // === BILLING NOTE FLOW === ... (rest stays the same)
                              const newPayment = {
                                id: Date.now() + 1,
                                bookingId: bookingId,
                                routeId: selectedRoute.id,
                                roundId: selectedRound.id,
                                saleId: currentUser.id,
                                paxIds: finalPax.map(p => p.id),
                                customerName: payerName,
                                billingInfo: { name: payerName, type: groupSelect ? 'juridical' : 'individual' },
                                totalAmount: netAmount,
                                paidAmount: 0,
                                status: 'pending',
                                createdAt: new Date().toLocaleDateString(),
                                transactions: []
                              };
                              setPayments(prev => [newPayment, ...prev]);

                              const newBillingNote = {
                                id: `INV-${Date.now()}`,
                                routeId: selectedRoute.id,
                                customerName: payerName,
                                billingType: groupSelect ? 'group' : 'individual',
                                totalAmount: netAmount,
                                billedAmount: inputAmount,
                                paidAmount: 0,
                                billingAmount: inputAmount,
                                previousPaid: previouslyPaid,
                                dueDate: "",
                                status: 'pending',
                                bookingId: bookingId,
                                paymentId: newPayment.id,
                                paxIds: finalPax.map(p => p.id),
                                roundId: selectedRound.id,
                                saleId: currentUser.id,
                                saleName: currentUser.name,
                                createdAt: new Date().toLocaleDateString()
                              };
                              setBillingNotes(prev => [newBillingNote, ...prev]);

                              const finalPaxIds = finalPax.map(p => p.id);
                              setBookingPaxList(prev => prev.map(p => {
                                if (finalPaxIds.includes(p.id)) {
                                  return {
                                    ...p,
                                    paymentStatus: p.paidAmount > 0 ? 'partial' : 'pending',
                                    bookingId: bookingId,
                                    billingNoteId: newBillingNote.id
                                  };
                                }
                                return p;
                              }));

                              // Clear selection
                              setSelectedPaxForBooking([]);
                              setIsBookingConfirmationModalOpen(false);

                              alert(`สร้างใบวางบิลเรียบร้อย!\nยอดวางบิล: ฿${inputAmount.toLocaleString()}\nสถานะ: รอชำระ\n\nกรุณาไปที่หน้า "การชำระเงิน" เพื่อบันทึกการชำระ`);
                            }}
                            className="w-full bg-[#03b8fa] hover:bg-[#029bc4] text-white py-4 rounded-lg font-bold shadow-md transition flex items-center justify-center gap-2 text-lg"
                          >
                            <CheckCircle size={20} /> <span id="label-confirm-payment">ยืนยัน</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )
        }


      </main >
    </div >
  );


}
