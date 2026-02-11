import React from 'react';
import { BillingNote, Booking, Round, Route, BankAccount } from '../../types';
import logo from '../../assets/roonganan_newlogo.png';

interface InvoicePDFProps {
    billingNote: BillingNote;
    booking?: Booking;
    round?: Round;
    route?: Route;
    bankAccount?: BankAccount;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ billingNote, booking, round, route, bankAccount }) => {

    // Helper function used across pages
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    const calculateDueDate = () => {
        if (round?.date) {
            const monthMap: Record<string, number> = {
                'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
                'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
            };

            try {
                const dateStr = round.date.toUpperCase();
                const parts = dateStr.split(/[\s-]+/).filter(p => p);

                let day = 1;
                let month = 0;
                let year = new Date().getFullYear();

                if (parts.length > 0 && /^\d+$/.test(parts[0])) {
                    day = parseInt(parts[0]);
                }

                for (const part of parts) {
                    if (monthMap[part] !== undefined) {
                        month = monthMap[part];
                        break;
                    }
                }

                for (const part of parts) {
                    if (/^\d{4}$/.test(part)) {
                        year = parseInt(part);
                        break;
                    }
                }

                const travelDate = new Date(year, month, day);
                travelDate.setDate(travelDate.getDate() - 7);
                return formatDate(travelDate.toISOString());
            } catch {
                return billingNote.dueDate ? formatDate(billingNote.dueDate) : '-';
            }
        }
        return billingNote.dueDate ? formatDate(billingNote.dueDate) : '-';
    };

    const bahtText = (num: number) => {
        if (!num || num === 0) return 'ศูนย์บาทถ้วน';
        const numberText = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
        const unitText = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
        const convert = (n: number) => {
            let res = '';
            const nStr = n.toString();
            const len = nStr.length;
            for (let i = 0; i < len; i++) {
                const digit = parseInt(nStr[i]);
                const pos = len - i - 1;
                if (digit !== 0) {
                    if (pos % 6 === 1 && digit === 1) res += '';
                    else if (pos % 6 === 1 && digit === 2) res += 'ยี่';
                    else if (pos % 6 === 0 && digit === 1 && len > 1 && i === len - 1) res += 'เอ็ด';
                    else res += numberText[digit];
                    res += unitText[pos % 6];
                }
                if (pos !== 0 && pos % 6 === 0) res += 'ล้าน';
            }
            return res;
        };
        const [intPart, decPart] = num.toFixed(2).split('.');
        const intNum = parseInt(intPart);
        const decNum = parseInt(decPart);
        let result = intNum === 0 ? 'ศูนย์บาท' : convert(intNum) + 'บาท';
        if (decNum === 0) result += 'ถ้วน';
        else result += convert(decNum) + 'สตางค์';
        return result;
    };

    const CI = {
        50: '#e6f7fc',
        100: '#bcebf9',
        500: '#008ac5',
        600: '#0174aa',
        700: '#015d88',
        800: '#014b6e',
        900: '#013b56',
    };

    const s = {
        page: {
            width: '210mm',
            // Use height auto to allow content to flow naturally, but minHeight for full page feel
            minHeight: '296mm',
            backgroundColor: '#ffffff',
            fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
            fontSize: '11px',
            lineHeight: '1.4',
            color: '#1f2937',
            padding: '25px 35px',
            paddingBottom: '30px',
            boxSizing: 'border-box' as const,
            display: 'flex',
            flexDirection: 'column' as const,
            position: 'relative' as const,
            // Force page break after each page except the last
            pageBreakAfter: 'always' as const
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: `2px solid ${CI[900]}`,
            paddingBottom: '12px',
            marginBottom: '14px',
        },
        headerTitle: { fontSize: '24px', fontWeight: 'bold', color: CI[900], marginBottom: '4px', lineHeight: '1' },
        headerSubtitle: { fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '4px' },
        customerBox: {
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            position: 'relative' as const,
            overflow: 'hidden',
            marginBottom: '16px'
        },
        customerBoxLabel: {
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#6b7280',
            textTransform: 'uppercase' as const,
            marginBottom: '6px',
            borderBottom: '1px solid #f3f4f6',
            paddingBottom: '4px',
            paddingLeft: '6px',
        },
        th: {
            padding: '6px 8px',
            textAlign: 'left' as const,
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase' as const,
            color: '#111827',
            borderTop: '1px solid #374151',
            borderBottom: '1px solid #374151',
            whiteSpace: 'nowrap' as const
        },
        td: {
            padding: '8px',
            verticalAlign: 'top' as const,
            borderBottom: '1px solid #f3f4f6'
        }
    };

    // Component for a single invoice page
    const InvoicePage = ({ isOriginal }: { isOriginal: boolean }) => (
        <div style={{ ...s.page, pageBreakAfter: isOriginal ? 'always' : 'auto' }}>
            {/* Content Wrapper */}
            <div>
                {/* Header */}
                <div style={s.header}>
                    {/* Left: Logo and Company Info */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                            height: '65px',
                            width: 'auto',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <img src={logo} alt="Logo" style={{ height: '100%', width: 'auto', maxWidth: '180px', objectFit: 'contain' }} />
                        </div>
                        <div style={{ paddingTop: '2px' }}>
                            <div style={{ fontSize: '15px', fontWeight: 'bold', color: CI[800], textTransform: 'uppercase', lineHeight: '1.2' }}>
                                ROONG ANAN TOUR
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: CI[600] }}>
                                บจก. รุ่งอนันต์ ทัวร์
                            </div>
                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: CI[800], marginTop: '2px' }}>
                                NO 21/00645
                            </div>
                            <div style={{ fontSize: '9px', color: '#4b5563', marginTop: '4px', lineHeight: '1.3' }}>
                                <div>123/45 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900</div>
                                <div><span style={{ fontWeight: 600 }}>เลขประจำตัวผู้เสียภาษี:</span> 0105566012345</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Document Info */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: '2px' }}>
                        <div style={s.headerTitle}>
                            ใบวางบิล
                        </div>
                        <div style={{ ...s.headerSubtitle, fontSize: '16px', color: isOriginal ? '#111827' : '#4b5563' }}>
                            {isOriginal ? 'ต้นฉบับ (Original)' : 'สำเนา (Copy)'}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 8px', textAlign: 'right', alignItems: 'center' }}>
                            <div style={{ color: '#6b7280', fontWeight: 600, fontSize: '10px' }}>เลขที่เอกสาร:</div>
                            <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#111827' }}>{billingNote.id}</div>
                            <div style={{ color: '#6b7280', fontWeight: 600, fontSize: '10px' }}>วันที่:</div>
                            <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#111827' }}>{formatDate(billingNote.createdAt)}</div>
                        </div>
                    </div>
                </div>

                {/* Customer Info Box */}
                <div style={s.customerBox}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', backgroundColor: CI[500] }}></div>
                    <div style={s.customerBoxLabel}>
                        ลูกค้า / กลุ่ม (CUSTOMER / GROUP)
                    </div>
                    <div style={{ paddingLeft: '8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                            {billingNote.customerName}
                        </div>
                        <div style={{ fontSize: '10px', color: '#4b5563', lineHeight: '1.4' }}>
                            {billingNote.customerAddress && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '1px' }}>
                                    <span style={{ color: '#9ca3af', minWidth: '30px' }}>ที่อยู่:</span>
                                    <span>{billingNote.customerAddress}</span>
                                </div>
                            )}
                            {booking?.contactPhone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
                                    <span style={{ color: '#9ca3af', minWidth: '30px' }}>โทร:</span>
                                    <span>{booking.contactPhone}</span>
                                </div>
                            )}
                            {billingNote.customerTaxId && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#9ca3af', minWidth: 'auto' }}>เลขผู้เสียภาษี:</span>
                                    <span>{billingNote.customerTaxId}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div style={{ marginBottom: '16px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ ...s.th, textAlign: 'center' as const, width: '30px' }}>#</th>
                                <th style={s.th}>รายการ (Description)</th>
                                <th style={{ ...s.th, textAlign: 'center' as const, width: '60px' }}>จำนวน</th>
                                <th style={{ ...s.th, textAlign: 'right' as const, width: '90px' }}>ราคา/หน่วย</th>
                                <th style={{ ...s.th, textAlign: 'right' as const, width: '90px' }}>จำนวนเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ ...s.td, textAlign: 'center', color: '#6b7280' }}>1</td>
                                <td style={s.td}>
                                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#1f2937', marginBottom: '2px' }}>
                                        {route?.name || 'แพ็กเกจทัวร์'} {billingNote.isDeposit ? '(มัดจำ)' : ''}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>เดินทาง: {round?.date || '-'}</span>
                                        {billingNote.isDeposit && (
                                            <span style={{ backgroundColor: '#fff7ed', color: '#c2410c', padding: '0 4px', borderRadius: '2px', fontWeight: 'bold', border: '1px solid #ffedd5' }}>
                                                ชำระมัดจำ
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ ...s.td, textAlign: 'center', color: '#111827' }}>
                                    {billingNote.paxIds?.length || 0} ท่าน
                                </td>
                                <td style={{ ...s.td, textAlign: 'right', fontFamily: 'monospace', color: '#111827' }}>
                                    {formatCurrency(billingNote.billingAmount / (billingNote.paxIds?.length || 1))}
                                </td>
                                <td style={{ ...s.td, textAlign: 'right', fontFamily: 'monospace', color: '#111827' }}>
                                    {formatCurrency(billingNote.billingAmount)}
                                </td>
                            </tr>
                            <tr style={{ height: '30px' }}>
                                <td colSpan={5} style={{ borderBottom: '1px solid #f3f4f6' }}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div style={{ marginBottom: '16px', display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                    {/* Baht Text */}
                    <div style={{ flex: '1' }}>
                        <div style={{
                            backgroundColor: '#f9fafb',
                            border: `1px solid #e5e7eb`,
                            padding: '8px 10px',
                            borderRadius: '4px',
                            textAlign: 'center',
                        }}>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#374151' }}>
                                ( {bahtText(billingNote.billingAmount)} )
                            </span>
                        </div>
                    </div>

                    {/* Totals */}
                    <div style={{ width: '220px' }}>
                        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '10px' }}>
                            <span>ยอดรวมทั้งหมด (Total):</span>
                            <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '11px' }}>{formatCurrency(billingNote.totalAmount)}</span>
                        </div>
                        {billingNote.previousPaid > 0 && (
                            <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontSize: '10px' }}>
                                <span>หัก ชำระแล้ว (Paid):</span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '11px' }}>-{formatCurrency(billingNote.previousPaid)}</span>
                            </div>
                        )}
                        <div style={{ borderTop: '1px solid #d1d5db', marginTop: '4px', marginBottom: '4px' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: '#111827', fontSize: '12px' }}>ยอดสุทธิ (Grand Total):</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>฿{formatCurrency(billingNote.billingAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Dashed Divider */}
                <div style={{ borderBottom: '1px dashed #e5e7eb', marginBottom: '16px' }}></div>

                {/* Payment & Contact Section */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                    {/* Payment Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '10px',
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: CI[500] }}></div>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                borderBottom: '1px solid #f3f4f6',
                                paddingBottom: '4px',
                                marginBottom: '6px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}>
                                ข้อมูลการชำระเงิน
                            </div>
                            <div style={{ fontSize: '10px', color: '#374151', paddingLeft: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <span style={{ color: '#6b7280' }}>ธนาคาร:</span>
                                    <span style={{ fontWeight: 600, color: '#111827' }}>{bankAccount?.bank || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <span style={{ color: '#6b7280' }}>เลขบัญชี:</span>
                                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#111827' }}>{bankAccount?.accountNumber || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ color: '#6b7280' }}>ชื่อบัญชี:</span>
                                    <span style={{ color: '#111827' }}>{bankAccount?.accountName || '-'}</span>
                                </div>
                            </div>
                            <div style={{
                                backgroundColor: '#fef2f2',
                                borderRadius: '4px',
                                padding: '4px',
                                textAlign: 'center',
                                border: '1px solid #fecaca',
                            }}>
                                <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#dc2626' }}>
                                    ชำระภายใน: {calculateDueDate()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '10px',
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                        }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: CI[500] }}></div>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                borderBottom: '1px solid #f3f4f6',
                                paddingBottom: '4px',
                                marginBottom: '6px',
                                fontSize: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}>
                                สอบถามข้อมูลเพิ่มเติม
                            </div>
                            <div style={{ fontSize: '10px', color: '#374151', paddingLeft: '4px' }}>
                                <div style={{ marginBottom: '4px' }}>
                                    <div style={{ color: '#6b7280', fontSize: '9px', marginBottom: '1px' }}>สาขาที่ดูแล:</div>
                                    <div style={{ fontWeight: 600, color: '#111827' }}>สาขาฟ้าฮ่าม (เชียงใหม่)</div>
                                </div>
                                <div style={{ marginBottom: '4px' }}>
                                    <div style={{ color: '#6b7280', fontSize: '9px', marginBottom: '1px' }}>เบอร์โทรศัพท์:</div>
                                    <div style={{ fontFamily: 'monospace', color: '#111827' }}>065-512-2155, 053-261-146</div>
                                </div>
                                <div>
                                    <div style={{ color: '#6b7280', fontSize: '9px', marginBottom: '1px' }}>ฝ่ายขาย:</div>
                                    <div style={{ color: '#111827' }}>คุณวิภาดา (089-999-8888)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Signature Section - Moved UP and closer to content */}
            <div style={{ marginTop: '10px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                    {/* Customer Signature */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                        <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '24px', width: '100%', textAlign: 'left', fontWeight: 500, paddingLeft: '4px' }}>
                            ในนาม ลูกค้า / ผู้รับวางบิล:
                        </div>
                        <div style={{ width: '100%', borderBottom: '1px dotted #9ca3af', marginBottom: '4px', height: '16px' }}></div>
                        <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '10px' }}>
                            ( ........................................................... )
                        </div>
                        <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>ผู้รับวางบิล</div>
                    </div>

                    {/* Company Signature */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                        <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '24px', width: '100%', textAlign: 'right', fontWeight: 500 }}>
                            ในนาม บจก. รุ่งอนันต์ ทัวร์:
                        </div>
                        <div style={{ width: '100%', borderBottom: '1px dotted #9ca3af', marginBottom: '4px', height: '16px' }}></div>
                        <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '10px' }}>
                            ( นางสาววิภาดา รักบริการ )
                        </div>
                        <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>ผู้วางบิล</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <InvoicePage isOriginal={true} />
            <InvoicePage isOriginal={false} />
        </div>
    );
};

export default InvoicePDF;
