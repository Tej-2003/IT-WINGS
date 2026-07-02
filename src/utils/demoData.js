// Demo seeding data for Survey Application

export const DEMO_USERS = [
  { id: 1, name: 'Admin User', user: 'admin', pass: 'admin123', role: 'admin', zone: '' },
  { id: 2, name: 'Ravi Kumar', user: 'officer1', pass: 'pass123', role: 'off', zone: 'North Zone' },
  { id: 3, name: 'Suresh M', user: 'officer2', pass: 'pass123', role: 'off', zone: 'South Zone' },
  { id: 4, name: 'Priya S', user: 'officer3', pass: 'pass123', role: 'off', zone: 'East Zone' },
];

const dt = (daysAgo, hh, mm) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hh, mm, 0, 0);
  return d;
};

const ds = (d) => d.toISOString().split('T')[0];

export const getDemoVisits = () => [
  {
    id: Date.now() + 1,
    offId: 2,
    offName: 'Ravi Kumar',
    co: 'Sri Lakshmi Textiles',
    asn: 'WD-2024-101',
    dno: '14',
    st: 'Mount Road',
    reg: 'register',
    contact: '9884012345',
    docs: { gst: false, pan: false },
    desc: '',
    wd: '12',
    zn: 'North Zone',
    isNew: false,
    pay: 'paid',
    amt: 4500,
    appStatus: '',
    appRemarks: '',
    lat: '13.082700',
    lng: '80.270700',
    ph: null,
    phf: null,
    ts: dt(0, 9, 20).toISOString(),
    date: ds(dt(0, 9, 20))
  },
  {
    id: Date.now() + 2,
    offId: 2,
    offName: 'Ravi Kumar',
    co: 'Balaji Hardware',
    asn: '',
    dno: '22',
    st: 'Anna Nagar',
    reg: 'register',
    contact: '9884012345',
    docs: { gst: false, pan: false },
    desc: '',
    wd: '14',
    zn: 'North Zone',
    isNew: true,
    pay: 'not_paid',
    amt: 0,
    appStatus: 'others',
    appRemarks: 'Owner unavailable, will revisit next week',
    lat: '13.099800',
    lng: '80.284900',
    ph: null,
    phf: null,
    ts: dt(0, 13, 5).toISOString(),
    date: ds(dt(0, 13, 5))
  },
  {
    id: Date.now() + 3,
    offId: 3,
    offName: 'Suresh M',
    co: 'Madurai Silks',
    asn: 'WD-2024-205',
    dno: '9',
    st: 'South Veli Street',
    reg: 'register',
    contact: '9843056789',
    docs: { gst: false, pan: false },
    desc: '',
    wd: '7',
    zn: 'South Zone',
    isNew: false,
    pay: 'paid',
    amt: 6200,
    appStatus: '',
    appRemarks: '',
    lat: '9.925200',
    lng: '78.119800',
    ph: null,
    phf: null,
    ts: dt(2, 11, 40).toISOString(),
    date: ds(dt(2, 11, 40))
  },
  {
    id: Date.now() + 4,
    offId: 3,
    offName: 'Suresh M',
    co: 'Green Valley Apartments',
    asn: '',
    dno: '5',
    st: 'Bypass Road',
    reg: 'register',
    contact: '9843056789',
    docs: { gst: false, pan: false },
    desc: '',
    wd: '9',
    zn: 'South Zone',
    isNew: true,
    pay: 'not_paid',
    amt: 0,
    appStatus: 'approval',
    appRemarks: 'Awaiting society committee approval',
    lat: '9.933500',
    lng: '78.131200',
    ph: null,
    phf: null,
    ts: dt(0, 10, 30).toISOString(),
    date: ds(dt(0, 10, 30))
  },
  {
    id: Date.now() + 5,
    offId: 4,
    offName: 'Priya S',
    co: 'City Bakers',
    asn: 'WD-2024-310',
    dno: '3',
    st: 'Market Street',
    reg: 'register',
    contact: '9791023456',
    docs: { gst: false, pan: false },
    desc: '',
    wd: '3',
    zn: 'East Zone',
    isNew: false,
    pay: 'paid',
    amt: 1800,
    appStatus: '',
    appRemarks: '',
    lat: '13.050000',
    lng: '80.220000',
    ph: null,
    phf: null,
    ts: dt(0, 9, 55).toISOString(),
    date: ds(dt(0, 9, 55))
  },
  {
    id: Date.now() + 6,
    offId: 4,
    offName: 'Priya S',
    co: 'Om Sai Traders',
    asn: '',
    dno: '17',
    st: 'Temple Street',
    reg: 'register',
    contact: '9791023456',
    docs: { gst: false, pan: false },
    desc: '',
    wd: '4',
    zn: 'East Zone',
    isNew: true,
    pay: 'not_paid',
    amt: 0,
    appStatus: 'close',
    appRemarks: 'Shop permanently closed — marked closed',
    lat: '13.054800',
    lng: '80.224600',
    ph: null,
    phf: null,
    ts: dt(3, 15, 10).toISOString(),
    date: ds(dt(3, 15, 10))
  },
  {
    id: Date.now() + 7,
    offId: 2,
    offName: 'Ravi Kumar',
    co: 'Annapurna Stores',
    asn: '',
    dno: '8',
    st: 'Gandhi Road',
    reg: 'register',
    contact: '9884012345',
    docs: { gst: false, pan: false },
    desc: '',
    wd: '12',
    zn: 'North Zone',
    isNew: true,
    pay: 'not_paid',
    amt: 0,
    appStatus: 'doc_collection',
    appRemarks: 'Owner requested 2 days to gather documents',
    lat: '13.089000',
    lng: '80.275000',
    ph: null,
    phf: null,
    ts: dt(1, 16, 0).toISOString(),
    date: ds(dt(1, 16, 0))
  },
];

export const getDemoAttendance = () => {
  const A = [];
  [2, 3, 4].forEach((offId, oi) => {
    const name = ['Ravi Kumar', 'Suresh M', 'Priya S'][oi];
    for (let day = 3; day >= 0; day--) {
      const isAbsent = (offId === 4 && day === 2);
      const isOffice = (offId === 3 && day === 1);
      const status = isAbsent ? 'absent' : isOffice ? 'office' : 'present';
      A.push({
        id: Date.now() + offId * 10 + day,
        offId,
        offName: name,
        date: ds(dt(day, 9, 30)),
        status,
        presentTime: isAbsent ? '' : dt(day, 9, 30).toLocaleTimeString('en-IN'),
        remarks: isAbsent ? 'Down with fever, on medical leave' : '',
        lat: '13.08' + (20 + oi) + '00',
        lng: '80.27' + (10 + oi) + '00',
        ts: dt(day, 9, 30).toISOString()
      });
    }
  });
  return A;
};

export const getDemoTrack = () => {
  const T = {};
  T[2] = {
    name: 'Ravi Kumar',
    lastSeen: dt(0, 13, 5).toISOString(),
    pts: [
      { lat: '13.082700', lng: '80.270700', ts: dt(0, 9, 5).toISOString() },
      { lat: '13.089000', lng: '80.275000', ts: dt(0, 9, 40).toISOString() },
      { lat: '13.095000', lng: '80.280000', ts: dt(0, 11, 15).toISOString() },
      { lat: '13.099800', lng: '80.284900', ts: dt(0, 13, 5).toISOString() }
    ]
  };
  T[3] = {
    name: 'Suresh M',
    lastSeen: dt(0, 10, 30).toISOString(),
    pts: [
      { lat: '9.925200', lng: '78.119800', ts: dt(0, 9, 15).toISOString() },
      { lat: '9.929000', lng: '78.124000', ts: dt(0, 9, 50).toISOString() },
      { lat: '9.933500', lng: '78.131200', ts: dt(0, 10, 30).toISOString() }
    ]
  };
  T[4] = {
    name: 'Priya S',
    lastSeen: dt(0, 9, 55).toISOString(),
    pts: [
      { lat: '13.050000', lng: '80.220000', ts: dt(0, 9, 20).toISOString() },
      { lat: '13.052500', lng: '80.222500', ts: dt(0, 9, 55).toISOString() }
    ]
  };
  return T;
};
