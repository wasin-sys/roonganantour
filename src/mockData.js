
// Mock Data for Tour System

// === USERS (Staff) ===
export const MOCK_USERS = [
    { id: 1, name: 'K.Admin', role: 'MANAGER', commissionRank: null, avatar: 'https://i.pravatar.cc/150?u=1', email: 'admin@tour.com' },
    { id: 2, name: 'K.Boy', role: 'SALE', commissionRank: 1, avatar: 'https://i.pravatar.cc/150?u=2', email: 'boy@tour.com' },
    { id: 3, name: 'K.Anne', role: 'SALE', commissionRank: 1, avatar: 'https://i.pravatar.cc/150?u=3', email: 'anne@tour.com' },
    { id: 4, name: 'K.New', role: 'SALE', commissionRank: 2, avatar: 'https://i.pravatar.cc/150?u=4', email: 'new@tour.com' },
    { id: 5, name: 'K.Guide1', role: 'GUIDE', commissionRank: null, avatar: 'https://i.pravatar.cc/150?u=5', email: 'guide1@tour.com' }
];

// === ROUTES ===
export const MOCK_ROUTES = [
    {
        id: 1,
        name: 'BEIJING - UNIVERSAL STUDIO 5D4N',
        code: 'BJ-US',
        price: 25900,
        duration: '5D4N',
        image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=300&h=200',
        description: 'Explore the wonders of Beijing including the Great Wall, Forbidden City, and the magical Universal Studios.',
        attachment: 'BJ-US_Program_Full.pdf',
        rank1Com: 500,
        rank2Com: 300
    },
    {
        id: 2,
        name: 'KUNMING - LIJIANG - SHANGRI-LA 6D5N',
        code: 'KM-LS',
        price: 32900,
        duration: '6D5N',
        image: 'https://images.chinahighlights.com/allpicture/2024/08/d09f58648bf547418c54ce3e6790c0af_cut_2560x800_296_1722698401.jpg',
        description: 'A breathtaking journey through the landscapes of Yunnan, visiting ancient towns and snow-capped mountains.',
        attachment: 'KM-LS_Program_Full.pdf',
        rank1Com: 600,
        rank2Com: 400
    },
    {
        id: 3,
        name: 'CHENGDU - JIUHAIGOU 5D4N',
        code: 'CD-JH',
        price: 28900,
        duration: '5D4N',
        image: 'https://www.asiaodysseytravel.com/images/china-tours/banner/fcd009-chengdu-jiuzhaigou-zhangjiajie-tour.jpg',
        description: 'Visit the home of giant pandas and the crystal clear waters of Jiuzhaigou National Park.',
        attachment: 'CD-JH_Program_Full.pdf',
        rank1Com: 550,
        rank2Com: 350
    },
    {
        id: 4,
        name: 'JAPAN - TOKYO FUJI NIKKO 6D4N',
        code: 'JP-TYO',
        price: 42900,
        duration: '6D4N',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=300&h=200',
        description: 'Experience the perfect blend of modern Tokyo and traditional Japan with breathtaking views of Mt. Fuji.',
        attachment: 'JP-TYO_Program_Full.pdf',
        rank1Com: 800,
        rank2Com: 500
    }
];

// === ROUNDS ===
export const MOCK_ROUNDS = [
    {
        id: 101,
        routeId: 1,
        date: '15-19 JAN 2026',
        airline: 'TG',
        flight: 'TG614',
        seats: 25,
        sold: 3,
        paidCount: 0,
        pendingCount: 1,
        partialCount: 2,
        status: 'Selling',
        headId: 2,
        head: 'K.Boy',
        guideId: 5,
        guide: 'K.Guide1',
        price: { adultTwin: 25900, adultSingle: 30900, adultTriple: 24900, childBed: 23900, childNoBed: 20900 }
    },
    {
        id: 102,
        routeId: 1,
        date: '22-26 JAN 2026',
        airline: 'CA',
        flight: 'CA980',
        seats: 30,
        sold: 5,
        paidCount: 3,
        pendingCount: 0,
        partialCount: 2,
        status: 'Selling',
        headId: 4,
        head: 'K.New',
        guideId: null,
        guide: 'ยังไม่กำหนด',
        price: { adultTwin: 26900, adultSingle: 31900, adultTriple: 25900, childBed: 24900, childNoBed: 21900 }
    },
    {
        id: 201,
        routeId: 2,
        date: '10-15 FEB 2026',
        airline: 'MU',
        flight: 'MU742',
        seats: 20,
        sold: 20,
        paidCount: 20,
        pendingCount: 0,
        partialCount: 0,
        status: 'Full',
        headId: 3,
        head: 'K.Anne',
        guideId: 5,
        guide: 'K.Guide1',
        price: { adultTwin: 32900, adultSingle: 38900, adultTriple: 30900, childBed: 28900, childNoBed: 25000 }
    },
    {
        id: 301,
        routeId: 3,
        date: '25 FEB - 02 MAR 2026',
        airline: 'TG',
        flight: 'TG618',
        seats: 25,
        sold: 25,
        paidCount: 25,
        pendingCount: 0,
        partialCount: 0,
        status: 'Full',
        headId: 2,
        head: 'K.Boy',
        guideId: 5,
        guide: 'K.Guide1',
        price: { adultTwin: 28900, adultSingle: 34900, adultTriple: 26900, childBed: 24900, childNoBed: 21000 }
    },
    {
        id: 103,
        routeId: 1,
        date: '05-09 FEB 2026',
        airline: 'TG',
        flight: 'TG614',
        seats: 25,
        sold: 12,
        paidCount: 8,
        pendingCount: 2,
        partialCount: 2,
        status: 'Selling',
        headId: 3,
        head: 'K.Anne',
        guideId: null,
        guide: 'ยังไม่กำหนด',
        price: { adultTwin: 29900, adultSingle: 35900, adultTriple: 28900, childBed: 27900, childNoBed: 24900 }
    },
    {
        id: 401,
        routeId: 4,
        date: '10-15 DEC 2025',
        airline: 'TG',
        flight: 'TG640',
        seats: 20,
        sold: 20,
        paidCount: 20,
        pendingCount: 0,
        partialCount: 0,
        status: 'Completed',
        headId: 2,
        head: 'K.Boy',
        guideId: 5,
        guide: 'K.Guide1',
        price: { adultTwin: 42900, adultSingle: 48900, adultTriple: 40900, childBed: 38900, childNoBed: 35000 }
    },
    {
        id: 402,
        routeId: 2,
        date: '20-25 DEC 2025',
        airline: 'MU',
        flight: 'MU742',
        seats: 18,
        sold: 18,
        paidCount: 18,
        pendingCount: 0,
        partialCount: 0,
        status: 'Completed',
        headId: 3,
        head: 'K.Anne',
        guideId: 5,
        guide: 'K.Guide1',
        price: { adultTwin: 32900, adultSingle: 38900, adultTriple: 30900, childBed: 28900, childNoBed: 25000 }
    }
];

// === CUSTOMERS DATABASE ===
export const INITIAL_CUSTOMER_STATE = {
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
    birthplace: 'BANGKOK',
    nationality: 'THAI',
    phone: '',
    email: '',
    lineId: '',
    remark: '',
    attachments: { passport: null, visa: null, ticket: null, insurance: null },
    ownerId: null
};

// Extended customer list for realistic data (100+ items generated roughly)
const generateCustomers = () => {
    // Expanded name lists for unique combinations (no duplicates with hardcoded names)
    const firstNames = [
        'Malee', 'Prasit', 'Wichan', 'Nattawut', 'Sunee', 'Kittichai', 'Anurat',
        'Pornthip', 'Pakorn', 'Weerayut', 'Chantana', 'Wisuth', 'Thawat', 'Ratchadaporn',
        'Narongsak', 'Wilawan', 'Piyapong', 'Natthakan', 'Sakda', 'Siriwan',
        'Thongdee', 'Udomsak', 'Wanpen', 'Yupaporn', 'Sopita', 'Kanyarat', 'Jirawat',
        'Noppadon', 'Supaporn', 'Chaiwat', 'Nonglak', 'Pramote', 'Sumalee', 'Kamon',
        'Nuchanart', 'Phisit', 'Rungnapa', 'Somkiat', 'Thidarat', 'Vichai',
        'Apinya', 'Bundit', 'Chalerm', 'Duangjai', 'Ekachai', 'Fongchan', 'Gantana',
        'Itsara', 'Jintana', 'Kamol', 'Lalita', 'Manop', 'Nalinee', 'Ongard'
    ];
    const lastNames = [
        'Wongsawat', 'Srisuwan', 'Phanthong', 'Khamkaen', 'Boonlert', 'Thongsri',
        'Siriphan', 'Keophet', 'Danwong', 'Mongkhon', 'Phonphat', 'Ratmanee',
        'Petcharat', 'Chansiri', 'Saengthong', 'Meechok', 'Jaiyen', 'Raksri', 'Suksan',
        'Intaraporn', 'Charoensuk', 'Limwattana', 'Treewit', 'Paisarn', 'Boonma'
    ];

    const customers = [];
    let id = 1;

    // Hardcoded Key Figures (indices 0-9) - Unique names, will not be duplicated
    customers.push(
        { id: id++, title: 'MR', firstNameEn: 'SOMCHAI', lastNameEn: 'JAIDEE', firstNameTh: 'สมชาย', lastNameTh: 'ใจดี', gender: 'M', dob: '1980-01-16', passportNo: 'AA1234567', nationality: 'THAI', phone: '081-234-5678', ownerId: 2 }, // 0
        { id: id++, title: 'MRS', firstNameEn: 'SUDA', lastNameEn: 'JAIDEE', firstNameTh: 'สุดา', lastNameTh: 'ใจดี', gender: 'F', dob: '1982-05-20', passportNo: 'AA1234568', nationality: 'THAI', phone: '089-999-8888', ownerId: 2 }, // 1
        { id: id++, title: 'MS', firstNameEn: 'LUCY', lastNameEn: 'LIU', firstNameTh: 'ลูซี่', lastNameTh: 'หลิว', gender: 'F', dob: '2015-02-12', passportNo: 'US987654321', nationality: 'USA', phone: '+1-555-0199', ownerId: 3 }, // 2
        { id: id++, title: 'MR', firstNameEn: 'WASIN', lastNameEn: 'GARNSOMDEE', firstNameTh: 'วศิน', lastNameTh: 'การสมดี', gender: 'M', dob: '1990-01-23', passportNo: 'AA84684645', nationality: 'THAI', phone: '092-123-4567', ownerId: 4 }, // 3
        { id: id++, title: 'MR', firstNameEn: 'JOHN', lastNameEn: 'DOE', firstNameTh: 'จอห์น', lastNameTh: 'โด', gender: 'M', dob: '1985-06-10', passportNo: 'UK1234567', nationality: 'UK', phone: '+44-20-1234-5678', ownerId: 3 }, // 4
        { id: id++, title: 'MRS', firstNameEn: 'JANE', lastNameEn: 'DOE', firstNameTh: 'เจน', lastNameTh: 'โด', gender: 'F', dob: '1987-03-22', passportNo: 'UK1234568', nationality: 'UK', phone: '+44-20-1234-5679', ownerId: 3 }, // 5
        { id: id++, title: 'MR', firstNameEn: 'TANAKORN', lastNameEn: 'SRISUK', firstNameTh: 'ธนากร', lastNameTh: 'ศรีสุข', gender: 'M', dob: '1975-02-14', passportNo: 'AA5678901', nationality: 'THAI', phone: '086-111-2222', ownerId: 2 }, // 6
        { id: id++, title: 'MRS', firstNameEn: 'NATTAYA', lastNameEn: 'SRISUK', firstNameTh: 'ณัฐญา', lastNameTh: 'ศรีสุข', gender: 'F', dob: '1978-09-14', passportNo: 'AA5678902', nationality: 'THAI', phone: '086-111-2223', ownerId: 2 }, // 7
        { id: id++, title: 'MR', firstNameEn: 'PRASERT', lastNameEn: 'WONG', firstNameTh: 'ประเสริฐ', lastNameTh: 'วงศ์', gender: 'M', dob: '1965-01-30', passportNo: 'AA7890123', nationality: 'THAI', phone: '081-555-6666', ownerId: 3 }, // 8
        { id: id++, title: 'MRS', firstNameEn: 'SUWANNA', lastNameEn: 'WONG', firstNameTh: 'สุวรรณา', lastNameTh: 'วงศ์', gender: 'F', dob: '1968-07-19', passportNo: 'AA7890124', nationality: 'THAI', phone: '081-555-6667', ownerId: 3 } // 9
    );

    // Track used name combinations to ensure uniqueness
    const usedCombinations = new Set();

    // Add hardcoded names to used set
    customers.forEach(c => usedCombinations.add(`${c.firstNameEn}-${c.lastNameEn}`));

    // Generate 110 more unique customers
    let fnIndex = 0;
    let lnIndex = 0;
    let attempts = 0;
    const maxAttempts = 10000;

    while (customers.length < 120 && attempts < maxAttempts) {
        const fn = firstNames[fnIndex % firstNames.length];
        const ln = lastNames[lnIndex % lastNames.length];
        const combo = `${fn.toUpperCase()}-${ln.toUpperCase()}`;

        if (!usedCombinations.has(combo)) {
            usedCombinations.add(combo);
            const gender = ['Malee', 'Sunee', 'Pornthip', 'Chantana', 'Ratchadaporn', 'Wilawan', 'Natthakan', 'Siriwan', 'Wanpen', 'Yupaporn', 'Sopita', 'Kanyarat', 'Nonglak', 'Sumalee', 'Nuchanart', 'Rungnapa', 'Thidarat', 'Apinya', 'Duangjai', 'Fongchan', 'Gantana', 'Jintana', 'Lalita', 'Nalinee', 'Supaporn'].includes(fn) ? 'F' : 'M';
            const customerIndex = customers.length;
            customers.push({
                id: id++,
                title: gender === 'M' ? 'MR' : 'MRS',
                firstNameEn: fn.toUpperCase(),
                lastNameEn: ln.toUpperCase(),
                firstNameTh: fn,
                lastNameTh: ln,
                gender: gender,
                dob: `19${70 + (customerIndex % 30)}-${('0' + (1 + (customerIndex % 12))).slice(-2)}-${('0' + (1 + (customerIndex % 28))).slice(-2)}`,
                passportNo: `AA${1000000 + customerIndex}`,
                nationality: 'THAI',
                phone: `08${(customerIndex % 10)}-${1000 + customerIndex}-${2000 + customerIndex}`,
                ownerId: (customerIndex % 3) + 2 // Cycle sales IDs
            });
        }

        // Move to next combination
        lnIndex++;
        if (lnIndex >= lastNames.length) {
            lnIndex = 0;
            fnIndex++;
        }
        attempts++;
    }

    return customers;
};

const CUSTOMER_TEMPLATES = generateCustomers();

export const MOCK_CUSTOMERS_DB = CUSTOMER_TEMPLATES.map(c => ({
    ...c,
    passportIssue: '2020-01-01',
    passportExpire: '2030-01-01',
    birthplace: 'BANGKOK',
    email: '',
    lineId: '',
    remark: '',
    attachments: { passport: null, visa: null, ticket: null, insurance: null }
}));

export const INITIAL_BLACKLIST_DATA = [
    { id: 1, name: 'SOMBAT BADGUY', passport: 'A00000000', reason: 'หนีทัวร์ปี 2023' },
    { id: 2, name: 'SOMSAK TROUBLE', passport: 'A11111111', reason: 'เมาสุราอาละวาด สร้างความวุ่นวาย' }
];

// === BOOKING TYPE (Individual or Group) ===
export const BOOKING_TYPES = {
    INDIVIDUAL: 'individual', // แบบเดี่ยว - แต่ละคนคำนวณยอดค้างแยกกัน
    GROUP: 'group'            // แบบกลุ่ม - ยอดค้างรวมกันเป็นก้อนเดียว
};

// === BOOKING / PAX IN ROUNDS ===

// Helper to get pax range safely
const getPax = (start, count) => MOCK_CUSTOMERS_DB.slice(start, start + count);

// Group definitions for multi-passenger bookings
export const MOCK_BOOKING_GROUPS = [
    { groupId: 'GRP-101-001', name: 'SOMCHAI JAIDEE GROUP', roundId: 101, totalAmount: 72700, paidAmount: 10400, balance: 62300, bookingType: 'group' },
    { groupId: 'GRP-102-001', name: 'WASIN GARNSOMDEE GROUP', roundId: 102, totalAmount: 134500, paidAmount: 80700, balance: 53800, bookingType: 'group' }
];

// Round 101: 3 pax (Sold: 3) - Indices 0-2 (Somchai group + Lucy individual)
// Note: No billing notes yet, so all should show "จองแล้ว" (gray) status
export const MOCK_PAX_IN_ROUND_101 = [
    { ...MOCK_CUSTOMERS_DB[0], roomType: 'adultTwin', bookedBy: 2, paymentDate: '2025-09-21', uniqueId: '1-101', groupId: 'GRP-101-001', bookingType: 'group', groupName: 'SOMCHAI JAIDEE GROUP' },
    { ...MOCK_CUSTOMERS_DB[1], roomType: 'adultTwin', bookedBy: 2, paymentDate: '2025-09-21', uniqueId: '2-101', groupId: 'GRP-101-001', bookingType: 'group', groupName: 'SOMCHAI JAIDEE GROUP' },
    { ...MOCK_CUSTOMERS_DB[2], roomType: 'childNoBed', bookedBy: 3, paymentDate: null, uniqueId: '3-101', groupId: null, bookingType: 'individual' }
];

// Round 102: 5 pax (Sold: 5) - Indices 3-7 (Wasin + Tanakorn group)
export const MOCK_PAX_IN_ROUND_102 = [
    { ...MOCK_CUSTOMERS_DB[3], roomType: 'adultTwin', bookedBy: 4, paymentStatus: 'paid', paymentDate: '2025-10-01', uniqueId: '4-102' },
    { ...MOCK_CUSTOMERS_DB[6], roomType: 'adultTwin', bookedBy: 4, paymentStatus: 'paid', paymentDate: '2025-10-01', uniqueId: '5-102' },
    { ...MOCK_CUSTOMERS_DB[7], roomType: 'adultSingle', bookedBy: 4, paymentStatus: 'paid', paymentDate: '2025-10-02', uniqueId: '6-102' },
    { ...MOCK_CUSTOMERS_DB[10], roomType: 'adultTwin', bookedBy: 4, paymentStatus: 'partial', paymentDate: '2025-10-03', uniqueId: '7-102' },
    { ...MOCK_CUSTOMERS_DB[11], roomType: 'adultTwin', bookedBy: 4, paymentStatus: 'partial', paymentDate: '2025-10-03', uniqueId: '8-102' }
];

// Round 201: 20 pax (Sold: 20) - Indices 10-29 (Corporate Group)
export const MOCK_PAX_IN_ROUND_201 = getPax(15, 20).map((c, i) => ({
    ...c,
    roomType: i % 3 === 0 ? 'adultSingle' : 'adultTwin',
    bookedBy: 3,
    paymentStatus: 'paid',
    paymentDate: '2025-10-15',
    uniqueId: `${c.id}-201`,
    attachments: { passport: 'pass.pdf', ticket: 'ticket.pdf', insurance: 'ins.pdf', prepDoc: 'doc.pdf', visa: c.nationality !== 'THAI' ? 'visa.pdf' : null }
}));

// Round 301: 25 pax (Sold: 25) - Indices 35-59 (Large Group)
export const MOCK_PAX_IN_ROUND_301 = getPax(35, 25).map((c, i) => ({
    ...c,
    roomType: i % 4 === 0 ? 'adultSingle' : 'adultTwin',
    bookedBy: 2,
    paymentStatus: 'paid',
    paymentDate: '2025-11-01',
    uniqueId: `${c.id}-301`,
    attachments: { passport: 'pass.pdf', ticket: 'ticket.pdf', insurance: 'ins.pdf', prepDoc: 'doc.pdf', visa: c.nationality !== 'THAI' ? 'visa.pdf' : null }
}));

// Round 103: 12 pax (Sold: 12) - Indices 60-71 (Mix Group)
export const MOCK_PAX_IN_ROUND_103 = getPax(60, 12).map((c, i) => {
    let status = 'paid';
    if (i >= 8 && i < 10) status = 'partial';
    if (i >= 10) status = 'pending';
    return {
        ...c,
        roomType: 'adultTwin',
        bookedBy: 3,
        paymentStatus: status,
        paymentDate: status === 'pending' ? null : '2025-12-01',
        uniqueId: `${c.id}-103`,
        attachments: { passport: i < 8 ? 'pass.pdf' : null, visa: null }
    };
});

// Round 401: 20 pax (JP-TYO) - Indices 72-91
export const MOCK_PAX_IN_ROUND_401 = getPax(72, 20).map((c, i) => ({
    ...c,
    roomType: i % 2 === 0 ? 'adultTwin' : 'adultTwin',
    bookedBy: 2,
    paymentStatus: 'paid',
    paymentDate: '2025-11-01',
    uniqueId: `${c.id}-401`,
    attachments: { passport: 'pass.pdf', ticket: 'ticket.pdf', insurance: 'ins.pdf', prepDoc: 'doc.pdf' }
}));

// Round 402: 18 pax (KM-LS) - Indices 92-109
export const MOCK_PAX_IN_ROUND_402 = getPax(92, 18).map((c, i) => ({
    ...c,
    roomType: 'adultTwin',
    bookedBy: 3,
    paymentStatus: 'paid',
    paymentDate: '2025-11-15',
    uniqueId: `${c.id}-402`,
    attachments: { passport: 'pass.pdf', ticket: 'ticket.pdf', insurance: 'ins.pdf', prepDoc: 'doc.pdf' }
}));


// === INITIAL PAYMENTS / BOOKINGS ===
export const INITIAL_PAYMENTS = [
    {
        id: 1,
        bookingId: 101,
        routeId: 1,
        roundId: 101,
        saleId: 2, // K.Boy
        customerName: 'SOMCHAI JAIDEE GROUP',
        totalAmount: 72700,
        paidAmount: 10400,
        status: 'partial',
        createdAt: '2025-09-20',
        paxIds: MOCK_PAX_IN_ROUND_101.map(p => p.id),
        transactions: [
            { id: 1, date: '2025-09-21', amount: 10400, method: 'transfer', receipt: 'receipt_001.pdf', status: 'verified', verifiedBy: 1, verifiedAt: '2025-09-21' }
        ]
    },
    {
        id: 2,
        bookingId: 201,
        routeId: 2,
        roundId: 201,
        saleId: 3, // K.Anne
        customerName: 'CORPORATE BOOKING - ABC CO.',
        totalAmount: 668100,
        paidAmount: 668100,
        status: 'paid',
        createdAt: '2025-10-15',
        paxIds: MOCK_PAX_IN_ROUND_201.map(p => p.id),
        transactions: [
            { id: 2, date: '2025-10-16', amount: 668100, method: 'cheque', receipt: 'cheque_001.jpg', status: 'verified', verifiedBy: 1, verifiedAt: '2025-10-17' }
        ]
    },
    {
        id: 3,
        bookingId: 102,
        routeId: 1,
        roundId: 102,
        saleId: 4, // K.New
        customerName: 'WASIN GARNSOMDEE GROUP',
        totalAmount: 134500,
        paidAmount: 80700,
        status: 'partial',
        createdAt: '2025-10-01',
        paxIds: MOCK_PAX_IN_ROUND_102.map(p => p.id),
        transactions: [
            { id: 3, date: '2025-10-01', amount: 80700, method: 'transfer', receipt: 'receipt_002.pdf', status: 'verified', verifiedBy: 1, verifiedAt: '2025-10-02' }
        ]
    },
    {
        id: 4,
        bookingId: 401,
        routeId: 4,
        roundId: 401,
        saleId: 2, // K.Boy
        customerName: 'JAPAN TOUR GROUP',
        totalAmount: 858000,
        paidAmount: 858000,
        status: 'paid',
        createdAt: '2025-11-01',
        paxIds: MOCK_PAX_IN_ROUND_401.map(p => p.id),
        transactions: [
            { id: 4, date: '2025-11-01', amount: 858000, method: 'transfer', receipt: 'receipt_003.pdf', status: 'verified', verifiedBy: 1, verifiedAt: '2025-11-02' }
        ]
    },
    {
        id: 5,
        bookingId: 402,
        routeId: 2,
        roundId: 402,
        saleId: 3, // K.Anne
        customerName: 'CHINA TOUR GROUP',
        totalAmount: 588200,
        paidAmount: 588200,
        status: 'paid',
        createdAt: '2025-11-15',
        paxIds: MOCK_PAX_IN_ROUND_402.map(p => p.id),
        transactions: [
            { id: 5, date: '2025-11-15', amount: 588200, method: 'transfer', receipt: 'receipt_004.pdf', status: 'verified', verifiedBy: 1, verifiedAt: '2025-11-16' }
        ]
    },
    // Added Missing Payment for Round 103
    {
        id: 6,
        bookingId: 103,
        routeId: 1,
        roundId: 103,
        saleId: 3, // K.Anne
        customerName: 'MIX GROUP 103',
        totalAmount: 360000,
        paidAmount: 240000, // 8 paid * 30k approx
        status: 'partial',
        createdAt: '2025-12-01',
        paxIds: MOCK_PAX_IN_ROUND_103.map(p => p.id),
        transactions: [
            { id: 6, date: '2025-12-01', amount: 240000, method: 'transfer', receipt: 'receipt_005.pdf', status: 'verified', verifiedBy: 1, verifiedAt: '2025-12-02' }
        ]
    }
];

// === BANK ACCOUNTS ===
export const MOCK_BANK_ACCOUNTS = [
    { id: 1, bank: 'KBANK', accountName: 'บจก. รุ่งอนันต์ ทัวร์', accountNumber: '012-3-45678-9', branch: 'สำนักพหลโยธิน', color: 'bg-[#138f2d]' },
    { id: 2, bank: 'SCB', accountName: 'บจก. รุ่งอนันต์ ทัวร์', accountNumber: '987-6-54321-0', branch: 'เซ็นทรัลลาดพร้าว', color: 'bg-[#4e2e7f]' }
];

// === MOCK BOOKINGS ===
export const MOCK_BOOKINGS = [
    {
        id: 101,
        roundId: 101,
        saleId: 2, // K.Boy
        status: 'partial',
        pax: MOCK_PAX_IN_ROUND_101,
        customerName: 'SOMCHAI JAIDEE GROUP',
        contactName: 'SOMCHAI JAIDEE',
        contactPhone: '081-234-5678',
        saleName: 'K.Boy'
    },
    {
        id: 201,
        roundId: 201,
        saleId: 3, // K.Anne
        status: 'paid',
        pax: MOCK_PAX_IN_ROUND_201,
        customerName: 'CORPORATE BOOKING - ABC CO.',
        contactName: 'MR. ANCHOR',
        contactPhone: '02-999-9999',
        saleName: 'K.Anne'
    },
    {
        id: 102,
        roundId: 102,
        saleId: 4, // K.New
        status: 'partial',
        pax: MOCK_PAX_IN_ROUND_102,
        customerName: 'WASIN GARNSOMDEE GROUP',
        contactName: 'WASIN GARNSOMDEE',
        contactPhone: '092-123-4567',
        saleName: 'K.New'
    },
    {
        id: 401,
        roundId: 401,
        saleId: 2, // K.Boy
        status: 'paid',
        pax: MOCK_PAX_IN_ROUND_401,
        customerName: 'JAPAN TOUR GROUP',
        contactName: 'KENJI SATO',
        contactPhone: '081-222-3333',
        saleName: 'K.Boy'
    },
    {
        id: 402,
        roundId: 402,
        saleId: 3, // K.Anne
        status: 'paid',
        pax: MOCK_PAX_IN_ROUND_402,
        customerName: 'CHINA TOUR GROUP',
        contactName: 'WEI CHEN',
        contactPhone: '081-444-5555',
        saleName: 'K.Anne'
    },
    {
        id: 103,
        roundId: 103,
        saleId: 3, // K.Anne
        status: 'partial',
        pax: MOCK_PAX_IN_ROUND_103,
        customerName: 'MIX GROUP 103',
        contactName: 'SUWANNA WONG',
        contactPhone: '081-555-6667',
        saleName: 'K.Anne'
    },
    {
        id: 301,
        roundId: 301,
        saleId: 2, // K.Boy
        status: 'paid',
        pax: MOCK_PAX_IN_ROUND_301,
        customerName: 'LARGE GROUP 301',
        contactName: 'SOMCHAI (HEAD)',
        contactPhone: '081-111-2222',
        saleName: 'K.Boy'
    }
];

// === DOCUMENT MANAGEMENT SYSTEM ===

// Document Status Types
export const DOCUMENT_STATUS = {
    DRAFT: 'draft',           // ฉบับร่าง
    PENDING: 'pending',       // รอชำระ
    PARTIAL: 'partial',       // ชำระบางส่วน
    PAID: 'paid',             // ชำระแล้ว
    CANCELLED: 'cancelled'    // ยกเลิก
};

// Payment Methods
export const PAYMENT_METHODS = {
    CASH: 'cash',             // เงินสด
    TRANSFER: 'transfer',     // โอนเงิน
    QR_CODE: 'qr_code'        // QR Code จาก Payment Gateway
};

// === Billing Notes (ใบวางบิล) ===
export const INITIAL_BILLING_NOTES = [
    {
        id: 'BN-160126-001',
        paymentId: 1,
        roundId: 101,
        routeId: 1,
        groupId: 'GRP-101-001',
        customerName: 'SOMCHAI JAIDEE GROUP',
        billingType: 'group', // 'group' or 'individual'
        paxIds: [1, 2], // Customer IDs in this billing
        totalAmount: 51800, // ยอดทั้งหมดที่ต้องชำระ
        previousPaid: 10400, // ยอดที่ชำระไปแล้ว
        billingAmount: 41400, // ยอดที่วางบิลครั้งนี้
        status: 'pending', // 'pending', 'partial', 'paid'
        createdAt: '2026-01-15',
        createdBy: 2, // K.Boy
        dueDate: '2026-01-20',
        paymentMethod: null, // Selected when paying
        bankAccountId: null,
        note: 'กรุณาชำระภายในวันที่กำหนด'
    },
    {
        id: 'BN-160126-002',
        paymentId: 3,
        roundId: 102,
        routeId: 1,
        groupId: 'GRP-102-001',
        customerName: 'WASIN GARNSOMDEE GROUP',
        billingType: 'group',
        paxIds: [4, 7, 8],
        totalAmount: 134500,
        previousPaid: 80700,
        billingAmount: 53800,
        status: 'pending',
        createdAt: '2026-01-14',
        createdBy: 4, // K.New
        dueDate: '2026-01-18',
        paymentMethod: null,
        bankAccountId: null,
        note: ''
    },
    {
        id: 'BN-150126-001',
        paymentId: 6,
        roundId: 103,
        routeId: 1,
        groupId: null,
        customerName: 'INDIVIDUAL - SUNISA',
        billingType: 'individual',
        paxIds: [71],
        totalAmount: 29900,
        previousPaid: 0,
        billingAmount: 29900,
        status: 'paid',
        createdAt: '2026-01-13',
        createdBy: 3, // K.Anne
        dueDate: '2026-01-15',
        paymentMethod: 'transfer',
        bankAccountId: 1,
        paidAt: '2026-01-14',
        note: 'ลูกค้าโอนเงินสด'
    }
];

// === Receipts (ใบรับเงิน) ===
export const INITIAL_RECEIPTS = [
    {
        id: 'RCP-150126-001',
        billingNoteId: 'BN-150126-001',
        paymentId: 6,
        roundId: 103,
        routeId: 1,
        customerName: 'INDIVIDUAL - SUNISA',
        paxIds: [71],
        totalAmount: 29900,
        receiptAmount: 29900,
        paymentMethod: 'transfer',
        bankAccountId: 1,
        transferSlip: 'slip_sunisa_150126.jpg',
        status: 'issued', // 'issued', 'used_for_tax'
        createdAt: '2026-01-14',
        createdBy: 3,
        note: 'รับชำระเต็มจำนวน',
        usedForTaxInvoice: false,
        taxInvoiceId: null
    },
    {
        id: 'RCP-100126-001',
        billingNoteId: null,
        paymentId: 2,
        roundId: 201,
        routeId: 2,
        customerName: 'CORPORATE BOOKING - ABC CO.',
        paxIds: MOCK_PAX_IN_ROUND_201.map(p => p.id),
        totalAmount: 668100,
        receiptAmount: 668100,
        paymentMethod: 'transfer',
        bankAccountId: 2,
        transferSlip: 'cheque_abc_co.jpg',
        status: 'used_for_tax',
        createdAt: '2025-10-17',
        createdBy: 1,
        note: 'ชำระผ่านเช็คบริษัท',
        usedForTaxInvoice: true,
        taxInvoiceId: 'TAX-171025-001'
    }
];

// === Tax Invoices (ใบกำกับภาษี) ===
// Running number format: DDMMYY### (e.g., 160126001)
export const INITIAL_TAX_INVOICES = [
    {
        id: 'TAX-171025-001',
        runningNumber: '171025001',
        receiptIds: ['RCP-100126-001'],
        paymentId: 2,
        roundId: 201,
        routeId: 2,
        // Customer / Billing Info
        customerType: 'juridical', // 'individual' or 'juridical'
        customerName: 'บริษัท เอบีซี จำกัด',
        taxId: '0105556123456',
        address: '123/45 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
        // Amounts
        subtotal: 624392.52, // ก่อน VAT
        vatAmount: 43707.48, // VAT 7%
        totalAmount: 668100, // รวมทั้งสิ้น
        // Metadata
        status: 'issued', // 'draft', 'issued', 'cancelled'
        createdAt: '2025-10-17',
        createdBy: 1, // Manager only
        issuedAt: '2025-10-17',
        note: 'ออกใบกำกับภาษีสำหรับการจองทัวร์คุนหมิง'
    }
];

// Helper function to generate running number for tax invoice
// Running number is ONLY generated when Manager issues the tax invoice
// Format: DDMMYY### (e.g., 160126001)
export const generateTaxInvoiceNumber = (existingInvoices = [], date = new Date()) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    const datePrefix = `${dd}${mm}${yy}`;

    // Find existing invoices issued on the same date
    const todaysInvoices = existingInvoices.filter(inv =>
        inv.runningNumber && inv.runningNumber.startsWith(datePrefix)
    );

    // Get next sequence number
    const nextSeq = todaysInvoices.length + 1;
    const sequence = String(nextSeq).padStart(3, '0');

    return `${datePrefix}${sequence}`;
};

// QR Code Payment Gateway Config (Mock)
export const PAYMENT_GATEWAY_CONFIG = {
    enabled: true,
    provider: 'PromptPay', // or 'K PLUS', 'SCB Easy', etc.
    merchantId: '0123456789012',
    merchantName: 'บจก. รุ่งอนันต์ ทัวร์',
    // QR will be generated dynamically based on amount
    qrCodeBaseUrl: 'https://api.promptpay.io/generateQR?'
};
