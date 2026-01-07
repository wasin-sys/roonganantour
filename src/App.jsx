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

// --- Mock Data ---

const USERS = [
  { id: 1, name: 'K.Admin', role: 'MANAGER', commission: 0, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'K.Boy', role: 'SALE', commission: 3, avatar: 'https://i.pravatar.cc/150?u=2' }, // Head of 101
  { id: 3, name: 'K.Anne', role: 'SALE', commission: 5, avatar: 'https://i.pravatar.cc/150?u=3' }, // Head of 201
  { id: 4, name: 'K.New', role: 'SALE', commission: 2, avatar: 'https://i.pravatar.cc/150?u=4' }, // Normal Sale
];

// Mock Payment Data
const INITIAL_PAYMENTS = [
  {
    id: 1,
    bookingId: 101,
    routeId: 1,
    roundId: 101,
    saleId: 2,
    contactName: 'SOMCHAI JAIDEE',
    totalAmount: 77700,
    paidAmount: 50000,
    status: 'partial',
    createdAt: '2025-12-20',
    transactions: [
      { id: 1, date: '2025-12-21', amount: 50000, method: 'transfer', receipt: 'receipt_001.pdf', status: 'verified', verifiedBy: 1, verifiedAt: '2025-12-21' }
    ]
  },
  {
    id: 2,
    bookingId: 201,
    routeId: 2,
    roundId: 201,
    saleId: 3,
    contactName: 'JOHN DOE',
    totalAmount: 98700,
    paidAmount: 0,
    status: 'pending',
    createdAt: '2025-12-25',
    transactions: []
  }
];

const MOCK_ROUTES = [
  { id: 1, name: 'BEIJING - UNIVERSAL STUDIO 5D4N', code: 'BJ-US', price: 25900, image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 2, name: 'KUNMING - LIJIANG - SHANGRI-LA 6D5N', code: 'KM-LS', price: 32900, image: 'https://images.unsplash.com/photo-1527684651001-705ed533005b?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: 3, name: 'CHENGDU - JIUHAIGOU 5D4N', code: 'CD-JH', price: 28900, image: 'https://images.unsplash.com/photo-1620984846468-b7692131972f?auto=format&fit=crop&q=80&w=300&h=200' },
];

const MOCK_ROUNDS = [
  { id: 101, routeId: 1, date: '12-16 OCT 2025', airline: 'TG', flight: 'TG614', seats: 25, sold: 2, status: 'Selling', headId: 2, head: 'K.Boy' },
  { id: 102, routeId: 1, date: '19-23 OCT 2025', airline: 'CA', flight: 'CA980', seats: 30, sold: 5, status: 'Selling', headId: 0, head: 'Unassigned' },
  { id: 201, routeId: 2, date: '20-25 NOV 2025', airline: 'MU', flight: 'MU742', seats: 20, sold: 20, status: 'Full', headId: 3, head: 'K.Anne' },
  { id: 301, routeId: 3, date: '05-10 DEC 2025', airline: 'TG', flight: 'TG618', seats: 25, sold: 25, status: 'Full', headId: 0, head: 'K.Somchai' },
  { id: 103, routeId: 1, date: '25-29 DEC 2025', airline: 'TG', flight: 'TG614', seats: 25, sold: 12, status: 'Selling', headId: 0, head: 'Unassigned' },
];

const INITIAL_BLACKLIST_DATA = [
  { id: 1, name: 'SOMBAT BADGUY', passport: 'A00000000', reason: 'หนีทัวร์ปี 2023' },
  { id: 2, name: 'SOMSAK TROUBLE', passport: 'A11111111', reason: 'เมาสุราอาละวาด สร้างความวุ่นวาย' }
];

const INITIAL_ATTACHMENTS = {
  passport: null,
  visa: null,
  ticket: null,
  insurance: null
};

const INITIAL_CUSTOMER_STATE = {
  id: null,
  title: 'MR',
  firstNameEn: '',
  lastNameEn: '',
  firstNameTh: '',
  lastNameTh: '',
  gender: 'M',
  dob: '',
  passportNo: '',
  passportIssue: '',
  passportExpire: '',
  birthplace: '',
  nationality: 'THAI',
  phone: '',
  remark: '',
  attachments: { ...INITIAL_ATTACHMENTS },
  ownerId: null // Track who created this pax
};

const MOCK_CUSTOMERS_DB = [
  {
    id: 1, title: 'MR', firstNameEn: 'SOMCHAI', lastNameEn: 'JAIDEE', firstNameTh: 'สมชาย', lastNameTh: 'ใจดี',
    gender: 'M', dob: '1980-04-15', passportNo: 'AA1234567', passportIssue: '2020-01-01', passportExpire: '2025-01-01',
    birthplace: 'BANGKOK', nationality: 'THAI', phone: '081-234-5678', remark: 'แพ้อาหารทะเล',
    attachments: { ...INITIAL_ATTACHMENTS, passport: 'passport_scan.pdf' },
    ownerId: 2 // Created by K.Boy (Sale)
  },
  {
    id: 2, title: 'MRS', firstNameEn: 'SUDA', lastNameEn: 'JAIDEE', firstNameTh: 'สุดา', lastNameTh: 'ใจดี',
    gender: 'F', dob: '1982-05-20', passportNo: 'AA1234568', passportIssue: '2021-06-15', passportExpire: '2026-06-14',
    birthplace: 'CHIANG MAI', nationality: 'THAI', phone: '089-999-8888', remark: '',
    ownerId: 2 // Created by K.Boy
  },
  {
    id: 3, title: 'MS', firstNameEn: 'LUCY', lastNameEn: 'LIU', firstNameTh: 'ลูซี่', lastNameTh: 'หลิว',
    gender: 'F', dob: '2015-02-12', passportNo: 'US987654321', passportIssue: '2022-01-01', passportExpire: '2032-01-01',
    birthplace: 'NEW YORK', nationality: 'USA', phone: '+1-555-0199', remark: 'Child Passenger',
    ownerId: 3 // Created by K.Anne
  }
];

const MOCK_PAX_IN_ROUND_101 = [
  { ...MOCK_CUSTOMERS_DB[0], room: '101' },
  { ...MOCK_CUSTOMERS_DB[1], room: '101' },
  { ...MOCK_CUSTOMERS_DB[2], room: '102' }
];

const INDIVIDUAL_TASKS = [
  { key: 'passport', label: 'Passport', icon: FileText, color: 'text-[#03b8fa]', bg: 'bg-[#d9edf4]' },
  { key: 'visa', label: 'Visa', icon: ShieldAlert, color: 'text-[#37c3a5]', bg: 'bg-green-50' },
  { key: 'ticket', label: 'Ticket', icon: Plane, color: 'text-blue-500', bg: 'bg-blue-50' },
  { key: 'insurance', label: 'Ins.', icon: UserCheck, color: 'text-[#fdcf1a]', bg: 'bg-yellow-50' }
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
  const [selectedOpRound, setSelectedOpRound] = useState(null);
  const [showTagPreview, setShowTagPreview] = useState(false);
  const [paxTaskStatus, setPaxTaskStatus] = useState({});

  // Payment States
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [paymentFormData, setPaymentFormData] = useState({ method: '', amount: 0, receipt: null, note: '' });

  // New States for Booking Improvements
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [selectedPaxForBooking, setSelectedPaxForBooking] = useState([]); // Array of IDs to confirm
  const [isBookingConfirmationModalOpen, setIsBookingConfirmationModalOpen] = useState(false);

  const getPaxForRound = (roundId) => {
    const mockPax = roundId === 101 ? MOCK_PAX_IN_ROUND_101 : [];

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
            newStatus[pax.id] = {
              passport: { checked: true, file: 'scanned_passport.pdf' },
              visa: { checked: pax.nationality === 'THAI', file: null },
              ticket: { checked: false, file: null },
              insurance: { checked: false, file: null }
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
    const safeBreakdown = { passport: 0, visa: 0, ticket: 0, insurance: 0 };
    if (!selectedOpRound || Object.keys(paxTaskStatus).length === 0) {
      return { total: 0, completed: 0, percent: 0, breakdown: safeBreakdown, paxCount: 0 };
    }
    let totalTasks = 0, completedTasks = 0;
    const breakdown = { passport: 0, visa: 0, ticket: 0, insurance: 0 };
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
      setCustomers([...customers, { ...saveData, id: newId }]);
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
              {formMode === 'create' ? 'Add New Customer' : 'Edit Customer Details'}
              {!canEdit && <span className="text-xs bg-white/20 px-2 py-0.5 rounded ml-2">View Only</span>}
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="hover:bg-[#03b8fa] p-1 rounded"><X size={24} /></button>
          </div>
          <div className={`p-6 space-y-6 ${!canEdit ? 'opacity-80 pointer-events-none' : ''}`}>
            {alerts.length > 0 && <div className="space-y-2 mb-4">{alerts.map((alert, idx) => <AlertBadge key={idx} type={alert.type} message={alert.msg} />)}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">Personal Information</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">Title</label><select className="w-full border rounded p-2 text-sm" value={formData.title} onChange={e => handleFormChange('title', e.target.value)}><option value="MR">MR</option><option value="MS">MS</option><option value="MRS">MRS</option><option value="MSTR">MSTR</option><option value="MISS">MISS</option></select></div>
                  <div><label className="text-xs text-gray-500 font-medium">Gender</label><select className="w-full border rounded p-2 text-sm" value={formData.gender} onChange={e => handleFormChange('gender', e.target.value)}><option value="M">Male</option><option value="F">Female</option></select></div>
                  <div><label className="text-xs text-gray-500 font-medium">Birth Date</label><input type="date" className="w-full border rounded p-2 text-sm" value={formData.dob} onChange={e => handleFormChange('dob', e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">First Name (EN)</label><input type="text" className="w-full border rounded p-2 text-sm uppercase" placeholder="SOMCHAI" value={formData.firstNameEn} onChange={e => handleFormChange('firstNameEn', e.target.value.toUpperCase())} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">Last Name (EN)</label><input type="text" className="w-full border rounded p-2 text-sm uppercase" placeholder="JAIDEE" value={formData.lastNameEn} onChange={e => handleFormChange('lastNameEn', e.target.value.toUpperCase())} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">ชื่อ (ไทย)</label><input type="text" className="w-full border rounded p-2 text-sm" placeholder="สมชาย" value={formData.firstNameTh} onChange={e => handleFormChange('firstNameTh', e.target.value)} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">นามสกุล (ไทย)</label><input type="text" className="w-full border rounded p-2 text-sm" placeholder="ใจดี" value={formData.lastNameTh} onChange={e => handleFormChange('lastNameTh', e.target.value)} /></div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">Passport & Visa Data</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">Passport No.</label><input type="text" className="w-full border rounded p-2 text-sm font-mono uppercase" placeholder="AA1234567" value={formData.passportNo} onChange={e => handleFormChange('passportNo', e.target.value.toUpperCase())} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">Nationality</label><select className="w-full border rounded p-2 text-sm" value={formData.nationality} onChange={e => handleFormChange('nationality', e.target.value)}><option value="THAI">THAI</option><option value="USA">USA</option><option value="CHINA">CHINA</option><option value="UK">UK</option><option value="OTHER">OTHER</option></select></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 font-medium">Issue Date</label><input type="date" className="w-full border rounded p-2 text-sm" value={formData.passportIssue} onChange={e => handleFormChange('passportIssue', e.target.value)} /></div>
                  <div><label className="text-xs text-gray-500 font-medium text-[#03b8fa]">Expire Date</label><input type="date" className="w-full border border-primary-200 bg-[#d9edf4] rounded p-2 text-sm" value={formData.passportExpire} onChange={e => handleFormChange('passportExpire', e.target.value)} /></div>
                </div>
                <div><label className="text-xs text-gray-500 font-medium">Birth Place (Province/City)</label><input type="text" className="w-full border rounded p-2 text-sm uppercase" placeholder="BANGKOK" value={formData.birthplace} onChange={e => handleFormChange('birthplace', e.target.value.toUpperCase())} /><p className="text-[10px] text-gray-400">Important for China Visa application</p></div>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">Documents & Attachments</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['passport', 'visa', 'ticket', 'insurance'].map((docType) => (
                    <div key={docType} className="border rounded-lg p-3 bg-gray-50 flex flex-col items-center text-center">
                      <div className="mb-2 p-2 bg-white rounded-full shadow-sm">
                        {formData.attachments?.[docType] ? <FileText size={20} className="text-green-600" /> : <Plus size={20} className="text-gray-400" />}
                      </div>
                      <label className="text-xs font-bold uppercase text-gray-600 mb-1">{docType}</label>
                      <div className="text-[10px] text-gray-400 truncate w-full mb-2">
                        {formData.attachments?.[docType] ? formData.attachments[docType] : 'No file'}
                      </div>
                      <div className="flex gap-1 w-full justify-center">
                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-2 py-1 rounded text-[10px] hover:bg-gray-50">
                          Upload
                          <input type="file" className="hidden" onChange={(e) => handleFileAttach(docType, e.target.files[0])} />
                        </label>
                        {formData.attachments?.[docType] && (
                          <button
                            onClick={() => window.alert(`Opening ${formData.attachments[docType]}...`)}
                            className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded text-[10px] hover:bg-blue-100"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">Contact & Additional Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-xs text-gray-500 font-medium">Phone Number</label><input type="tel" className="w-full border rounded p-2 text-sm" placeholder="08X-XXX-XXXX" value={formData.phone} onChange={e => handleFormChange('phone', e.target.value)} /></div>
                  <div><label className="text-xs text-gray-500 font-medium">Ticket No. (Optional)</label><input type="text" className="w-full border rounded p-2 text-sm" placeholder="999-XXXXXXXXXX" /></div>
                </div>
                <div><label className="text-xs text-gray-500 font-medium">Remark (Allergies, Wheelchair, etc.)</label><textarea className="w-full border rounded p-2 text-sm h-20" placeholder="e.g. No beef, Aisle seat request" value={formData.remark} onChange={e => handleFormChange('remark', e.target.value)}></textarea></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t">
            <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
            {canEdit && <button onClick={saveCustomer} disabled={alerts.some(a => a.type === 'danger')} className="px-6 py-2 bg-[#03b8fa] text-white rounded-lg font-medium hover:bg-[#0279a9] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"><Save size={18} /> Save Customer</button>}
          </div>
        </div>
      </div>
    );
  };

  const renderCRM = () => (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex justify-between items-center mb-2">
        <div><h1 className="text-2xl font-bold text-gray-800">CRM & Blacklist</h1><p className="text-gray-500 text-sm">Customer Database and Security Management</p></div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setCrmSubTab('customers')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${crmSubTab === 'customers' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Customer List</button>
          <button onClick={() => setCrmSubTab('blacklist')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${crmSubTab === 'blacklist' ? 'bg-[#03b8fa] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><ShieldAlert size={14} /> Blacklist</button>
        </div>
      </header>
      {crmSubTab === 'customers' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col animate-fade-in">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search customer..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#6bc8e9] w-64" /></div>
            <button onClick={() => openCustomerForm()} className="bg-[#03b8fa] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#0279a9] flex items-center gap-2"><Plus size={16} /> Add Customer</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200"><tr><th className="px-6 py-3 font-medium">Name</th><th className="px-6 py-3 font-medium">Passport Info</th><th className="px-6 py-3 font-medium">Personal</th><th className="px-6 py-3 font-medium">Contact / Remark</th><th className="px-6 py-3 font-medium text-right">Actions</th></tr></thead>
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
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between"><span>Showing {customers.length} records</span><span>Database v1.0.2</span></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-primary-200 flex-1 overflow-hidden flex flex-col animate-fade-in relative">
          {isBlacklistFormOpen && (
            <div className="absolute inset-0 bg-white/95 z-20 flex items-center justify-center p-8">
              <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#0279a9] mb-4 flex items-center gap-2"><Ban /> Add to Blacklist</h3>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium text-gray-700">Full Name (English)</label><input type="text" className="w-full border p-2 rounded uppercase" placeholder="SOMCHAI BADGUY" value={blacklistFormData.name} onChange={(e) => setBlacklistFormData({ ...blacklistFormData, name: e.target.value.toUpperCase() })} /></div>
                  <div><label className="text-sm font-medium text-gray-700">Passport / ID Card</label><input type="text" className="w-full border p-2 rounded uppercase font-mono" placeholder="A1234567" value={blacklistFormData.passport} onChange={(e) => setBlacklistFormData({ ...blacklistFormData, passport: e.target.value.toUpperCase() })} /></div>
                  <div><label className="text-sm font-medium text-gray-700">Reason</label><textarea className="w-full border p-2 rounded" placeholder="Why is this person blacklisted?" value={blacklistFormData.reason} onChange={(e) => setBlacklistFormData({ ...blacklistFormData, reason: e.target.value })}></textarea></div>
                  <div className="flex justify-end gap-3 pt-2"><button onClick={() => setIsBlacklistFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button onClick={handleBlacklistSubmit} className="px-4 py-2 bg-[#03b8fa] text-white rounded-lg hover:bg-[#0279a9]">Add to Blacklist</button></div>
                </div>
              </div>
            </div>
          )}
          <div className="p-4 bg-[#d9edf4] border-b border-red-100 flex justify-between items-center"><div className="flex items-center gap-2 text-red-800 font-bold"><ShieldAlert size={20} /> High Risk Individuals ({blacklist.length})</div><button onClick={() => setIsBlacklistFormOpen(true)} className="bg-white border border-primary-200 text-[#0279a9] px-3 py-2 rounded-lg text-sm hover:bg-[#d9edf4] flex items-center gap-2"><Plus size={16} /> Add Blacklist</button></div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200"><tr><th className="px-6 py-3 font-medium">Name</th><th className="px-6 py-3 font-medium">ID / Passport</th><th className="px-6 py-3 font-medium">Reason</th><th className="px-6 py-3 font-medium text-right">Action</th></tr></thead>
              <tbody className="divide-y divide-gray-100">{blacklist.map(person => (<tr key={person.id} className="hover:bg-[#d9edf4] group transition-colors"><td className="px-6 py-4 font-bold text-gray-800">{person.name}</td><td className="px-6 py-4 font-mono text-gray-600">{person.passport}</td><td className="px-6 py-4 text-[#03b8fa]">{person.reason}</td><td className="px-6 py-4 text-right"><button onClick={() => deleteBlacklist(person.id)} className="text-gray-400 hover:text-[#03b8fa] p-2"><Trash2 size={16} /></button></td></tr>))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-800">Executive Dashboard</h1><p className="text-gray-500 text-sm">Welcome back, K.Admin</p></div><button className="bg-[#03b8fa] text-white px-4 py-2 rounded-lg shadow-sm hover:bg-[#0279a9] transition flex items-center gap-2" onClick={() => setActiveTab('booking')}><Plus size={18} /> New Booking</button></header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><StatCard title="Total Sales (Month)" value="฿2.4M" subtext="+12% from last month" icon={CreditCard} color="green" /><StatCard title="Active Tours" value="8 Groups" subtext="In operation pipeline" icon={Plane} color="blue" /><StatCard title="Pending Tasks" value="14 Tasks" subtext="Needs attention" icon={AlertTriangle} color="red" /></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-gray-800">Upcoming Tours Status</h3><span className="text-xs text-blue-600 cursor-pointer hover:underline">View All</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500"><tr><th className="px-6 py-3 font-medium">Route</th><th className="px-6 py-3 font-medium">Date</th><th className="px-6 py-3 font-medium">Pax</th><th className="px-6 py-3 font-medium">Head</th><th className="px-6 py-3 font-medium">Progress</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{rounds.map(round => { const route = routes.find(r => r.id === round.routeId); const progress = round.id === 101 ? 65 : round.id === 201 ? 90 : 10; return (<tr key={round.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium text-gray-800">{route?.code}</td><td className="px-6 py-4 text-gray-600">{round.date}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${round.sold === round.seats ? 'bg-red-100 text-[#0279a9]' : 'bg-green-100 text-green-700'}`}>{round.sold}/{round.seats}</span></td><td className="px-6 py-4 text-gray-600">{round.head}</td><td className="px-6 py-4"><div className="w-24 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${progress > 80 ? 'bg-[#37c3a5]' : progress > 50 ? 'bg-[#fdcf1a]' : 'bg-[#0279a9]'}`} style={{ width: `${progress}%` }}></div></div></td></tr>); })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // --- Helper for Complex Pricing ---
  const formatPrice = (p) => p ? `฿${p.toLocaleString()}` : '-';

  const renderRouteEditor = () => {
    const isNew = !editorRoute.id;

    const handleSaveRouteDetails = () => {
      if (!editorRoute.name || !editorRoute.code) return alert("Name and Code are required");
      if (isNew) {
        const newRoute = { ...editorRoute, id: Date.now() };
        setRoutes([...routes, newRoute]);
        setEditorRoute(newRoute);
        alert("Route Created! You can now add rounds.");
      } else {
        setRoutes(routes.map(r => r.id === editorRoute.id ? editorRoute : r));
        alert("Route Saved!");
      }
    };

    const handleAddRound = () => {
      if (isNew && !routes.find(r => r.id === editorRoute.id)) return alert("Please Save Basic Info First");
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
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">{isNew ? 'Create New Route' : 'Edit Route'} <span className="text-xs font-normal bg-red-100 text-[#03b8fa] px-2 py-0.5 rounded-full">{isNew ? 'Draft' : 'Live'}</span></h2>
              <p className="text-xs text-gray-400">Configure route details, pricing, and operational settings</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium">Discard</button>
            <button onClick={handleSaveRouteDetails} className="bg-[#03b8fa] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-200 hover:bg-[#0279a9] transition flex items-center gap-2"><Save size={18} /> Save Changes</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* 1. Basic Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-700"><Globe size={18} /> General Information</div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Route Name</label>
                    <input type="text" className="w-full text-lg font-bold border-b-2 border-gray-200 focus:border-[#03b8fa] outline-none py-2 bg-transparent placeholder-gray-300" placeholder="e.g. GRAND JAPAN - TOKYO FUJI NIKKO" value={editorRoute.name} onChange={e => setEditorRoute({ ...editorRoute, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Route Code</label>
                      <input type="text" className="w-full border rounded-lg p-2.5 text-sm bg-gray-50 font-mono" placeholder="JP-TYO01" value={editorRoute.code} onChange={e => setEditorRoute({ ...editorRoute, code: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                      <input type="text" className="w-full border rounded-lg p-2.5 text-sm" placeholder="e.g. 6 Days 5 Nights" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Highlights / Description</label>
                    <textarea className="w-full border rounded-lg p-3 text-sm h-24" placeholder="Briefly describe the highlights..."></textarea>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Cover Image Preview</label>
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
                <div className="flex items-center gap-2 font-bold text-gray-700"><DollarSign size={18} /> Rounds & Pricing Configuration</div>
                <button onClick={handleAddRound} className="text-xs bg-[#03b8fa] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#0279a9] transition shadow flex items-center gap-1"><Plus size={14} /> Add Travel Date</button>
              </div>

              <div className="p-6">
                {filteredRounds.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                    <h3 className="text-gray-500 font-bold">No Rounds Scheduled</h3>
                    <p className="text-sm text-gray-400 mb-4">Add travel dates to start selling this tour.</p>
                    <button onClick={handleAddRound} className="text-[#03b8fa] font-bold text-sm hover:underline">Add First Round</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredRounds.map((round, idx) => (
                      <div key={round.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition duration-300 group">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4 border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">#{idx + 1}</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">Date Range</label><input type="text" className="block w-40 font-bold text-gray-800 border-b border-gray-200 focus:border-[#03b8fa] outline-none text-sm py-0.5" value={round.date} onChange={e => updateRound(round.id, 'date', e.target.value)} /></div>
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">Airline</label><input type="text" className="block w-20 font-bold text-gray-800 border-b border-gray-200 focus:border-[#03b8fa] outline-none text-sm py-0.5" value={round.airline} onChange={e => updateRound(round.id, 'airline', e.target.value)} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">Flight</label><input type="text" className="block w-20 text-gray-600 border-b border-gray-200 focus:border-[#03b8fa] outline-none text-sm py-0.5" value={round.flight} onChange={e => updateRound(round.id, 'flight', e.target.value)} /></div>
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">Seats</label><input type="number" className="block w-16 text-gray-800 border-b border-gray-200 focus:border-[#03b8fa] outline-none text-sm py-0.5" value={round.seats} onChange={e => updateRound(round.id, 'seats', Number(e.target.value))} /></div>
                            </div>
                            <div className="pl-4 border-l border-gray-200 ml-2">
                              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Assigned Head</label>
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
                          <label className="text-xs font-bold text-gray-400 uppercase mb-3 block flex items-center gap-2"><DollarSign size={14} /> Pricing Tier (THB)</label>
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                              { s: 'Adult (Twin)', k: 'adultTwin' }, { s: 'Adult (Single)', k: 'adultSingle' }, { s: 'Adult (Triple)', k: 'adultTriple' },
                              { s: 'Child (Bed)', k: 'childBed' }, { s: 'Child (No Bed)', k: 'childNoBed' }
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
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center gap-2 font-bold text-gray-700"><FileIcon size={18} /> Route Assets & Documents</div>
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer" onClick={() => {
                  const fileName = prompt("Enter File Name to simulate upload (e.g. Program_Full.pdf):");
                  if (fileName) setEditorRoute({ ...editorRoute, attachment: fileName });
                }}>
                  <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3"><Download size={24} /></div>
                  <h3 className="text-gray-800 font-bold">Upload Route Program (PDF)</h3>
                  <p className="text-sm text-gray-400 mb-4">Upload beautiful itinerary PDF for sales team to download.</p>
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
            <h1 className="text-2xl font-bold text-gray-800">New Booking</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span className={`px-2 py-1 rounded ${bookingStep >= 1 ? 'bg-red-100 text-[#0279a9] font-bold' : ''}`}>1. Select Route</span>
              <span>→</span>
              <span className={`px-2 py-1 rounded ${bookingStep >= 2 ? 'bg-red-100 text-[#0279a9] font-bold' : ''}`}>2. Select Round</span>
              <span>→</span>
              <span className={`px-2 py-1 rounded ${bookingStep >= 3 ? 'bg-red-100 text-[#0279a9] font-bold' : ''}`}>3. Pax Info</span>
            </div>
          </div>
        </header>

        {bookingStep === 1 && (
          <div className="flex-1 overflow-y-auto p-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-gray-800">Select a Route</h2>
              {currentUser.role === 'MANAGER' && (
                <button
                  onClick={() => {
                    setEditorRoute({ name: '', code: '', image: 'https://source.unsplash.com/random/300x200?travel', price: 0 });
                    setBookingMode('editor');
                  }}
                  className="bg-[#03b8fa] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0279a9] shadow-md transition"
                >
                  <Plus size={16} /> Create New Route
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
                    <div className="mt-4 flex justify-between items-center text-sm">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{route.duration}</span>
                      <span className="font-bold text-[#03b8fa]">From ฿{route.price?.toLocaleString()}</span>
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
                <button onClick={() => setBookingStep(1)} className="text-gray-400 hover:text-gray-600">← Back</button>
                <h2 className="font-bold text-lg">Select Round for <span className="text-[#03b8fa]">{selectedRoute.code}</span></h2>
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
                  <Settings size={14} /> Manage Route / Rounds
                </button>
              )}
            </div>

            <div className="space-y-4">
              {rounds.filter(r => r.routeId === selectedRoute.id).map(round => {
                const isFull = round.sold >= round.seats;
                const prices = round.price || selectedRoute.price || {};

                return (
                  <div key={round.id} className="border border-gray-200 rounded-lg group hover:border-[#03b8fa] transition">
                    {/* Main Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-2 p-4 items-center cursor-pointer" onClick={() => { setSelectedRound({ ...round, price: prices }); setBookingStep(3); }}>
                      <div className="col-span-1 font-bold text-[#03b8fa]">{round.airline}</div>
                      <div className="col-span-3 font-medium text-gray-800">{round.date}</div>
                      <div className="col-span-2 text-right font-mono font-bold">{prices.adultTwin?.toLocaleString()}</div>
                      <div className="col-span-2 text-right font-mono text-gray-600">{prices.adultSingle?.toLocaleString()}</div>
                      <div className="col-span-2 text-center text-sm">{round.seats} seats</div>
                      <div className="col-span-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${isFull ? 'text-[#03b8fa] bg-[#d9edf4]' : 'text-green-600 bg-green-50'}`}>
                          {isFull ? 'Sold Out' : 'Available'}
                        </span>
                      </div>
                    </div>
                    {/* Expanded Details (Visual Only for now to mimic requesting "Other Prices") */}
                    <div className="bg-gray-50 p-3 text-xs border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
                      <div>Adult (Triple): <strong>{formatPrice(prices.adultTriple)}</strong></div>
                      <div>Child (Bed): <strong>{formatPrice(prices.childBed)}</strong></div>
                      <div>Child (No Bed): <strong>{formatPrice(prices.childNoBed)}</strong></div>
                      <div className="text-right text-gray-400 italic">Click to select</div>
                    </div>
                  </div>
                )
              })}

              {rounds.filter(r => r.routeId === selectedRoute.id).length === 0 && (
                <div className="text-center py-10 text-gray-400">No active rounds for this route. Contact Manager.</div>
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
                  <h2 className="font-bold text-lg">Passenger Details</h2>
                  <div className="text-xs text-gray-500">
                    Round: {selectedRound.date} | Base Price: <span className="font-bold text-[#03b8fa]">฿{selectedRound.price?.adultTwin?.toLocaleString()}</span>
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
                      placeholder="Search DB (Name/Passport)..."
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
                      {MOCK_CUSTOMERS_DB.filter(c =>
                        c.firstNameEn.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                        (c.passportNo && c.passportNo.includes(customerSearchTerm))
                      ).length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-xs">No customers found.</div>
                      ) : (
                        <div>
                          {MOCK_CUSTOMERS_DB.filter(c =>
                            c.firstNameEn.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
                            (c.passportNo && c.passportNo.includes(customerSearchTerm))
                          ).map(c => (
                            <div key={c.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50" onClick={() => {
                              if (!customers.find(existing => existing.id === c.id)) {
                                setCustomers([...customers, { ...c, paymentStatus: 'pending' }]);
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
                      )}
                    </div>
                  )}
                  {showCustomerSearch && <div className="fixed inset-0 z-40" onClick={() => setShowCustomerSearch(false)}></div>}
                </div>
                <button onClick={() => openCustomerForm()} className="bg-[#d9edf4] text-[#03b8fa] border border-primary-200 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 hover:bg-red-100 transition whitespace-nowrap">
                  <Plus size={16} /> Manual Add
                </button>
              </div>
            </div>

            {/* Booking Customization Area */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Head Responsible</label>
                  <input type="text" className="w-full border p-2 rounded text-sm bg-white" placeholder="Name of Head who manages this route" value={bookingDetails.contactName} onChange={(e) => setBookingDetails({ ...bookingDetails, contactName: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Tour Code (Optional)</label>
                  <input type="text" className="w-full border p-2 rounded text-sm bg-white font-mono uppercase" placeholder="e.g. RNAT250662" value={bookingDetails.tourCode} onChange={(e) => setBookingDetails({ ...bookingDetails, tourCode: e.target.value.toUpperCase() })} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Special Note / Internal Memo</label>
                <input type="text" className="w-full border p-2 rounded text-sm bg-white" placeholder="Discount? Request?" value={bookingDetails.specialRequest} onChange={(e) => setBookingDetails({ ...bookingDetails, specialRequest: e.target.value })} />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {customers.length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed">
                  <Search size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No passengers added.</p>
                  <p className="text-xs">Search database or add manually.</p>
                </div>
              ) : (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 flex justify-between items-center">
                  <p className="text-sm text-blue-800 flex items-center gap-2"><CheckCircle size={16} /> Review Passenger List</p>
                  <div className="text-xs text-blue-600 font-bold">
                    {selectedPaxForBooking.length} / {customers.length} Selected for Booking
                  </div>
                </div>
              )}
              {customers.map((pax, index) => (
                <div key={pax.id} className={`border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all ${selectedPaxForBooking.includes(pax.id) ? 'bg-white border-[#03b8fa] shadow-sm' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
                  <div className="flex gap-4 items-center flex-1">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer accent-[#03b8fa]"
                      checked={selectedPaxForBooking.includes(pax.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedPaxForBooking([...selectedPaxForBooking, pax.id]);
                        else setSelectedPaxForBooking(selectedPaxForBooking.filter(id => id !== pax.id));
                      }}
                    />
                    <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">{index + 1}</div>
                    <div>
                      <div className="font-bold text-gray-800">{pax.firstNameEn} {pax.lastNameEn}</div>
                      <div className="text-xs text-gray-500 font-mono">{pax.passportNo} | {pax.nationality}</div>
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
                          setCustomers(customers.map(c => c.id === pax.id ? { ...c, roomType: e.target.value } : c));
                        }}
                      >
                        <option value="adultTwin">Adult (Twin)</option>
                        <option value="adultSingle">Adult (Single)</option>
                        <option value="adultTriple">Adult (Triple)</option>
                        <option value="childBed">Child (With Bed)</option>
                        <option value="childNoBed">Child (No Bed)</option>
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
                        {pax.paymentStatus || 'Draft'}
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
                <span>Total Estimate:</span>
                {/* Calculate based on selected pax only */}
                <span>฿{(selectedPaxForBooking.reduce((sum, paxId) => {
                  const pax = customers.find(c => c.id === paxId);
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
                Proceed to Payment ({selectedPaxForBooking.length} Pax)
              </button>
            </div>
          </div>
        )}

        {/* Booking Confirmation & Payment Modal */}
        {isBookingConfirmationModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
              <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard size={20} /> Payment Selection</h3>
                <button onClick={() => setIsBookingConfirmationModalOpen(false)}><X size={20} /></button>
              </header>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-gray-500 text-sm mb-1">Total Amount</div>
                  <div className="text-3xl font-bold text-[#03b8fa]">
                    ฿{(selectedPaxForBooking.reduce((sum, paxId) => {
                      const pax = customers.find(c => c.id === paxId);
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
                        const pax = customers.find(c => c.id === paxId);
                        if (!pax) return sum;
                        return sum + (selectedRound.price?.[pax.roomType || 'adultTwin'] || 0);
                      }, 0);

                      // Create Booking
                      const finalPax = customers.filter(c => selectedPaxForBooking.includes(c.id));
                      const bookingId = Date.now();
                      const newBooking = { id: bookingId, route: selectedRoute, round: selectedRound, pax: finalPax, details: bookingDetails };
                      setBookings(prev => [...prev, newBooking]);

                      // Create Payment Record
                      const newPayment = {
                        id: Date.now() + 1,
                        bookingId: bookingId,
                        customerName: bookingDetails.contactName || (finalPax[0]?.firstNameEn + ' ' + finalPax[0]?.lastNameEn),
                        totalAmount: amount,
                        paidAmount: 0,
                        status: 'pending',
                        transactions: []
                      };
                      setPayments(prev => [newPayment, ...prev]);

                      // UPDATE UI STATUS instead of clearing
                      setCustomers(prev => prev.map(c => selectedPaxForBooking.includes(c.id) ? { ...c, paymentStatus: 'pending' } : c));
                      setIsBookingConfirmationModalOpen(false);

                      // Optional: Uncheck them to prevent double booking? Or keep them checks?
                      // Let's keep them checked but visual status updated serves as feedback.
                      alert("Booking Confirmed! Status updated to Pending.");
                    }}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg font-bold text-gray-600 hover:border-[#03b8fa] hover:text-[#03b8fa] hover:bg-blue-50 transition"
                  >
                    Confirm & Pay Later (Invoice)
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center"><span className="bg-white px-2 text-sm text-gray-500">OR PAY NOW</span></div>
                  </div>

                  <button
                    onClick={() => {
                      // Same Create Logic
                      const amount = selectedPaxForBooking.reduce((sum, paxId) => {
                        const pax = customers.find(c => c.id === paxId);
                        if (!pax) return sum;
                        return sum + (selectedRound.price?.[pax.roomType || 'adultTwin'] || 0);
                      }, 0);

                      const finalPax = customers.filter(c => selectedPaxForBooking.includes(c.id));
                      const bookingId = Date.now();
                      const newBooking = { id: bookingId, route: selectedRoute, round: selectedRound, pax: finalPax, details: bookingDetails };
                      setBookings(prev => [...prev, newBooking]);

                      const newPayment = {
                        id: Date.now() + 1,
                        bookingId: bookingId,
                        customerName: bookingDetails.contactName || (finalPax[0]?.firstNameEn + ' ' + finalPax[0]?.lastNameEn),
                        totalAmount: amount,
                        paidAmount: 0,
                        status: 'pending',
                        transactions: []
                      };
                      setPayments(prev => [newPayment, ...prev]);

                      // UPDATE UI STATUS
                      setCustomers(prev => prev.map(c => selectedPaxForBooking.includes(c.id) ? { ...c, paymentStatus: 'deposit' } : c)); // Mocking deposit status
                      setIsBookingConfirmationModalOpen(false);

                      alert("Redirecting to Payment Gateway... (Status updated)");
                      // Ideally we redirect, but user asked for "list not to disappear", so maybe we stay here?
                      // "รายการจะไม่หายไปแต่จะเป็นการ อัปเดทสถานะแทน" -> List won't disappear but update status.
                      // I will NOT redirect to payment tab automatically then, or maybe confirm with user.
                      // Let's stay on this page to satisfy the request.
                    }}
                    className="w-full bg-[#03b8fa] text-white py-3 rounded-lg font-bold hover:bg-[#0279a9] shadow-md transition flex justify-center items-center gap-2"
                  >
                    <CreditCard size={18} /> Pay Deposit / Full Amount
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
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
      return (
        <div className="space-y-6 animate-fade-in">
          <header className="mb-6 flex justify-between items-center"><div><h1 className="text-2xl font-bold text-gray-800">Operations Center</h1><p className="text-gray-500 text-sm">Overview of all active tour groups and assignments</p></div><div className="flex gap-2"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search tours..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#6bc8e9] outline-none" /></div></div></header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{rounds.map(round => { const route = routes.find(r => r.id === round.routeId); const progress = round.id === 101 ? 65 : round.id === 201 ? 90 : 10; const isFull = round.sold === round.seats; return (<div key={round.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer flex flex-col justify-between group" onClick={() => { setSelectedOpRound(round); setOperationView('detail'); }}><div><div className="flex justify-between items-start mb-4"><div className="bg-[#d9edf4] text-[#0279a9] px-2 py-1 rounded text-xs font-bold">{route?.code}</div><span className={`px-2 py-1 rounded-full text-xs font-medium ${isFull ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{round.status}</span></div><h3 className="font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-[#0279a9] transition">{route?.name}</h3><div className="text-sm text-gray-500 mb-4 flex items-center gap-2"><Calendar size={14} /> {round.date}</div></div><div className="space-y-3 pt-3 border-t border-gray-100"><div className="flex justify-between text-sm"><span className="text-gray-500">Head:</span><span className={`font-medium ${round.head === 'Unassigned' ? 'text-[#03b8fa] italic' : 'text-gray-800'}`}>{round.head}</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Pax:</span><span className="font-medium text-gray-800">{round.sold}/{round.seats}</span></div><div className="space-y-1"><div className="flex justify-between text-xs text-gray-400"><span>Task Completion</span><span>{progress}%</span></div><div className="w-full bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${progress > 80 ? 'bg-[#37c3a5]' : 'bg-[#fdcf1a]'}`} style={{ width: `${progress}%` }}></div></div></div></div></div>); })}</div>
        </div>
      );
    }

    if (!selectedOpRound) {
      // Fallback if state is lost or invalid
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
          <AlertTriangle size={48} className="text-[#03b8fa]" />
          <h3 className="text-xl font-bold">No Tour Selected</h3>
          <p>Please go back to the list and select a tour group.</p>
          <button onClick={() => setOperationView('list')} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">Back to List</button>
        </div>
      );
    }

    const currentRoute = routes.find(r => r.id === selectedOpRound.routeId);
    const paxList = getPaxForRound(selectedOpRound.id) || [];

    return (
      <div className="h-full flex flex-col animate-fade-in">
        <header className="mb-6 flex justify-between items-center"><div className="flex items-center gap-4"><button onClick={() => setOperationView('list')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition"><ArrowLeft size={20} /></button><div><h1 className="text-2xl font-bold text-gray-800">Operation Workspace</h1><p className="text-gray-500 text-sm">{selectedOpRound.date} • {currentRoute?.code || 'N/A'}</p></div></div><div className="flex gap-2"><button className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"><FileDown size={16} /> Export Name List</button><button onClick={() => setShowTagPreview(true)} className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"><Tags size={16} /> Gen Tags</button></div></header>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-bold text-gray-800">Overall Progress</h3>
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
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task Breakdown</h4>
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
            <div className="bg-[#d9edf4] rounded-xl p-6 border border-[#6bc8e9]"><h3 className="font-bold text-[#0279a9] mb-2 flex items-center gap-2"><Users size={18} /> Head Assignment</h3><p className="text-sm text-[#03b8fa] mb-3">Current Head: <strong>{selectedOpRound.head}</strong></p>{isManager && <button className="text-xs bg-white text-[#03b8fa] px-3 py-1 rounded border border-[#6bc8e9] hover:bg-[#d9edf4]">Change Head</button>}</div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-gray-800">Pax Manifest & Tracking ({paxList.length} Pax)</h3><div className="relative"><Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search pax..." className="pl-9 pr-4 py-1 border border-gray-200 rounded-full text-sm outline-none focus:border-[#6bc8e9]" /></div></div>
            <div className="overflow-auto flex-1 p-2">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10"><tr><th className="px-4 py-2 w-16">Room</th><th className="px-4 py-2">Name / Passport</th>{INDIVIDUAL_TASKS.map(task => (<th key={task.key} className="px-2 py-2 text-center w-20">{task.label}</th>))}<th className="px-4 py-2 text-right">Action</th></tr></thead>
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

                      // Render Child Cert Button
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
                        <span className="text-xs text-gray-300 italic">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {!canEdit && <div className="bg-yellow-50 text-yellow-800 text-xs p-2 text-center border-t border-yellow-100">View Only / Restricted Access (Sale)</div>}
          </div>
        </div>
        {showTagPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              {/* Mock Tag Preview Content */}
              <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><Printer size={18} /> Print Preview: Luggage Tags</h3><button onClick={() => setShowTagPreview(false)}><X size={20} /></button></div>
              <div className="p-6 bg-gray-100 max-h-[60vh] overflow-y-auto"><div className="bg-white shadow-lg p-4 mx-auto w-full aspect-[1/1.414] text-xs flex flex-col gap-2"><div className="border-2 border-dashed border-gray-300 rounded p-2 flex flex-col bg-white"><div className="bg-[#0279a9] text-white text-center font-bold py-1">BJ-US | 12-16 OCT</div><div className="p-2"><div className="font-bold text-lg">MR. SOMCHAI JAIDEE</div><div className="text-gray-500">คุณ สมชาย ใจดี</div><div className="mt-2 flex items-center gap-2 font-bold"><span className="bg-gray-200 px-1 rounded">TG</span> TG614</div></div></div><div className="text-center text-gray-400 mt-4 italic">... Mock Tags ...</div></div></div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3"><button onClick={() => setShowTagPreview(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button className="px-4 py-2 bg-[#03b8fa] text-white rounded-lg hover:bg-[#0279a9] flex items-center gap-2" onClick={() => alert("Printing sent to printer!")}><Printer size={16} /> Print Now</button></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6 flex flex-col h-full animate-fade-in">
      <header className="mb-2">
        <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        <p className="text-gray-500 text-sm">Manage users, roles, and permissions</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Users size={18} /> User Access & Commissions</h3>
          <div className="text-xs text-gray-500 bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Role: Manager Access Only</div>
        </div>
        <div className="overflow-auto flex-1 p-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
              <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Commission (%)</th><th className="px-4 py-3 text-right">Action</th></tr>
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
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
          <p className="text-gray-500 text-sm">View all payment records and transactions</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 font-medium">Total Outstanding</p>
            <p className="text-2xl font-bold text-red-600">฿{payments.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500 font-medium">Paid This Month</p>
            <p className="text-2xl font-bold text-[#37c3a5]">฿{payments.reduce((sum, p) => sum + p.paidAmount, 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><Wallet size={18} /> Transaction History</h3>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Date</th>
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
                      <td className="px-4 py-3 font-medium text-gray-800">{payment.customerName}</td>
                      <td className="px-4 py-3">
                        <span className="bg-[#d9edf4] text-[#0279a9] px-2 py-1 rounded text-xs font-bold">{route?.code || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-800">฿{payment.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-[#37c3a5] font-bold">฿{payment.paidAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-red-600">฿{balance.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${payment.status === 'paid' ? 'bg-green-100 text-green-700' : payment.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {payment.status === 'paid' ? 'Paid' : payment.status === 'partial' ? 'Partial' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500 text-xs">
                        {new Date(payment.id).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
