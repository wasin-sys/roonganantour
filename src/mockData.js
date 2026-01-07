
// Mock Data for Tour System

// === USERS (Staff) ===
export const MOCK_USERS = [
    { id: 1, name: 'K.Admin', role: 'MANAGER', commission: 0, avatar: 'https://i.pravatar.cc/150?u=1', email: 'admin@tour.com' },
    { id: 2, name: 'K.Boy', role: 'SALE', commission: 3, avatar: 'https://i.pravatar.cc/150?u=2', email: 'boy@tour.com' },
    { id: 3, name: 'K.Anne', role: 'SALE', commission: 5, avatar: 'https://i.pravatar.cc/150?u=3', email: 'anne@tour.com' },
    { id: 4, name: 'K.New', role: 'SALE', commission: 2, avatar: 'https://i.pravatar.cc/150?u=4', email: 'new@tour.com' },
    { id: 5, name: 'K.Guide1', role: 'GUIDE', commission: 0, avatar: 'https://i.pravatar.cc/150?u=5', email: 'guide1@tour.com' }
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
        description: 'Explore the wonders of Beijing including the Great Wall, Forbidden City, and the magical Universal Studios.'
    },
    {
        id: 2,
        name: 'KUNMING - LIJIANG - SHANGRI-LA 6D5N',
        code: 'KM-LS',
        price: 32900,
        duration: '6D5N',
        image: 'https://images.chinahighlights.com/allpicture/2024/08/d09f58648bf547418c54ce3e6790c0af_cut_2560x800_296_1722698401.jpg',
        description: 'A breathtaking journey through the landscapes of Yunnan, visiting ancient towns and snow-capped mountains.'
    },
    {
        id: 3,
        name: 'CHENGDU - JIUHAIGOU 5D4N',
        code: 'CD-JH',
        price: 28900,
        duration: '5D4N',
        image: 'https://www.asiaodysseytravel.com/images/china-tours/banner/fcd009-chengdu-jiuzhaigou-zhangjiajie-tour.jpg',
        description: 'Visit the home of giant pandas and the crystal clear waters of Jiuzhaigou National Park.'
    },
    {
        id: 4,
        name: 'JAPAN - TOKYO FUJI NIKKO 6D4N',
        code: 'JP-TYO',
        price: 42900,
        duration: '6D4N',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=300&h=200',
        description: 'Experience the perfect blend of modern Tokyo and traditional Japan with breathtaking views of Mt. Fuji.'
    }
];

// === ROUNDS ===
export const MOCK_ROUNDS = [
    {
        id: 101,
        routeId: 1,
        date: '12-16 OCT 2025',
        airline: 'TG',
        flight: 'TG614',
        seats: 25,
        sold: 3,
        status: 'Selling',
        headId: 2,
        head: 'K.Boy',
        price: { adultTwin: 25900, adultSingle: 30900, adultTriple: 24900, childBed: 23900, childNoBed: 20900 }
    },
    {
        id: 102,
        routeId: 1,
        date: '19-23 OCT 2025',
        airline: 'CA',
        flight: 'CA980',
        seats: 30,
        sold: 5,
        status: 'Selling',
        headId: 4,
        head: 'K.New',
        price: { adultTwin: 26900, adultSingle: 31900, adultTriple: 25900, childBed: 24900, childNoBed: 21900 }
    },
    {
        id: 201,
        routeId: 2,
        date: '20-25 NOV 2025',
        airline: 'MU',
        flight: 'MU742',
        seats: 20,
        sold: 20,
        status: 'Full',
        headId: 3,
        head: 'K.Anne',
        price: { adultTwin: 32900, adultSingle: 38900, adultTriple: 30900, childBed: 28900, childNoBed: 25000 }
    },
    {
        id: 301,
        routeId: 3,
        date: '05-10 DEC 2025',
        airline: 'TG',
        flight: 'TG618',
        seats: 25,
        sold: 25,
        status: 'Full',
        headId: 2,
        head: 'K.Boy',
        price: { adultTwin: 28900, adultSingle: 34900, adultTriple: 26900, childBed: 24900, childNoBed: 21000 }
    },
    {
        id: 103,
        routeId: 1,
        date: '25-29 DEC 2025',
        airline: 'TG',
        flight: 'TG614',
        seats: 25,
        sold: 12,
        status: 'Selling',
        headId: 3,
        head: 'K.Anne',
        price: { adultTwin: 29900, adultSingle: 35900, adultTriple: 28900, childBed: 27900, childNoBed: 24900 }
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
    birthplace: '',
    nationality: 'THAI',
    phone: '',
    email: '',
    lineId: '',
    remark: '',
    attachments: { passport: null, visa: null, ticket: null, insurance: null },
    ownerId: null
};

// Extended customer list for realistic data
const CUSTOMER_TEMPLATES = [
    { id: 1, title: 'MR', firstNameEn: 'SOMCHAI', lastNameEn: 'JAIDEE', firstNameTh: 'สมชาย', lastNameTh: 'ใจดี', gender: 'M', dob: '1980-04-15', passportNo: 'AA1234567', nationality: 'THAI', phone: '081-234-5678', ownerId: 2 },
    { id: 2, title: 'MRS', firstNameEn: 'SUDA', lastNameEn: 'JAIDEE', firstNameTh: 'สุดา', lastNameTh: 'ใจดี', gender: 'F', dob: '1982-05-20', passportNo: 'AA1234568', nationality: 'THAI', phone: '089-999-8888', ownerId: 2 },
    { id: 3, title: 'MS', firstNameEn: 'LUCY', lastNameEn: 'LIU', firstNameTh: 'ลูซี่', lastNameTh: 'หลิว', gender: 'F', dob: '2015-02-12', passportNo: 'US987654321', nationality: 'USA', phone: '+1-555-0199', ownerId: 3 },
    { id: 4, title: 'MR', firstNameEn: 'WASIN', lastNameEn: 'GARNSOMDEE', firstNameTh: 'วศิน', lastNameTh: 'การสมดี', gender: 'M', dob: '1990-08-25', passportNo: 'AA84684645', nationality: 'THAI', phone: '092-123-4567', ownerId: 1 },
    { id: 5, title: 'MR', firstNameEn: 'JOHN', lastNameEn: 'DOE', firstNameTh: 'จอห์น', lastNameTh: 'โด', gender: 'M', dob: '1985-06-10', passportNo: 'UK1234567', nationality: 'UK', phone: '+44-20-1234-5678', ownerId: 3 },
    { id: 6, title: 'MRS', firstNameEn: 'JANE', lastNameEn: 'DOE', firstNameTh: 'เจน', lastNameTh: 'โด', gender: 'F', dob: '1987-03-22', passportNo: 'UK1234568', nationality: 'UK', phone: '+44-20-1234-5679', ownerId: 3 },
    { id: 7, title: 'MR', firstNameEn: 'TANAKORN', lastNameEn: 'SRISUK', firstNameTh: 'ธนากร', lastNameTh: 'ศรีสุข', gender: 'M', dob: '1975-11-08', passportNo: 'AA5678901', nationality: 'THAI', phone: '086-111-2222', ownerId: 2 },
    { id: 8, title: 'MRS', firstNameEn: 'NATTAYA', lastNameEn: 'SRISUK', firstNameTh: 'ณัฐญา', lastNameTh: 'ศรีสุข', gender: 'F', dob: '1978-09-14', passportNo: 'AA5678902', nationality: 'THAI', phone: '086-111-2223', ownerId: 2 },
    { id: 9, title: 'MR', firstNameEn: 'PRASERT', lastNameEn: 'WONG', firstNameTh: 'ประเสริฐ', lastNameTh: 'วงศ์', gender: 'M', dob: '1965-01-30', passportNo: 'AA7890123', nationality: 'THAI', phone: '081-555-6666', ownerId: 3 },
    { id: 10, title: 'MRS', firstNameEn: 'SUWANNA', lastNameEn: 'WONG', firstNameTh: 'สุวรรณา', lastNameTh: 'วงศ์', gender: 'F', dob: '1968-07-19', passportNo: 'AA7890124', nationality: 'THAI', phone: '081-555-6667', ownerId: 3 },
    { id: 11, title: 'MR', firstNameEn: 'KITTIPONG', lastNameEn: 'CHAI', firstNameTh: 'กิตติพงศ์', lastNameTh: 'ไชย', gender: 'M', dob: '1992-12-05', passportNo: 'AA2345678', nationality: 'THAI', phone: '095-999-8888', ownerId: 4 },
    { id: 12, title: 'MS', firstNameEn: 'PIMCHANOK', lastNameEn: 'SUWAN', firstNameTh: 'พิมพ์ชนก', lastNameTh: 'สุวรรณ', gender: 'F', dob: '1995-04-18', passportNo: 'AA2345679', nationality: 'THAI', phone: '095-999-8889', ownerId: 4 },
    { id: 13, title: 'MR', firstNameEn: 'ANUWAT', lastNameEn: 'PHAN', firstNameTh: 'อนุวัฒน์', lastNameTh: 'พันธุ์', gender: 'M', dob: '1988-06-22', passportNo: 'AA3456789', nationality: 'THAI', phone: '089-123-4567', ownerId: 2 },
    { id: 14, title: 'MRS', firstNameEn: 'PORNPIMOL', lastNameEn: 'PHAN', firstNameTh: 'พรพิมล', lastNameTh: 'พันธุ์', gender: 'F', dob: '1990-08-10', passportNo: 'AA3456790', nationality: 'THAI', phone: '089-123-4568', ownerId: 2 },
    { id: 15, title: 'MSTR', firstNameEn: 'PAKIN', lastNameEn: 'PHAN', firstNameTh: 'ภากิน', lastNameTh: 'พันธุ์', gender: 'M', dob: '2016-03-15', passportNo: 'AA3456791', nationality: 'THAI', phone: '', ownerId: 2 },
    { id: 16, title: 'MR', firstNameEn: 'WEERACHAI', lastNameEn: 'KHAM', firstNameTh: 'วีระชัย', lastNameTh: 'คำ', gender: 'M', dob: '1970-10-25', passportNo: 'AA4567890', nationality: 'THAI', phone: '084-222-3333', ownerId: 3 },
    { id: 17, title: 'MRS', firstNameEn: 'SUNISA', lastNameEn: 'KHAM', firstNameTh: 'สุนิสา', lastNameTh: 'คำ', gender: 'F', dob: '1973-02-14', passportNo: 'AA4567891', nationality: 'THAI', phone: '084-222-3334', ownerId: 3 },
    { id: 18, title: 'MR', firstNameEn: 'CHEN', lastNameEn: 'WEI', firstNameTh: 'เฉิน', lastNameTh: 'เวย', gender: 'M', dob: '1983-09-08', passportNo: 'CN1234567', nationality: 'CHINA', phone: '+86-138-0000-1111', ownerId: 3 },
    { id: 19, title: 'MRS', firstNameEn: 'LI', lastNameEn: 'NA', firstNameTh: 'หลี่', lastNameTh: 'นา', gender: 'F', dob: '1985-11-20', passportNo: 'CN1234568', nationality: 'CHINA', phone: '+86-138-0000-1112', ownerId: 3 },
    { id: 20, title: 'MR', firstNameEn: 'THAWATCHAI', lastNameEn: 'BOON', firstNameTh: 'ธวัชชัย', lastNameTh: 'บุญ', gender: 'M', dob: '1979-05-30', passportNo: 'AA5678903', nationality: 'THAI', phone: '087-444-5555', ownerId: 2 },
    { id: 21, title: 'MRS', firstNameEn: 'RATCHANEE', lastNameEn: 'BOON', firstNameTh: 'รัชนี', lastNameTh: 'บุญ', gender: 'F', dob: '1981-12-01', passportNo: 'AA5678904', nationality: 'THAI', phone: '087-444-5556', ownerId: 2 },
    { id: 22, title: 'MR', firstNameEn: 'SOMSAK', lastNameEn: 'THONG', firstNameTh: 'สมศักดิ์', lastNameTh: 'ทอง', gender: 'M', dob: '1960-08-15', passportNo: 'AA6789012', nationality: 'THAI', phone: '081-666-7777', ownerId: 3 },
    { id: 23, title: 'MRS', firstNameEn: 'BOONMA', lastNameEn: 'THONG', firstNameTh: 'บุญมา', lastNameTh: 'ทอง', gender: 'F', dob: '1962-04-22', passportNo: 'AA6789013', nationality: 'THAI', phone: '081-666-7778', ownerId: 3 },
    { id: 24, title: 'MR', firstNameEn: 'NARONG', lastNameEn: 'SIRI', firstNameTh: 'ณรงค์', lastNameTh: 'ศิริ', gender: 'M', dob: '1977-07-07', passportNo: 'AA7890125', nationality: 'THAI', phone: '089-888-9999', ownerId: 2 },
    { id: 25, title: 'MRS', firstNameEn: 'WILAI', lastNameEn: 'SIRI', firstNameTh: 'วิไล', lastNameTh: 'ศิริ', gender: 'F', dob: '1980-01-25', passportNo: 'AA7890126', nationality: 'THAI', phone: '089-888-9998', ownerId: 2 },
    { id: 26, title: 'MR', firstNameEn: 'PIYAWAT', lastNameEn: 'KEO', firstNameTh: 'ปิยวัฒน์', lastNameTh: 'แก้ว', gender: 'M', dob: '1993-03-12', passportNo: 'AA8901234', nationality: 'THAI', phone: '096-111-2222', ownerId: 4 },
    { id: 27, title: 'MS', firstNameEn: 'NATTHIDA', lastNameEn: 'DAN', firstNameTh: 'ณัฐธิดา', lastNameTh: 'แดน', gender: 'F', dob: '1996-06-28', passportNo: 'AA8901235', nationality: 'THAI', phone: '096-111-2223', ownerId: 4 },
    { id: 28, title: 'MR', firstNameEn: 'SAKCHAI', lastNameEn: 'MONG', firstNameTh: 'ศักดิ์ชัย', lastNameTh: 'มง', gender: 'M', dob: '1972-09-18', passportNo: 'AA9012345', nationality: 'THAI', phone: '083-333-4444', ownerId: 2 },
    { id: 29, title: 'MRS', firstNameEn: 'CHANTRA', lastNameEn: 'MONG', firstNameTh: 'จันทรา', lastNameTh: 'มง', gender: 'F', dob: '1975-11-30', passportNo: 'AA9012346', nationality: 'THAI', phone: '083-333-4445', ownerId: 2 },
    { id: 30, title: 'MR', firstNameEn: 'WISIT', lastNameEn: 'PHON', firstNameTh: 'วิศิษฐ์', lastNameTh: 'พล', gender: 'M', dob: '1968-02-28', passportNo: 'AA0123456', nationality: 'THAI', phone: '082-444-5555', ownerId: 3 }
];

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

// === BOOKING / PAX IN ROUNDS ===
// Round 101: 3 pax (Sold: 3)
export const MOCK_PAX_IN_ROUND_101 = [
    { ...MOCK_CUSTOMERS_DB[0], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'partial', paymentDate: '2025-09-21', uniqueId: '1-101' },
    { ...MOCK_CUSTOMERS_DB[1], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'partial', paymentDate: '2025-09-21', uniqueId: '2-101' },
    { ...MOCK_CUSTOMERS_DB[2], roomType: 'childNoBed', bookedBy: 3, paymentStatus: 'pending', paymentDate: null, uniqueId: '3-101' }
];

// Round 102: 5 pax (Sold: 5)
export const MOCK_PAX_IN_ROUND_102 = [
    { ...MOCK_CUSTOMERS_DB[3], roomType: 'adultTwin', bookedBy: 4, paymentStatus: 'paid', paymentDate: '2025-10-01', uniqueId: '4-102' },
    { ...MOCK_CUSTOMERS_DB[4], roomType: 'adultTwin', bookedBy: 4, paymentStatus: 'paid', paymentDate: '2025-10-01', uniqueId: '5-102' },
    { ...MOCK_CUSTOMERS_DB[5], roomType: 'adultSingle', bookedBy: 4, paymentStatus: 'paid', paymentDate: '2025-10-02', uniqueId: '6-102' },
    { ...MOCK_CUSTOMERS_DB[6], roomType: 'adultTwin', bookedBy: 4, paymentStatus: 'partial', paymentDate: '2025-10-03', uniqueId: '7-102' },
    { ...MOCK_CUSTOMERS_DB[7], roomType: 'adultTwin', bookedBy: 4, paymentStatus: 'partial', paymentDate: '2025-10-03', uniqueId: '8-102' }
];

// Round 201: 20 pax (Sold: 20) - Full Group
export const MOCK_PAX_IN_ROUND_201 = [
    { ...MOCK_CUSTOMERS_DB[0], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-10', uniqueId: '1-201' },
    { ...MOCK_CUSTOMERS_DB[1], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-10', uniqueId: '2-201' },
    { ...MOCK_CUSTOMERS_DB[6], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-11', uniqueId: '7-201' },
    { ...MOCK_CUSTOMERS_DB[7], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-11', uniqueId: '8-201' },
    { ...MOCK_CUSTOMERS_DB[8], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-12', uniqueId: '9-201' },
    { ...MOCK_CUSTOMERS_DB[9], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-12', uniqueId: '10-201' },
    { ...MOCK_CUSTOMERS_DB[10], roomType: 'adultSingle', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-13', uniqueId: '11-201' },
    { ...MOCK_CUSTOMERS_DB[11], roomType: 'adultSingle', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-13', uniqueId: '12-201' },
    { ...MOCK_CUSTOMERS_DB[12], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-14', uniqueId: '13-201' },
    { ...MOCK_CUSTOMERS_DB[13], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-14', uniqueId: '14-201' },
    { ...MOCK_CUSTOMERS_DB[14], roomType: 'childNoBed', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-14', uniqueId: '15-201' },
    { ...MOCK_CUSTOMERS_DB[15], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-15', uniqueId: '16-201' },
    { ...MOCK_CUSTOMERS_DB[16], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-15', uniqueId: '17-201' },
    { ...MOCK_CUSTOMERS_DB[17], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-16', uniqueId: '18-201' },
    { ...MOCK_CUSTOMERS_DB[18], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-16', uniqueId: '19-201' },
    { ...MOCK_CUSTOMERS_DB[19], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-17', uniqueId: '20-201' },
    { ...MOCK_CUSTOMERS_DB[20], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-17', uniqueId: '21-201' },
    { ...MOCK_CUSTOMERS_DB[21], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-18', uniqueId: '22-201' },
    { ...MOCK_CUSTOMERS_DB[22], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-18', uniqueId: '23-201' },
    { ...MOCK_CUSTOMERS_DB[23], roomType: 'adultSingle', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-10-19', uniqueId: '24-201' }
];

// Round 301: 25 pax (Sold: 25) - Full Group
export const MOCK_PAX_IN_ROUND_301 = [
    { ...MOCK_CUSTOMERS_DB[0], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-01', uniqueId: '1-301' },
    { ...MOCK_CUSTOMERS_DB[1], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-01', uniqueId: '2-301' },
    { ...MOCK_CUSTOMERS_DB[6], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-02', uniqueId: '7-301' },
    { ...MOCK_CUSTOMERS_DB[7], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-02', uniqueId: '8-301' },
    { ...MOCK_CUSTOMERS_DB[8], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-03', uniqueId: '9-301' },
    { ...MOCK_CUSTOMERS_DB[9], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-03', uniqueId: '10-301' },
    { ...MOCK_CUSTOMERS_DB[10], roomType: 'adultSingle', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-04', uniqueId: '11-301' },
    { ...MOCK_CUSTOMERS_DB[11], roomType: 'adultSingle', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-04', uniqueId: '12-301' },
    { ...MOCK_CUSTOMERS_DB[12], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-05', uniqueId: '13-301' },
    { ...MOCK_CUSTOMERS_DB[13], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-05', uniqueId: '14-301' },
    { ...MOCK_CUSTOMERS_DB[14], roomType: 'childNoBed', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-05', uniqueId: '15-301' },
    { ...MOCK_CUSTOMERS_DB[15], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-06', uniqueId: '16-301' },
    { ...MOCK_CUSTOMERS_DB[16], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-06', uniqueId: '17-301' },
    { ...MOCK_CUSTOMERS_DB[17], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-07', uniqueId: '18-301' },
    { ...MOCK_CUSTOMERS_DB[18], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-07', uniqueId: '19-301' },
    { ...MOCK_CUSTOMERS_DB[19], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-08', uniqueId: '20-301' },
    { ...MOCK_CUSTOMERS_DB[20], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-08', uniqueId: '21-301' },
    { ...MOCK_CUSTOMERS_DB[21], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-09', uniqueId: '22-301' },
    { ...MOCK_CUSTOMERS_DB[22], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-09', uniqueId: '23-301' },
    { ...MOCK_CUSTOMERS_DB[23], roomType: 'adultSingle', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-10', uniqueId: '24-301' },
    { ...MOCK_CUSTOMERS_DB[24], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-10', uniqueId: '25-301' },
    { ...MOCK_CUSTOMERS_DB[25], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-11', uniqueId: '26-301' },
    { ...MOCK_CUSTOMERS_DB[26], roomType: 'adultSingle', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-11', uniqueId: '27-301' },
    { ...MOCK_CUSTOMERS_DB[27], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-12', uniqueId: '28-301' },
    { ...MOCK_CUSTOMERS_DB[28], roomType: 'adultTwin', bookedBy: 2, paymentStatus: 'paid', paymentDate: '2025-11-12', uniqueId: '29-301' }
];

// Round 103: 12 pax (Sold: 12)
export const MOCK_PAX_IN_ROUND_103 = [
    { ...MOCK_CUSTOMERS_DB[3], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-12-01', uniqueId: '4-103' },
    { ...MOCK_CUSTOMERS_DB[4], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-12-01', uniqueId: '5-103' },
    { ...MOCK_CUSTOMERS_DB[5], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'paid', paymentDate: '2025-12-02', uniqueId: '6-103' },
    { ...MOCK_CUSTOMERS_DB[6], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'partial', paymentDate: '2025-12-02', uniqueId: '7-103' },
    { ...MOCK_CUSTOMERS_DB[7], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'partial', paymentDate: '2025-12-03', uniqueId: '8-103' },
    { ...MOCK_CUSTOMERS_DB[8], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'partial', paymentDate: '2025-12-03', uniqueId: '9-103' },
    { ...MOCK_CUSTOMERS_DB[9], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'pending', paymentDate: null, uniqueId: '10-103' },
    { ...MOCK_CUSTOMERS_DB[10], roomType: 'adultSingle', bookedBy: 3, paymentStatus: 'pending', paymentDate: null, uniqueId: '11-103' },
    { ...MOCK_CUSTOMERS_DB[11], roomType: 'adultSingle', bookedBy: 3, paymentStatus: 'pending', paymentDate: null, uniqueId: '12-103' },
    { ...MOCK_CUSTOMERS_DB[12], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'pending', paymentDate: null, uniqueId: '13-103' },
    { ...MOCK_CUSTOMERS_DB[13], roomType: 'adultTwin', bookedBy: 3, paymentStatus: 'pending', paymentDate: null, uniqueId: '14-103' },
    { ...MOCK_CUSTOMERS_DB[14], roomType: 'childNoBed', bookedBy: 3, paymentStatus: 'pending', paymentDate: null, uniqueId: '15-103' }
];

// === INITIAL PAYMENTS / BOOKINGS ===
export const INITIAL_PAYMENTS = [
    {
        id: 1,
        bookingId: 101,
        routeId: 1,
        roundId: 101,
        saleId: 2,
        customerName: 'SOMCHAI JAIDEE GROUP',
        totalAmount: 72700,
        paidAmount: 30000,
        status: 'partial',
        createdAt: '2025-09-20',
        transactions: [
            { id: 1, date: '2025-09-21', amount: 30000, method: 'transfer', receipt: 'receipt_001.pdf', status: 'verified', verifiedBy: 1, verifiedAt: '2025-09-21' }
        ]
    },
    {
        id: 2,
        bookingId: 201,
        routeId: 2,
        roundId: 201,
        saleId: 3,
        customerName: 'CORPORATE BOOKING - ABC CO.',
        totalAmount: 658000,
        paidAmount: 658000,
        status: 'paid',
        createdAt: '2025-10-15',
        transactions: [
            { id: 2, date: '2025-10-16', amount: 658000, method: 'cheque', receipt: 'cheque_001.jpg', status: 'verified', verifiedBy: 1, verifiedAt: '2025-10-17' }
        ]
    }
];
