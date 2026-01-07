export const MOCK_ROUTES = [
    { id: 1, name: 'BEIJING - UNIVERSAL STUDIO 5D4N', code: 'BJ-US', price: 25900, duration: '5D4N', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 2, name: 'KUNMING - LIJIANG - SHANGRI-LA 6D5N', code: 'KM-LS', price: 32900, duration: '6D5N', image: 'https://images.unsplash.com/photo-1527684651001-705ed533005b?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 3, name: 'CHENGDU - JIUHAIGOU 5D4N', code: 'CD-JH', price: 28900, duration: '5D4N', image: 'https://images.unsplash.com/photo-1620984846468-b7692131972f?auto=format&fit=crop&q=80&w=300&h=200' },
];

export const MOCK_ROUNDS = [
    { id: 101, routeId: 1, date: '12-16 OCT 2025', airline: 'TG', flight: 'TG614', seats: 25, sold: 2, status: 'Selling', head: 'K.Boy' },
    { id: 102, routeId: 1, date: '19-23 OCT 2025', airline: 'CA', flight: 'CA980', seats: 30, sold: 5, status: 'Selling', head: 'Unassigned' },
    { id: 201, routeId: 2, date: '20-25 NOV 2025', airline: 'MU', flight: 'MU742', seats: 20, sold: 20, status: 'Full', head: 'K.Anne' },
    { id: 301, routeId: 3, date: '05-10 DEC 2025', airline: 'TG', flight: 'TG618', seats: 25, sold: 25, status: 'Full', head: 'K.Somchai' },
    { id: 103, routeId: 1, date: '25-29 DEC 2025', airline: 'TG', flight: 'TG614', seats: 25, sold: 12, status: 'Selling', head: 'Unassigned' },
];

export const INITIAL_BLACKLIST_DATA = [
    { id: 1, name: 'SOMBAT BADGUY', passport: 'A00000000', reason: 'หนีทัวร์ปี 2023' },
    { id: 2, name: 'SOMSAK TROUBLE', passport: 'A11111111', reason: 'เมาสุราอาละวาด สร้างความวุ่นวาย' }
];

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
    remark: ''
};

export const MOCK_CUSTOMERS_DB = [
    {
        id: 1,
        title: 'MR',
        firstNameEn: 'SOMCHAI',
        lastNameEn: 'JAIDEE',
        firstNameTh: 'สมชาย',
        lastNameTh: 'ใจดี',
        gender: 'M',
        dob: '1980-04-15',
        passportNo: 'AA1234567',
        passportIssue: '2020-01-01',
        passportExpire: '2025-01-01', // Expiring soon for demo
        birthplace: 'BANGKOK',
        nationality: 'THAI',
        phone: '081-234-5678',
        remark: 'แพ้อาหารทะเล'
    },
    {
        id: 2,
        title: 'MRS',
        firstNameEn: 'SUDA',
        lastNameEn: 'JAIDEE',
        firstNameTh: 'สุดา',
        lastNameTh: 'ใจดี',
        gender: 'F',
        dob: '1982-05-20',
        passportNo: 'AA1234568',
        passportIssue: '2021-06-15',
        passportExpire: '2026-06-14',
        birthplace: 'CHIANG MAI',
        nationality: 'THAI',
        phone: '089-999-8888',
        remark: ''
    },
    {
        id: 3,
        title: 'MS',
        firstNameEn: 'LUCY',
        lastNameEn: 'LIU',
        firstNameTh: 'ลูซี่',
        lastNameTh: 'หลิว',
        gender: 'F',
        dob: '1990-02-12',
        passportNo: 'US987654321',
        passportIssue: '2022-01-01',
        passportExpire: '2032-01-01',
        birthplace: 'NEW YORK',
        nationality: 'USA',
        phone: '+1-555-0199',
        remark: 'Need Visa'
    }
];

export const MOCK_PAX_IN_ROUND_101 = [
    { ...MOCK_CUSTOMERS_DB[0], room: '101' },
    { ...MOCK_CUSTOMERS_DB[1], room: '101' },
    { ...MOCK_CUSTOMERS_DB[2], room: '102' }
];
