import React, { useState, useEffect, useMemo } from 'react';

import CustomerLogin from './pages/CustomerLogin';
import InvoicePDF from './components/documents/InvoicePDF';
import ReceiptPDF from './components/documents/ReceiptPDF';
import TaxInvoicePDF from './components/documents/TaxInvoicePDF';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { createRoot } from 'react-dom/client';

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
  ChevronLeft,
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
  Pin,
  LineChart,
  Hash,
  StickyNote,
  type LucideIcon
} from 'lucide-react';

import type {
  User,
  UserRole,
  Route as TourRoute,
  Round,
  RoundPricing,
  Customer,
  Passenger,
  BookingGroup,
  Booking,
  Payment,
  BankAccount,
  BillingNote,
  Receipt,
  TaxInvoice,
  TaxInvoiceCustomerType,
  PaymentMethod,
  BlacklistEntry,
  CustomerFormState,
  CommissionRank,
  IndividualTask,
  PaxTaskStatusMap,
  GuideTaskStatusMap,
  OperationProgress,
  Alert,
  NavigationTab,
  CrmSubTab,
  OperationView,
  OperationTab,
  SettingsTab,
  PaymentSubTab,
  BookingAddMode,
  BillingInfo,
  PaymentFormData,
  TaxInvoiceFormData,
  BookingDetails,
  RoomType,
} from './types';

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
  BOOKING_TYPES,
  MOCK_BOOKING_GROUPS,
  INITIAL_BILLING_NOTES,
  INITIAL_RECEIPTS,
  INITIAL_TAX_INVOICES,
  PAYMENT_METHODS,
  DOCUMENT_STATUS,
  TRANSACTION_STATUS,
  PAYMENT_GATEWAY_CONFIG,
  generateTaxInvoiceNumber
} from './mockData';

const INDIVIDUAL_TASKS: IndividualTask[] = [
  { key: 'passport', label: 'พาสปอร์ต', icon: FileText, color: 'text-[#008ac5]', bg: 'bg-indigo-50' },
  { key: 'visa', label: 'วีซ่า', icon: ShieldAlert, color: 'text-[#16809a]', bg: 'bg-teal-50' },
  { key: 'ticket', label: 'ตั๋วบิน', icon: Plane, color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'insurance', label: 'ประกัน', icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'prepDoc', label: 'ใบเตรียมตัว', icon: FileIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'payment', label: 'การชำระเงิน', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' }
];



// --- Component Props Types ---

interface AlertBadgeProps {
  type: 'danger' | 'warning';
  message: string;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color?: 'green' | 'blue' | 'cyan';
}

// --- Components ---

const AlertBadge: React.FC<AlertBadgeProps> = ({ type, message }) => {
  const styles = type === 'danger'
    ? 'bg-red-50 text-red-600 border-l-4 border-red-400'
    : 'bg-amber-50 text-amber-700 border-l-4 border-amber-400';
  const Icon = type === 'danger' ? AlertTriangle : UserCheck;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${styles} text-sm font-medium shadow-soft animate-fade-in`}>
      <Icon size={18} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg my-0.5 transition-all duration-200 ease-out group
      ${active
        ? 'bg-rt-blue/10 text-rt-dark shadow-soft border-l-4 border-rt-blue font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}`}
  >
    <Icon size={20} className={`transition-transform duration-200 ${active ? 'text-rt-blue' : 'group-hover:scale-110'}`} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100/50 flex items-start justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
      <p className={`text-xs mt-2 font-medium ${color === 'green' ? 'text-green-600' : color === 'blue' ? 'text-blue-600' : 'text-rt-dark'}`}>{subtext}</p>
    </div>
    <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 ${color === 'green' ? 'bg-green-50 text-green-600' : color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-rt-light text-rt-blue'}`}>
      <Icon size={24} />
    </div>
  </div>
);

// --- Main App ---

import CustomerDashboard from './pages/CustomerDashboard';

// Basic navigation helper
export const navigate = (to: string) => {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Separate Path for Customer Login
  if (path === '/login') {
    return <CustomerLogin />;
  }

  // Path for Customer Dashboard (After Login)
  if (path === '/customer') {
    return <CustomerDashboard />;
  }

  // Default and Staff path for the main system
  return <TourSystemApp />;
}

function TourSystemApp() {
  const [appUsers, setAppUsers] = useState<User[]>(USERS);
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]); // Default to Admin

  // Lifted MOCK data to state for Manager editing
  const [routes, setRoutes] = useState<TourRoute[]>(MOCK_ROUTES);
  const [rounds, setRounds] = useState<Round[]>(MOCK_ROUNDS);

  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({ contactName: '', specialRequest: '', discount: 0, tourCode: '' });
  const [activeTab, setActiveTab] = useState<NavigationTab>('operation');
  const [viewingCustomerId, setViewingCustomerId] = useState<number | null>(null);
  const [previousTab, setPreviousTab] = useState<NavigationTab>('crm');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS_DB);
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(INITIAL_BLACKLIST_DATA);
  const [selectedRoute, setSelectedRoute] = useState<TourRoute | null>(null);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<CustomerFormState>(INITIAL_CUSTOMER_STATE);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [crmSubTab, setCrmSubTab] = useState<CrmSubTab>('customers');
  const [isBlacklistFormOpen, setIsBlacklistFormOpen] = useState(false);
  const [blacklistFormData, setBlacklistFormData] = useState({ name: '', passport: '', reason: '' });
  const [operationView, setOperationView] = useState<OperationView>('list');
  const [operationTab, setOperationTab] = useState<OperationTab>('upcoming');
  const [selectedOpRound, setSelectedOpRound] = useState<Round | null>(null);
  const [showTagPreview, setShowTagPreview] = useState(false);
  const [paxTaskStatus, setPaxTaskStatus] = useState<PaxTaskStatusMap>({});
  const [guideTaskStatus, setGuideTaskStatus] = useState<GuideTaskStatusMap>({});
  const [blacklistSearchTerm, setBlacklistSearchTerm] = useState('');
  const [showBlacklistSearch, setShowBlacklistSearch] = useState(false);

  // Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(MOCK_BANK_ACCOUNTS);
  const [isBankFormOpen, setIsBankFormOpen] = useState(false);
  const [bankFormData, setBankFormData] = useState<Partial<BankAccount>>({ bank: '', accountName: '', accountNumber: '', branch: '', color: 'bg-blue-600' });
  const [selectedBankForTransfer, setSelectedBankForTransfer] = useState('');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('bank');

  // Payment Confirmation State
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({ type: 'individual', name: '', taxId: '', address: '', email: '', phone: '' });
  const [paymentStep, setPaymentStep] = useState(1);

  // Payment States
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({ method: '', amount: 0, receipt: null, note: '' });
  const [paymentSubTab, setPaymentSubTab] = useState<PaymentSubTab>('billing');

  // New States for Booking Improvements
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [selectedPaxForBooking, setSelectedPaxForBooking] = useState<(number | string)[]>([]);
  const [bookingPaxList, setBookingPaxList] = useState<Passenger[]>([]);
  const [bookingPaxMetadata, setBookingPaxMetadata] = useState<Record<number, { addedBy: number; timestamp: number }>>({});

  const [isBookingConfirmationModalOpen, setIsBookingConfirmationModalOpen] = useState(false);
  const [isDepositPayment, setIsDepositPayment] = useState(false);
  const [viewingSaleId, setViewingSaleId] = useState<number | null>(null);
  const [viewingPaymentId, setViewingPaymentId] = useState<number | null>(null);

  // User Management State
  const [isUserFormModalOpen, setIsUserFormModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState<Partial<User> & { commissionRank: number | null }>({ name: '', role: 'SALE', commissionRank: 2, avatar: 'https://i.pravatar.cc/150?u=99', id: undefined });

  // === Document Management States ===
  const [billingNotes, setBillingNotes] = useState<BillingNote[]>(INITIAL_BILLING_NOTES);
  const [receipts, setReceipts] = useState<Receipt[]>(INITIAL_RECEIPTS);
  const [taxInvoices, setTaxInvoices] = useState<TaxInvoice[]>(INITIAL_TAX_INVOICES);
  const [bookingGroups, setBookingGroups] = useState<BookingGroup[]>(MOCK_BOOKING_GROUPS);
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);

  // Booking Type Selection (Individual vs Group)
  const [bookingAddMode, setBookingAddMode] = useState<BookingAddMode>(null);
  const [showBookingTypeModal, setShowBookingTypeModal] = useState(false);
  const [currentGroupName, setCurrentGroupName] = useState('');

  // Document Preview/Creation Modal
  const [viewingBillingNote, setViewingBillingNote] = useState<BillingNote | null>(null);
  const [selectedBillingBankId, setSelectedBillingBankId] = useState('');
  const [viewingReceipt, setViewingReceipt] = useState<Receipt | null>(null);
  const [viewingTaxInvoice, setViewingTaxInvoice] = useState<TaxInvoice | null>(null);
  const [isCreatingBillingNote, setIsCreatingBillingNote] = useState(false);
  const [isCreatingReceipt, setIsCreatingReceipt] = useState(false);
  const [isCreatingTaxInvoice, setIsCreatingTaxInvoice] = useState(false);
  const [selectedItemsForBilling, setSelectedItemsForBilling] = useState<number[]>([]);
  const [billingAmount, setBillingAmount] = useState(0);
  const [selectedReceiptForTaxInvoice, setSelectedReceiptForTaxInvoice] = useState<Receipt | null>(null);
  const [taxInvoiceFormData, setTaxInvoiceFormData] = useState<TaxInvoiceFormData>({ customerType: 'individual' });

  // Commission Ranks State
  const [commissionRanks, setCommissionRanks] = useState<CommissionRank[]>([
    { id: 1, name: 'Rank 1 (อาวุโส)', defaultAmount: 500, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
    { id: 2, name: 'Rank 2 (ทั่วไป)', defaultAmount: 300, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' }
  ]);
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [rankFormData, setRankFormData] = useState<Partial<CommissionRank>>({ name: '', defaultAmount: 0, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', id: undefined });

  // === PDF GENERATION UTILS ===
  const generatePDF = async (type: 'invoice' | 'receipt' | 'tax_invoice', data: any, filename: string) => {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7); z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
    `;
    modalOverlay.id = 'pdf-preview-modal';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white; border-radius: 12px; max-width: 900px; width: 100%;
      max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    `;

    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
      padding: 16px 24px; background: #1e3a8a; color: white;
      display: flex; justify-content: space-between; align-items: center;
    `;
    modalHeader.innerHTML = `
      <h3 style="margin:0; font-size:18px; font-weight:600;">
        📄 Preview ${type === 'invoice' ? 'ใบวางบิล (Invoice)' : type === 'tax_invoice' ? 'ใบเสร็จ/ใบกำกับภาษี' : 'ใบเสร็จรับเงิน'}
      </h3>
      <div id="pdf-action-buttons" style="display: flex; gap: 8px;">
        <button id="pdf-download-btn" style="
          background: #10b981; color: white; border: none; padding: 8px 20px;
          border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;
          display: flex; align-items: center; gap: 6px;
        ">⬇ Download PDF</button>
        <button id="pdf-close-btn" style="
          background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3);
          padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;
        ">✕ ปิด</button>
      </div>
    `;

    // Preview container (scrollable)
    const previewContainer = document.createElement('div');
    previewContainer.style.cssText = `
      flex: 1; overflow: auto; padding: 20px; background: #f3f4f6;
      display: flex; justify-content: center;
    `;

    // PDF content wrapper
    const pdfWrapper = document.createElement('div');
    pdfWrapper.style.cssText = `
      background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      width: 210mm;
    `;
    pdfWrapper.id = 'pdf-content-wrapper';

    previewContainer.appendChild(pdfWrapper);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(previewContainer);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Find related booking data for context
    let relatedBooking = bookings.find(b => b.id === data.bookingId);
    if (!relatedBooking && data.paymentId) {
      const payment = payments.find(p => p.id === data.paymentId);
      if (payment) relatedBooking = bookings.find(b => b.id === payment.bookingId);
    }
    const relatedRound = rounds.find(r => r.id === (relatedBooking?.roundId || data.roundId));
    const relatedRoute = routes.find(r => r.id === (relatedRound?.routeId || data.routeId));

    // Render component to the wrapper
    const root = createRoot(pdfWrapper);

    if (type === 'invoice') {
      root.render(
        <InvoicePDF
          billingNote={data as BillingNote}
          booking={relatedBooking}
          round={relatedRound}
          route={relatedRoute}
        />
      );
    } else if (type === 'tax_invoice') {
      const taxInvoiceData = data as TaxInvoice;
      const relatedReceipts = receipts.filter(r => taxInvoiceData.receiptIds.includes(r.id));
      root.render(
        <TaxInvoicePDF
          taxInvoice={taxInvoiceData}
          receipts={relatedReceipts}
          booking={relatedBooking}
          round={relatedRound}
          route={relatedRoute}
        />
      );
    } else {
      root.render(
        <ReceiptPDF
          receipt={data as Receipt}
          booking={relatedBooking}
          round={relatedRound}
          route={relatedRoute}
        />
      );
    }

    // Wait for React to render
    await new Promise(resolve => setTimeout(resolve, 300));
    await document.fonts.ready;

    // Setup button handlers
    const downloadBtn = document.getElementById('pdf-download-btn');
    const closeBtn = document.getElementById('pdf-close-btn');

    const cleanup = () => {
      root.unmount();
      if (document.body.contains(modalOverlay)) {
        document.body.removeChild(modalOverlay);
      }
    };

    closeBtn?.addEventListener('click', cleanup);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) cleanup();
    });

    downloadBtn?.addEventListener('click', async () => {
      // Show loading state
      if (downloadBtn) {
        downloadBtn.innerHTML = '⏳ กำลังสร้าง PDF...';
        downloadBtn.style.background = '#6b7280';
        downloadBtn.style.pointerEvents = 'none';
      }

      const pdfContent = pdfWrapper.firstElementChild as HTMLElement;
      if (!pdfContent) {
        alert('ไม่พบเนื้อหา PDF');
        return;
      }

      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg' as const, quality: 1.0 },
        html2canvas: {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          logging: false,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          // Use fixed width for A4 (210mm at 96 DPI = 794px)
          windowWidth: 794,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      try {
        await html2pdf().set(opt).from(pdfContent).save();
        // Show success
        if (downloadBtn) {
          downloadBtn.innerHTML = '✅ Download สำเร็จ!';
          downloadBtn.style.background = '#10b981';
        }
        // Auto close after download
        setTimeout(cleanup, 1500);
      } catch (err) {
        console.error("PDF Generation Error", err);
        alert(`ไม่สามารถสร้าง PDF ได้: ${err instanceof Error ? err.message : String(err)}`);
        if (downloadBtn) {
          downloadBtn.innerHTML = '⬇ Download PDF';
          downloadBtn.style.background = '#10b981';
          downloadBtn.style.pointerEvents = 'auto';
        }
      }
    });
  };

  const getPaxForRound = (roundId: number): Passenger[] => {
    // Safety check for bookings
    if (!bookings) return [];

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

        // Safety check if paxList is undefined or null
        if (!paxList) return prev;

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
      // If we are in booking step 3, add with attachments to the booking session
      if (bookingStep === 3 && selectedRound) {
        const existingGroup = bookingGroups.find(g => g.name === currentGroupName);
        let targetGroupId = null;

        if (bookingAddMode === 'group') {
          targetGroupId = existingGroup?.groupId || `GRP-${selectedRound.id}-${Date.now()}`;
          // Auto-create group if missing (e.g. manually typed but not confirmed)
          if (!existingGroup && currentGroupName) {
            setBookingGroups(prev => [...prev, {
              groupId: targetGroupId,
              name: currentGroupName,
              roundId: selectedRound.id,
              totalAmount: 0,
              paidAmount: 0,
              balance: 0,
              bookingType: 'group'
            }]);
          }
        }

        const paxWithAttachments = {
          ...newCustomer,
          attachments: attachments || {},
          roundId: selectedRound.id,
          bookingType: bookingAddMode || 'individual',
          groupId: targetGroupId,
          groupName: bookingAddMode === 'group' ? currentGroupName : null,
          paidAmount: 0
        };
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
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
          <div className="bg-[#0174aa] text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              {formMode === 'create' ? <UserPlus size={20} /> : <Edit2 size={20} />}
              {formMode === 'create' ? 'เพิ่มลูกค้าใหม่' : 'แก้ไขข้อมูลลูกค้า'}
              {!canEdit && <span className="text-xs bg-white/20 px-2 py-0.5 rounded ml-2">ดูข้อมูลเท่านั้น</span>}
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="hover:bg-[#008ac5] p-1 rounded"><X size={24} /></button>
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
                  <div><label className="text-xs text-gray-500 font-medium text-[#008ac5]">วันหมดอายุ</label><input type="date" className="w-full border border-primary-200 bg-[#d9edf4] rounded p-2 text-sm" value={formData.passportExpire} onChange={e => handleFormChange('passportExpire', e.target.value)} /></div>
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
                        className="w-full border rounded p-2 text-sm bg-blue-50 font-bold text-[#0174aa]"
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
            {canEdit && <button onClick={saveCustomer} disabled={alerts.some(a => a.type === 'danger')} className="px-6 py-2 bg-rt-blue text-white rounded-lg font-medium hover:bg-rt-dark disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"><Save size={18} /> บันทึกข้อมูล</button>}
          </div>
        </div>
      </div>
    );
  };

  const renderCRM = () => (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex justify-between items-center mb-2">
        <div><h1 className="text-2xl font-bold text-gray-800">ฐานข้อมูล <span className="text-rt-blue">ลูกค้า</span></h1><p className="text-gray-500 text-sm mt-1">Customer Database and Security Management</p></div>
        <div className="flex bg-white p-1.5 rounded-xl shadow-soft border border-gray-100">
          <button onClick={() => setCrmSubTab('customers')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${crmSubTab === 'customers' ? 'bg-rt-blue text-white shadow-soft' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>รายชื่อลูกค้า</button>
          <button onClick={() => setCrmSubTab('blacklist')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${crmSubTab === 'blacklist' ? 'bg-red-500 text-white shadow-soft' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}><ShieldAlert size={14} /> บัญชีดำ</button>
        </div>
      </header>
      {crmSubTab === 'customers' ? (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 flex-1 overflow-hidden flex flex-col animate-fade-in">
          <div className="p-4 border-b border-gray-100/50 flex justify-between items-center bg-gray-50">
            <div className="relative"><Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="ค้นหาลูกค้า..." className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-rt-sky focus:ring-2 focus:ring-rt-blue/10 w-72 transition-all" /></div>
            <button onClick={() => openCustomerForm()} className="bg-rt-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-rt-dark hover:shadow-glow transition-all duration-300 flex items-center gap-2"><Plus size={16} /> เพิ่มลูกค้าใหม่</button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-100"><tr><th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">ชื่อ-นามสกุล</th><th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">ข้อมูลพาสปอร์ต</th><th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">ส่วนตัว</th><th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">ติดต่อ</th><th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">หมายเหตุ</th><th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">ผู้ดูแล</th><th className="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider text-right">จัดการ</th></tr></thead>
              <tbody className="divide-y divide-gray-100/50">
                {customers.map(customer => {
                  const owner = appUsers.find(u => u.id === customer.ownerId);
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50/80 group transition-colors">
                      <td className="px-6 py-4"><div className="font-semibold text-gray-800">{customer.title} {customer.firstNameEn} {customer.lastNameEn}</div><div className="text-gray-500 text-xs">{customer.firstNameTh} {customer.lastNameTh}</div></td>
                      <td className="px-6 py-4"><div className="font-mono text-gray-700">{customer.passportNo}</div><div className="text-xs text-gray-500">Exp: <span className={new Date(customer.passportExpire) < new Date('2025-06-01') ? 'text-rt-blue font-bold' : ''}>{customer.passportExpire}</span></div>{customer.nationality !== 'THAI' && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">{customer.nationality}</span>}</td>
                      <td className="px-6 py-4"><div className="text-gray-600">{customer.gender === 'M' ? 'Male' : 'Female'}, Age: {new Date().getFullYear() - new Date(customer.dob).getFullYear()}</div><div className="text-xs text-gray-400">DOB: {customer.dob}</div></td>
                      <td className="px-6 py-4"><div className="text-gray-600">{customer.phone}</div></td>
                      <td className="px-6 py-4">
                        {customer.remark ? (
                          <div className="text-xs text-amber-700 font-medium flex items-center gap-1.5 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-100 truncate max-w-[150px]" title={customer.remark}>
                            <Pin size={10} /> {customer.remark}
                          </div>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {owner ? (
                          <span className="px-2.5 py-1 rounded-lg bg-rt-light text-rt-dark text-[10px] font-bold">
                            {owner.name}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => {
                              setViewingCustomerId(customer.id);
                              setPreviousTab(activeTab);
                              setActiveTab('customer-dashboard');
                            }}
                            className="p-2 text-rt-mint hover:bg-rt-mint/10 rounded-lg transition-colors"
                            title="ดูหน้า Dashboard ลูกค้า"
                          >
                            <Globe size={16} />
                          </button>
                          <button onClick={() => openCustomerForm(customer)} className="p-2 text-rt-blue hover:bg-rt-light rounded-lg transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => deleteCustomer(customer.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50/80 px-6 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between">แสดงบัญชี: {customers.length} รายการ<span>Database v1.0.2</span></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-red-100 flex-1 overflow-hidden flex flex-col animate-fade-in relative">
          {isBlacklistFormOpen && (
            <div className="absolute inset-0 bg-white/98 backdrop-blur-sm z-20 flex items-center justify-center p-8">
              <div className="w-full max-w-md bg-white border border-red-100 shadow-2xl rounded-2xl p-6 relative">
                <button onClick={() => setIsBlacklistFormOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"><X size={20} /></button>
                <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2"><Ban size={24} /> เพิ่มรายชื่อบัญชีดำ</h3>
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
          <div className="p-4 bg-red-50 border-b border-red-100/50 flex justify-between items-center"><div className="flex items-center gap-2 text-red-700 font-bold"><ShieldAlert size={20} /> รายชื่อบุคคลเฝ้าระวัง ({blacklist.length})</div><button onClick={() => setIsBlacklistFormOpen(true)} className="bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2"><Plus size={16} /> เพิ่ม Blacklist</button></div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-100"><tr><th className="px-6 py-3.5 font-semibold">ชื่อ-นามสกุล</th><th className="px-6 py-3.5 font-semibold">ID / Passport</th><th className="px-6 py-3.5 font-semibold">สาเหตุ</th><th className="px-6 py-3.5 font-semibold text-right">ลบ</th></tr></thead>
              <tbody className="divide-y divide-gray-100/50">{blacklist.map(person => (<tr key={person.id} className="hover:bg-red-50/50 group transition-colors"><td className="px-6 py-4 font-semibold text-gray-800">{person.name}</td><td className="px-6 py-4 font-mono text-gray-600">{person.passport}</td><td className="px-6 py-4 text-red-600">{person.reason}</td><td className="px-6 py-4 text-right"><button onClick={() => deleteBlacklist(person.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={16} /></button></td></tr>))}</tbody>
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

      const myActiveRounds = Array.from(myRoundsMap.values()).sort((a, b) => new Date(a.round.date).getTime() - new Date(b.round.date).getTime());

      return (
        <div className="space-y-6 animate-fade-in">
          <header className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ภาพรวมงานขาย <span className="text-rt-blue">(My Performance)</span></h1>
              <p className="text-gray-500 text-sm mt-1">ติดตามสถานะลูกค้า, เอกสาร, และค่าคอมมิชชั่น</p>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2.5 bg-white rounded-xl border border-gray-100 text-sm font-medium text-gray-600 shadow-soft flex items-center gap-2">
                <span className="text-gray-400">Commission Rank:</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${commissionRanks.find(r => r.id === currentUser.commissionRank)?.bg || 'bg-gray-100'} ${commissionRanks.find(r => r.id === currentUser.commissionRank)?.color || 'text-gray-700'}`}>
                  {commissionRanks.find(r => r.id === currentUser.commissionRank)?.name || 'None'}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('booking')}
                className="bg-rt-blue text-white px-5 py-2.5 rounded-xl hover:bg-rt-dark hover:shadow-glow shadow-soft transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Plus size={18} /> จองทัวร์ใหม่
              </button>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100/50 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-600 transition-transform duration-300 group-hover:scale-110"><Wallet size={26} /></div>
              <div>
                <p className="text-sm text-gray-500">ค่าคอมมิชชั่นสะสม</p>
                <h3 className="text-2xl font-bold text-green-600">฿{myTotalCommission.toLocaleString()}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100/50 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 transition-transform duration-300 group-hover:scale-110"><ShoppingBag size={26} /></div>
              <div>
                <p className="text-sm text-gray-500">ยอดขายรวม</p>
                <h3 className="text-2xl font-bold text-blue-600">฿{myTotalSales.toLocaleString()}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100/50 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group">
              <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 transition-transform duration-300 group-hover:scale-110"><Users size={26} /></div>
              <div>
                <p className="text-sm text-gray-500">ลูกค้าที่ดูแล (Pax)</p>
                <h3 className="text-2xl font-bold text-gray-800">{myTotalPax} ท่าน</h3>
              </div>
            </div>
          </div>

          {/* Active Job Tracking */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100/50 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-rt-blue" /> รายการที่ต้องติดตาม (Job Tracking)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">เส้นทาง / วันที่</th>
                    <th className="px-6 py-3.5 font-semibold text-center">ลูกค้าของคุณ</th>
                    <th className="px-6 py-3.5 font-semibold text-center">ค่าคอมฯ (Paid)</th>
                    <th className="px-6 py-3.5 font-semibold text-center">สถานะทัวร์</th>
                    <th className="px-6 py-3.5 font-semibold text-center">สถานะอนุมัติ</th>
                    <th className="px-6 py-3.5 font-semibold">ติดตามเอกสาร & การจ่ายเงิน</th>
                    <th className="px-6 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                  {myActiveRounds.map((item) => {
                    const { round, paxCount, customers } = item;
                    const route = routes.find(r => r.id === round.routeId);

                    // Detailed Check Logic
                    let unpaidPax = 0;
                    const missingSummary: Record<string, number> = {};

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
                        <tr className={`hover:bg-gray-50/80 cursor-pointer transition-all duration-200 ${isExpanded ? 'bg-rt-light/30' : ''}`} onClick={() => setDashboardExpandedRow(isExpanded ? null : round.id)}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                className={`p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 ${isExpanded ? 'bg-rt-light text-rt-blue rotate-180' : 'text-gray-400'}`}
                                onClick={(e) => { e.stopPropagation(); setDashboardExpandedRow(isExpanded ? null : round.id); }}
                              >
                                <ChevronDown size={16} />
                              </button>
                              <div>
                                <div className="font-bold text-rt-blue">{route?.code}</div>
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

                        {isExpanded && (
                          <tr className="bg-gray-50 border-t border-gray-100 animate-fade-in">
                            <td colSpan={6} className="px-8 py-6">
                              <div className="bg-white rounded-xl border border-gray-200/50 overflow-hidden shadow-soft">
                                <div className="px-4 py-3 border-b border-gray-100 bg-rt-light/30 flex justify-between items-center">
                                  <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2"><Users size={16} className="text-rt-blue" /> รายชื่อลูกค้าในความดูแล ({customers.length})</h4>
                                  <button onClick={() => setDashboardExpandedRow(null)} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">ปิด</button>
                                </div>
                                <table className="w-full text-sm text-left">
                                  <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase">
                                    <tr>
                                      <th className="px-4 py-2 w-10">#</th>
                                      <th className="px-4 py-2">ชื่อ-นามสกุล</th>
                                      <th className="px-4 py-2">Passport</th>
                                      <th className="px-4 py-2 min-w-[200px]">หมายเหตุ</th>
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
                                          {c.passportNo || <span className="text-red-400 italic">รอข้อมูล</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="flex flex-col gap-1.5 max-w-[280px]">
                                            {c.customerNote && (
                                              <div className="flex items-start gap-2 p-2.5 bg-amber-50/80 rounded-lg border border-amber-100">
                                                <Pin size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-amber-800 leading-relaxed">{c.customerNote}</span>
                                              </div>
                                            )}
                                            {c.remark && (
                                              <div className="flex items-start gap-2 p-2.5 bg-rt-light/50 rounded-lg border border-rt-sky/30">
                                                <Edit2 size={12} className="text-rt-blue mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-700 leading-relaxed">{c.remark}</span>
                                              </div>
                                            )}
                                            {!c.customerNote && !c.remark && <span className="text-gray-300 text-sm">-</span>}
                                          </div>
                                        </td>
                                        {/* สถานะการเงิน - เป็นภาษาไทย */}
                                        <td className="px-4 py-2 text-center">
                                          {c.paymentStatus === 'paid' ?
                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-lg text-xs font-bold"><CheckCircle size={12} /> ชำระแล้ว</span> :
                                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-lg text-xs font-bold"><Clock size={12} /> ค้างชำระ</span>
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
            <h1 className="text-2xl font-bold text-gray-800">แผงควบคุม <span className="text-rt-blue">ผู้บริหาร</span></h1>
            <p className="text-gray-500 text-sm mt-1">ยินดีต้อนรับ, {currentUser.name}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-soft">
              <Calendar size={16} className="text-rt-blue" />
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
              <button className="ml-2 text-xs bg-rt-blue text-white px-3 py-1.5 rounded-lg hover:bg-rt-dark transition-all font-medium">
                กรอง
              </button>
            </div>
            <button className="bg-rt-blue text-white px-5 py-2.5 rounded-xl shadow-soft hover:bg-rt-dark hover:shadow-glow transition-all duration-300 flex items-center gap-2 font-medium" onClick={() => setActiveTab('booking')}>
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
        <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100/50 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-rt-yellow" /> ทัวร์ที่กำลังจะถึง (รอดำเนินการ)
            </h3>
            <span className="text-xs text-rt-blue cursor-pointer hover:underline font-medium" onClick={() => { setActiveTab('operation'); setOperationTab('upcoming'); }}>ดูทั้งหมด →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">เส้นทาง</th>
                  <th className="px-6 py-3.5 font-semibold">วันที่</th>
                  <th className="px-6 py-3.5 font-semibold">ลูกทัวร์</th>
                  <th className="px-6 py-3.5 font-semibold">OP Staff</th>
                  <th className="px-6 py-3.5 font-semibold">ความคืบหน้า</th>
                  <th className="px-6 py-3.5 font-semibold text-center">สถานะอนุมัติ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {rounds.filter(r => r.status === 'Selling' || r.status === 'Full').map(round => {
                  const route = routes.find(r => r.id === round.routeId);
                  const progress = round.status === 'Completed' ? 100 : calculateEstimatedProgress(round.id);
                  const approver = appUsers.find(u => u.id === round.approvedBy);
                  const paxPercent = (round.sold / (round.seats || 1)) * 100;

                  return (
                    <tr key={round.id} className="hover:bg-gray-50/80 cursor-pointer group transition-all duration-200" onClick={() => { setSelectedOpRound(round); setOperationView('detail'); setActiveTab('operation'); }} title="Click to view passenger manifest">
                      <td className="px-6 py-4 font-semibold text-gray-800 group-hover:text-rt-blue transition-colors">{route?.code}</td>
                      <td className="px-6 py-4 text-gray-600">{round.date}</td>
                      <td className="px-6 py-4">
                        {(() => {
                          let colors = 'bg-rose-50 text-rose-600 border border-rose-100'; // Low (< 40%)
                          if (paxPercent >= 100) colors = 'bg-emerald-50 text-emerald-600 border border-emerald-100'; // Full
                          else if (paxPercent >= 40) colors = 'bg-amber-50 text-amber-600 border border-amber-100'; // Medium (>= 40%)
                          return (
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${colors}`}>
                              {round.sold}/{round.seats}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{round.head}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${progress >= 100 ? 'bg-emerald-500' :
                                progress > 70 ? 'bg-rt-blue' :
                                  progress > 30 ? 'bg-amber-400' : 'bg-rose-400'
                                }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        {round.approved ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                              <CheckCircle size={10} /> อนุมัติแล้ว
                            </span>
                            <span className="text-[9px] text-gray-400 font-medium italic">โดย {approver?.name || 'Admin'}</span>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveRound(round.id);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-black border border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:text-white hover:bg-slate-900 transition-all duration-300 shadow-sm group"
                          >
                            <ShieldCheck size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                            <span>อนุมัติทัวร์</span>
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
        <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-gray-100/50 bg-rt-mint/5 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2"><Wallet size={18} className="text-rt-mint" /> รายงานค่าคอมมิชชั่น (Sales Commission)</h3>
            <span className="text-xs text-gray-400">คำนวณจากจำนวนลูกทัวร์ที่ชำระเงินแล้ว × ค่าคอมต่อหัวของเส้นทาง</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">พนักงานขาย</th>
                  <th className="px-6 py-3.5 font-semibold text-right">ยอดขายรวม</th>
                  <th className="px-6 py-3.5 font-semibold text-right">ยอดรับชำระแล้ว</th>
                  <th className="px-6 py-3.5 font-semibold text-center">Rank</th>
                  <th className="px-6 py-3.5 font-semibold text-center">จำนวน Pax (ชำระแล้ว)</th>
                  <th className="px-6 py-3.5 font-bold text-rt-mint text-right">ค่าคอมมิชชั่น</th>
                  <th className="px-6 py-3.5 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
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
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-gray-600">฿{totalSales.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-rt-blue">฿{totalPaid.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${commissionRanks.find(r => r.id === user.commissionRank)?.bg || 'bg-gray-100'} ${commissionRanks.find(r => r.id === user.commissionRank)?.color || 'text-gray-700'}`}>
                          {commissionRanks.find(r => r.id === user.commissionRank)?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-gray-700">{totalPaxCount} คน</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-rt-mint">฿{totalCommission.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setViewingSaleId(user.id)} className="p-2 text-gray-400 hover:text-rt-blue hover:bg-rt-light rounded-lg transition-all">
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {appUsers.filter(u => u.role === 'SALE').length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">ไม่พบข้อมูลพนักงานขาย</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* Sale Detail Modal */}
        {
          viewingSaleId && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
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
                              <th className="px-4 py-3 text-right text-[#16809a] font-bold">คอมมิชชั่น</th>
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
                                  <td className="px-4 py-3 text-right font-mono font-bold text-[#16809a]">฿{comm.toLocaleString()}</td>
                                </tr>
                              );
                            }) : (
                              <tr><td colSpan={6} className="text-center py-8 text-gray-400">ยังไม่มีรายการขายที่ชำระเงินแล้ว</td></tr>
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
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">{isNew ? 'สร้างเส้นทางใหม่' : 'แก้ไขเส้นทาง'} <span className="text-xs font-normal bg-red-100 text-[#008ac5] px-2 py-0.5 rounded-full">{isNew ? 'Draft' : 'Live'}</span></h2>
              <p className="text-xs text-gray-400">ตั้งค่ารายละเอียดเส้นทาง, ราคา, และรอบเดินทาง</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg text-sm font-medium">ยกเลิก</button>
            <button onClick={handleSaveRouteDetails} className="bg-rt-blue text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-200 hover:bg-rt-dark transition flex items-center gap-2"><Save size={18} /> บันทึกข้อมูล</button>
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
                    <input type="text" className="w-full text-lg font-bold border-b-2 border-gray-200 focus:border-[#008ac5] outline-none py-2 bg-transparent placeholder-gray-300" placeholder="e.g. GRAND JAPAN - TOKYO FUJI NIKKO" value={editorRoute.name} onChange={e => setEditorRoute({ ...editorRoute, name: e.target.value })} />
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
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
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
                <button onClick={handleAddRound} className="text-xs bg-rt-blue text-white px-3 py-1.5 rounded-lg font-bold hover:bg-rt-dark transition shadow flex items-center gap-1"><Plus size={14} /> เพิ่มรอบเดินทาง</button>
              </div>

              <div className="p-6">
                {filteredRounds.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
                    <h3 className="text-gray-500 font-bold">ยังไม่ได้เพิ่มรอบเดินทาง</h3>
                    <p className="text-sm text-gray-400 mb-4">Add travel dates to start selling this tour.</p>
                    <button onClick={handleAddRound} className="text-[#008ac5] font-bold text-sm hover:underline">เริ่มสร้างรอบแรก</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredRounds.map((round, idx) => (
                      <div key={round.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition duration-300 group">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4 border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-500 text-sm">#{idx + 1}</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">วันที่เดินทาง</label><input type="text" className="block w-40 font-bold text-gray-800 border-b border-gray-200 focus:border-[#008ac5] outline-none text-sm py-0.5" value={round.date} onChange={e => updateRound(round.id, 'date', e.target.value)} /></div>
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">สายการบิน</label><input type="text" className="block w-20 font-bold text-gray-800 border-b border-gray-200 focus:border-[#008ac5] outline-none text-sm py-0.5" value={round.airline} onChange={e => updateRound(round.id, 'airline', e.target.value)} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">เที่ยวบิน</label><input type="text" className="block w-20 text-gray-600 border-b border-gray-200 focus:border-[#008ac5] outline-none text-sm py-0.5" value={round.flight} onChange={e => updateRound(round.id, 'flight', e.target.value)} /></div>
                              <div><label className="text-[10px] uppercase font-bold text-gray-400">ที่นั่ง</label><input type="number" className="block w-16 text-gray-800 border-b border-gray-200 focus:border-[#008ac5] outline-none text-sm py-0.5" value={round.seats} onChange={e => updateRound(round.id, 'seats', Number(e.target.value))} /></div>
                            </div>
                            <div className="pl-4 border-l border-gray-200 ml-2">
                              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">OP Staff</label>
                              <select
                                className="block w-32 text-sm border-b border-gray-200 focus:border-[#008ac5] outline-none py-0.5 bg-transparent"
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
                          <button onClick={() => setRounds(rounds.filter(r => r.id !== round.id))} className="text-gray-300 hover:text-[#008ac5] transition"><Trash2 size={16} /></button>
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
                      <button onClick={(e) => { e.stopPropagation(); setEditorRoute({ ...editorRoute, attachment: null }); }} className="ml-2 hover:text-[#008ac5]"><X size={14} /></button>
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
            <h1 className="text-2xl font-bold text-gray-800">จอง <span className="text-rt-blue">ทัวร์ใหม่</span></h1>
            <div className="flex items-center gap-3 text-sm mt-2">
              <span className={`px-3 py-1.5 rounded-lg transition-all duration-300 ${bookingStep >= 1 ? 'bg-rt-blue text-white font-bold shadow-soft' : 'bg-gray-100 text-gray-400'}`}>1. เลือกเส้นทาง</span>
              <span className="text-gray-300">→</span>
              <span className={`px-3 py-1.5 rounded-lg transition-all duration-300 ${bookingStep >= 2 ? 'bg-rt-blue text-white font-bold shadow-soft' : 'bg-gray-100 text-gray-400'}`}>2. เลือกรอบเดินทาง</span>
              <span className="text-gray-300">→</span>
              <span className={`px-3 py-1.5 rounded-lg transition-all duration-300 ${bookingStep >= 3 ? 'bg-rt-blue text-white font-bold shadow-soft' : 'bg-gray-100 text-gray-400'}`}>3. ข้อมูลผู้เดินทาง</span>
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
                  className="bg-rt-blue text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rt-dark hover:shadow-glow transition-all duration-300"
                >
                  <Plus size={16} /> สร้างเส้นทางใหม่
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {routes.map(route => (
                <div key={route.id} className="bg-white rounded-2xl shadow-card border border-gray-100/50 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col relative" onClick={() => { setSelectedRoute(route); setBookingStep(2); }}>
                  <div className="h-40 overflow-hidden relative">
                    <img src={route.image} alt={route.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2.5 py-1 text-xs font-bold rounded-lg shadow-soft">{route.code}</div>
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-rt-blue transition">{route.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{route.description}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <span className="bg-rt-light text-rt-dark px-2.5 py-1 rounded-lg text-xs font-bold w-fit flex items-center gap-1">
                          <Clock size={12} /> {route.duration}
                        </span>
                        <span className="text-xs text-gray-400 font-medium pl-1">
                          {rounds.filter(r => r.routeId === route.id && r.status !== 'Full').length} รอบที่เปิดจอง
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 font-normal mb-[-2px]">เริ่มต้นที่</div>
                        <span className="font-bold text-rt-blue text-lg">฿{route.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookingStep === 2 && selectedRoute && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 p-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setBookingStep(1)} className="text-gray-400 hover:text-rt-blue transition-colors flex items-center gap-1"><ChevronLeft size={16} /> ย้อนกลับ</button>
                <h2 className="font-bold text-lg">เลือกรอบเดินทางสำหรับ <span className="text-rt-blue">{selectedRoute.code}</span></h2>
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
                    className="bg-rt-mint/10 border border-rt-mint/20 text-rt-mint px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-rt-mint/20 transition-all"
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
                    className="bg-white border border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <Settings size={14} /> จัดการเส้นทาง / รอบ
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {/* Header Row */}
              <div className="hidden md:flex items-center justify-between px-5 py-3.5 bg-gray-100 rounded-xl text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex-1 min-w-[60px]">สายการบิน</div>
                <div className="flex-1 min-w-[100px]">วันที่เดินทาง</div>
                <div className="flex-1 min-w-[80px] text-center">ผู้ใหญ่ (คู่)</div>
                <div className="flex-1 min-w-[70px] text-center">พักเดี่ยว</div>
                <div className="flex-1 min-w-[80px] text-center">OP Staff</div>
                <div className="flex-1 min-w-[50px] text-center">ที่นั่ง</div>
                <div className="flex-1 min-w-[60px] text-center text-rt-mint">ชำระแล้ว</div>
                <div className="flex-1 min-w-[60px] text-center text-orange-500">รอชำระ</div>
                <div className="flex-1 min-w-[60px] text-center text-rt-yellow">บางส่วน</div>
                <div className="flex-1 min-w-[70px] text-center">อนุมัติ</div>
                <div className="flex-1 min-w-[60px] text-right">สถานะ</div>
              </div>

              {selectedRoute && rounds.filter(r => r.routeId === selectedRoute.id).map(round => {
                const isFull = round.sold >= round.seats;
                const prices = (round.price || selectedRoute?.price || {}) as RoundPricing;

                // คำนวณสถานะการชำระจาก pax จริง แทนที่จะใช้ค่า static
                const allPaxForRound = getPaxForRound(round.id);
                const dynamicPaidCount = allPaxForRound.filter(p => {
                  const total = prices[p.roomType || 'adultTwin'] || 0;
                  const paid = p.paidAmount || 0;
                  // Check explicit status OR calculated amount
                  return (p.paymentStatus === 'paid') || (paid >= (total - 1) && total > 0);
                }).length;

                const dynamicPartialCount = allPaxForRound.filter(p => {
                  const total = prices[p.roomType || 'adultTwin'] || 0;
                  const paid = p.paidAmount || 0;
                  const isPaid = (p.paymentStatus === 'paid') || (paid >= (total - 1) && total > 0);
                  if (isPaid) return false;

                  // Partial MUST have paid amount > 0
                  return paid > 0;
                }).length;

                // Pending is the rest
                const dynamicPendingCount = allPaxForRound.length - dynamicPaidCount - dynamicPartialCount;
                const dynamicSoldCount = allPaxForRound.length;

                return (
                  <div key={round.id} className="border border-gray-200/50 rounded-xl group hover:border-rt-blue hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Main Row */}
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-5 py-4 cursor-pointer bg-white hover:bg-gray-50/50 transition-colors" onClick={() => {
                      setSelectedRound({ ...round, price: prices });
                      setBookingDetails(prev => ({ ...prev, contactName: round.head || '' }));
                      // Auto-populate ALL pax to bookingPaxList (not just unpaid)
                      setBookingPaxList(allPaxForRound);
                      setSelectedPaxForBooking(allPaxForRound.filter(p => p.paymentStatus !== 'paid').map(p => p.id));
                      setBookingStep(3);
                    }}>
                      <div className="flex-1 min-w-[60px] font-bold text-rt-blue text-lg">{round.airline}</div>
                      <div className="flex-1 min-w-[100px] font-medium text-gray-800 text-sm">{round.date}</div>
                      <div className="flex-1 min-w-[80px] text-center font-mono font-bold text-rt-blue text-lg">{prices.adultTwin?.toLocaleString()}</div>
                      <div className="flex-1 min-w-[70px] text-center font-mono text-gray-400 text-sm">{prices.adultSingle?.toLocaleString()}</div>
                      <div className="flex-1 min-w-[80px] text-center text-sm text-gray-600 truncate" title={round.head}>{round.head || '-'}</div>
                      <div className="flex-1 min-w-[50px] text-center text-sm font-bold text-gray-700">{round.seats}</div>
                      <div className="flex-1 min-w-[60px] text-center">
                        <span className="inline-block min-w-[28px] font-bold text-rt-mint bg-rt-mint/10 px-2.5 py-1 rounded-lg">{dynamicPaidCount}</span>
                      </div>
                      <div className="flex-1 min-w-[60px] text-center">
                        <span className="inline-block min-w-[28px] font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg">{dynamicPendingCount}</span>
                      </div>
                      <div className="flex-1 min-w-[60px] text-center">
                        <span className="inline-block min-w-[28px] font-bold text-rt-yellow bg-rt-yellow/10 px-2.5 py-1 rounded-lg">{dynamicPartialCount}</span>
                      </div>
                      <div className="flex-1 min-w-[70px] text-center">
                        {round.approved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rt-mint/10 text-rt-mint">
                            <CheckCircle size={10} /> อนุมัติ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-600">
                            <Clock size={10} /> รอ
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-[60px] text-right">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isFull ? 'text-red-600 bg-red-50' : 'text-rt-mint bg-rt-mint/10'}`}>
                          {isFull ? 'เต็ม' : 'ว่าง'}
                        </span>
                      </div>
                    </div>
                    {/* Expanded Details */}
                    <div className="bg-gray-50 px-5 py-3 text-xs border-t border-gray-100/50 flex flex-wrap md:flex-nowrap items-center gap-6 text-gray-500">
                      <div>ผู้ใหญ่ (3 ท่าน): <strong className="text-gray-700">{prices.adultTriple?.toLocaleString() || '-'}</strong></div>
                      <div>เด็ก (มีเตียง): <strong className="text-gray-700">{prices.childBed?.toLocaleString() || '-'}</strong></div>
                      <div>เด็ก (ไม่มีเตียง): <strong className="text-gray-700">{prices.childNoBed?.toLocaleString() || '-'}</strong></div>
                      <div className="flex-1 text-right text-rt-blue font-medium cursor-pointer hover:underline" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRound({ ...round, price: prices });
                        setBookingDetails(prev => ({ ...prev, contactName: round.head || '' }));
                        setBookingPaxList(allPaxForRound);
                        setSelectedPaxForBooking(allPaxForRound.filter(p => p.paymentStatus !== 'paid').map(p => p.id));
                        setBookingStep(3);
                      }}>คลิกเพื่อเลือกรอบนี้ →</div>
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

        {bookingStep === 3 && selectedRound && (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100/50 p-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setBookingStep(2)}
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-rt-blue/10 hover:text-rt-blue transition-all duration-300"
                >
                  <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                  <h2 className="font-black text-2xl text-gray-800 tracking-tight">ข้อมูลผู้เดินทาง</h2>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold">รอบเดินทาง: {selectedRound.date}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">ราคาเริ่มต้น: <span className="font-black text-rt-blue">฿{(selectedRound.price?.adultTwin || 0).toLocaleString()}</span></span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 relative">
                {/* Add Customer Button - Opens Modal */}
                <button
                  onClick={() => {
                    setBookingAddMode(null);
                    setCurrentGroupName('');
                    setCustomerSearchTerm('');
                    setShowBookingTypeModal(true);
                  }}
                  className="bg-rt-blue text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-rt-dark hover:shadow-glow-blue transition-all duration-500 transform hover:-translate-y-0.5 shadow-soft"
                >
                  <Plus size={18} strokeWidth={3} /> เพิ่มลูกค้า
                </button>
              </div>
            </div>

            {/* === สรุปสถานะการชำระเงิน (Dynamic Calculation) === */}
            {(() => {
              const getPaxStatus = (p: Passenger) => {
                if (!p || !selectedRound) return 'pending';
                const total = selectedRound.price?.[p.roomType || 'adultTwin'] || 0;
                const paid = p.paidAmount || 0;

                // Priority 1: Check Paid
                if (p.paymentStatus === 'paid') return 'paid';
                if (paid >= (total - 1) && total > 0) return 'paid';

                // Priority 2: Check Partial - MUST have paid amount > 0
                if (paid > 0) return 'partial';

                return 'pending';
              };

              const summary = {
                paid: bookingPaxList.filter(p => getPaxStatus(p) === 'paid').length,
                pending: bookingPaxList.filter(p => getPaxStatus(p) === 'pending').length,
                partial: bookingPaxList.filter(p => getPaxStatus(p) === 'partial').length,
              };

              return (
                <div className="glass-subtle rounded-2xl p-5 mb-6 border border-white/40 shadow-soft relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rt-blue/20 flex items-center justify-center border border-white/50 shadow-sm">
                        <LineChart size={24} className="text-rt-blue" />
                      </div>
                      <div>
                        <span className="font-black text-gray-800 text-lg block">สรุปสถานะการชำระเงิน</span>
                        <span className="text-xs text-gray-500 font-medium">รวมทั้งหมด {bookingPaxList.length} รายการในบุ๊คกิ้งนี้</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Paid */}
                      <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-rt-mint/10 border border-rt-mint/20 min-w-[100px]">
                        <span className="text-[10px] font-bold text-rt-mint uppercase tracking-wider mb-1">ชำระแล้ว</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-rt-mint" />
                          <span className="text-lg font-black text-rt-mint">{summary.paid}</span>
                        </div>
                      </div>

                      {/* Pending */}
                      <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 min-w-[100px] shadow-sm">
                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">รอชำระ</span>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-orange-500" />
                          <span className="text-lg font-black text-orange-600">{summary.pending}</span>
                        </div>
                      </div>

                      {/* Partial */}
                      <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-rt-yellow/10 border border-rt-yellow/20 min-w-[100px]">
                        <span className="text-[10px] font-bold text-rt-yellow/90 uppercase tracking-wider mb-1">บางส่วน</span>
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-rt-yellow" />
                          <span className="text-lg font-black text-rt-yellow">{summary.partial}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Booking Customization Area - New Modern Look */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-5">
                <div className="flex items-center gap-2 mb-1">
                  <Settings size={18} className="text-rt-blue" />
                  <h3 className="font-bold text-gray-700 text-sm">การตั้งค่าบุ๊คกิ้ง</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">OP Staff ผู้ดูแล</label>
                    <div className="relative group">
                      <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rt-blue transition-colors" />
                      <select
                        className={`w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm bg-gray-50/50 focus:bg-white transition-all appearance-none outline-none ${currentUser.role !== 'MANAGER' ? 'text-gray-500 cursor-not-allowed' : 'hover:border-rt-blue/30 focus:border-rt-blue focus:ring-4 focus:ring-rt-blue/5'}`}
                        value={bookingDetails.contactName}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, contactName: e.target.value })}
                        disabled={currentUser.role !== 'MANAGER'}
                      >
                        <option value="">เลือกพนักงานผู้ดูแล</option>
                        {appUsers.filter(u => u.role !== 'GUIDE').map(u => (
                          <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">รหัสทัวร์ (Reference)</label>
                    <div className="relative group">
                      <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rt-blue transition-colors" />
                      <input
                        type="text"
                        className="w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm bg-gray-50/50 focus:bg-white transition-all font-mono uppercase hover:border-rt-blue/30 focus:border-rt-blue focus:ring-4 focus:ring-rt-blue/5 outline-none"
                        placeholder="e.g. RNAT250662"
                        value={bookingDetails.tourCode}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, tourCode: e.target.value.toUpperCase() })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">หมายเหตุ / บันทึกภายใน</label>
                  <div className="relative group">
                    <StickyNote size={16} className="absolute left-3 top-3 text-gray-400 group-focus-within:text-rt-blue transition-colors" />
                    <textarea
                      rows={1}
                      className="w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm bg-gray-50/50 focus:bg-white transition-all hover:border-rt-blue/30 focus:border-rt-blue focus:ring-4 focus:ring-rt-blue/5 outline-none"
                      placeholder="เช่น ขอมัดจำ 50%, แพ้อาหาร, สมาชิกระดับ VIP..."
                      value={bookingDetails.specialRequest}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, specialRequest: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="lg:col-span-4 bg-rt-dark p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Plane size={140} />
                </div>
                <div className="relative z-10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">สถานะรอบเดินทาง</div>
                  <div className="font-black text-xl mb-4">{selectedRound.airline} - {selectedRound.date}</div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/70">ที่นั่งทั้งหมด</span>
                      <span className="font-bold">{selectedRound.seats}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/70">ยอดขายปัจจุบัน</span>
                      <span className="font-bold">{selectedRound.sold}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20 mt-4 relative z-10">
                  <div className="text-[10px] text-white/60 uppercase font-black tracking-widest">สถานะการอนุมัติ</div>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedRound.approved ? (
                      <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/10">
                        <CheckCircle size={14} /> อนุมัติแล้ว
                      </span>
                    ) : (
                      <span className="bg-amber-500/30 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-amber-500/20">
                        <Clock size={14} /> รอพิจารณา
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State - Show when no passengers added */}
            {bookingPaxList.length === 0 && !bookingAddMode && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed mb-4">
                <Users size={40} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">ยังไม่มีลูกค้าในรายการจอง</p>
                <p className="text-sm text-gray-400">กดปุ่ม "เพิ่มลูกค้า" ด้านบนเพื่อเริ่มต้น</p>
              </div>
            )}



            {/* === PASSENGER TABLE AREA (DESIGN FROM IMAGE 2) === */}
            <div className="space-y-6 mt-6">
              {/* Individual Passengers Section */}
              {(() => {
                const indivPax = bookingPaxList.filter(p => !p.groupId);
                if (indivPax.length === 0) return null;

                return (
                  <div className="border border-blue-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-blue-50/50 px-5 py-3 border-b border-blue-100 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-blue-800 font-bold">
                        <UserIcon size={18} />
                        <span>รายชื่อลูกค้าเดี่ยว ({indivPax.length} ท่าน)</span>
                      </div>
                      <div className="text-[10px] text-blue-500 font-bold">เลือกได้ทีละ 1 รายการเท่านั้น</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50/50 text-gray-400 border-b border-gray-100">
                            <th className="px-4 py-3 w-10"></th>
                            <th className="px-4 py-3 w-10 text-center font-bold">#</th>
                            <th className="px-4 py-3 font-bold">ชื่อ-นามสกุล</th>
                            <th className="px-4 py-3 font-bold">ประเภทห้อง</th>
                            <th className="px-4 py-3 font-bold">หมายเหตุ</th>
                            <th className="px-4 py-3 font-bold text-right">ยอดจอง</th>
                            <th className="px-4 py-3 font-bold text-right">ค้างชำระ</th>
                            <th className="px-4 py-3 font-bold text-center">สถานะ</th>
                            <th className="px-4 py-3 font-bold text-center">วันที่ชำระ</th>
                            <th className="px-4 py-3 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {indivPax.map((pax, idx) => {
                            if (!pax) return null;
                            const total = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                            // Fix: if status is paid but amount is 0 (legacy data), treat as full paid
                            const paid = pax.paidAmount || (pax.paymentStatus === 'paid' ? total : 0);
                            const balance = total - paid;
                            const isSelected = selectedPaxForBooking.includes(pax.id);

                            // Status tag logic
                            let statusText = 'รอชำระ';
                            let statusClass = 'bg-orange-100 text-orange-600';

                            const isPaid = (pax.paymentStatus === 'paid') || (paid >= total && total > 0);
                            const isPartial = !isPaid && (paid > 0);

                            if (isPaid) {
                              statusText = 'ชำระแล้ว';
                              statusClass = 'bg-green-100 text-green-600';
                            } else if (isPartial) {
                              statusText = 'บางส่วน';
                              statusClass = 'bg-yellow-100 text-yellow-600';
                            }

                            return (
                              <tr key={pax.id} className={`hover:bg-blue-50/30 transition-colors ${isSelected ? 'bg-blue-50/50' : ''}`}>
                                <td className="px-4 py-3">
                                  <div
                                    onClick={() => setSelectedPaxForBooking([pax.id])}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'}`}
                                  >
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-400 font-medium">{idx + 1}</td>
                                <td className="px-4 py-3">
                                  <div className="font-bold text-gray-800 uppercase">{pax.firstNameEn} {pax.lastNameEn}</div>
                                  <div className="text-[10px] text-gray-400 uppercase">{pax.passportNo || 'NO PASSPORT'}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <select
                                    className="bg-transparent border border-gray-200 rounded px-2 py-1 outline-none text-[11px] font-medium"
                                    value={pax.roomType || 'adultTwin'}
                                    onChange={(e) => setBookingPaxList(prev => prev.map(p => p.id === pax.id ? { ...p, roomType: e.target.value } : p))}
                                  >
                                    <option value="adultTwin">ผู้ใหญ่ (พักคู่)</option>
                                    <option value="adultSingle">ผู้ใหญ่ (พักเดี่ยว)</option>
                                    <option value="childBed">เด็ก (มีเตียง)</option>
                                    <option value="childNoBed">เด็ก (ไม่มีเตียง)</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="space-y-1">
                                    {pax.customerNote && (
                                      <div className="text-[10px] text-gray-400 italic">📌 {pax.customerNote}</div>
                                    )}
                                    <div className="flex items-center gap-1 text-[10px]">
                                      <Edit2 size={10} className="text-blue-400" />
                                      <input
                                        type="text"
                                        className="bg-transparent border-b border-gray-100 focus:border-blue-400 outline-none w-full"
                                        placeholder="เพิ่มหมายเหตุ..."
                                        value={pax.remark || ''}
                                        onChange={(e) => setBookingPaxList(prev => prev.map(p => p.id === pax.id ? { ...p, remark: e.target.value } : p))}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-blue-600">฿{total.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-bold text-rose-500">฿{balance.toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusClass}`}>{statusText}</span>
                                </td>
                                <td className="px-4 py-3 text-center text-gray-400 text-[10px] font-bold">-</td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => setBookingPaxList(prev => prev.filter(p => p.id !== pax.id))}
                                    className="text-gray-300 hover:text-rose-500 transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Group Section */}
              {selectedRound && bookingGroups
                .filter(g => g.roundId === selectedRound.id)
                .filter(group => {
                  // Only show groups that have members
                  const hasMembers = bookingPaxList.some(p =>
                    p.bookingType === 'group' &&
                    (p.groupName === group.name || (group.groupId && p.groupId === group.groupId))
                  );
                  return hasMembers;
                })
                .map(group => {
                  const groupMembers = bookingPaxList.filter(p =>
                    p.bookingType === 'group' &&
                    (p.groupName === group.name || (group.groupId && p.groupId === group.groupId))
                  );
                  const groupTotal = groupMembers.reduce((sum, p) => sum + (selectedRound.price?.[p.roomType || 'adultTwin'] || 0), 0);
                  const groupPaid = groupMembers.reduce((sum, p) => {
                    const pTotal = selectedRound.price?.[p.roomType || 'adultTwin'] || 0;
                    const pPaid = p.paidAmount || (p.paymentStatus === 'paid' ? pTotal : 0);
                    return sum + pPaid;
                  }, 0);
                  const groupBalance = groupTotal - groupPaid;
                  const isSelected = selectedPaxForBooking.includes(`group:${group.name}`);

                  return (
                    <div key={group.groupId || group.name} className="border border-purple-200 rounded-xl overflow-hidden bg-white shadow-sm">
                      <div className="bg-purple-50/50 px-5 py-3 border-b border-purple-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => setSelectedPaxForBooking([`group:${group.name}`])}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'}`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="flex items-center gap-2 text-purple-800 font-bold">
                            <Users size={18} />
                            <span>กลุ่ม: {group.name}</span>
                            <span className="text-[10px] text-purple-500 font-normal">({groupMembers.length} ท่าน)</span>
                            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold">รอชำระ</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] font-bold">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 uppercase">ยอดจอง:</span>
                            <span className="text-gray-700">฿{groupTotal.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 uppercase">ค้างชำระ:</span>
                            <span className="text-rose-500">฿{groupBalance.toLocaleString()}</span>
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm(`ยืนยันการลบกลุ่ม "${group.name}" และผู้เดินทางทั้งหมดในกลุ่ม?`)) {
                                setBookingGroups(prev => prev.filter(g => g.name !== group.name && g.groupId !== group.groupId));
                                setBookingPaxList(prev => prev.filter(p => p.groupName !== group.name && p.groupId !== group.groupId));
                                setSelectedPaxForBooking(prev => prev.filter(id => id !== `group:${group.name}`));
                              }
                            }}
                            className="text-gray-300 hover:text-rose-500 ml-2"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50/30 text-gray-400 border-b border-gray-100">
                              <th className="px-4 py-2 w-10 text-center font-bold">#</th>
                              <th className="px-4 py-2 font-bold">ชื่อ-นามสกุล</th>
                              <th className="px-4 py-2 font-bold">ประเภทห้อง</th>
                              <th className="px-4 py-2 font-bold">หมายเหตุ</th>
                              <th className="px-4 py-2 font-bold text-right">ยอดจอง</th>
                              <th className="px-4 py-2 w-10"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {groupMembers.map((pax, idx) => {
                              const total = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                              return (
                                <tr key={pax.id} className="hover:bg-purple-50/10">
                                  <td className="px-4 py-2.5 text-center text-gray-400 font-medium">{idx + 1}</td>
                                  <td className="px-4 py-2.5">
                                    <div className="font-bold text-gray-800 uppercase">{pax.firstNameEn} {pax.lastNameEn}</div>
                                    <div className="text-[10px] text-gray-400 uppercase">{pax.passportNo || 'AA1234567'}</div>
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <select
                                      className="bg-transparent border border-gray-100 rounded px-2 py-1 outline-none text-[11px] font-medium"
                                      value={pax.roomType || 'adultTwin'}
                                      onChange={(e) => setBookingPaxList(prev => prev.map(p => p.id === pax.id ? { ...p, roomType: e.target.value } : p))}
                                    >
                                      <option value="adultTwin">ผู้ใหญ่ (พักคู่)</option>
                                      <option value="adultSingle">ผู้ใหญ่ (พักเดี่ยว)</option>
                                    </select>
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <div className="space-y-1">
                                      <div className="text-[10px] text-gray-400 italic">💬 {pax.customerNote || 'ไม่มีหมายเหตุความต้องการพิเศษ'}</div>
                                      <div className="flex items-center gap-1 text-[10px]">
                                        <Edit2 size={10} className="text-purple-400" />
                                        <input
                                          type="text"
                                          className="bg-transparent border-b border-gray-100 focus:border-purple-400 outline-none w-full"
                                          placeholder="เพิ่มหมายเหตุ..."
                                          value={pax.remark || ''}
                                          onChange={(e) => setBookingPaxList(prev => prev.map(p => p.id === pax.id ? { ...p, remark: e.target.value } : p))}
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-bold text-gray-700">฿{total.toLocaleString()}</td>
                                  <td className="px-4 py-2.5 text-center">
                                    <button
                                      onClick={() => setBookingPaxList(prev => prev.filter(p => p.id !== pax.id))}
                                      className="text-gray-200 hover:text-rose-500 transition-colors"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}

              {/* Summary Bottom Bar */}
              <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div className="text-xl font-black text-rt-blue uppercase tracking-tight">
                  ยอดรวมโดยประมาณ:
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-4xl font-black text-rt-blue drop-shadow-sm">
                    ฿{(selectedPaxForBooking.reduce((sum: number, selId: number | string) => {
                      if (String(selId).startsWith('group:')) {
                        const gName = String(selId).split(':')[1];
                        const group = bookingGroups.find(g => g.name === gName);
                        if (!group) return sum;

                        const gMembers = bookingPaxList.filter(p =>
                          p.groupName === gName ||
                          (group.id && p.groupId === group.id) ||
                          (group.groupId && p.groupId === group.groupId)
                        );

                        return sum + gMembers.reduce((gSum, pax) => {
                          const total = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                          const paid = pax.paidAmount || 0;
                          return gSum + (total - paid);
                        }, 0);
                      }
                      const pax = bookingPaxList.find(c => c.id === selId);
                      if (!pax) return sum;
                      const total = selectedRound.price?.[pax.roomType || 'adultTwin'] || 0;
                      const paid = pax.paidAmount || 0;
                      return sum + (total - paid);
                    }, 0)).toLocaleString()}
                  </div>
                  <button
                    className="mt-6 px-16 py-4 bg-rt-blue text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-rt-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-blue-200"
                    disabled={selectedPaxForBooking.length === 0}
                    onClick={() => setIsBookingConfirmationModalOpen(true)}
                  >
                    ดำเนินการวางบิล
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
                onClick={() => setOperationTab(tab.key as OperationTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${operationTab === tab.key
                  ? 'bg-rt-blue text-white shadow-sm'
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
                        <div className="bg-[#d9edf4] text-[#0174aa] px-2 py-1 rounded text-xs font-bold">{route?.code}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isFull ? 'bg-amber-100 text-amber-700 border border-amber-200' : round.status === 'Completed' ? 'bg-gray-100 text-gray-600 border border-gray-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                          {round.status === 'Selling' ? 'เปิดจอง' : round.status === 'Full' ? 'เต็ม' : round.status === 'Completed' ? 'เสร็จสิ้น' : round.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-[#0174aa] transition">{route?.name}</h3>
                      <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                        <Calendar size={14} /> {round.date}
                      </div>
                    </div>
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">ผู้ดูแล:</span>
                        <span className={`font-medium ${round.head === 'Unassigned' ? 'text-[#008ac5] italic' : 'text-gray-800'}`}>{round.head}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">ที่นั่ง:</span>
                        {(() => {
                          const paxPercent = (round.sold / (round.seats || 1)) * 100;
                          let colors = 'bg-rose-50 text-rose-600 border border-rose-100'; // Low
                          if (paxPercent >= 100) colors = 'bg-emerald-50 text-emerald-600 border border-emerald-100'; // Full
                          else if (paxPercent >= 40) colors = 'bg-amber-50 text-amber-600 border border-amber-100'; // Medium
                          return (
                            <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${colors}`}>
                              {round.sold}/{round.seats}
                            </span>
                          );
                        })()}
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
                          <div className={`h-1.5 rounded-full ${progress > 80 ? 'bg-[#16809a]' : 'bg-[#fdcf1a]'}`} style={{ width: `${progress}%` }}></div>
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
          <AlertTriangle size={48} className="text-[#008ac5]" />
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
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-all duration-300 shadow-md shadow-slate-200 active:scale-95"
              >
                <ShieldCheck size={18} /> อนุมัติทัวร์นี้
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

        {/* === MODERN COMPACT STATUS STRIP === */}
        {(() => {
          const ticketCount = Object.values(paxTaskStatus).filter(t => t.ticket?.checked).length;
          const prepDocCount = Object.values(paxTaskStatus).filter(t => t.prepDoc?.checked).length;
          const totalPax = paxList.length;
          const ticketPercent = totalPax > 0 ? Math.round((ticketCount / totalPax) * 100) : 0;
          const prepPercent = totalPax > 0 ? Math.round((prepDocCount / totalPax) * 100) : 0;

          const birthdayPax = paxList.filter(p => {
            if (!p.dob) return false;
            const dobMonth = new Date(p.dob).getMonth();
            const tourMonth = selectedOpRound.date?.split(' ')[1]?.toLowerCase();
            const monthMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
            return dobMonth === monthMap[tourMonth?.slice(0, 3)?.toLowerCase()];
          });
          const foreignerCount = paxList.filter(p => p.nationality !== 'THAI').length;

          return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 mb-4 flex flex-wrap items-center gap-4">
              {/* ตั๋วเครื่องบิน - Mini */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${ticketPercent === 100 ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'}`}>
                  {ticketPercent}%
                </div>
                <div className="flex items-center gap-1.5">
                  <Plane size={14} className={ticketPercent === 100 ? 'text-sky-500' : 'text-rose-500'} />
                  <span className="text-sm font-medium text-gray-700">ตั๋วบิน</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ticketPercent === 100 ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>{ticketCount}/{totalPax}</span>
                </div>
              </div>

              {/* ใบเตรียมตัว - Mini */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${prepPercent === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {prepPercent}%
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText size={14} className={prepPercent === 100 ? 'text-emerald-500' : 'text-amber-500'} />
                  <span className="text-sm font-medium text-gray-700">ใบเตรียมตัว</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${prepPercent === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{prepDocCount}/{totalPax}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

              {/* วันเกิด - Compact */}
              {birthdayPax.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 cursor-pointer group" title={birthdayPax.map(p => `${p.firstNameTh || p.firstNameEn} ${p.lastNameTh || p.lastNameEn}`).join(', ')}>
                  <Gift size={14} className="text-pink-500" />
                  <span className="text-sm font-medium text-pink-700">🎂 {birthdayPax.length} ท่าน</span>
                  <div className="hidden group-hover:flex gap-1 animate-fade-in">
                    {birthdayPax.slice(0, 2).map((p, i) => (
                      <span key={i} className="text-xs bg-white px-1.5 py-0.5 rounded border border-pink-200 text-pink-600 font-medium">{p.firstNameTh || p.firstNameEn} {p.lastNameTh || p.lastNameEn}</span>
                    ))}
                    {birthdayPax.length > 2 && <span className="text-xs text-pink-500">+{birthdayPax.length - 2}</span>}
                  </div>
                </div>
              )}

              {/* ต่างชาติ - Compact */}
              {foreignerCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100">
                  <Globe size={14} className="text-orange-500" />
                  <span className="text-sm font-medium text-orange-700">⚠️ ต่างชาติ {foreignerCount}</span>
                </div>
              )}

              {/* Overall Progress - Right aligned */}
              <div className="ml-auto flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">ภาพรวม</div>
                  <div className="text-lg font-black text-[#008ac5]">{operationProgress.percent}%</div>
                </div>
                <div className="relative w-10 h-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-100" />
                    <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-[#008ac5]" strokeDasharray={100.5} strokeDashoffset={100.5 * (1 - operationProgress.percent / 100)} strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })()}


        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          <div className="lg:col-span-1 space-y-4">
            {/* 1. OP Staff Section - ย้ายขึ้นมาบนสุด */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <UserCheck size={18} className="text-[#008ac5]" /> OP Staff ผู้ดูแล
              </h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#008ac5] rounded-full flex items-center justify-center text-white font-bold">
                  {selectedOpRound.head?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{selectedOpRound.head}</p>
                  <p className="text-xs text-gray-500">ผู้รับผิดชอบเอกสาร</p>
                </div>
              </div>
              {isManager && (
                <button className="mt-3 w-full text-xs bg-gray-100 text-gray-600 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-200 transition">
                  เปลี่ยน OP Staff
                </button>
              )}
            </div>

            {/* 2. ความคืบหน้าภาพรวม */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 text-sm">ความคืบหน้าภาพรวม</h3>
                <span className="text-xl font-black text-[#008ac5]">{operationProgress.percent}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
                <div
                  className="bg-[#008ac5] h-full rounded-full transition-all duration-700"
                  style={{ width: `${operationProgress.percent}%` }}
                ></div>
              </div>
              <div className="space-y-2">
                {INDIVIDUAL_TASKS.map(task => (
                  <div key={task.key} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <task.icon size={14} className={task.color} />
                      <span className="text-gray-600">{task.label}</span>
                    </div>
                    <span className="font-bold text-gray-700">
                      {operationProgress.breakdown[task.key]}/{operationProgress.paxCount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Tour Guide Section - ปรับสีใหม่ให้อ่านง่าย */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Users size={18} className="text-purple-500" /> ไกด์ / หัวหน้าทัวร์
              </h3>

              {/* แสดงชื่อไกด์ */}
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedOpRound.guide?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{selectedOpRound.guide || 'ยังไม่กำหนด'}</p>
                  <p className="text-xs text-gray-500">ไกด์นำเที่ยว</p>
                </div>
              </div>

              {/* Dropdown เฉพาะ Manager */}
              {isManager ? (
                <select
                  className="text-sm bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-200 w-full outline-none focus:border-purple-400 mb-3"
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
              ) : (
                <p className="text-xs text-gray-400 mb-3">ดูได้อย่างเดียว (Manager เท่านั้นที่สามารถเปลี่ยนได้)</p>
              )}

              {/* Guide Checkboxes - ถ้ามีไกด์แล้ว */}
              {selectedOpRound.guideId && (() => {
                // ผู้ที่สามารถใช้งาน checkbox ได้: Manager, OP Staff (Head), หรือ ไกด์ที่ถูกกำหนด
                const canEditGuideTask = isManager || currentUser.id === selectedOpRound.headId || currentUser.id === selectedOpRound.guideId;

                return (
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-xs text-gray-400 font-medium mb-2">เอกสารที่ส่งมอบแล้ว:</p>
                    <div
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${guideTaskStatus[selectedOpRound.id]?.ticket ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'} ${canEditGuideTask ? 'cursor-pointer hover:border-gray-300' : ''}`}
                      onClick={() => canEditGuideTask && toggleGuideTask(selectedOpRound.id, 'ticket')}
                    >
                      <div className="flex items-center gap-2">
                        <Plane size={14} className={guideTaskStatus[selectedOpRound.id]?.ticket ? 'text-green-600' : 'text-gray-400'} />
                        <span className={`text-sm ${guideTaskStatus[selectedOpRound.id]?.ticket ? 'text-green-700 font-medium' : 'text-gray-600'}`}>ตั๋วเครื่องบิน</span>
                      </div>
                      {guideTaskStatus[selectedOpRound.id]?.ticket ? <CheckSquare size={18} className="text-green-600" /> : <Square size={18} className="text-gray-300" />}
                    </div>
                    <div
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${guideTaskStatus[selectedOpRound.id]?.hotel ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'} ${canEditGuideTask ? 'cursor-pointer hover:border-gray-300' : ''}`}
                      onClick={() => canEditGuideTask && toggleGuideTask(selectedOpRound.id, 'hotel')}
                    >
                      <div className="flex items-center gap-2">
                        <Bed size={14} className={guideTaskStatus[selectedOpRound.id]?.hotel ? 'text-green-600' : 'text-gray-400'} />
                        <span className={`text-sm ${guideTaskStatus[selectedOpRound.id]?.hotel ? 'text-green-700 font-medium' : 'text-gray-600'}`}>ที่พัก / โรงแรม</span>
                      </div>
                      {guideTaskStatus[selectedOpRound.id]?.hotel ? <CheckSquare size={18} className="text-green-600" /> : <Square size={18} className="text-gray-300" />}
                    </div>
                    {!canEditGuideTask && (
                      <p className="text-[10px] text-gray-400 text-center mt-2">เฉพาะ Manager, OP Staff หรือ ไกด์ที่ถูกกำหนด เท่านั้นที่แก้ไขได้</p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 4. Travel Prep Document - เฉพาะ Manager/Head เท่านั้น */}
            {(isManager || currentUser.id === selectedOpRound.headId) && (
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-orange-500" /> ใบเตรียมตัวการเดินทาง
                </h3>

                {selectedOpRound.prepDocument ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">{selectedOpRound.prepDocument}</p>
                          <p className="text-xs text-green-600">อัปโหลดแล้ว</p>
                        </div>
                      </div>
                      <button
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 flex items-center gap-1"
                        onClick={() => alert(`กำลังดาวน์โหลด: ${selectedOpRound.prepDocument}`)}
                      >
                        <Download size={14} /> ดาวน์โหลด
                      </button>
                    </div>
                    <label className="block text-center text-xs text-gray-500 hover:text-[#008ac5] cursor-pointer">
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
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                      <FileText size={28} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">ยังไม่มีใบเตรียมตัว</p>
                    </div>
                    <label className="block w-full bg-rt-blue text-white py-2 rounded-lg text-sm font-bold hover:bg-rt-dark cursor-pointer text-center transition">
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
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-base">รายชื่อลูกทัวร์ & สถานะเอกสาร ({paxList.length} ท่าน)</h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="ค้นหา..." className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-full text-sm outline-none focus:border-[#6bc8e9]" />
              </div>
            </div>
            <div className="overflow-auto flex-1 p-2">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10 text-sm">
                  <tr className="border-b border-gray-200/50">
                    <th className="px-3 py-3.5 w-12 text-center font-semibold">#</th>
                    <th className="px-4 py-3.5 min-w-[280px] text-left font-semibold">ชื่อ-นามสกุล</th>
                    <th className="px-4 py-3.5 min-w-[220px] text-left font-semibold">หมายเหตุ</th>
                    {INDIVIDUAL_TASKS.map((task, idx) => (
                      <th key={task.key} className={`px-2 py-3 text-center w-20 text-xs ${idx === 0 ? 'border-l border-gray-200' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                          <span>{task.label}</span>
                          {task.key === 'insurance' && (
                            <button
                              onClick={() => toggleAllTask('insurance')}
                              className={`text-[9px] px-2 py-0.5 rounded-full border ${paxList.every(pax => paxTaskStatus[pax.id]?.insurance?.checked)
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-white text-gray-400 border-gray-200'}`}
                            >
                              {paxList.every(pax => paxTaskStatus[pax.id]?.insurance?.checked) ? 'ALL ✓' : 'ALL'}
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-3 text-center w-16 text-xs border-l border-gray-200">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">{paxList.map((pax, index) => (
                  <tr key={pax.uniqueId || pax.id} className={`hover:bg-blue-50/30 transition-colors ${pax.nationality !== 'THAI' ? 'bg-orange-50/30 border-l-4 border-orange-400' : ''}`}>
                    <td className="px-3 py-4 text-center font-bold text-gray-500 text-sm">{index + 1}</td>
                    {/* ชื่อ - เน้นขนาดใหญ่ */}
                    <td className="px-4 py-4">
                      <div className="cursor-pointer" onClick={() => openCustomerForm(pax)}>
                        {/* ชื่อภาษาไทย - ขนาดใหญ่ */}
                        {pax.firstNameTh && (
                          <div className="text-base font-bold text-gray-800 hover:text-[#008ac5] transition-colors flex items-center gap-2">
                            {pax.firstNameTh} {pax.lastNameTh}
                            {pax.nationality !== 'THAI' && (
                              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                <Globe size={12} /> {pax.nationality}
                              </span>
                            )}
                          </div>
                        )}
                        {/* ชื่อภาษาอังกฤษ */}
                        <div className={`${pax.firstNameTh ? 'text-sm text-gray-500' : 'text-base font-bold text-gray-800 hover:text-[#008ac5]'} flex items-center gap-2`}>
                          {pax.firstNameEn} {pax.lastNameEn}
                          {!pax.firstNameTh && pax.nationality !== 'THAI' && (
                            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                              <Globe size={12} /> {pax.nationality}
                            </span>
                          )}
                        </div>
                        {/* Passport */}
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{pax.passportNo || 'N/A'}</div>
                      </div>
                    </td>
                    {/* หมายเหตุ - ขนาดใหญ่ขึ้น */}
                    <td className="px-4 py-4">
                      <div className="space-y-2 max-w-[250px]">
                        {/* หมายเหตุจากฐานข้อมูล */}
                        {pax.customerNote && (
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
                            <Pin size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-amber-800 font-medium leading-relaxed">{pax.customerNote}</span>
                          </div>
                        )}
                        {/* หมายเหตุเฉพาะทริป */}
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 border border-blue-100">
                          <Edit2 size={14} className="text-[#008ac5] mt-0.5 flex-shrink-0" />
                          <textarea
                            className="w-full bg-transparent text-sm text-gray-700 outline-none font-medium leading-relaxed resize-none min-h-[24px]"
                            placeholder="หมายเหตุเฉพาะทริปนี้..."
                            rows={1}
                            value={pax.remark || ''}
                            onChange={(e) => {
                              const newVal = e.target.value;
                              setBookings(prev => prev.map(b => b.id === pax.bookingId ? {
                                ...b,
                                pax: b.pax.map(px => px.id === pax.id ? { ...px, remark: newVal } : px)
                              } : b));
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    {
                      INDIVIDUAL_TASKS.map(task => {
                        const status = paxTaskStatus[pax.id]?.[task.key] || { checked: false, file: null };
                        const isChildPax = isChild(pax.dob);

                        // Render Child Cert Button for passport column if child
                        if (task.key === 'passport' && isChildPax) {
                          const birthCertFile = pax.attachments?.birthCert || status.file;
                          return (
                            <td key={task.key} className="px-2 py-3 text-center relative">
                              <button
                                onClick={() => togglePaxTask(pax.id, task.key)}
                                className={`flex flex-col items-center justify-center p-1.5 rounded transition-colors group relative ${status.checked ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-500'}`}
                              >
                                {status.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                                <span className="text-[10px] uppercase font-bold mt-0.5 text-pink-600">Birth Cert</span>
                              </button>
                              {/* File attachment indicator - clickable to open file */}
                              {birthCertFile && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.alert(`📄 เปิดไฟล์สูติบัตร: ${birthCertFile}\n\n(ในระบบจริงจะเปิดดูไฟล์ PDF/รูปภาพ)`);
                                  }}
                                  className="absolute top-1 right-2 w-5 h-5 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-600 hover:scale-110 transition-all"
                                  title={`ดูสูติบัตร: ${birthCertFile}`}
                                >
                                  <FileText size={10} />
                                </button>
                              )}
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
                              <div className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${isPaid ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : isPartial ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                {isPaid ? <CheckCircle size={12} /> : isPartial ? <Clock size={12} /> : <XCircle size={12} />}
                                {isPaid ? 'ชำระครบ' : isPartial ? 'มัดจำแล้ว' : 'รอชำระ'}
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
                            <button onClick={() => window.confirm(`Remove ${pax.firstNameEn} from this tour?`) && alert("Removed (Mock)")} className="hover:text-[#008ac5]"><Trash2 size={16} /></button>
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
              {/* Mock Tag Preview Content */}
              <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center"><h3 className="font-bold flex items-center gap-2"><Printer size={18} /> ตัวอย่างพิมพ์: ป้ายติดกระเป๋า</h3><button onClick={() => setShowTagPreview(false)}><X size={20} /></button></div>
              <div className="p-6 bg-gray-100 max-h-[60vh] overflow-y-auto"><div className="bg-white shadow-lg p-4 mx-auto w-full aspect-[1/1.414] text-xs flex flex-col gap-2"><div className="border-2 border-dashed border-gray-300 rounded p-2 flex flex-col bg-white"><div className="bg-[#0174aa] text-white text-center font-bold py-1">BJ-US | 12-16 OCT</div><div className="p-2"><div className="font-bold text-lg">MR. SOMCHAI JAIDEE</div><div className="text-gray-500">คุณ สมชาย ใจดี</div><div className="mt-2 flex items-center gap-2 font-bold"><span className="bg-gray-200 px-1 rounded">TG</span> TG614</div></div></div><div className="text-center text-gray-400 mt-4 italic">... Mock Tags ...</div></div></div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3"><button onClick={() => setShowTagPreview(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button><button className="px-4 py-2 bg-rt-blue text-white rounded-lg hover:bg-rt-dark flex items-center gap-2" onClick={() => alert("Printing sent to printer!")}><Printer size={16} /> สั่งพิมพ์ทันที</button></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUserFormModal = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
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
            <input type="text" className="w-full border p-2 rounded text-sm focus:border-[#008ac5] outline-none" value={userFormData.name} onChange={e => setUserFormData({ ...userFormData, name: e.target.value })} placeholder="เช่น สมชาย ใจดี" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">ตำแหน่ง (Role)</label>
            <select className="w-full border p-2 rounded text-sm focus:border-[#008ac5] outline-none bg-white" value={userFormData.role} onChange={e => setUserFormData({ ...userFormData, role: e.target.value as UserRole })}>
              <option value="SALE">Sale (ฝ่ายขาย)</option>
              <option value="MANAGER">Manager (ผู้จัดการ)</option>
              <option value="GUIDE">Guide (ไกด์/Ops)</option>
            </select>
          </div>
          {userFormData.role === 'SALE' && (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Commission Rank</label>
              <select
                className={`w-full border p-2 rounded text-sm focus:border-[#008ac5] outline-none bg-white font-bold ${commissionRanks.find(r => r.id === userFormData.commissionRank)?.color || 'text-gray-700'}`}
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
              setAppUsers(prev => prev.map(u => u.id === userFormData.id ? (userFormData as User) : u));
            } else {
              // Add new user
              const newUser = {
                ...userFormData,
                role: userFormData.role || 'SALE',
                id: Date.now()
              } as User;
              setAppUsers([...appUsers, newUser]);
            }
            setIsUserFormModalOpen(false);
          }} className="w-full bg-rt-blue text-white py-2 rounded-lg font-bold hover:bg-rt-dark transition shadow-lg mt-2">
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
          <Settings className="text-[#008ac5]" />
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
                className="bg-rt-blue text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#029bc4]"
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
                            className="p-1 text-gray-400 hover:text-[#008ac5] hover:bg-blue-50 rounded"
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
                  setBankFormData({ bank: '', accountName: '', accountNumber: '', branch: '', color: 'bg-blue-600', id: undefined });
                  setIsBankFormOpen(true);
                }}
                className="bg-rt-blue text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#029bc4]"
              >
                <Plus size={16} /> เพิ่มบัญชี
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bankAccounts.map(acc => (
                <div key={acc.id} className="border border-gray-200 rounded-xl p-4 flex items-start justify-between bg-gray-50 hover:border-[#008ac5] transition group">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-sm ${acc.color || 'bg-gray-400'}`}>
                      {acc.bank.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        {acc.bank}
                        <span className="text-xs font-normal text-gray-500 bg-white border px-1.5 rounded">{acc.branch}</span>
                      </h4>
                      <p className="font-mono font-bold text-[#0174aa] my-1 text-lg">{acc.accountNumber}</p>
                      <p className="text-xs text-gray-500">{acc.accountName}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setBankFormData(acc);
                        setIsBankFormOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#008ac5] hover:bg-white rounded-full transition"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
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
                  className="w-full border rounded px-3 py-2 text-sm font-mono font-bold text-[#0174aa]"
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
                  setBankAccounts(prev => prev.map(a => a.id === bankFormData.id ? (bankFormData as BankAccount) : a));
                } else {
                  setBankAccounts([...bankAccounts, { ...bankFormData, id: Date.now() } as BankAccount]);
                }
                setIsBankFormOpen(false);
              }} className="px-6 py-2 bg-rt-blue text-white rounded-lg font-bold hover:bg-rt-dark shadow-lg">บันทึกข้อมูล</button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Rank Modal */}
      {isRankModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
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
                  setCommissionRanks(ranks => ranks.map(r => r.id === rankFormData.id ? (rankFormData as CommissionRank) : r));
                } else {
                  const newRank = { ...rankFormData, id: commissionRanks.length > 0 ? Math.max(...commissionRanks.map(r => r.id)) + 1 : 1 } as CommissionRank;
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

    // Pending Verification Stats (for transfer slips)
    const getPendingVerifyStats = () => {
      const pending = receipts.filter(r => r.status === 'pending_verify');
      const total = pending.reduce((sum, r) => sum + r.receiptAmount, 0);
      return { count: pending.length, total };
    };

    const billingStats = getBillingStats();
    const receiptStats = getReceiptStats();
    const taxStats = getTaxStats();
    const pendingVerifyStats = getPendingVerifyStats();

    return (
      <div className="space-y-6 h-full flex flex-col animate-fade-in">
        <header className="mb-1 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">การชำระเงิน (Payments & Documents)</h1>
            <p className="text-sm text-gray-500">จัดการใบวางบิล, ใบเสร็จรับเงิน, และใบกำกับภาษี</p>
          </div>
        </header>

        {/* System Blue Theme Tabs */}
        <div className="flex gap-3 mb-2 border-b border-gray-100 pb-2">
          <button
            onClick={() => setPaymentSubTab('billing')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${paymentSubTab === 'billing' ? 'bg-[#d9edf4] text-[#008ac5]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText size={18} />
            1. ใบวางบิล ({billingStats.count})
          </button>
          <button
            onClick={() => setPaymentSubTab('receipt')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${paymentSubTab === 'receipt' ? 'bg-[#d9edf4] text-[#008ac5]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileCheck size={18} />
            2. ใบเสร็จรับเงิน ({receiptStats.count})
          </button>
          <button
            onClick={() => setPaymentSubTab('tax')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${paymentSubTab === 'tax' ? 'bg-[#d9edf4] text-[#008ac5]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ShieldCheck size={18} />
            3. ใบกำกับภาษี ({taxStats.count})
          </button>
          {/* Manager Only: Verification Tab */}
          {currentUser.role === 'MANAGER' && (
            <button
              onClick={() => setPaymentSubTab('pending')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 ${paymentSubTab === 'pending' ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:bg-gray-50'} ${pendingVerifyStats.count > 0 ? 'animate-pulse' : ''}`}
            >
              <Clock size={18} />
              ⏳ รอตรวจสอบสลิป ({pendingVerifyStats.count})
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex gap-6">
          <div className="flex-1 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block font-bold text-gray-700">
                {paymentSubTab === 'billing' ? 'รายการรอวางบิล' : paymentSubTab === 'receipt' ? 'ใบเสร็จรับเงินที่ออกแล้ว' : 'ใบกำกับภาษีที่ออกแล้ว'}
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
            <span className="text-3xl font-bold text-[#008ac5]">
              ฿{(paymentSubTab === 'billing' ? billingStats.total : paymentSubTab === 'receipt' ? receiptStats.total : taxStats.total).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Data Table - Tab Specific */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
          {/* Billing Notes Tab */}
          {paymentSubTab === 'billing' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 border-b border-gray-200/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">เลขที่ใบวางบิล</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ลูกค้า / กลุ่ม</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">ประเภท</th>
                  <th className="px-6 py-4 text-right font-semibold text-xs uppercase tracking-wider">ยอดวางบิล</th>
                  <th className="px-6 py-4 text-right font-semibold text-xs uppercase tracking-wider text-rt-mint">ชำระแล้ว</th>
                  <th className="px-6 py-4 text-right font-semibold text-xs uppercase tracking-wider text-orange-500">คงค้าง</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {billingNotes.map(bill => {
                  const route = routes.find(r => r.id === bill.routeId);
                  // paidSoFar = previousPaid + paidAmount (จากใบวางบิลนี้)
                  const paidFromBilling = bill.paidAmount || 0;
                  const totalPaid = (bill.previousPaid || 0) + paidFromBilling;
                  // remaining = billingAmount - paidAmount (ยอดคงค้างของใบวางบิลนี้)
                  const remaining = bill.billingAmount - paidFromBilling;

                  return (
                    <tr key={bill.id} className={`hover:bg-gray-50/80 transition-all duration-200 ${bill.status === 'paid' ? 'bg-rt-mint/5' : ''}`}>
                      <td className="px-6 py-4 font-mono font-bold text-rt-blue">{bill.id}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{bill.customerName}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${bill.billingType === 'group' ? 'bg-purple-100/80 text-purple-700' : 'bg-rt-light text-rt-dark'}`}>
                          {bill.billingType === 'group' ? 'กลุ่ม' : 'เดี่ยว'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-gray-600">฿{bill.billingAmount.toLocaleString()}</span>
                          {bill.isDeposit && (
                            <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 font-bold mt-1">
                              มัดจำ
                            </span>
                          )}
                        </div>
                      </td>
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
                          <button onClick={() => setViewingBillingNote(bill)} className="text-[#008ac5] hover:bg-[#d9edf4] px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition">
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
              <thead className="bg-gray-100 text-gray-600 border-b border-gray-200/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">เลขที่ใบเสร็จรับเงิน</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ลูกค้า</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">ช่องทาง</th>
                  <th className="px-6 py-4 text-right font-semibold text-xs uppercase tracking-wider text-rt-mint">จำนวนเงิน</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">วันที่</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {receipts.map(receipt => (
                  <tr key={receipt.id} className="hover:bg-gray-50/80 transition-all duration-200">
                    <td className="px-6 py-4 font-mono font-bold text-rt-blue">{receipt.id}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{receipt.customerName}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${receipt.paymentMethod === 'cash' ? 'bg-rt-mint/10 text-rt-mint' : receipt.paymentMethod === 'transfer' ? 'bg-rt-light text-rt-dark' : 'bg-purple-100/80 text-purple-700'}`}>
                        {receipt.paymentMethod === 'cash' ? 'เงินสด' : receipt.paymentMethod === 'transfer' ? 'โอนเงิน' : 'QR Code'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-rt-mint">฿{receipt.receiptAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">{receipt.createdAt}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${receipt.usedForTaxInvoice ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {receipt.usedForTaxInvoice ? 'ออกใบกำกับแล้ว' : 'ออกใบเสร็จรับเงินแล้ว'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => setViewingReceipt(receipt)} className="text-[#008ac5] hover:bg-[#d9edf4] px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition">
                          <Printer size={14} /> ออกใบเสร็จรับเงิน
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
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">ไม่มีรายการใบเสร็จรับเงิน</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* Tax Invoices Tab */}
          {paymentSubTab === 'tax' && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 border-b border-gray-200/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">เลขที่ใบกำกับภาษี</th>
                  <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ลูกค้า / บริษัท</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">เลขผู้เสียภาษี</th>
                  <th className="px-6 py-4 text-right font-semibold text-xs uppercase tracking-wider">ยอดรวม (รวม VAT)</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">วันที่ออก</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-4 text-center font-semibold text-xs uppercase tracking-wider">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50">
                {taxInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-all duration-200">
                    <td className="px-6 py-4 font-mono font-bold text-purple-600">{inv.runningNumber}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{inv.customerName}</td>
                    <td className="px-6 py-4 text-center font-mono text-gray-500">{inv.taxId}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-700">฿{inv.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">{inv.issuedAt}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${inv.status === 'issued' ? 'bg-rt-mint/10 text-rt-mint' : inv.status === 'cancelled' ? 'bg-red-100/80 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
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

          {/* Pending Verification Tab - Manager Only */}
          {paymentSubTab === 'pending' && currentUser.role === 'MANAGER' && (
            <div className="p-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                  <Clock size={18} /> สลิปที่รอตรวจสอบ
                </h3>
                <p className="text-sm text-amber-700">รายการสลิปโอนเงินจาก Sales ที่รอการตรวจสอบและอนุมัติ หลังอนุมัติยอดจะถูกบันทึกเข้าสู่ระบบ</p>
              </div>

              {receipts.filter(r => r.status === 'pending_verify').length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <CheckCircle size={48} className="mx-auto mb-4 text-green-300" />
                  <p className="font-bold">ไม่มีสลิปรอตรวจสอบ</p>
                  <p className="text-sm">รายการทั้งหมดได้รับการตรวจสอบแล้ว</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receipts.filter(r => r.status === 'pending_verify').map(receipt => {
                    const route = routes.find(r => r.id === receipt.routeId);
                    const round = rounds.find(r => r.id === receipt.roundId);
                    const bank = bankAccounts.find(b => b.id === receipt.bankAccountId);

                    return (
                      <div key={receipt.id} className="bg-white border-2 border-amber-200 rounded-xl p-5 hover:shadow-lg transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-[#008ac5]">{receipt.id}</span>
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">รอตรวจสอบ</span>
                            </div>
                            <p className="font-bold text-gray-800 text-lg">{receipt.customerName}</p>
                            <p className="text-sm text-gray-500">{route?.code} - {round?.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">ยอดโอน</p>
                            <p className="text-2xl font-bold text-amber-600">฿{receipt.receiptAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 bg-gray-50 p-3 rounded-lg text-sm">
                          <div>
                            <p className="text-xs text-gray-400 uppercase">ส่งโดย</p>
                            <p className="font-bold text-gray-700">{receipt.submittedByName || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase">วันที่ส่ง</p>
                            <p className="font-bold text-gray-700">{receipt.createdAt}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase">บัญชีปลายทาง</p>
                            <p className="font-bold text-gray-700">{bank?.bank || 'N/A'} - {bank?.accountNumber || ''}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase">ไฟล์สลิป</p>
                            <p className="font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => alert(`ดูสลิป: ${receipt.slipFileName || receipt.slipFile || 'ไม่มีไฟล์'}`)}>
                              📎 {receipt.slipFileName || 'ดูสลิป'}
                            </p>
                          </div>
                        </div>

                        {receipt.note && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-4 text-sm text-blue-700">
                            <strong>หมายเหตุจาก Sale:</strong> {receipt.note}
                          </div>
                        )}

                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              const reason = window.prompt('ระบุเหตุผลในการปฏิเสธ (ถ้ามี):');
                              if (reason !== null) {
                                setReceipts(prev => prev.map(r =>
                                  r.id === receipt.id
                                    ? { ...r, status: 'rejected', rejectionReason: reason, verifiedBy: currentUser.id, verifiedAt: new Date().toISOString().split('T')[0] }
                                    : r
                                ));
                                alert(`❌ ปฏิเสธสลิป ${receipt.id}\nเหตุผล: ${reason || 'ไม่ระบุ'}`);
                              }
                            }}
                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold text-sm hover:bg-red-100 transition flex items-center gap-2"
                          >
                            <XCircle size={16} /> ปฏิเสธ
                          </button>
                          <button
                            onClick={() => {
                              // Approve and update all related statuses
                              const paidAmount = receipt.receiptAmount;
                              const billingNote = billingNotes.find(b => b.id === receipt.billingNoteId);

                              // 1. Update receipt status to issued
                              setReceipts(prev => prev.map(r =>
                                r.id === receipt.id
                                  ? { ...r, status: 'issued', verifiedBy: currentUser.id, verifiedAt: new Date().toISOString().split('T')[0] }
                                  : r
                              ));

                              // 2. Update billing note if exists
                              if (billingNote) {
                                const existingPaid = billingNote.paidAmount || 0;
                                const totalPaidSoFar = existingPaid + paidAmount;
                                const remainingBalance = billingNote.billingAmount - totalPaidSoFar;
                                const newStatus = remainingBalance <= 0 ? 'paid' : 'partial';

                                setBillingNotes(prev => prev.map(b =>
                                  b.id === billingNote.id
                                    ? { ...b, status: newStatus, paidAmount: totalPaidSoFar, paidAt: new Date().toISOString().split('T')[0] }
                                    : b
                                ));

                                // 3. Update payment record
                                if (receipt.paymentId) {
                                  setPayments(prev => prev.map(p =>
                                    p.id === receipt.paymentId
                                      ? { ...p, paidAmount: (p.paidAmount || 0) + paidAmount, status: newStatus }
                                      : p
                                  ));
                                }

                                // 4. Update pax payment status
                                if (receipt.roundId && receipt.paxIds) {
                                  const paymentDate = new Date().toISOString().split('T')[0];
                                  const shareOfPaid = paidAmount / receipt.paxIds.length;
                                  const roundPrice = rounds.find(r => r.id === receipt.roundId)?.price || {};

                                  setBookings(prev => prev.map(booking => {
                                    if (booking.roundId === receipt.roundId) {
                                      return {
                                        ...booking,
                                        pax: booking.pax.map(p => {
                                          if (receipt.paxIds.includes(p.id)) {
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
                                        })
                                      };
                                    }
                                    return booking;
                                  }));

                                  // 5. Update bookingPaxList state (Crucial for UI consistency in Booking/Operations)
                                  setBookingPaxList(prev => prev.map(p => {
                                    if (receipt.paxIds.includes(p.id)) {
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

                                alert(`✅ อนุมัติสลิป ${receipt.id} เรียบร้อย!\n\nยอด: ฿${paidAmount.toLocaleString()}\nสถานะ: ${newStatus === 'paid' ? 'ชำระครบแล้ว' : 'ชำระบางส่วน'}`);
                              } else {
                                alert(`✅ อนุมัติสลิป ${receipt.id} เรียบร้อย!\nยอด: ฿${paidAmount.toLocaleString()}`);
                              }
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 transition flex items-center gap-2 shadow-md"
                          >
                            <CheckCircle size={16} /> อนุมัติสลิป
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        {
          viewingPaymentId && (() => {
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
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
                  <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2"><FileText size={20} /> รายละเอียดการชำระเงิน</h3>
                    <button onClick={() => setViewingPaymentId(null)}><X size={20} /></button>
                  </header>
                  <div className="p-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">เส้นทาง</div>
                        <div className="font-bold text-[#008ac5] text-lg">{route?.code || 'N/A'}</div>
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
                        <div className="font-bold text-[#16809a] text-xl">฿{payment?.paidAmount?.toLocaleString()}</div>
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
                                  <td className="px-3 py-2 text-right font-mono font-bold text-[#008ac5]">
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
                              <td className="px-3 py-2 text-right font-mono text-[#0174aa]">
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
                                setPaymentFormData(prev => ({ ...prev, method: e.target.value as any }));
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
                            <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#008ac5] hover:bg-blue-50 transition">
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
                            className="px-4 py-2 bg-[#16809a] text-white rounded-lg font-bold hover:bg-green-600 transition flex items-center gap-2"
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
          })()
        }

        {/* Billing Note Preview Modal */}
        {
          viewingBillingNote && !isCreatingReceipt && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in shadow-2xl">
              <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                <header className="bg-[#008ac5] text-white px-6 py-4 flex justify-between items-center flex-shrink-0">
                  <h3 className="font-bold text-lg flex items-center gap-2"><FileText size={20} /> ใบวางบิล (Billing Note)</h3>
                  <button onClick={() => setViewingBillingNote(null)} className="hover:bg-white/10 rounded-full p-1 transition"><X size={20} /></button>
                </header>

                <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
                  {/* Paper Container */}
                  <div className="bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-gray-200 w-full mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                      {/* Left Column: Company & Customer Info */}
                      <div className="lg:col-span-5 space-y-8 border-r border-gray-100 pr-0 lg:pr-10">
                        {/* Header Section */}
                        {(() => {
                          const roundForBill = rounds.find(r => r.id === viewingBillingNote.roundId);
                          const routeForBill = routes.find(r => r.id === roundForBill?.routeId);
                          return (
                            <div className="space-y-6">
                              <div>
                                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2 tracking-tight">บจก. รุ่งอนันต์ ทัวร์</h2>
                                <div className="text-sm text-gray-500 space-y-1">
                                  <p className="flex items-center gap-2">เลขที่เอกสาร: <span className="font-bold text-[#008ac5] select-all px-1.5 py-0.5 bg-blue-50 rounded">{viewingBillingNote.id}</span></p>
                                  <p className="flex items-center gap-2">วันที่ออก: <span className="font-medium text-gray-700">{viewingBillingNote.createdAt}</span></p>
                                </div>
                              </div>

                              <div className="bg-[#f0f9ff]/50 border border-[#bae6fd]/50 rounded-xl p-4">
                                <p className="text-[10px] text-[#0369a1] font-bold uppercase mb-2 tracking-widest">เส้นทางเดินทาง (Tour Route)</p>
                                <div className="flex items-center gap-3">
                                  <div className="bg-[#008ac5] text-white font-bold px-2 py-1 rounded text-xs">
                                    {routeForBill?.code || 'N/A'}
                                  </div>
                                  <p className="text-sm font-bold text-gray-800 truncate">{routeForBill?.name || '-'}</p>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-2 font-medium">รอบวันที่: {roundForBill?.date || '-'}</p>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Customer Section */}
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">ลูกค้า (Purchaser)</p>
                            <p className="font-bold text-gray-900 text-xl leading-tight">{viewingBillingNote.customerName}</p>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 opacity-70">เลขผู้เสียภาษี (Tax ID)</label>
                              <input
                                type="text"
                                className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008ac5]/20 focus:border-[#008ac5] px-3 py-2 transition-all outline-none font-mono"
                                placeholder="ระบุเลขผู้เสียภาษี..."
                                value={viewingBillingNote.customerTaxId || ''}
                                onChange={(e) => setViewingBillingNote({ ...viewingBillingNote, customerTaxId: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1.5 opacity-70">ที่อยู่จัดส่งเอกสาร (Billing Address)</label>
                              <textarea
                                className="w-full text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008ac5]/20 focus:border-[#008ac5] px-3 py-2 transition-all outline-none resize-none leading-relaxed"
                                style={{ minHeight: '80px' }}
                                placeholder="ระบุที่อยู่สำหรับใบวางบิล..."
                                value={viewingBillingNote.customerAddress || ''}
                                onChange={(e) => setViewingBillingNote({ ...viewingBillingNote, customerAddress: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Items, Totals & Payment */}
                      <div className="lg:col-span-7 space-y-6">

                        {/* Items Summary Table-style */}
                        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                            <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider">รายการ (Item Description)</h4>
                            <button
                              onClick={() => setViewingBillingNote({ ...viewingBillingNote, isDeposit: !viewingBillingNote.isDeposit })}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5 shadow-sm border ${viewingBillingNote.isDeposit ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}
                            >
                              {viewingBillingNote.isDeposit ? <CheckCircle size={10} /> : <Plus size={10} />}
                              {viewingBillingNote.isDeposit ? 'เฉพาะมัดจำ' : 'เปลี่ยนเป็นมัดจำ'}
                            </button>
                          </div>
                          <div className="p-6 bg-white flex justify-between items-start">
                            <div>
                              <p className="font-bold text-gray-800 text-lg">ค่าแพ็กเกจทัวร์ {viewingBillingNote.isDeposit ? '(มัดจำ)' : ''}</p>
                              <p className="text-xs text-gray-500 mt-2 flex items-center gap-2 font-medium bg-gray-50 px-2 py-1 rounded-md inline-flex">
                                <Users size={12} className="text-gray-400" /> จำนวน {viewingBillingNote.paxIds?.length || 0} ท่าน
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">จำนวนเงิน</p>
                              <p className="font-black text-gray-900 text-2xl">฿{viewingBillingNote.totalAmount.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="bg-white px-6 pb-6 pt-2 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">รวมเงินทั้งสิ้น (Subtotal)</span>
                              <span className="font-bold text-gray-700">฿{viewingBillingNote.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 font-medium">
                              <span className="text-green-600">หักชำระแล้ว (Less Paid Amount)</span>
                              <span className="text-green-600">(- ฿{viewingBillingNote.previousPaid.toLocaleString()})</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-black text-[#008ac5] pt-2">
                              <span className="flex flex-col">
                                <span>ยอดวางบิลสุทธิ</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Net Billing Amount</span>
                              </span>
                              <span className="text-3xl">฿{viewingBillingNote.billingAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Channel */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-4 bg-[#0174aa] rounded-full"></div>
                              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-widest">ช่องทางการชำระ (Payment)</h4>
                            </div>
                            <div className="relative">
                              <select
                                className="text-xs bg-gray-50 hover:bg-white text-[#008ac5] font-bold border border-gray-100 rounded-lg outline-none focus:ring-1 focus:ring-[#008ac5] cursor-pointer pl-3 pr-8 py-1.5 appearance-none shadow-sm transition-all"
                                value={selectedBillingBankId || (bankAccounts[0]?.id)}
                                onChange={(e) => setSelectedBillingBankId(e.target.value)}
                              >
                                {bankAccounts.map(b => (
                                  <option key={b.id} value={b.id}>{b.bank} {b.accountNumber}</option>
                                ))}
                              </select>
                              <ChevronDown size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#008ac5] pointer-events-none" />
                            </div>
                          </div>

                          {(() => {
                            const bankToShow = bankAccounts.find(b => String(b.id) === String(selectedBillingBankId)) || bankAccounts[0];
                            if (bankToShow) {
                              return (
                                <div className="flex items-center gap-5 p-4 rounded-xl border border-[#008ac5]/10 bg-[#008ac5]/5 animate-fade-in group hover:bg-[#008ac5]/10 transition-colors">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0 transform group-hover:scale-105 transition-transform ${bankToShow.color || 'bg-gray-500'}`}>
                                    {bankToShow.bank}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-black text-gray-900 text-lg leading-tight mb-1">{bankToShow.bank} — <span className="text-[#008ac5]">{bankToShow.accountNumber}</span></p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 font-medium">
                                      <span className="flex items-center gap-1.5 underline decoration-[#008ac5]/30 decoration-2 underline-offset-2">{bankToShow.accountName}</span>
                                      <span className="text-gray-300">|</span>
                                      <span className="text-gray-500">สาขา {bankToShow.branch}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0 z-10">
                  <button
                    onClick={() => setViewingBillingNote(null)}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    ปิดหน้าต่าง
                  </button>
                  <button
                    onClick={() => generatePDF('invoice', viewingBillingNote, `Invoice-${viewingBillingNote.id}.pdf`)}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
                  >
                    <FileText size={18} /> ดาวน์โหลด PDF
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* Receipt Preview Modal */}
        {
          viewingReceipt && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
                <header className="bg-[#16809a] text-white px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2"><FileCheck size={20} /> ใบเสร็จรับเงิน</h3>
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
                        <p className="text-sm text-gray-500">เลขที่ใบเสร็จรับเงิน</p>
                        <p className="font-mono font-bold text-xl text-[#16809a]">{viewingReceipt.id}</p>
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
                      <p className="text-4xl font-bold text-[#16809a]">฿{viewingReceipt.receiptAmount.toLocaleString()}</p>
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
                  <button onClick={() => generatePDF('receipt', viewingReceipt, `Receipt-${viewingReceipt.id}.pdf`)} className="px-6 py-2 bg-[#16809a] text-white rounded-lg font-bold hover:bg-green-600 flex items-center gap-2">
                    <FileText size={16} /> ดู PDF
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* Tax Invoice Preview Modal */}
        {
          viewingTaxInvoice && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
                <header className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2"><ShieldCheck size={20} /> ใบเสร็จ/ใบกำกับภาษี (Receipt/Tax Invoice)</h3>
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
                        <p className="text-sm text-gray-500">เลขที่ใบเสร็จ/ใบกำกับภาษี</p>
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
                  <button onClick={() => generatePDF('tax_invoice', viewingTaxInvoice, `TaxInvoice-${viewingTaxInvoice.runningNumber}.pdf`)} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2">
                    <Download size={16} /> ดาวน์โหลด PDF
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* Payment/Receipt Creation Modal */}
        {
          isCreatingReceipt && viewingBillingNote && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                <header className="bg-[#16809a] text-white px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard size={20} /> ชำระเงิน</h3>
                  <button onClick={() => { setIsCreatingReceipt(false); setViewingBillingNote(null); }}><X size={20} /></button>
                </header>
                <div className="p-6 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-700">{viewingBillingNote.customerName}</p>
                    <p className="text-2xl font-bold text-[#008ac5]">฿{viewingBillingNote.billingAmount.toLocaleString()}</p>
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
                    <div className="grid grid-cols-2 gap-2">
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
                        🏦 โอนเงิน (แนบสลิป)
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
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">แนบสลิปการโอน *</label>
                        <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 cursor-pointer transition block">
                          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">{paymentFormData.slipFileName || 'คลิกเพื่ออัปโหลดสลิป'}</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                setPaymentFormData({
                                  ...paymentFormData,
                                  slipFileName: e.target.files[0].name,
                                  slipFile: `slip_${Date.now()}.jpg` // Mock file path
                                });
                              }
                            }}
                          />
                        </label>
                        {paymentFormData.slipFileName && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle size={12} /> ไฟล์: {paymentFormData.slipFileName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">หมายเหตุ (ถ้ามี)</label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-4 py-2 text-sm"
                          placeholder="เช่น โอนจากบัญชี xxx เวลา xx:xx น."
                          value={paymentFormData.note || ''}
                          onChange={(e) => setPaymentFormData({ ...paymentFormData, note: e.target.value })}
                        />
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                        <strong>หมายเหตุ:</strong> หลังจากส่งสลิป ยอดจะเข้าสู่สถานะ "รอตรวจสอบ" และจะถูกอนุมัติโดย Manager
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-between border-t">
                  <button onClick={() => { setIsCreatingReceipt(false); setViewingBillingNote(null); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">ยกเลิก</button>
                  <button
                    onClick={() => {
                      // Validate transfer has slip
                      if (paymentFormData.method === 'transfer' && !paymentFormData.slipFileName) {
                        alert('กรุณาแนบสลิปการโอนเงิน');
                        return;
                      }

                      // Calculate paid amount
                      const paidAmount = billingAmount || viewingBillingNote.billingAmount;

                      // Is this a transfer payment? Then it goes to pending verification
                      const isTransfer = paymentFormData.method === 'transfer';
                      const receiptStatus = isTransfer ? 'pending_verify' : 'issued';

                      // Create receipt with appropriate status
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
                        status: receiptStatus,
                        createdAt: new Date().toISOString().split('T')[0],
                        createdBy: currentUser.id,
                        submittedBy: currentUser.id,
                        submittedByName: currentUser.name,
                        slipFile: paymentFormData.slipFile || null,
                        slipFileName: paymentFormData.slipFileName || null,
                        note: paymentFormData.note || '',
                        isDeposit: viewingBillingNote.isDeposit,
                        usedForTaxInvoice: false,
                        taxInvoiceId: null,
                        // Verification fields (for Manager)
                        verifiedBy: isTransfer ? null : currentUser.id,
                        verifiedAt: isTransfer ? null : new Date().toISOString().split('T')[0],
                        rejectionReason: null
                      };
                      setReceipts(prev => [newReceipt, ...prev]);

                      // For cash payments (immediate verification), update statuses now
                      // For transfer payments, statuses will be updated when Manager approves
                      if (!isTransfer) {
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
                                status: remainingBalance <= 0 ? 'paid' : 'partial'
                              };
                            }
                            return booking;
                          }));

                          // Also update bookingPaxList state
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

                        alert(`✅ สร้างใบเสร็จรับเงินเรียบร้อย!\n\nเลขที่: ${newReceipt.id}\nยอดชำระ: ฿${paidAmount.toLocaleString()}\nสถานะ: ${newStatus === 'paid' ? 'ชำระครบแล้ว' : 'ชำระมัดจำแล้ว'}`);
                      } else {
                        // Transfer payment - waiting for approval
                        alert(`📤 ส่งหลักฐานการชำระเรียบร้อย!\n\nเลขที่: ${newReceipt.id}\nยอด: ฿${paidAmount.toLocaleString()}\nสถานะ: รอตรวจสอบโดย Manager\n\nหลังจาก Manager อนุมัติ ยอดจะถูกบันทึกเข้าสู่ระบบ`);
                      }

                      setIsCreatingReceipt(false);
                      setViewingBillingNote(null);
                      setBillingAmount(0);
                      setPaymentFormData({ method: '', amount: 0, receipt: null, note: '', slipFileName: null, slipFile: null });
                      setSelectedBankForTransfer('');
                      setPaymentSubTab('receipt');
                    }}
                    className="px-6 py-2 bg-[#16809a] text-white rounded-lg font-bold hover:bg-green-600 flex items-center gap-2"
                  >
                    <CheckCircle size={16} /> {paymentFormData.method === 'transfer' ? 'ส่งหลักฐานการชำระ' : 'ยืนยันการชำระเงิน'}
                  </button>
                </div>
              </div>
            </div>
          )
        }

        {/* Tax Invoice Creation Modal - Manager Only */}
        {
          isCreatingTaxInvoice && selectedReceiptForTaxInvoice && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                <header className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2"><ShieldCheck size={20} /> ออกใบกำกับภาษี</h3>
                  <button onClick={() => { setIsCreatingTaxInvoice(false); setSelectedReceiptForTaxInvoice(null); }}><X size={20} /></button>
                </header>
                <div className="p-6 space-y-4">
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">จากใบเสร็จรับเงิน:</span>
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

                      const newTaxInvoice: TaxInvoice = {
                        id: `TAX-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(taxInvoices.length + 1).padStart(3, '0')}`,
                        runningNumber: runningNumber,
                        receiptIds: [selectedReceiptForTaxInvoice.id],
                        paymentId: selectedReceiptForTaxInvoice.paymentId,
                        roundId: selectedReceiptForTaxInvoice.roundId,
                        routeId: selectedReceiptForTaxInvoice.routeId,
                        customerType: (taxInvoiceFormData.customerType as TaxInvoiceCustomerType) || 'individual',
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
                      setTaxInvoiceFormData({ customerType: 'individual' });
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
          )
        }
      </div >
    );
  };



  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <aside className={`bg-white/80 backdrop-blur-lg shadow-soft-lg z-20 transition-all duration-300 ease-smooth flex flex-col border-r border-gray-100/50 overflow-x-hidden overflow-y-auto ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-100/50 h-16">{isSidebarOpen ? (<div className="flex items-center gap-2 text-rt-blue font-bold text-xl"><Plane className="fill-current" /> <span>Roonganan Tour<span className="text-rt-dark font-light ml-1">SYS</span></span></div>) : (<div className="mx-auto text-rt-blue"><Plane /></div>)}<button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"><Menu size={20} /></button></div>

        {/* User Switcher for RBAC Demo */}
        {isSidebarOpen && (
          <div className="px-4 pt-4 pb-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current User (Demo)</div>
            <div className="relative">
              <select className="w-full border border-gray-200 rounded-xl p-2.5 bg-white text-sm appearance-none cursor-pointer hover:border-rt-blue/30 focus:border-rt-blue focus:ring-2 focus:ring-rt-blue/10 transition-all shadow-soft" value={currentUser.id} onChange={(e) => {
                const selected = appUsers.find(u => u.id === Number(e.target.value));
                setCurrentUser(selected);
              }}>
                {appUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"><Settings size={14} /></div>
            </div>
          </div>
        )}

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden px-4">
          <SidebarItem icon={Users} label={isSidebarOpen ? "ระบบจัดการลูกค้า" : ""} active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} />
          <SidebarItem icon={LayoutDashboard} label={isSidebarOpen ? "ภาพรวม" : ""} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Calendar} label={isSidebarOpen ? "จองทัวร์" : ""} active={activeTab === 'booking'} onClick={() => setActiveTab('booking')} />
          <SidebarItem icon={FileText} label={isSidebarOpen ? "ระบบจัดการทัวร์" : ""} active={activeTab === 'operation'} onClick={() => setActiveTab('operation')} />
          <SidebarItem icon={Wallet} label={isSidebarOpen ? "การชำระเงิน" : ""} active={activeTab === 'payment'} onClick={() => setActiveTab('payment')} />

          {/* Settings with Sub-menu */}
          <div>
            <SidebarItem icon={Settings} label={isSidebarOpen ? "ตั้งค่าระบบ" : ""} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            {activeTab === 'settings' && isSidebarOpen && (
              <div className="ml-6 mt-2 space-y-1 animate-fade-in">
                <button
                  onClick={() => setSettingsTab('users')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${settingsTab === 'users' ? 'bg-rt-light text-rt-blue font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                >
                  ผู้ใช้งาน & คอมมิชชั่น
                </button>
                <button
                  onClick={() => setSettingsTab('bank')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${settingsTab === 'bank' ? 'bg-rt-light text-rt-blue font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                >
                  บัญชีธนาคาร
                </button>
              </div>
            )}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-100/50"><SidebarItem icon={LogOut} label={isSidebarOpen ? "ออกจากระบบ" : ""} active={false} onClick={() => alert("Logged out")} /></div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100/50 flex items-center px-4 lg:hidden shadow-soft"><button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button></div>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'booking' && renderBooking()}
          {activeTab === 'operation' && renderOperation()}
          {activeTab === 'payment' && renderPayment()}
          {activeTab === 'crm' && renderCRM()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'customer-dashboard' && (
            <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
              <CustomerDashboard
                targetCustomerId={viewingCustomerId || 4}
                isAdmin={true}
                onBack={() => {
                  setActiveTab(previousTab);
                  setViewingCustomerId(null);
                }}
              />
            </div>
          )}
        </div>
        {isFormOpen && renderCustomerFormModal()}
        {isUserFormModalOpen && renderUserFormModal()}

        {/* Add Customer Modal - Multi-step */}
        {showBookingTypeModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto">

              {/* Step 1: Choose Booking Type (if not selected yet) */}
              {!bookingAddMode && (
                <>
                  <header className="bg-[#008ac5] text-white px-6 py-4 flex justify-between items-center">
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
                    <div className="flex items-center gap-3">
                      <button onClick={() => setBookingAddMode(null)} className="hover:bg-purple-500 p-1 rounded-full"><ArrowLeft size={20} /></button>
                      <h3 className="font-bold text-lg flex items-center gap-2"><Users size={20} /> ระบุชื่อกรุ๊ปทัวร์</h3>
                    </div>
                    <button onClick={() => { setShowBookingTypeModal(false); setBookingAddMode(null); }}><X size={20} /></button>
                  </header>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-2">เลือกกรุ๊ปที่มีอยู่แล้ว</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                        {(() => {
                          // Get unique existing groups for current round from bookingGroups state
                          const relevantGroups = bookingGroups.filter(g => g.roundId === selectedRound?.id);
                          const groupPassengers = bookingPaxList.filter(p => p.bookingType === 'group');

                          if (relevantGroups.length === 0) {
                            return <div className="text-sm text-gray-400 text-center py-2">ไม่มีกรุ๊ปที่สร้างไว้ในรอบนี้</div>;
                          }

                          return (
                            <>
                              {/* Existing named groups from state */}
                              {relevantGroups.map(group => {
                                const count = groupPassengers.filter(p =>
                                  p.groupName === group.name ||
                                  p.groupId === group.groupId ||
                                  p.groupId === group.id
                                ).length;
                                return (
                                  <button
                                    key={group.groupId || group.name}
                                    onClick={() => setCurrentGroupName(group.name)}
                                    className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded text-purple-700 font-bold text-sm transition flex justify-between items-center"
                                  >
                                    <span>{group.name}</span>
                                    <span className="bg-purple-100 text-[10px] px-2 py-0.5 rounded-full">{count} ท่าน</span>
                                  </button>
                                );
                              })}

                              {/* Unnamed group (active currentGroupName) */}
                              {groupPassengers.some(p => !p.groupName) && (
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
                            if (e.key === 'Enter') {
                              const val = (e.currentTarget as HTMLInputElement).value.trim();
                              if (val) {
                                setCurrentGroupName(val);
                                if (!bookingGroups.find(g => g.name === val)) {
                                  setBookingGroups(prev => [...prev, {
                                    groupId: `GRP-${selectedRound?.id}-${Date.now()}`,
                                    name: val,
                                    roundId: selectedRound?.id || 0,
                                    totalAmount: 0,
                                    paidAmount: 0,
                                    balance: 0,
                                    bookingType: 'group'
                                  }]);
                                }
                              }
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const val = (document.getElementById('newGroupNameInput') as HTMLInputElement).value.trim();
                            if (val) {
                              setCurrentGroupName(val);
                              if (!bookingGroups.find(g => g.name === val)) {
                                setBookingGroups(prev => [...prev, {
                                  groupId: `GRP-${selectedRound?.id}-${Date.now()}`,
                                  name: val,
                                  roundId: selectedRound?.id || 0,
                                  totalAmount: 0,
                                  paidAmount: 0,
                                  balance: 0,
                                  bookingType: 'group'
                                }]);
                              }
                            }
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold"
                        >
                          ถัดไป
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-start">
                    <button onClick={() => { setBookingAddMode(null); }} className="text-sm text-gray-500 hover:text-gray-800 font-medium underline">
                      ← เปลี่ยนประเภท
                    </button>
                  </div>
                </>
              )}

              {/* Step 2: Search or Add Customer (after mode is selected AND group name is set if applicable) */}
              {bookingAddMode && (bookingAddMode === 'individual' || (bookingAddMode === 'group' && currentGroupName)) && (
                <>
                  <header className={`${bookingAddMode === 'individual' ? 'bg-blue-500' : 'bg-purple-600'} text-white px-6 py-4 flex justify-between items-center`}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (bookingAddMode === 'group') {
                            setCurrentGroupName(''); // Back to Group Name Selection
                          } else {
                            setBookingAddMode(null); // Back to Type Selection
                          }
                        }}
                        className="hover:bg-white/20 p-1 rounded-full"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {bookingAddMode === 'individual' ? <UserIcon size={20} /> : <Users size={20} />}
                        {bookingAddMode === 'individual' ? 'เพิ่มลูกค้าเดี่ยว' : `กลุ่ม: ${currentGroupName}`}
                      </h3>
                    </div>
                    <button onClick={() => { setShowBookingTypeModal(false); }}><X size={20} /></button>
                  </header>
                  <div className="p-6 space-y-4">
                    {/* Search */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-2">ค้นหาลูกค้าจากระบบ</label>
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:border-[#008ac5] transition">
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
                                const existingGroup = bookingGroups.find(g => g.name === currentGroupName);
                                let targetGroupId = existingGroup?.groupId;

                                if (bookingAddMode === 'group') {
                                  // 1. Try to find ID from existing group
                                  // 2. Try to find ID from other peers in the same group (in case group not yet in bookingGroups state)
                                  // 3. Generate new ID
                                  const peerPax = bookingPaxList.find(p => p.groupName === currentGroupName && p.groupId);
                                  targetGroupId = targetGroupId || peerPax?.groupId || `GRP-${selectedRound?.id || 0}-${Date.now()}`;

                                  if (!existingGroup && currentGroupName) {
                                    setBookingGroups(prev => {
                                      if (prev.find(g => g.name === currentGroupName)) return prev;
                                      return [...prev, {
                                        groupId: targetGroupId,
                                        name: currentGroupName,
                                        roundId: selectedRound?.id || 0,
                                        totalAmount: 0,
                                        paidAmount: 0,
                                        balance: 0,
                                        bookingType: 'group'
                                      }];
                                    });
                                  }
                                }

                                const newPax = {
                                  ...c,
                                  customerNote: c.remark || '', // Copy original DB remark to customerNote
                                  remark: '', // Reset remark for new booking-specific note
                                  // NO paymentStatus initially - will be set after payment process
                                  // bookingId will be set after confirmation
                                  bookingType: bookingAddMode,
                                  groupId: targetGroupId,
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
                              <Plus size={16} className="text-[#008ac5]" />
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
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#008ac5] hover:text-[#008ac5] transition flex items-center justify-center gap-2"
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
              <header className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard size={20} /> ยืนยันยอดชำระเงิน</h3>
                <button onClick={() => { setIsBookingConfirmationModalOpen(false); setIsDepositPayment(false); }}><X size={20} /></button>
              </header>
              <div className="p-6">
                {(() => {
                  // Detect group selection
                  const groupSelect = selectedPaxForBooking.find(s => String(s).startsWith('group:'));
                  const groupName = groupSelect ? String(groupSelect).split(':')[1] : null;

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
                        <div className="text-4xl font-bold text-[#008ac5] mb-4">
                          ฿{netAmount.toLocaleString()}
                        </div>
                      </div>

                      {/* Payment Actions - Combined Flow */}
                      <div className="space-y-3 mt-6">

                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                          <label className="text-sm font-bold text-gray-700 mb-3 block flex justify-between items-center">
                            <span>ระบุยอดที่ต้องการชำระ</span>
                            <span className="text-xs text-blue-500 cursor-pointer hover:underline" onClick={() => {
                              (document.getElementById('manualPaidAmountInput') as HTMLInputElement).value = '0';
                              document.getElementById('manualPaidAmountInput').dispatchEvent(new Event('input', { bubbles: true }));
                            }}>เคลียร์ค่า (0)</span>
                          </label>

                          {/* Quick Amount Buttons */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <button
                              onClick={() => {
                                const input = document.getElementById('manualPaidAmountInput') as HTMLInputElement;
                                input.value = String(netAmount);
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                setIsDepositPayment(false);
                              }}
                              className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:border-[#008ac5] hover:text-[#008ac5] transition"
                            >
                              เต็มจำนวน ({Math.round(netAmount / 100) / 10}k)
                            </button>
                            <button
                              onClick={() => {
                                const input = document.getElementById('manualPaidAmountInput') as HTMLInputElement;
                                input.value = String(Math.floor(netAmount * 0.3)); // 30% Deposit
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                setIsDepositPayment(true);
                              }}
                              className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:border-[#008ac5] hover:text-[#008ac5] transition"
                            >
                              มัดจำ 30%
                            </button>
                            <button
                              onClick={() => {
                                const input = document.getElementById('manualPaidAmountInput') as HTMLInputElement;
                                input.value = '0';
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                setIsDepositPayment(false);
                              }}
                              className="px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-600 hover:border-[#008ac5] hover:text-[#008ac5] transition"
                            >
                              วางบิล (0฿)
                            </button>
                          </div>

                          <div className="flex gap-2 mb-3 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">฿</span>
                            <input
                              type="number"
                              className="w-full border border-gray-300 p-3 pl-8 rounded-lg text-2xl font-bold text-right text-gray-800 outline-none focus:border-[#008ac5] focus:ring-4 focus:ring-blue-50/50 transition bg-white"
                              defaultValue={netAmount}
                              id="manualPaidAmountInput"
                              onChange={(e) => {
                                // Simplified logic
                              }}
                            />
                          </div>

                          {/* Deposit Toggle Indicator */}
                          <label className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer mb-5 ${isDepositPayment ? 'bg-amber-50 border-amber-500 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-70 hover:opacity-100'}`}>
                            <div className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isDepositPayment}
                                onChange={(e) => setIsDepositPayment(e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-sm font-bold ${isDepositPayment ? 'text-amber-700' : 'text-gray-600'}`}>ชำระแบบมัดจำ (Deposit Only)</span>
                              <span className="text-[10px] text-gray-500 leading-none">ระบุในใบวางบิลว่าเป็นรายการชำระมัดจำ</span>
                            </div>
                          </label>

                          <button
                            id="btn-confirm-payment"
                            onClick={() => {
                              const inputAmount = Number((document.getElementById('manualPaidAmountInput') as HTMLInputElement).value);

                              if (inputAmount < 0) return alert("กรุณาระบุยอดชำระที่มากกว่าหรือเท่ากับ 0 บาท");

                              // Detect if group is selected
                              const groupSelect = selectedPaxForBooking.find(s => String(s).startsWith('group:'));

                              // Create Booking
                              const finalPax = bookingPaxList
                                .filter(p => {
                                  if (groupSelect) {
                                    const gName = String(groupSelect).split(':')[1];
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

                              // === BILLING NOTE FLOW === 
                              const newPayment: Payment = {
                                id: Date.now() + 1,
                                bookingId: bookingId,
                                routeId: selectedRoute.id,
                                roundId: selectedRound.id,
                                saleId: currentUser.id,
                                paxIds: finalPax.map(p => p.id),
                                customerName: payerName,
                                totalAmount: netAmount,
                                paidAmount: 0,
                                status: 'pending',
                                createdAt: new Date().toLocaleDateString(),
                                transactions: []
                              };
                              setPayments(prev => [newPayment, ...prev]);

                              const newBillingNote: BillingNote = {
                                id: `INV-${Date.now()}`,
                                paymentId: newPayment.id,
                                roundId: selectedRound.id,
                                routeId: selectedRoute.id,
                                groupId: groupSelect ? String(groupSelect).split(':')[1] : null,
                                bookingId: bookingId,
                                customerName: payerName,
                                billingType: groupSelect ? 'group' : 'individual',
                                paxIds: finalPax.map(p => p.id),
                                totalAmount: netAmount,
                                previousPaid: previouslyPaid,
                                billingAmount: inputAmount,
                                paidAmount: 0,
                                isDeposit: isDepositPayment,
                                status: 'pending',
                                createdAt: new Date().toISOString().split('T')[0],
                                createdBy: currentUser.id,
                                dueDate: "",
                                paymentMethod: null,
                                bankAccountId: null,
                                note: ""
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
                              setIsDepositPayment(false);

                              alert(`สร้างใบวางบิลเรียบร้อย!\nยอดวางบิล: ฿${inputAmount.toLocaleString()}\nสถานะ: รอชำระ\n\nกรุณาไปที่หน้า "การชำระเงิน" เพื่อบันทึกการชำระ`);
                            }}
                            className="w-full bg-[#008ac5] hover:bg-[#029bc4] text-white py-4 rounded-lg font-bold shadow-md transition flex items-center justify-center gap-2 text-lg"
                          >
                            <CheckCircle size={20} /> <span id="label-confirm-payment">ยืนยันยอด {isDepositPayment ? '(มัดจำ)' : ''}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
