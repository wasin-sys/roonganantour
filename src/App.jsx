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
  XCircle
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
  INITIAL_CUSTOMER_STATE
} from './mockData';

const INDIVIDUAL_TASKS = [
  { key: 'passport', label: 'Passport', icon: FileText, color: 'text-[#03b8fa]', bg: 'bg-[#d9edf4]' },
  { key: 'visa', label: 'Visa', icon: ShieldAlert, color: 'text-[#37c3a5]', bg: 'bg-green-50' },
  { key: 'ticket', label: 'Ticket', icon: Plane, color: 'text-blue-500', bg: 'bg-blue-50' },
  { key: 'insurance', label: 'Ins.', icon: UserCheck, color: 'text-[#fdcf1a]', bg: 'bg-yellow-50' },
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

  const [bookings, setBookings] = useState([]);
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

  // Payment Confirmation State
  const [billingInfo, setBillingInfo] = useState({ type: 'individual', name: '', taxId: '', address: '', email: '', phone: '' });
  const [paymentStep, setPaymentStep] = useState(1);

  // Payment States
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [paymentFormData, setPaymentFormData] = useState({ method: '', amount: 0, receipt: null, note: '' });

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
  const [userFormData, setUserFormData] = useState({ name: '', role: 'SALE', commission: 0, avatar: 'https://i.pravatar.cc/150?u=99' });

  const getPaxForRound = (roundId) => {
    let mockPax = [];
    if (roundId === 101) mockPax = MOCK_PAX_IN_ROUND_101;
    else if (roundId === 102) mockPax = MOCK_PAX_IN_ROUND_102;
    else if (roundId === 201) mockPax = MOCK_PAX_IN_ROUND_201;
    else if (roundId === 301) mockPax = MOCK_PAX_IN_ROUND_301;
    else if (roundId === 103) mockPax = MOCK_PAX_IN_ROUND_103;
    else if (roundId === 401) mockPax = MOCK_PAX_IN_ROUND_401;

    // Get unique passengers from actual bookings for this round
    const realPax = bookings
      .filter(b => b.round.id === roundId) // Match round ID
      .flatMap(b => b.pax.map(p => ({
        ...p,
        room: p.room || 'Unassigned',
        bookingId: b.id,
        // Composite ID to prevent key conflicts with mock data if same user booked
        uniqueId: `${p.id}-${b.id}`
      })));

    return [...mockPax, ...realPax];
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

  const operationProgress = useMemo(() => {
    // Default safe return
    const safeBreakdown = { passport: 0, visa: 0, ticket: 0, insurance: 0, payment: 0 };
    if (!selectedOpRound || Object.keys(paxTaskStatus).length === 0) {
      return { total: 0, completed: 0, percent: 0, breakdown: safeBreakdown, paxCount: 0 };
    }
    let totalTasks = 0, completedTasks = 0;
    const breakdown = { passport: 0, visa: 0, ticket: 0, insurance: 0, payment: 0 };
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

    if (customer) { setFormData({ ...INITIAL_CUSTOMER_STATE, ...customer }); setFormMode('edit'); validatePassport(customer); }
    else { setFormData({ ...INITIAL_CUSTOMER_STATE, ownerId: currentUser.id }); setFormMode('create'); setAlerts([]); }
    setIsFormOpen(true);
  };

  const saveCustomer = () => {
    if (!formData.firstNameEn || !formData.passportNo) { alert("Please fill in at least Name and Passport No."); return; }

    // Normalize Data
    const saveData = { ...formData, ownerId: formData.ownerId || currentUser.id };

    if (formMode === 'create') {
      const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
      const newCustomer = { ...saveData, ownerId: currentUser.id, id: newId };

      setCustomers(prev => [...prev, newCustomer]);

      // If we are in booking step 3, also add to bookingPaxList with roundId
      if (bookingStep === 3 && selectedRound) {
        const customerWithRound = { ...newCustomer, roundId: selectedRound.id };
        setCustomers(prev => prev.map(c => c.id === newId ? customerWithRound : c));
        setBookingPaxList(prev => [...prev, customerWithRound]);
        setSelectedPaxForBooking(prev => [...prev, newId]);
      }
    } else { setCustomers(customers.map(c => c.id === formData.id ? saveData : c)); }
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
              <div className="col-span-1 md:col-span-2 space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">เอกสารแนบ</h4>
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
                      ? ['passport', 'birthCert', 'visa', 'ticket', 'insurance']
                      : ['passport', 'visa', 'ticket', 'insurance'];
                    const docLabels = {
                      passport: 'หน้าพาสปอร์ต',
                      visa: 'วีซ่า',
                      ticket: 'ตั๋วเครื่องบิน',
                      insurance: 'ประกันเดินทาง',
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

              <div className="col-span-1 md:col-span-2 space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">ข้อมูลการติดต่อ</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="text-xs text-gray-500 font-medium">เบอร์โทรศัพท์</label><input type="tel" className="w-full border rounded p-2 text-sm" placeholder="08X-XXX-XXXX" value={formData.phone} onChange={e => handleFormChange('phone', e.target.value)} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">อีเมล</label><input type="email" className="w-full border rounded p-2 text-sm" placeholder="user@example.com" value={formData.email} onChange={e => handleFormChange('email', e.target.value)} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">ไลน์ (Line ID)</label><input type="text" className="w-full border rounded p-2 text-sm" placeholder="@lineid" value={formData.lineId} onChange={e => handleFormChange('lineId', e.target.value)} /></div>
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
          <button onClick={() => setCrmSubTab('blacklist')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${crmSubTab === 'blacklist' ? 'bg-[#03b8fa] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><ShieldAlert size={14} /> บัญชีดำ</button>
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
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200"><tr><th className="px-6 py-3 font-medium">ชื่อ-นามสกุล</th><th className="px-6 py-3 font-medium">ข้อมูลพาสปอร์ต</th><th className="px-6 py-3 font-medium">ส่วนตัว</th><th className="px-6 py-3 font-medium">ติดต่อ / หมายเหตุ</th><th className="px-6 py-3 font-medium text-right">จัดการ</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50 group">
                    <td className="px-6 py-4"><div className="font-bold text-gray-800">{customer.title} {customer.firstNameEn} {customer.lastNameEn}</div><div className="text-gray-500 text-xs">{customer.firstNameTh} {customer.lastNameTh}</div></td>
                    <td className="px-6 py-4"><div className="font-mono text-gray-700">{customer.passportNo}</div><div className="text-xs text-gray-500">Exp: <span className={new Date(customer.passportExpire) < new Date('2025-06-01') ? 'text-[#03b8fa] font-bold' : ''}>{customer.passportExpire}</span></div>{customer.nationality !== 'THAI' && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded">{customer.nationality}</span>}</td>
                    <td className="px-6 py-4"><div className="text-gray-600">{customer.gender === 'M' ? 'Male' : 'Female'}, Age: {new Date().getFullYear() - new Date(customer.dob).getFullYear()}</div><div className="text-xs text-gray-400">DOB: {customer.dob}</div></td>
                    <td className="px-6 py-4"><div className="text-gray-600">{customer.phone}</div>{customer.remark && <div className="text-xs text-[#03b8fa] truncate max-w-[150px]">{customer.remark}</div>}</td>
                    <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => openCustomerForm(customer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button><button onClick={() => deleteCustomer(customer.id)} className="p-2 text-[#03b8fa] hover:bg-[#d9edf4] rounded"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between"><span>แสดงบัญชี: {customers.length} รายการ</span><span>Database v1.0.2</span></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 flex-1 overflow-hidden flex flex-col animate-fade-in relative">
          {isBlacklistFormOpen && (
            <div className="absolute inset-0 bg-white/95 z-20 flex items-center justify-center p-8">
              <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0279a9] mb-4 flex items-center gap-2"><Ban /> เพิ่มรายชื่อบัญชีดำ</h3>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล (อังกฤษ)</label><input type="text" className="w-full border p-2 rounded uppercase" placeholder="SOMCHAI BADGUY" value={blacklistFormData.name} onChange={(e) => setBlacklistFormData({ ...blacklistFormData, name: e.target.value.toUpperCase() })} /></div>
                  <div><label className="text-sm font-medium text-gray-700">เลขพาสปอร์ต / บัตรประชาชน</label><input type="text" className="w-full border p-2 rounded uppercase font-mono" placeholder="A1234567" value={blacklistFormData.passport} onChange={(e) => setBlacklistFormData({ ...blacklistFormData, passport: e.target.value.toUpperCase() })} /></div>
                  <div><label className="text-sm font-medium text-gray-700">สาเหตุที่โดนแบน</label><textarea className="w-full border p-2 rounded" placeholder="ระบุสาเหตุ..." value={blacklistFormData.reason} onChange={(e) => setBlacklistFormData({ ...blacklistFormData, reason: e.target.value })}></textarea></div>
                  <div className="flex justify-end gap-3 pt-2"><button onClick={() => setIsBlacklistFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button><button onClick={handleBlacklistSubmit} className="px-4 py-2 bg-[#03b8fa] text-white rounded-lg hover:bg-[#0279a9]">ยืนยันเพิ่ม Blacklist</button></div>
                </div>
              </div>
            </div>
          )}
          <div className="p-4 bg-[#d9edf4] border-b border-red-100 flex justify-between items-center"><div className="flex items-center gap-2 text-red-800 font-bold"><ShieldAlert size={20} /> รายชื่อบุคคลเฝ้าระวัง ({blacklist.length})</div><button onClick={() => setIsBlacklistFormOpen(true)} className="bg-white border border-primary-200 text-[#0279a9] px-3 py-2 rounded-lg text-sm hover:bg-[#d9edf4] flex items-center gap-2"><Plus size={16} /> เพิ่ม Blacklist</button></div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200"><tr><th className="px-6 py-3 font-medium">ชื่อ-นามสกุล</th><th className="px-6 py-3 font-medium">ID / Passport</th><th className="px-6 py-3 font-medium">สาเหตุ</th><th className="px-6 py-3 font-medium text-right">ลบ</th></tr></thead>
              <tbody className="divide-y divide-gray-100">{blacklist.map(person => (<tr key={person.id} className="hover:bg-[#d9edf4] group transition-colors"><td className="px-6 py-4 font-bold text-gray-800">{person.name}</td><td className="px-6 py-4 font-mono text-gray-600">{person.passport}</td><td className="px-6 py-4 text-[#03b8fa]">{person.reason}</td><td className="px-6 py-4 text-right"><button onClick={() => deleteBlacklist(person.id)} className="text-gray-400 hover:text-[#03b8fa] p-2"><Trash2 size={16} /></button></td></tr>))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => {
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
                  <th className="px-6 py-3 font-medium">หัวหน้าทัวร์</th>
                  <th className="px-6 py-3 font-medium">ความคืบหน้า</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rounds.filter(r => r.status === 'Selling').map(round => {
                  const route = routes.find(r => r.id === round.routeId);
                  const progress = Math.round((round.sold / round.seats) * 100);
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
            <span className="text-xs text-gray-400">คำนวณจากยอดที่ชำระแล้ว (Paid Amount)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">พนักงานขาย</th>
                  <th className="px-6 py-3 font-medium text-right">ยอดขายรวม</th>
                  <th className="px-6 py-3 font-medium text-right">ยอดรับชำระแล้ว</th>
                  <th className="px-6 py-3 font-medium text-center">Rate</th>
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
                  const commission = totalPaid * (user.commission / 100);

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-gray-600">฿{totalSales.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-blue-600">฿{totalPaid.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center text-xs bg-gray-50 rounded mx-auto w-fit">{user.commission}%</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-[#37c3a5]">฿{commission.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setViewingSaleId(user.id)} className="p-2 text-gray-400 hover:text-[#03b8fa] hover:bg-blue-50 rounded-full transition">
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {appUsers.filter(u => u.role === 'SALE').length === 0 && (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-400">ไม่พบข้อมูลพนักงานขาย</td></tr>
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
                  const totalCommission = userPayments.reduce((sum, p) => sum + (p.paidAmount * (user.commission / 100)), 0);

                  return (
                    <>
                      <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2"><Wallet size={20} /> รายละเอียดยอดขาย: {user?.name}</h3>
                          <p className="text-gray-400 text-xs">Commission Rate: {user?.commission}% | Total Earned: ฿{totalCommission.toLocaleString()}</p>
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
                              <th className="px-4 py-3 text-right">ยอดรับชำระ</th>
                              <th className="px-4 py-3 text-right text-[#37c3a5] font-bold">คอมมิชชั่น</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {userPayments.length > 0 ? userPayments.map(p => {
                              const route = routes.find(r => r.id === p.routeId);
                              const comm = p.paidAmount * (user.commission / 100);
                              return (
                                <tr key={p.id}>
                                  <td className="px-4 py-3">
                                    <div className="font-mono text-xs text-gray-500">{p.createdAt}</div>
                                    <div className="text-xs text-blue-600">ID: #{p.id}</div>
                                  </td>
                                  <td className="px-4 py-3 md:table-cell hidden">
                                    <div className="font-medium text-gray-800">{route?.code}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{route?.name}</div>
                                  </td>
                                  <td className="px-4 py-3 text-gray-700">{p.customerName}</td>
                                  <td className="px-4 py-3 text-right font-mono">฿{p.paidAmount.toLocaleString()}</td>
                                  <td className="px-4 py-3 text-right font-mono font-bold text-[#37c3a5]">฿{comm.toLocaleString()}</td>
                                </tr>
                              );
                            }) : (
                              <tr><td colSpan="5" className="text-center py-8 text-gray-400">ยังไม่มีรายการขายที่ชำระเงินแล้ว</td></tr>
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
                      <input type="text" className="w-full border rounded-lg p-2.5 text-sm" placeholder="e.g. 6 Days 5 Nights" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ไฮไลท์ / รายละเอียด</label>
                    <textarea className="w-full border rounded-lg p-3 text-sm h-24" placeholder="Briefly describe the highlights..."></textarea>
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
                              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">หัวหน้าทัวร์</label>
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

            <div className="space-y-3">
              {/* Header Row */}
              <div className="hidden md:flex items-center justify-between px-5 py-3 bg-gray-100 rounded-lg text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="flex-1 min-w-[60px]">สายการบิน</div>
                <div className="flex-1 min-w-[100px]">วันที่เดินทาง</div>
                <div className="flex-1 min-w-[80px] text-center">ผู้ใหญ่ (คู่)</div>
                <div className="flex-1 min-w-[70px] text-center">พักเดี่ยว</div>
                <div className="flex-1 min-w-[80px] text-center">หัวหน้าทัวร์</div>
                <div className="flex-1 min-w-[50px] text-center">ที่นั่ง</div>
                <div className="flex-1 min-w-[60px] text-center text-green-600">ชำระแล้ว</div>
                <div className="flex-1 min-w-[60px] text-center text-orange-500">รอชำระ</div>
                <div className="flex-1 min-w-[60px] text-center text-yellow-600">บางส่วน</div>
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
                {/* Search Bar */}
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:border-[#03b8fa] transition w-64">
                    <div className="pl-3 text-gray-400"><Search size={16} /></div>
                    <input
                      type="text"
                      className="px-3 py-1.5 text-sm outline-none w-full"
                      placeholder="ค้นหาลูกค้า (ชื่อ/พาสปอร์ต)..."
                      value={customerSearchTerm}
                      onChange={(e) => {
                        setCustomerSearchTerm(e.target.value);
                        setShowCustomerSearch(true);
                      }}
                      onFocus={() => setShowCustomerSearch(true)}
                    />
                    {customerSearchTerm && <button onClick={() => setCustomerSearchTerm('')} className="pr-2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
                  </div>

                  {/* Search Dropdown */}
                  {showCustomerSearch && customerSearchTerm && (
                    <div className="absolute top-full mt-1 right-0 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
                      {/* Filter: Show all customers EXCEPT those already in current booking list */}
                      {(() => {
                        const availableCustomers = MOCK_CUSTOMERS_DB.filter(c => {
                          // Check if already in current booking list - skip if already added
                          if (bookingPaxList.find(p => p.id === c.id)) return false;
                          // Search filter
                          return c.firstNameEn.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                            (c.passportNo && c.passportNo.includes(customerSearchTerm));
                        });

                        if (availableCustomers.length === 0) {
                          return <div className="p-4 text-center text-gray-400 text-xs">ไม่พบข้อมูลลูกค้า</div>;
                        }

                        return (
                          <div>
                            {availableCustomers.map(c => (
                              <div key={c.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50" onClick={() => {
                                // Add to bookingPaxList for this booking session
                                if (!bookingPaxList.find(p => p.id === c.id)) {
                                  setBookingPaxList(prev => [...prev, { ...c, paymentStatus: 'pending' }]);
                                }
                                if (!selectedPaxForBooking.includes(c.id)) {
                                  setSelectedPaxForBooking(prev => [...prev, c.id]);
                                }
                                setShowCustomerSearch(false);
                                setCustomerSearchTerm('');
                              }}>
                                <div className="font-bold text-sm text-gray-800">{c.firstNameEn} {c.lastNameEn}</div>
                                <div className="text-xs text-gray-500">{c.passportNo}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {showCustomerSearch && <div className="fixed inset-0 z-40" onClick={() => setShowCustomerSearch(false)}></div>}
                </div>

                <button onClick={() => openCustomerForm()} className="bg-[#d9edf4] text-[#03b8fa] border border-primary-200 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 hover:bg-red-100 transition whitespace-nowrap">
                  <Plus size={16} /> เพิ่มลูกค้าใหม่
                </button>
              </div>
            </div>

            {/* Existing Passengers Section - Only show PAID pax */}
            {(() => {
              const allPaxInRound = getPaxForRound(selectedRound.id);
              const paidPax = allPaxInRound.filter(p => p.paymentStatus === 'paid');
              const unpaidPax = allPaxInRound.filter(p => p.paymentStatus === 'pending' || p.paymentStatus === 'partial');

              return (
                <>
                  {/* PAID Section */}
                  {paidPax.length > 0 && (
                    <div className="mb-6 border border-green-200 rounded-xl overflow-hidden">
                      <div className="bg-green-50 px-4 py-2 text-sm font-bold text-green-700 flex justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle size={14} /> รายชื่อผู้ที่ชำระเงินแล้ว ({paidPax.length} ท่าน)
                        </span>
                        <span className="text-xs font-normal text-green-500">ยืนยันการจองเรียบร้อย</span>
                      </div>
                      <div className="bg-green-50/30 max-h-48 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-green-100 text-green-700 sticky top-0">
                            <tr>
                              <th className="px-4 py-2">ชื่อ-นามสกุล</th>
                              <th className="px-4 py-2">ผู้ขาย</th>
                              <th className="px-4 py-2">วันที่ชำระเงิน</th>
                              <th className="px-4 py-2 text-right">ยอดจอง</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-green-100">
                            {paidPax.map((pax, idx) => {
                              const seller = appUsers.find(u => u.id === pax.bookedBy);
                              return (
                                <tr key={idx} className="hover:bg-green-50">
                                  <td className="px-4 py-2 font-medium text-gray-700">{pax.firstNameEn} {pax.lastNameEn}</td>
                                  <td className="px-4 py-2">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-medium">
                                      {seller?.name || '-'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 font-mono text-gray-500">{pax.paymentDate || '-'}</td>
                                  <td className="px-4 py-2 text-right font-mono font-bold text-green-600">
                                    ฿{(selectedRound.price?.[pax.roomType || 'adultTwin'] || 0).toLocaleString()}
                                  </td>
                                </tr>
                              );
                            })}
                            {/* Total Row */}
                            <tr className="bg-green-100 font-bold">
                              <td className="px-4 py-2 text-green-700" colSpan={3}>รวมยอดชำระแล้ว ({paidPax.length} ท่าน)</td>
                              <td className="px-4 py-2 text-right font-mono text-green-700">
                                ฿{paidPax.reduce((sum, pax) => sum + (selectedRound.price?.[pax.roomType || 'adultTwin'] || 0), 0).toLocaleString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Booking Customization Area */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">หัวหน้าทัวร์ผู้ดูแล</label>
                  <input
                    type="text"
                    className={`w-full border p-2 rounded text-sm bg-white ${currentUser.role !== 'MANAGER' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                    placeholder="ระบุชื่อหัวหน้าทัวร์ที่ดูแลเส้นทางนี้"
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
            </div>

            <div className="space-y-4 mb-6">
              {bookingPaxList.length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
                  <Search size={32} className="mx-auto mb-2 opacity-50" />
                  <p>ยังไม่ได้เพิ่มรายชื่อผู้เดินทางใหม่ (New Booking)</p>
                  <p className="text-xs">ค้นหาจากฐานข้อมูลด้านบน หรือ เพิ่มใหม่</p>
                </div>
              ) : (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 flex justify-between items-center">
                  <p className="text-sm text-blue-800 flex items-center gap-2"><CheckCircle size={16} /> ตรวจสอบรายชื่อผู้เดินทาง เพื่อดำเนินการจอง</p>
                  <div className="text-xs text-blue-600 font-bold">
                    เลือกจอง {selectedPaxForBooking.length} / {bookingPaxList.length} คน
                  </div>
                </div>
              )}
              {bookingPaxList.map((pax, index) => (
                <div key={pax.id} className={`border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all ${selectedPaxForBooking.includes(pax.id) ? 'bg-white border-[#03b8fa] shadow-sm' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
                  <div className="flex gap-4 items-center flex-1">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer accent-[#03b8fa]"
                      checked={selectedPaxForBooking.includes(pax.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPaxForBooking([...selectedPaxForBooking, pax.id]);
                        } else {
                          setSelectedPaxForBooking(selectedPaxForBooking.filter(id => id !== pax.id));
                        }
                      }}
                    />
                    <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">{index + 1}</div>
                    <div>
                      <div className="font-bold text-gray-800">{pax.firstNameEn} {pax.lastNameEn}</div>
                      <div className="text-xs text-gray-500 font-mono">{pax.passportNo} | {pax.nationality}</div>
                      {/* Show Added By User - Check OwnerId Only */}
                      {pax.ownerId && (
                        <div className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded w-fit mt-1 border border-blue-100 flex items-center gap-1">
                          <UserPlus size={10} />
                          Added by: {appUsers.find(u => u.id === pax.ownerId)?.name || 'Unknown'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Tier & Payment Status */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Room/Price Selector */}
                    <div className="flex items-center gap-2">
                      <select
                        className="text-xs font-bold border rounded px-2 py-1 outline-none bg-white text-gray-700"
                        value={pax.roomType || 'adultTwin'}
                        onChange={(e) => {
                          setBookingPaxList(prev => prev.map(c => c.id === pax.id ? { ...c, roomType: e.target.value } : c));
                        }}
                      >
                        <option value="adultTwin">ผู้ใหญ่ (พักคู่)</option>
                        <option value="adultSingle">ผู้ใหญ่ (พักเดี่ยว)</option>
                        <option value="adultTriple">ผู้ใหญ่ (พัก 3 ท่าน)</option>
                        <option value="childBed">เด็ก (มีเตียง)</option>
                        <option value="childNoBed">เด็ก (ไม่มีเตียง)</option>
                      </select>
                      <span className="font-mono font-bold text-[#03b8fa] w-16 text-right">
                        ฿{(selectedRound.price?.[pax.roomType || 'adultTwin'] || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Payment Status Indicator (restored) */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Status:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${pax.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                        pax.paymentStatus === 'deposit' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          pax.paymentStatus === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                            'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                        {pax.paymentStatus === 'paid' ? 'ชำระแล้ว' : pax.paymentStatus === 'partial' ? 'ชำระบางส่วน' : pax.paymentStatus === 'pending' ? 'รอชำระ' : pax.paymentStatus === 'deposit' ? 'มัดจำ' : 'ร่าง'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pl-4 border-l border-gray-100">
                    <button onClick={() => openCustomerForm(pax)} className="text-gray-400 hover:text-blue-600 p-1"><Edit2 size={16} /></button>
                    <button onClick={() => {
                      // Remove from customers and selection
                      setCustomers(customers.filter(c => c.id !== pax.id));
                      setSelectedPaxForBooking(selectedPaxForBooking.filter(id => id !== pax.id));
                    }} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-lg font-bold mt-3 text-[#03b8fa] mb-4">
                <span>ยอดรวมโดยประมาณ:</span>
                {/* Calculate based on selected pax only */}
                <span>฿{(selectedPaxForBooking.reduce((sum, paxId) => {
                  const pax = bookingPaxList.find(c => c.id === paxId);
                  if (!pax) return sum;
                  const price = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                  return sum + price;
                }, 0)).toLocaleString()}</span>
              </div>
              <button
                className="w-full bg-[#03b8fa] text-white py-3 rounded-lg font-bold hover:bg-[#0279a9] shadow-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={selectedPaxForBooking.length === 0}
                onClick={() => setIsBookingConfirmationModalOpen(true)}
              >
                ดำเนินการชำระเงิน - {selectedPaxForBooking.length} ท่าน
              </button>
            </div>
          </div>
        )}
      </div>
    )
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
            // Rounds that are full (ready to travel / in operation)
            return rounds.filter(r => r.status === 'Full');
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
        { key: 'ongoing', label: 'กำลังออกเดินทาง', icon: Plane, count: rounds.filter(r => r.status === 'Full').length },
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
                const progress = (round.status === 'Full' || round.status === 'Completed') ? 100 : (round.id === 101 ? 65 : 10);
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
                        <span className="text-gray-500">Head:</span>
                        <span className={`font-medium ${round.head === 'Unassigned' ? 'text-[#03b8fa] italic' : 'text-gray-800'}`}>{round.head}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Pax:</span>
                        <span className="font-medium text-gray-800">{round.sold}/{round.seats}</span>
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

    return (
      <div className="h-full flex flex-col animate-fade-in">
        <header className="mb-6 flex justify-between items-center"><div className="flex items-center gap-4"><button onClick={() => setOperationView('list')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition"><ArrowLeft size={20} /></button><div><h1 className="text-2xl font-bold text-gray-800">พื้นที่จัดการทัวร์</h1><p className="text-gray-500 text-sm">{selectedOpRound.date} • {currentRoute?.code || 'N/A'}</p></div></div><div className="flex gap-2"><button className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"><FileDown size={16} /> ดาวน์โหลดรายชื่อ</button><button onClick={() => setShowTagPreview(true)} className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"><Tags size={16} /> สร้างป้ายกระเป๋า</button></div></header>
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
            <div className="bg-[#d9edf4] rounded-xl p-6 border border-[#6bc8e9]"><h3 className="font-bold text-[#0279a9] mb-2 flex items-center gap-2"><Users size={18} /> หัวหน้าทัวร์ที่รับผิดชอบ</h3><p className="text-sm text-[#03b8fa] mb-3">Current Head: <strong>{selectedOpRound.head}</strong></p>{isManager && <button className="text-xs bg-white text-[#03b8fa] px-3 py-1 rounded border border-[#6bc8e9] hover:bg-[#d9edf4]">เปลี่ยนหัวหน้าทัวร์</button>}</div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-gray-800">รายชื่อลูกทัวร์ & สถานะเอกสาร ({paxList.length} ท่าน)</h3><div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search pax..." className="pl-9 pr-4 py-1 border border-gray-200 rounded-full text-sm outline-none focus:border-[#6bc8e9]" /></div></div>
            <div className="overflow-auto flex-1 p-2">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10"><tr><th className="px-4 py-2 w-16">ห้อง</th><th className="px-4 py-2">ชื่อ-นามสกุล / พาสปอร์ต</th>{INDIVIDUAL_TASKS.map(task => (<th key={task.key} className="px-2 py-2 text-center w-20">{task.label}</th>))}<th className="px-4 py-2 text-right">จัดการ</th></tr></thead>
                <tbody className="divide-y divide-gray-100">{paxList.map(pax => (
                  <tr key={pax.uniqueId || pax.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-500">{pax.room}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-gray-800 cursor-pointer hover:text-[#03b8fa] flex items-center gap-2" onClick={() => openCustomerForm(pax)}>
                            {pax.firstNameEn} {pax.lastNameEn}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">{pax.passportNo} ({pax.nationality})</div>
                        </div>
                        <button onClick={() => openCustomerForm(pax)} className="text-gray-400 hover:text-blue-600" title="View Full Details">
                          <Search size={14} />
                        </button>
                      </div>
                    </td>
                    {INDIVIDUAL_TASKS.map(task => {
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
                    })}
                    <td className="px-4 py-3 text-right text-gray-400 cursor-pointer hover:text-gray-600">
                      {/* Edit Button: Manager, Head, or Owner */}
                      {(canManageAll || pax.ownerId === currentUser.id) ? (
                        <div className="flex justify-end gap-2">
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
          <h3 className="font-bold text-lg flex items-center gap-2"><UserPlus size={20} /> เพิ่มพนักงานใหม่</h3>
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
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">ค่าคอมมิชชั่น (%)</label>
            <input type="number" className="w-full border p-2 rounded text-sm focus:border-[#03b8fa] outline-none" value={userFormData.commission} onChange={e => setUserFormData({ ...userFormData, commission: Number(e.target.value) })} />
          </div>
          <button onClick={() => {
            if (!userFormData.name) return alert("กรุณาระบุชื่อพนักงาน");
            const newUser = {
              id: Date.now(),
              ...userFormData
            };
            setAppUsers([...appUsers, newUser]);
            setIsUserFormModalOpen(false);
          }} className="w-full bg-[#03b8fa] text-white py-2 rounded-lg font-bold hover:bg-[#0279a9] transition shadow-lg mt-2">บันทึกพนักงาน</button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 flex flex-col h-full animate-fade-in">
      <header className="mb-2">
        <h1 className="text-2xl font-bold text-gray-800">ตั้งค่าระบบ</h1>
        <p className="text-gray-500 text-sm">Manage users, roles, and permissions</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Users size={18} /> จัดการผู้ใช้งาน & ค่าคอมมิชชั่น</h3>
          <button onClick={() => { setUserFormData({ name: '', role: 'SALE', commission: 0, avatar: `https://i.pravatar.cc/150?u=${Date.now()}` }); setIsUserFormModalOpen(true); }} className="bg-[#03b8fa] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0279a9] flex items-center gap-1 shadow-sm"><UserPlus size={14} /> เพิ่มพนักงาน</button>
        </div>
        <div className="overflow-auto flex-1 p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
              <tr><th className="px-4 py-3">ผู้ใช้งาน</th><th className="px-4 py-3">ตำแหน่ง</th><th className="px-4 py-3">ค่าคอมมิชชั่น (%)</th><th className="px-4 py-3 text-right">จัดการ</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-gray-200" />
                    <div><div className="font-bold text-gray-800">{user.name}</div><div className="text-xs text-gray-400">ID: {user.id}</div></div>
                  </td>
                  <td className="px-4 py-3">
                    <select className="border rounded p-1 text-xs" value={user.role} onChange={(e) => {
                      const newUsers = appUsers.map(u => u.id === user.id ? { ...u, role: e.target.value } : u);
                      setAppUsers(newUsers);
                    }}>
                      <option value="MANAGER">Manager</option>
                      <option value="SALE">Sale</option>
                      <option value="GUIDE">Guide</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input type="number" className="border rounded p-1 w-16 text-center" value={user.commission} onChange={(e) => {
                        const newUsers = appUsers.map(u => u.id === user.id ? { ...u, commission: Number(e.target.value) } : u);
                        setAppUsers(newUsers);
                      }} />
                      <span className="text-gray-400">%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-400"><button className="hover:text-[#03b8fa]"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
            <strong>Note on Roles:</strong>
            <ul className="list-disc pl-4 mt-1 space-y-1">
              <li><strong>Manager:</strong> Full access to all settings, bookings, and operations.</li>
              <li><strong>Sale:</strong> Can Create Bookings and Add Pax. Can only check docs for pax they handle. Cannot Delete Pax (unless Header).</li>
              <li><strong>Guide/Ops:</strong> View only access to Name List.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );


  // === Payment Management ===

  const renderPayment = () => {
    return (
      <div className="space-y-6 h-full flex flex-col animate-fade-in">
        <header className="mb-2">
          <h1 className="text-2xl font-bold text-gray-800">ประวัติการชำระเงิน</h1>
          <p className="text-gray-500 text-sm">View all payment records and transactions</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 font-medium">ยอดคงค้างรวม</p>
            <p className="text-2xl font-bold text-red-600">฿{payments.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 font-medium">ยอดรับเดือนนี้</p>
            <p className="text-2xl font-bold text-[#37c3a5]">฿{payments.reduce((sum, p) => sum + p.paidAmount, 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><Wallet size={18} /> รายการธุรกรรมทั้งหมด</h3>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">เส้นทาง</th>
                  <th className="px-4 py-3 text-right">ยอดรวม</th>
                  <th className="px-4 py-3 text-right">จ่ายแล้ว</th>
                  <th className="px-4 py-3 text-right">คงค้าง</th>
                  <th className="px-4 py-3 text-center">สถานะ</th>
                  <th className="px-4 py-3 text-center">วันที่</th>
                  <th className="px-4 py-3 text-center">ดูรายการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map(payment => {
                  const route = routes.find(r => r.id === payment.routeId);
                  const balance = payment.totalAmount - payment.paidAmount;
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-500">#{payment.id}</td>
                      <td className="px-4 py-3 font-mono font-bold text-gray-700">#{payment.bookingId}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#d9edf4] text-[#0279a9] px-2 py-1 rounded text-xs font-bold">{route?.code || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-800">฿{payment.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-[#37c3a5] font-bold">฿{payment.paidAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">฿{balance.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${payment.status === 'paid' ? 'bg-green-100 text-green-700' : payment.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {payment.status === 'paid' ? 'ชำระแล้ว' : payment.status === 'partial' ? 'ชำระบางส่วน' : 'รอชำระ'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500 text-xs">
                        {new Date(payment.id).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setViewingPaymentId(payment.id)} className="p-2 text-gray-400 hover:text-[#03b8fa] hover:bg-blue-50 rounded-full transition" title="ดูรายละเอียด">
                          <Search size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Detail Modal */}
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
                            <td className="px-3 py-2 text-gray-600" colSpan={3}>รวมยอดจอง ({paxList.length} ท่าน)</td>
                            <td className="px-3 py-2 text-right font-mono text-[#0279a9]">
                              ฿{paxList.reduce((sum, p) => sum + (round?.price?.[p.roomType || 'adultTwin'] || 0), 0).toLocaleString()}
                            </td>
                            <td className="px-3 py-2"></td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
                  <button onClick={() => setViewingPaymentId(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">ปิดหน้าต่าง</button>
                </div>
              </div>
            </div>
          );
        })()}
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

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto"><SidebarItem icon={Users} label={isSidebarOpen ? "ระบบจัดการลูกค้า" : ""} active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} /><SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? "ภาพรวม" : ""} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} /><SidebarItem icon={Calendar} label={isSidebarOpen ? "จองทัวร์" : ""} active={activeTab === 'booking'} onClick={() => setActiveTab('booking')} /><SidebarItem icon={FileText} label={isSidebarOpen ? "ระบบจัดการทัวร์" : ""} active={activeTab === 'operation'} onClick={() => setActiveTab('operation')} /><SidebarItem icon={Wallet} label={isSidebarOpen ? "ประวัติการชำระเงิน" : ""} active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} /><SidebarItem icon={Settings} label={isSidebarOpen ? "ตั้งค่าระบบ" : ""} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} /></nav>
        <div className="p-4 border-t border-gray-100"><SidebarItem icon={LogOut} label={isSidebarOpen ? "ออกจากระบบ" : ""} active={false} onClick={() => alert("Logged out")} /></div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="h-16 bg-white border-b border-gray-100 flex items-center px-4 lg:hidden"><button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button></div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{activeTab === 'dashboard' && renderDashboard()}{activeTab === 'booking' && renderBooking()}{activeTab === 'operation' && renderOperation()}{activeTab === 'payment' && renderPayment()}{activeTab === 'crm' && renderCRM()}{activeTab === 'settings' && renderSettings()}</div>
        {isFormOpen && renderCustomerFormModal()}
        {isUserFormModalOpen && renderUserFormModal()}

        {/* Booking Confirmation & Payment Modal */}
        {isBookingConfirmationModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
              <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard size={20} /> เลือกวิธีการชำระเงิน</h3>
                <button onClick={() => setIsBookingConfirmationModalOpen(false)}><X size={20} /></button>
              </header>
              <div className="p-6">
                {/* Step 1: Billing Information */}
                {paymentStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex gap-4 p-1 bg-gray-100 rounded-lg select-none">
                      <label className={`flex-1 py-2 text-center rounded-md cursor-pointer transition text-sm font-bold ${billingInfo.type === 'individual' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        <input type="radio" name="customerType" className="hidden" checked={billingInfo.type === 'individual'} onChange={() => setBillingInfo({ ...billingInfo, type: 'individual' })} />
                        บุคคลธรรมดา
                      </label>
                      <label className={`flex-1 py-2 text-center rounded-md cursor-pointer transition text-sm font-bold ${billingInfo.type === 'juridical' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        <input type="radio" name="customerType" className="hidden" checked={billingInfo.type === 'juridical'} onChange={() => setBillingInfo({ ...billingInfo, type: 'juridical' })} />
                        นิติบุคคล
                      </label>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">{billingInfo.type === 'individual' ? 'ชื่อ-นามสกุล ผู้ชำระเงิน' : 'ชื่อบริษัท / ห้างหุ้นส่วน'}</label>
                        <input
                          type="text"
                          className="w-full border p-2 rounded text-sm focus:border-[#03b8fa] outline-none"
                          placeholder={billingInfo.type === 'individual' ? "เช่น นายสมชาย สายเสมอ" : "เช่น บริษัท ทัวร์ดี จำกัด"}
                          value={billingInfo.name}
                          onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                        />
                      </div>

                      {billingInfo.type === 'juridical' && (
                        <div className="animate-fade-in">
                          <label className="text-xs font-bold text-gray-500 uppercase">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
                          <input
                            type="text"
                            className="w-full border p-2 rounded text-sm focus:border-[#03b8fa] outline-none"
                            placeholder="เช่น 1234567890123"
                            value={billingInfo.taxId}
                            onChange={(e) => setBillingInfo({ ...billingInfo, taxId: e.target.value })}
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">ที่อยู่ (สำหรับออกใบกำกับภาษี)</label>
                        <textarea
                          className="w-full border p-2 rounded text-sm focus:border-[#03b8fa] outline-none h-20 resize-none"
                          placeholder="รายละเอียดที่อยู่..."
                          value={billingInfo.address}
                          onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">อีเมล</label>
                          <input
                            type="email"
                            className="w-full border p-2 rounded text-sm focus:border-[#03b8fa] outline-none"
                            value={billingInfo.email}
                            onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">เบอร์โทรศัพท์</label>
                          <input
                            type="tel"
                            className="w-full border p-2 rounded text-sm focus:border-[#03b8fa] outline-none"
                            value={billingInfo.phone}
                            onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!billingInfo.name) return alert("กรุณาระบุชื่อผู้ชำระเงิน");
                        if (billingInfo.type === 'juridical' && !billingInfo.taxId) return alert("กรุณาระบุเลขประจำตัวผู้เสียภาษีสำหรับนิติบุคคล");
                        setPaymentStep(2);
                      }}
                      className="w-full bg-[#03b8fa] text-white py-2.5 rounded-lg font-bold mt-2 hover:bg-[#029bc4] transition flex items-center justify-center gap-2"
                    >
                      ถัดไป: เลือกวิธีการชำระเงิน <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* Step 2: Payment Section */}
                {paymentStep === 2 && (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 cursor-pointer hover:text-blue-500" onClick={() => setPaymentStep(1)}>
                      <ArrowLeft size={14} /> กลับไปแก้ไขข้อมูล
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-gray-500 text-sm mb-1">ยอดรวมทั้งหมด ({billingInfo.name})</div>
                      <div className="text-3xl font-bold text-[#03b8fa]">
                        ฿{(selectedPaxForBooking.reduce((sum, paxId) => {
                          const pax = bookingPaxList.find(c => c.id === paxId);
                          if (!pax) return sum;
                          const price = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                          return sum + price;
                        }, 0)).toLocaleString()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          const amount = selectedPaxForBooking.reduce((sum, paxId) => {
                            const pax = bookingPaxList.find(c => c.id === paxId);
                            if (!pax) return sum;
                            return sum + (selectedRound.price?.[pax.roomType || 'adultTwin'] || 0);
                          }, 0);

                          // Create Booking
                          const finalPax = bookingPaxList
                            .filter(c => selectedPaxForBooking.includes(c.id))
                            .map(c => ({
                              ...c,
                              bookedBy: bookingPaxMetadata[c.id]?.addedBy || currentUser.id
                            }));
                          const bookingId = Date.now();
                          const newBooking = { id: bookingId, route: selectedRoute, round: selectedRound, pax: finalPax, details: bookingDetails };
                          setBookings(prev => [...prev, newBooking]);

                          // Create Payment Record (Pending)
                          const newPayment = {
                            id: Date.now() + 1,
                            bookingId: bookingId,
                            routeId: selectedRoute.id,
                            roundId: selectedRound.id,
                            saleId: currentUser.id,
                            paxIds: selectedPaxForBooking,
                            customerName: billingInfo.name || (finalPax[0]?.firstNameEn + ' ' + finalPax[0]?.lastNameEn),
                            billingInfo: billingInfo,
                            totalAmount: amount,
                            paidAmount: 0,
                            status: 'pending',
                            createdAt: new Date().toLocaleDateString(),
                            transactions: []
                          };
                          setPayments(prev => [newPayment, ...prev]);

                          // Reset UI & State
                          setCustomers(prev => prev.map(c => selectedPaxForBooking.includes(c.id) ? { ...c, paymentStatus: 'pending' } : c));
                          setBookingPaxList(prev => prev.map(c => selectedPaxForBooking.includes(c.id) ? { ...c, paymentStatus: 'pending' } : c));
                          setIsBookingConfirmationModalOpen(false);
                          setPaymentStep(1);
                          setBillingInfo({ type: 'individual', name: '', taxId: '', address: '', email: '', phone: '' });

                          alert("ทำรายการวางบิลสำเร็จ! สถานะ: รอชำระ");
                        }}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg font-bold text-gray-600 hover:border-[#03b8fa] hover:text-[#03b8fa] hover:bg-blue-50 transition"
                      >
                        ยืนยันการจอง & จ่ายทีหลัง (วางบิล)
                      </button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center"><span className="bg-white px-2 text-sm text-gray-500">หรือ ชำระเงิน (บางส่วน/เต็มจำนวน)</span></div>
                      </div>

                      {/* Input Paid Amount */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="mb-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">ระบุยอดชำระ</label>
                          <input
                            type="number"
                            className="w-full border p-2 rounded text-lg font-bold text-right text-gray-800 outline-none focus:border-[#03b8fa]"
                            placeholder="0.00"
                            defaultValue={selectedPaxForBooking.reduce((sum, paxId) => {
                              const pax = bookingPaxList.find(c => c.id === paxId);
                              if (!pax) return sum;
                              return sum + (selectedRound.price?.[pax.roomType || 'adultTwin'] || 0);
                            }, 0)}
                            id="manualPaidAmountInput"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const totalAmount = selectedPaxForBooking.reduce((sum, paxId) => {
                              const pax = bookingPaxList.find(c => c.id === paxId);
                              if (!pax) return sum;
                              return sum + (selectedRound.price?.[pax.roomType || 'adultTwin'] || 0);
                            }, 0);

                            const paidInput = document.getElementById('manualPaidAmountInput');
                            const paidAmount = parseFloat(paidInput.value) || 0;

                            if (paidAmount <= 0) return alert("กรุณาระบุยอดชำระที่ถูกต้อง");

                            // Create Booking
                            const finalPax = bookingPaxList
                              .filter(c => selectedPaxForBooking.includes(c.id))
                              .map(c => ({
                                ...c,
                                paymentStatus: paidAmount >= totalAmount ? 'paid' : 'partial',
                                paymentDate: new Date().toISOString().split('T')[0],
                                bookedBy: bookingPaxMetadata[c.id]?.addedBy || currentUser.id
                              }));

                            const bookingId = Date.now();
                            const newBooking = { id: bookingId, route: selectedRoute, round: selectedRound, pax: finalPax, details: bookingDetails };
                            setBookings(prev => [...prev, newBooking]);

                            // Determine Status
                            let status = 'pending';
                            if (paidAmount >= totalAmount) status = 'paid';
                            else if (paidAmount > 0) status = 'partial';

                            // Create Payment Record (Paid/Partial)
                            const newPayment = {
                              id: Date.now() + 1,
                              bookingId: bookingId,
                              routeId: selectedRoute.id,
                              roundId: selectedRound.id,
                              saleId: currentUser.id,
                              paxIds: selectedPaxForBooking,
                              customerName: billingInfo.name || (finalPax[0]?.firstNameEn + ' ' + finalPax[0]?.lastNameEn),
                              billingInfo: billingInfo,
                              totalAmount: totalAmount,
                              paidAmount: paidAmount,
                              status: status,
                              createdAt: new Date().toLocaleDateString(),
                              transactions: [
                                { id: 1, date: new Date().toLocaleDateString(), amount: paidAmount, method: 'transfer', receipt: '-', status: 'verified', verifiedBy: currentUser.id, verifiedAt: new Date().toLocaleDateString() }
                              ]
                            };
                            setPayments(prev => [newPayment, ...prev]);

                            // Reset UI & State
                            setCustomers(prev => prev.map(c => selectedPaxForBooking.includes(c.id) ? { ...c, paymentStatus: status, paymentDate: new Date().toISOString().split('T')[0] } : c));
                            setBookingPaxList(prev => prev.map(c => selectedPaxForBooking.includes(c.id) ? { ...c, paymentStatus: status, paymentDate: new Date().toISOString().split('T')[0] } : c));
                            setIsBookingConfirmationModalOpen(false);
                            setPaymentStep(1);
                            setBillingInfo({ type: 'individual', name: '', taxId: '', address: '', email: '', phone: '' });

                            alert(`บันทึกการชำระเงินสำเร็จ! สถานะ: ${status === 'paid' ? 'ชำระแล้ว' : 'ชำระบางส่วน'}`);
                          }}
                          className="w-full bg-emerald-500 text-white py-3 rounded-lg font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-200"
                        >
                          ยืนยันการชำระเงิน
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      </main>
    </div>
  );


}
