import { Receipt, Booking, Round, Route } from '../../types';
import logo from '../../assets/roonganan_logo.png';

interface ReceiptPDFProps {
    receipt: Receipt;
    booking?: Booking;
    round?: Round;
    route?: Route;
}

const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ receipt, booking, round, route }) => {
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
    const PRIMARY = '#0f766e'; // Teal
    const TEXT_MAIN = '#1f2937';
    const TEXT_MUTED = '#6b7280';
    const BACKGROUND = '#f0fdfa';

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
            overflow: 'hidden' as const,
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '30px',
            borderBottom: `4px solid ${PRIMARY}`,
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
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px 15px',
            marginBottom: '25px',
            backgroundColor: BACKGROUND,
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
        infoCard: {
            backgroundColor: BACKGROUND,
            padding: '15px',
            borderRadius: '8px',
            border: `1px solid ${PRIMARY}20`,
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse' as const,
            marginBottom: '20px',
        },
        thead: {
            backgroundColor: '#f1f5f9',
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
        totalSection: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '40px',
        },
        totalBox: {
            backgroundColor: PRIMARY,
            color: 'white',
            padding: '20px 30px',
            borderRadius: '8px',
            textAlign: 'right' as const,
            minWidth: '320px',
        },
        totalLabel: {
            fontSize: '14px',
            textTransform: 'uppercase' as const,
            opacity: 0.8,
            marginBottom: '5px',
        },
        totalValue: {
            fontSize: '28px',
            fontWeight: 'bold',
        },
        bahtText: {
            marginTop: '8px',
            textAlign: 'right' as const,
            fontSize: '13px',
            color: PRIMARY,
            fontStyle: 'italic',
            fontWeight: 'bold',
        },
        footer: {
            marginTop: 'auto',
            paddingTop: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
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
                        เลขประจำตัวผู้เสียภาษี: 0105566012345
                    </div>
                </div>
                <div style={styles.docInfoBox}>
                    <div style={styles.docTitle}>RECEIPT</div>
                    <div style={styles.docSubtitle}>ใบเสร็จรับเงิน</div>
                    <table style={styles.docMetaTable}>
                        <tbody>
                            <tr>
                                <td style={styles.docMetaLabel}>เลขที่เอกสาร:</td>
                                <td style={styles.docMetaValue}>{receipt.id}</td>
                            </tr>
                            <tr>
                                <td style={styles.docMetaLabel}>วันที่:</td>
                                <td style={styles.docMetaValue}>{formatDate(receipt.createdAt)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Trip Info */}
            <div style={styles.tripBox}>
                <span style={styles.sectionTitle}>เส้นทาง / โปรแกรมทัวร์</span>
                <div style={{ fontWeight: 'bold', color: PRIMARY, fontSize: '15px' }}>
                    {route?.code} - {route?.name}
                </div>
                <div style={{ fontSize: '12px', color: TEXT_MUTED, marginTop: '4px' }}>
                    🗓 รอบการเดินทาง: {round?.date || '-'}
                </div>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '30px' }}>
                <div style={{ flex: 1 }}>
                    <span style={styles.sectionTitle}>ได้รับเงินจาก (RECEIVED FROM)</span>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{receipt.customerName}</div>
                </div>
                <div style={{ width: '200px' }}>
                    <span style={styles.sectionTitle}>วิธีชำระเงิน (PAYMENT METHOD)</span>
                    <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{receipt.paymentMethod}</div>
                    {receipt.note && <div style={{ fontSize: '11px', color: TEXT_MUTED }}>*{receipt.note}</div>}
                </div>
            </div>

            {/* Items Table */}
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
                                อ้างอิง: {booking?.details?.tourCode || '-'} | จำนวนผู้เดินทาง: {receipt.paxIds?.length || 1} ท่าน
                            </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold' }}>
                            {formatCurrency(receipt.receiptAmount)}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Total Section */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <div>
                    <div style={styles.totalBox}>
                        <div style={styles.totalLabel}>ยอดรวมรับเงินทั้งสิ้น (GRAND TOTAL)</div>
                        <div style={styles.totalValue}>฿{formatCurrency(receipt.receiptAmount)}</div>
                    </div>
                    <div style={styles.bahtText}>
                        ( {bahtText(receipt.receiptAmount)} )
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <div style={{ width: '60%', fontSize: '11px', color: TEXT_MUTED, lineHeight: '1.8' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: PRIMARY, marginBottom: '8px' }}>หมายเหตุ:</div>
                    เอกสารนี้ถูกสร้างขึ้นด้วยระบบคอมพิวเตอร์ และมีผลสมบูรณ์ตามกฎหมาย<br />
                    กรุณาเก็บรักษาไว้เพื่อเป็นหลักฐานการชำระเงิน
                </div>
                <div style={{ width: '200px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: TEXT_MUTED, marginBottom: '5px' }}>ผู้รับเงิน / เจ้าหน้าที่</div>
                    <div style={{ borderBottom: '1px solid #e2e8f0', height: '50px', marginBottom: '10px' }}></div>
                    <div style={{ fontWeight: 'bold' }}>บจก. รุ่งอนันต์ ทัวร์</div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPDF;
