import React from 'react';
import { TaxInvoice, Booking, Round, Route, Receipt, BankAccount } from '../../types';
import logo from '../../../dist/roonganan_newlogo.png';

interface TaxInvoicePDFProps {
    taxInvoice: TaxInvoice;
    receipts?: Receipt[];
    booking?: Booking;
    round?: Round;
    route?: Route;
    bankAccount?: BankAccount;
}

const TaxInvoicePDF: React.FC<TaxInvoicePDFProps> = ({ taxInvoice, receipts, booking, round, route, bankAccount }) => {

    // Helper Functions
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' });
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

    // Color palette - Amber/Orange theme for tax invoice
    const CI = {
        50: '#fffbeb',
        100: '#fef3c7',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    };

    const paxCount = booking?.pax?.length || taxInvoice.receiptIds?.length || 1;

    const s = {
        page: {
            width: '210mm',
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
        headerSubtitle: { fontSize: '16px', fontWeight: 500, color: '#64748b', marginBottom: '4px' },
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

    const TaxInvoicePage = ({ isOriginal }: { isOriginal: boolean }) => (
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
                            ใบสำคัญรับเงิน
                        </div>
                        <div style={{ ...s.headerSubtitle, color: isOriginal ? '#111827' : '#4b5563' }}>
                            {isOriginal ? 'ต้นฉบับ (Original)' : 'สำเนา (Copy)'}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 8px', textAlign: 'right', alignItems: 'center' }}>
                            <div style={{ color: '#6b7280', fontWeight: 600, fontSize: '10px' }}>เลขที่เอกสาร:</div>
                            <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#111827' }}>{taxInvoice.runningNumber}</div>
                            <div style={{ color: '#6b7280', fontWeight: 600, fontSize: '10px' }}>วันที่:</div>
                            <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#111827' }}>{formatDate(taxInvoice.issuedAt)}</div>
                            {receipts && receipts.length > 0 && (
                                <>
                                    <div style={{ color: '#6b7280', fontWeight: 600, fontSize: '10px' }}>อ้างอิง:</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#111827' }}>{receipts[0].billingNoteId || '-'}</div>
                                </>
                            )}
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
                            {taxInvoice.customerName}
                        </div>
                        <div style={{ fontSize: '10px', color: '#4b5563', lineHeight: '1.4' }}>
                            {taxInvoice.address && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '1px' }}>
                                    <span style={{ color: '#9ca3af', minWidth: '30px' }}>ที่อยู่:</span>
                                    <span>{taxInvoice.address}</span>
                                </div>
                            )}
                            {taxInvoice.taxId && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: '#9ca3af', minWidth: 'auto' }}>เลขผู้เสียภาษี:</span>
                                    <span>{taxInvoice.taxId}</span>
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
                                        {route?.name || 'ค่าบริการนำเที่ยว (Tour Package Service)'}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span>เดินทาง: {round?.date || '-'}</span>
                                    </div>
                                    {taxInvoice.receiptIds && (
                                        <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>
                                            อ้างอิงใบวางบิล: {taxInvoice.receiptIds.join(', ')}
                                        </div>
                                    )}
                                </td>
                                <td style={{ ...s.td, textAlign: 'center', color: '#111827' }}>
                                    {paxCount} ท่าน
                                </td>
                                <td style={{ ...s.td, textAlign: 'right', fontFamily: 'monospace', color: '#111827' }}>
                                    {formatCurrency(taxInvoice.subtotal / paxCount)}
                                </td>
                                <td style={{ ...s.td, textAlign: 'right', fontFamily: 'monospace', color: '#111827' }}>
                                    {formatCurrency(taxInvoice.subtotal)}
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
                                ( {bahtText(taxInvoice.totalAmount)} )
                            </span>
                        </div>
                    </div>

                    {/* Totals */}
                    <div style={{ width: '220px' }}>
                        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '10px' }}>
                            <span>รวมเป็นเงิน (Subtotal):</span>
                            <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '11px' }}>{formatCurrency(taxInvoice.subtotal)}</span>
                        </div>
                        <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '10px' }}>
                            <span>ภาษีมูลค่าเพิ่ม 7% (VAT):</span>
                            <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '11px' }}>{formatCurrency(taxInvoice.vatAmount)}</span>
                        </div>
                        <div style={{ borderTop: '1px solid #d1d5db', marginTop: '4px', marginBottom: '4px' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', color: '#111827', fontSize: '12px' }}>ยอดรวมสุทธิ (Net Total):</span>
                            <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>฿{formatCurrency(taxInvoice.totalAmount)}</span>
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
                                การชำระเงิน (Payment Method)
                            </div>
                            <div style={{ fontSize: '10px', color: '#374151', paddingLeft: '6px' }}>
                                {/* Transfer Option */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        border: `2px solid ${CI[600]}`,
                                        borderRadius: '2px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: CI[600],
                                        color: 'white',
                                        marginTop: '2px',
                                    }}>
                                        <div style={{ width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '1px' }}></div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontWeight: 600, color: '#111827' }}>เงินโอน (Bank Transfer)</span>
                                        <div style={{
                                            marginTop: '4px',
                                            fontSize: '9px',
                                            color: '#6b7280',
                                        }}>
                                            <div>ธนาคาร: <span style={{ color: '#111827' }}>{bankAccount?.bank || '-'}</span></div>
                                            <div>เลขบัญชี: <span style={{ fontFamily: 'monospace' }}>{bankAccount?.accountNumber || '-'}</span></div>
                                        </div>
                                    </div>
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

            {/* Footer / Signature Section - Moved UP */}
            <div style={{ marginTop: '10px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                    {/* Customer Signature */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
                        <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '24px', width: '100%', textAlign: 'left', fontWeight: 500, paddingLeft: '4px' }}>
                            ในนาม ลูกค้า / ผู้รับบริการ:
                        </div>
                        <div style={{ width: '100%', borderBottom: '1px dotted #9ca3af', marginBottom: '4px', height: '16px' }}></div>
                        <div style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '10px' }}>
                            ( ........................................................... )
                        </div>
                        <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>ผู้รับบริการ</div>
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
                        <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>ผู้รับเงิน</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TaxInvoicePage isOriginal={true} />
            <TaxInvoicePage isOriginal={false} />
        </div>
    );
};

export default TaxInvoicePDF;
