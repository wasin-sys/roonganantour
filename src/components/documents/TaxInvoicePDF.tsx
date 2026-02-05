import React from 'react';
import { TaxInvoice, Booking, Round, Route, Receipt } from '../../types';
import logo from '../../assets/roonganan_logo.png';

interface TaxInvoicePDFProps {
    taxInvoice: TaxInvoice;
    receipts?: Receipt[];
    booking?: Booking;
    round?: Round;
    route?: Route;
}

const TaxInvoicePDF: React.FC<TaxInvoicePDFProps> = ({ taxInvoice, receipts, booking, round, route }) => {
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

    // --- COLORS & STYLES ---
    const PRIMARY = '#7c3aed'; // Purple for Tax Invoice
    const TEXT_MAIN = '#1f2937';
    const TEXT_MUTED = '#6b7280';
    const BACKGROUND = '#f5f3ff';

    const styles = {
        page: {
            width: '210mm',
            height: '296.5mm',
            padding: '15mm',
            backgroundColor: '#ffffff',
            fontFamily: "'Sarabun', sans-serif",
            color: TEXT_MAIN,
            boxSizing: 'border-box' as const,
            fontSize: '13px',
            lineHeight: '1.6',
            position: 'relative' as const,
            overflow: 'hidden' as const,
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '25px',
            borderBottom: `2px solid ${PRIMARY}`,
            paddingBottom: '15px',
        },
        logoContainer: {
            width: '55%',
        },
        logo: {
            height: '55px',
            marginBottom: '8px',
            objectFit: 'contain' as const,
        },
        companyTitle: {
            fontSize: '18px',
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
            width: '45%',
        },
        docTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: PRIMARY,
            marginBottom: '2px',
        },
        docSubtitle: {
            fontSize: '11px',
            color: TEXT_MUTED,
            marginBottom: '8px',
            textTransform: 'uppercase' as const,
        },
        docMetaTable: {
            float: 'right' as const,
            borderCollapse: 'collapse' as const,
        },
        docMetaLabel: {
            color: TEXT_MUTED,
            fontSize: '11px',
            textAlign: 'right' as const,
            paddingRight: '10px',
        },
        docMetaValue: {
            textAlign: 'right' as const,
            fontWeight: 'bold',
            fontSize: '13px',
        },
        twoColGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '20px',
        },
        infoBox: {
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: `1px solid ${PRIMARY}40`,
        },
        sectionTitle: {
            fontSize: '10px',
            fontWeight: 'bold',
            color: PRIMARY,
            textTransform: 'uppercase' as const,
            letterSpacing: '1px',
            marginBottom: '6px',
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
            padding: '8px 10px',
            fontSize: '11px',
            fontWeight: 'bold',
            textAlign: 'left' as const,
            color: '#475569',
        },
        td: {
            padding: '10px',
            fontSize: '12px',
            borderBottom: '1px solid #f1f5f9',
            verticalAlign: 'top' as const,
        },
        summaryWrapper: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        summaryTable: {
            width: '400px',
            borderCollapse: 'collapse' as const,
        },
        summaryLabel: {
            padding: '4px 10px',
            fontSize: '12px',
            color: TEXT_MUTED,
            textAlign: 'right' as const,
            whiteSpace: 'nowrap' as const,
        },
        summaryValue: {
            padding: '4px 10px',
            textAlign: 'right' as const,
            fontWeight: 'bold',
            fontSize: '13px',
            whiteSpace: 'nowrap' as const,
        },
        grandTotalRow: {
            borderTop: `1.5px solid ${PRIMARY}`,
            color: PRIMARY,
        },
        grandTotalLabel: {
            padding: '12px 15px',
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap' as const,
        },
        grandTotalValue: {
            padding: '12px 15px',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'right' as const,
            whiteSpace: 'nowrap' as const,
        },
        bahtText: {
            marginTop: '8px',
            textAlign: 'right' as const,
            fontSize: '12px',
            color: PRIMARY,
            fontStyle: 'italic',
            fontWeight: 'bold',
        },
        footer: {
            marginTop: 'auto',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px dashed #e2e8f0',
        }
    };

    return (
        <div style={styles.page}>
            {/* Header Section */}
            <div style={styles.header}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <div style={styles.companyTitle}>บจก. รุ่งอนันต์ ทัวร์</div>
                    <div style={styles.companyInfo}>
                        123/45 ถนนพหลโยธิน แขวงลาดยาว กรุงเทพฯ 10900<br />
                        เลขประจำตัวผู้เสียภาษี: 0105566012345 (สำนักงานใหญ่)
                    </div>
                </div>
                <div style={styles.docInfoBox}>
                    <div style={{ ...styles.docSubtitle, fontWeight: 'bold', color: PRIMARY, fontSize: '12px' }}>ต้นฉบับ / ORIGINAL</div>
                    <div style={styles.docTitle}>TAX INVOICE / RECEIPT</div>
                    <div style={styles.docSubtitle}>ใบเสร็จ/ใบกำกับภาษี</div>
                    <table style={styles.docMetaTable}>
                        <tbody>
                            <tr>
                                <td style={styles.docMetaLabel}>เลขที่เอกสาร (No.):</td>
                                <td style={styles.docMetaValue}>{taxInvoice.runningNumber}</td>
                            </tr>
                            <tr>
                                <td style={styles.docMetaLabel}>วันที่ (Date):</td>
                                <td style={styles.docMetaValue}>{formatDate(taxInvoice.issuedAt)}</td>
                            </tr>
                            {receipts && receipts.length > 0 && (
                                <tr>
                                    <td style={styles.docMetaLabel}>อ้างอิงใบวางบิล:</td>
                                    <td style={styles.docMetaValue}>{receipts[0].billingNoteId || '-'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Info Box (Full Width) */}
            <div style={{ ...styles.infoBox, marginBottom: '20px' }}>
                <span style={styles.sectionTitle}>ข้อมูลลูกค้า (CUSTOMER / GROUP)</span>
                <div style={{ fontWeight: 'bold', fontSize: '20px', color: PRIMARY, marginBottom: '6px' }}>{taxInvoice.customerName}</div>
                <div style={{ fontSize: '13px', color: TEXT_MAIN }}>
                    <span style={{ color: TEXT_MUTED }}>เลขประจำตัวผู้เสียภาษี:</span> {taxInvoice.taxId} |
                    <span style={{ color: TEXT_MUTED }}> ที่อยู่:</span> {taxInvoice.address}
                </div>
            </div>

            {/* Tour Details (Below Box) */}
            <div style={{ marginBottom: '20px', padding: '0 12px' }}>
                <span style={styles.sectionTitle}>รายละเอียดทัวร์ (TOUR DETAILS)</span>
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: TEXT_MAIN }}>{route?.code} - {route?.name}</div>
                <div style={{ fontSize: '12px', color: TEXT_MUTED, marginTop: '4px' }}>
                    <span style={{ marginRight: '20px' }}>🗓 วันที่เดินทาง: {round?.date || '-'}</span>
                    <span>👥 จำนวนผู้เดินทาง: {booking?.pax?.length || taxInvoice.receiptIds?.length || 1} ท่าน</span>
                </div>
            </div>

            {/* Items Table */}
            <table style={styles.table}>
                <thead style={styles.thead}>
                    <tr>
                        <th style={{ ...styles.th, width: '40px', textAlign: 'center' }}>#</th>
                        <th style={styles.th}>รายการ (Description)</th>
                        <th style={{ ...styles.th, width: '120px', textAlign: 'right' }}>จำนวนเงิน (THB)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ ...styles.td, textAlign: 'center' }}>1</td>
                        <td style={styles.td}>
                            <div style={{ fontWeight: 'bold' }}>ค่าบริการนำเที่ยว (Tour Package Service)</div>
                            <div style={{ fontSize: '11px', color: TEXT_MUTED, marginTop: '4px', lineHeight: '1.4' }}>
                                เส้นทาง: {route?.name} ({route?.code})<br />
                                อ้างอิงใบรับเงินเลขที่: {taxInvoice.receiptIds.join(', ')}
                            </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                            {formatCurrency(taxInvoice.subtotal)}
                        </td>
                    </tr>
                    {/* Empty rows to fill space */}
                    <tr style={{ height: '60px' }}>
                        <td style={{ ...styles.td, borderBottom: 'none' }}></td>
                        <td style={{ ...styles.td, borderBottom: 'none' }}></td>
                        <td style={{ ...styles.td, borderBottom: 'none' }}></td>
                    </tr>
                </tbody>
            </table>

            {/* Summary Section */}
            <div style={styles.summaryWrapper}>
                <div>
                    <table style={styles.summaryTable}>
                        <tbody>
                            <tr>
                                <td style={styles.summaryLabel}>รวมเป็นเงิน (Subtotal):</td>
                                <td style={styles.summaryValue}>{formatCurrency(taxInvoice.subtotal)}</td>
                            </tr>
                            <tr>
                                <td style={styles.summaryLabel}>ภาษีมูลค่าเพิ่ม 7% (VAT):</td>
                                <td style={styles.summaryValue}>{formatCurrency(taxInvoice.vatAmount)}</td>
                            </tr>
                            <tr style={styles.grandTotalRow}>
                                <td style={{ ...styles.summaryLabel, ...styles.grandTotalLabel, color: PRIMARY }}>จำนวนเงินรวมทั้งสิ้น (Grand Total):</td>
                                <td style={{ ...styles.summaryValue, ...styles.grandTotalValue, color: PRIMARY }}>฿{formatCurrency(taxInvoice.totalAmount)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={styles.bahtText}>
                        ( {bahtText(taxInvoice.totalAmount)} )
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <div style={{ width: '40%', fontSize: '11px', color: TEXT_MUTED, lineHeight: '1.6' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: PRIMARY, marginBottom: '5px' }}>หมายเหตุ:</div>
                    1. เอกสารฉบับนี้จะสมบูรณ์ก็ต่อเมื่อบริษัทฯ ได้รับเงินเรียบร้อยแล้ว<br />
                    2. กรณีชำระด้วยเช็ค เอกสารนี้จะสมบูรณ์เมื่อบริษัทฯ ได้รับเงินตามเช็คนั้นแล้ว<br />
                    3. เอกสารนี้จัดทำขึ้นโดยระบบคอมพิวเตอร์
                </div>
                <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ width: '170px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: TEXT_MUTED, marginBottom: '5px' }}>ผู้รับสินค้า / บริการ (Receiver)</div>
                        <div style={{ borderBottom: '1px solid #e2e8f0', height: '45px', marginBottom: '8px' }}></div>
                        <div style={{ fontSize: '11px' }}>วันที่ ........./........./.........</div>
                    </div>
                    <div style={{ width: '170px', textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: TEXT_MUTED, marginBottom: '5px' }}>ผู้อนุมัติ (Authorized Signature)</div>
                        <div style={{ borderBottom: '1px solid #e2e8f0', height: '45px', marginBottom: '8px', position: 'relative' }}>
                            <span style={{ position: 'absolute', bottom: '10px', right: '30px', color: '#e2e8f0', fontStyle: 'italic', fontSize: '20px', opacity: 0.5 }}>Approved</span>
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '11px' }}>บจก. รุ่งอนันต์ ทัวร์</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaxInvoicePDF;
