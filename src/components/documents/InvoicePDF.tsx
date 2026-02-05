import React from 'react';
import { BillingNote, Booking, Round, Route } from '../../types';
import logo from '../../assets/roonganan_logo.png';

interface InvoicePDFProps {
    billingNote: BillingNote;
    booking?: Booking;
    round?: Round;
    route?: Route;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ billingNote, booking, round, route }) => {
    // --- FORMATTERS ---
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    // Thai Baht Text Function
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

    // Filter only passengers that are in this billing note
    const billingPax = booking?.pax?.filter(p => billingNote.paxIds.includes(p.id)) || [];

    // --- COLORS & STYLES ---
    const PRIMARY = '#1e3a8a';
    const TEXT_MAIN = '#1f2937';
    const TEXT_MUTED = '#6b7280';
    const BACKGROUND = '#f9fafb';

    const styles = {
        page: {
            width: '210mm',
            height: '296.5mm', // Slightly less than 297mm to prevent blank page
            padding: '15mm',
            backgroundColor: '#ffffff',
            fontFamily: "'Sarabun', sans-serif",
            color: TEXT_MAIN,
            boxSizing: 'border-box' as const,
            fontSize: '14px',
            lineHeight: '1.6',
            position: 'relative' as const,
            overflow: 'hidden' as const, // Ensure no scrollbars
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '30px',
            borderBottom: `2px solid ${PRIMARY}`,
            paddingBottom: '20px',
        },
        logoContainer: {
            width: '60%',
        },
        logo: {
            height: '60px',
            marginBottom: '10px',
            objectFit: 'contain' as const,
        },
        companyTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            color: PRIMARY,
        },
        companyInfo: {
            fontSize: '11px',
            color: TEXT_MUTED,
            marginTop: '2px',
        },
        docInfoBox: {
            textAlign: 'right' as const,
            width: '40%',
        },
        docTitle: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: PRIMARY,
            marginBottom: '5px',
        },
        docSubtitle: {
            fontSize: '12px',
            color: TEXT_MUTED,
            marginBottom: '10px',
        },
        docMetaTable: {
            float: 'right' as const,
            borderCollapse: 'collapse' as const,
        },
        docMetaLabel: {
            color: TEXT_MUTED,
            fontSize: '12px',
            textAlign: 'right' as const,
            paddingRight: '12px',
        },
        docMetaValue: {
            textAlign: 'right' as const,
            fontWeight: 'bold',
            fontSize: '14px',
        },
        tripBox: {
            border: `1px solid ${PRIMARY}40`,
            borderRadius: '8px',
            padding: '12px 15px',
            marginBottom: '25px',
            backgroundColor: 'transparent',
        },
        sectionTitle: {
            fontSize: '10px',
            fontWeight: 'bold',
            color: PRIMARY,
            textTransform: 'uppercase' as const,
            letterSpacing: '1px',
            marginBottom: '8px',
            display: 'block',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as const,
            marginBottom: '20px',
        },
        thead: {
            backgroundColor: 'transparent',
            borderTop: '1px solid #e2e8f0',
            borderBottom: '1px solid #e2e8f0',
        },
        th: {
            padding: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'left' as const,
            color: '#475569',
        },
        td: {
            padding: '12px 10px',
            fontSize: '13px',
            borderBottom: '1px solid #f1f5f9',
            verticalAlign: 'middle' as const,
        },
        summaryWrapper: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '10px',
        },
        summaryTable: {
            width: '400px',
            borderCollapse: 'collapse' as const,
        },
        summaryLabel: {
            padding: '6px 10px',
            fontSize: '13px',
            color: TEXT_MUTED,
            textAlign: 'right' as const,
            whiteSpace: 'nowrap' as const,
        },
        summaryValue: {
            padding: '6px 10px',
            textAlign: 'right' as const,
            fontWeight: 'bold',
            whiteSpace: 'nowrap' as const,
        },
        billingRow: {
            borderTop: `1.5px solid ${PRIMARY}`,
            color: PRIMARY,
        },
        billingLabel: {
            padding: '12px 10px',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'right' as const,
            whiteSpace: 'nowrap' as const,
        },
        billingValue: {
            padding: '12px 10px',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'right' as const,
            whiteSpace: 'nowrap' as const,
        },
        bahtText: {
            marginTop: '5px',
            textAlign: 'right' as const,
            fontSize: '12px',
            color: PRIMARY,
            fontStyle: 'italic',
            fontWeight: 'bold',
        }
    };

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <div style={styles.companyTitle}>บจก. รุ่งอนันต์ ทัวร์</div>
                    <div style={styles.companyInfo}>
                        123/45 ถนนพหลโยธิน แขวงลาดยาว กรุงเทพฯ 10900<br />
                        เลขประจำตัวผู้เสียภาษี: 0105566012345
                    </div>
                </div>
                <div style={styles.docInfoBox}>
                    <div style={styles.docTitle}>INVOICE</div>
                    <div style={styles.docSubtitle}>ใบวางบิล / ใบแจ้งหนี้</div>
                    <table style={styles.docMetaTable}>
                        <tbody>
                            <tr>
                                <td style={styles.docMetaLabel}>เลขที่เอกสาร:</td>
                                <td style={styles.docMetaValue}>{billingNote.id}</td>
                            </tr>
                            <tr>
                                <td style={styles.docMetaLabel}>วันที่:</td>
                                <td style={styles.docMetaValue}>{formatDate(billingNote.createdAt)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Info Box */}
            <div style={styles.tripBox}>
                <span style={styles.sectionTitle}>ลูกค้า / กลุ่ม (CUSTOMER / GROUP)</span>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: PRIMARY }}>{billingNote.customerName}</div>
            </div>

            {/* Trip Info */}
            <div style={{ marginBottom: '20px' }}>
                <span style={styles.sectionTitle}>เส้นทาง / โปรแกรมทัวร์ (TOUR PROGRAM)</span>
                <div style={{ fontWeight: 'bold', color: TEXT_MAIN, fontSize: '15px' }}>
                    {route?.code} - {route?.name}
                </div>
                <div style={{ fontSize: '12px', color: TEXT_MUTED, marginTop: '4px' }}>
                    🗓 รอบการเดินทาง: {round?.date || '-'}
                </div>
            </div>

            {/* Passenger Table */}
            <span style={styles.sectionTitle}>รายละเอียดรายการ (PASSENGER BREAKDOWN)</span>
            <table style={styles.table}>
                <thead style={styles.thead}>
                    <tr>
                        <th style={{ ...styles.th, width: '40px', textAlign: 'center' }}>#</th>
                        <th style={styles.th}>รายการ (Description)</th>
                        <th style={{ ...styles.th, width: '120px', textAlign: 'right' }}>จำนวนเงิน</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ ...styles.td, textAlign: 'center' }}>1</td>
                        <td style={styles.td}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>ชำระค่าแพ็กเกจทัวร์</div>
                            <div style={{ fontSize: '11px', color: TEXT_MUTED, marginTop: '4px' }}>
                                เส้นทาง: {route?.name} ({route?.code})<br />
                                จำนวนผู้เดินทาง: {billingNote.paxIds.length} ท่าน
                            </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold' }}>
                            {formatCurrency(billingNote.totalAmount)}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Summary */}
            <div style={styles.summaryWrapper}>
                <div>
                    <table style={styles.summaryTable}>
                        <tbody>
                            <tr>
                                <td style={styles.summaryLabel}>ยอดรวมทั้งหมด (Total Amount):</td>
                                <td style={styles.summaryValue}>฿{formatCurrency(billingNote.totalAmount)}</td>
                            </tr>
                            <tr>
                                <td style={styles.summaryLabel}>ชำระแล้ว (Previously Paid):</td>
                                <td style={{ ...styles.summaryValue, color: '#059669' }}>฿{formatCurrency(billingNote.previousPaid)}</td>
                            </tr>
                            <tr style={styles.billingRow}>
                                <td style={styles.billingLabel}>ยอดวางบิลครั้งนี้ (Grand Total):</td>
                                <td style={styles.billingValue}>฿{formatCurrency(billingNote.billingAmount)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={styles.bahtText}>
                        ( {bahtText(billingNote.billingAmount)} )
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ width: '55%', fontSize: '11px', color: TEXT_MUTED, lineHeight: '1.6' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: PRIMARY, marginBottom: '8px' }}>ข้อมูลการชำระเงิน:</div>
                        ธนาคาร: กสิกรไทย (KBank) | เลขบัญชี: 123-4-56789-0<br />
                        ชื่อบัญชี: บจก. รุ่งอนันต์ ทัวร์<br />
                        <span style={{ fontStyle: 'italic', marginTop: '5px', display: 'block' }}>
                            * กรุณาแนบใบโอนเงินเข้าระบบหลังจากชำระเรียบร้อยแล้ว
                        </span>
                    </div>
                    <div style={{ width: '180px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: TEXT_MUTED, marginBottom: '5px' }}>ผู้ออกเอกสาร</div>
                        <div style={{ borderBottom: '1px solid #e2e8f0', height: '45px', marginBottom: '8px' }}></div>
                        <div style={{ fontWeight: 'bold' }}>เจ้าหน้าที่ บจก. รุ่งอนันต์ ทัวร์</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePDF;
