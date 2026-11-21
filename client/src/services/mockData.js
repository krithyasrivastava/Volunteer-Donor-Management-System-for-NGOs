const STORAGE_KEY = 'gh_mock_data_v1';
const demoPassword = 'password123';

function dateFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export const initialMockData = {
  admins: [
    { admin_id: 1, name: 'Anita Rao', email: 'admin@ngo.org', password: demoPassword }
  ],
  volunteers: [
    { volunteer_id: 1, name: 'Priya Sharma', email: 'priya.sharma@mail.com', password: demoPassword, phone: '9876500001', address: 'Jodhpur, Rajasthan', availability: 'Weekends', status: 'Approved', joined_date: '2025-01-12', created_at: '2025-01-12T10:00:00.000Z' },
    { volunteer_id: 2, name: 'Rohit Verma', email: 'rohit.verma@mail.com', password: demoPassword, phone: '9876500002', address: 'Jaipur, Rajasthan', availability: 'Flexible', status: 'Approved', joined_date: '2025-02-03', created_at: '2025-02-03T10:00:00.000Z' },
    { volunteer_id: 3, name: 'Ananya Gupta', email: 'ananya.gupta@mail.com', password: demoPassword, phone: '9876500003', address: 'Delhi', availability: 'Weekdays', status: 'Approved', joined_date: '2025-02-18', created_at: '2025-02-18T10:00:00.000Z' },
    { volunteer_id: 4, name: 'Karan Mehta', email: 'karan.mehta@mail.com', password: demoPassword, phone: '9876500004', address: 'Udaipur, Rajasthan', availability: 'Evenings', status: 'Pending', joined_date: '2025-03-05', created_at: '2025-03-05T10:00:00.000Z' },
    { volunteer_id: 5, name: 'Sneha Iyer', email: 'sneha.iyer@mail.com', password: demoPassword, phone: '9876500005', address: 'Bengaluru', availability: 'Weekends', status: 'Approved', joined_date: '2025-03-10', created_at: '2025-03-10T10:00:00.000Z' },
    { volunteer_id: 6, name: 'Arjun Nair', email: 'arjun.nair@mail.com', password: demoPassword, phone: '9876500006', address: 'Kochi', availability: 'Flexible', status: 'Approved', joined_date: '2025-03-22', created_at: '2025-03-22T10:00:00.000Z' },
    { volunteer_id: 7, name: 'Ishita Singh', email: 'ishita.singh@mail.com', password: demoPassword, phone: '9876500007', address: 'Jodhpur, Rajasthan', availability: 'Weekends', status: 'Rejected', joined_date: '2025-04-01', created_at: '2025-04-01T10:00:00.000Z' },
    { volunteer_id: 8, name: 'Vikram Rathore', email: 'vikram.rathore@mail.com', password: demoPassword, phone: '9876500008', address: 'Jodhpur, Rajasthan', availability: 'Weekdays', status: 'Approved', joined_date: '2025-04-14', created_at: '2025-04-14T10:00:00.000Z' },
    { volunteer_id: 9, name: 'Meera Joshi', email: 'meera.joshi@mail.com', password: demoPassword, phone: '9876500009', address: 'Ajmer, Rajasthan', availability: 'Flexible', status: 'Approved', joined_date: '2025-05-02', created_at: '2025-05-02T10:00:00.000Z' },
    { volunteer_id: 10, name: 'Aditya Kapoor', email: 'aditya.kapoor@mail.com', password: demoPassword, phone: '9876500010', address: 'Mumbai', availability: 'Evenings', status: 'Inactive', joined_date: '2025-05-19', created_at: '2025-05-19T10:00:00.000Z' },
    { volunteer_id: 11, name: 'Neha Chawla', email: 'neha.chawla@mail.com', password: demoPassword, phone: '9876500011', address: 'Pune', availability: 'Weekends', status: 'Approved', joined_date: '2025-06-01', created_at: '2025-06-01T10:00:00.000Z' },
    { volunteer_id: 12, name: 'Rahul Bansal', email: 'rahul.bansal@mail.com', password: demoPassword, phone: '9876500012', address: 'Jodhpur, Rajasthan', availability: 'Weekdays', status: 'Pending', joined_date: '2025-06-20', created_at: '2025-06-20T10:00:00.000Z' }
  ],
  donors: [
    { donor_id: 1, name: 'Suresh Agarwal', email: 'suresh.agarwal@mail.com', password: demoPassword, phone: '9911100001', address: 'Jodhpur, Rajasthan', donor_type: 'Individual', created_at: '2025-01-05T10:00:00.000Z' },
    { donor_id: 2, name: 'Kavita Malhotra', email: 'kavita.malhotra@mail.com', password: demoPassword, phone: '9911100002', address: 'Jaipur, Rajasthan', donor_type: 'Individual', created_at: '2025-02-11T10:00:00.000Z' },
    { donor_id: 3, name: 'Sunrise Traders Pvt Ltd', email: 'contact@sunrisetraders.com', password: demoPassword, phone: '9911100003', address: 'Jodhpur, Rajasthan', donor_type: 'Organization', created_at: '2025-02-20T10:00:00.000Z' },
    { donor_id: 4, name: 'Deepak Choudhary', email: 'deepak.choudhary@mail.com', password: demoPassword, phone: '9911100004', address: 'Bikaner, Rajasthan', donor_type: 'Individual', created_at: '2025-03-08T10:00:00.000Z' },
    { donor_id: 5, name: 'Green Earth Foundation', email: 'info@greenearthfdn.org', password: demoPassword, phone: '9911100005', address: 'Delhi', donor_type: 'Organization', created_at: '2025-03-15T10:00:00.000Z' },
    { donor_id: 6, name: 'Ritu Bhandari', email: 'ritu.bhandari@mail.com', password: demoPassword, phone: '9911100006', address: 'Jodhpur, Rajasthan', donor_type: 'Individual', created_at: '2025-04-02T10:00:00.000Z' },
    { donor_id: 7, name: 'Manish Oswal', email: 'manish.oswal@mail.com', password: demoPassword, phone: '9911100007', address: 'Jodhpur, Rajasthan', donor_type: 'Individual', created_at: '2025-04-25T10:00:00.000Z' },
    { donor_id: 8, name: 'TechNova Solutions', email: 'csr@technova.com', password: demoPassword, phone: '9911100008', address: 'Bengaluru', donor_type: 'Organization', created_at: '2025-05-10T10:00:00.000Z' }
  ],
  skills: [
    { skill_id: 1, skill_name: 'Teaching', description: 'Tutoring and classroom facilitation' },
    { skill_id: 2, skill_name: 'Food Distribution', description: 'Packing and distributing food kits' },
    { skill_id: 3, skill_name: 'Event Management', description: 'Planning and coordinating on-ground logistics' },
    { skill_id: 4, skill_name: 'First Aid', description: 'Basic medical and emergency response' },
    { skill_id: 5, skill_name: 'Fundraising', description: 'Donor outreach and campaign support' },
    { skill_id: 6, skill_name: 'Social Media', description: 'Content creation and online promotion' },
    { skill_id: 7, skill_name: 'Team Work', description: 'Collaborative on-ground support' },
    { skill_id: 8, skill_name: 'Photography', description: 'Event documentation' }
  ],
  volunteer_skills: [
    { volunteer_id: 1, skill_id: 2, proficiency: 'Expert' }, { volunteer_id: 1, skill_id: 3, proficiency: 'Intermediate' }, { volunteer_id: 1, skill_id: 7, proficiency: 'Expert' },
    { volunteer_id: 2, skill_id: 2, proficiency: 'Intermediate' }, { volunteer_id: 2, skill_id: 4, proficiency: 'Expert' }, { volunteer_id: 2, skill_id: 7, proficiency: 'Intermediate' },
    { volunteer_id: 3, skill_id: 1, proficiency: 'Expert' }, { volunteer_id: 3, skill_id: 6, proficiency: 'Intermediate' },
    { volunteer_id: 4, skill_id: 3, proficiency: 'Beginner' }, { volunteer_id: 4, skill_id: 5, proficiency: 'Intermediate' },
    { volunteer_id: 5, skill_id: 1, proficiency: 'Intermediate' }, { volunteer_id: 5, skill_id: 4, proficiency: 'Expert' }, { volunteer_id: 5, skill_id: 7, proficiency: 'Intermediate' },
    { volunteer_id: 6, skill_id: 2, proficiency: 'Expert' }, { volunteer_id: 6, skill_id: 3, proficiency: 'Expert' }, { volunteer_id: 6, skill_id: 7, proficiency: 'Expert' },
    { volunteer_id: 8, skill_id: 2, proficiency: 'Intermediate' }, { volunteer_id: 8, skill_id: 4, proficiency: 'Intermediate' }, { volunteer_id: 8, skill_id: 7, proficiency: 'Beginner' },
    { volunteer_id: 9, skill_id: 5, proficiency: 'Expert' }, { volunteer_id: 9, skill_id: 6, proficiency: 'Expert' },
    { volunteer_id: 11, skill_id: 1, proficiency: 'Intermediate' }, { volunteer_id: 11, skill_id: 8, proficiency: 'Expert' }
  ],
  events: [
    { event_id: 1, event_name: 'Food Distribution Drive', description: 'Packing and distributing food kits to underprivileged families.', event_date: dateFromToday(7), start_time: '09:00:00', end_time: '13:00:00', location: 'Community Hall, Jodhpur', required_volunteers: 8, status: 'Upcoming', created_by: 1 },
    { event_id: 2, event_name: 'Tree Plantation Program', description: 'Plantation drive along the city ring road to improve green cover.', event_date: dateFromToday(14), start_time: '07:00:00', end_time: '10:00:00', location: 'Ring Road, Jodhpur', required_volunteers: 15, status: 'Upcoming', created_by: 1 },
    { event_id: 3, event_name: 'Cloth Donation Camp', description: 'Collection and sorting of donated clothes for winter distribution.', event_date: dateFromToday(0), start_time: '10:00:00', end_time: '16:00:00', location: 'City Ground, Jodhpur', required_volunteers: 6, status: 'Ongoing', created_by: 1 },
    { event_id: 4, event_name: 'Education for All Workshop', description: 'Free weekend tutoring workshop for children from nearby slums.', event_date: '2025-08-30', start_time: '10:00:00', end_time: '13:00:00', location: 'Govt. School No. 4, Jodhpur', required_volunteers: 5, status: 'Completed', created_by: 1 },
    { event_id: 5, event_name: 'Health Awareness Camp', description: 'Free health checkup and first-aid awareness camp for senior citizens.', event_date: dateFromToday(30), start_time: '09:00:00', end_time: '14:00:00', location: 'Community Hall, Jodhpur', required_volunteers: 10, status: 'Upcoming', created_by: 1 },
    { event_id: 6, event_name: 'Winter Blanket Drive', description: 'Distribution of blankets to homeless individuals before winter.', event_date: '2025-08-15', start_time: '08:00:00', end_time: '12:00:00', location: 'Railway Station Area, Jodhpur', required_volunteers: 6, status: 'Completed', created_by: 1 }
  ],
  event_requirements: [
    { event_id: 1, skill_id: 2, required_count: 4 }, { event_id: 1, skill_id: 3, required_count: 2 }, { event_id: 1, skill_id: 7, required_count: 4 },
    { event_id: 2, skill_id: 3, required_count: 3 }, { event_id: 2, skill_id: 7, required_count: 10 },
    { event_id: 3, skill_id: 2, required_count: 2 }, { event_id: 3, skill_id: 7, required_count: 4 },
    { event_id: 4, skill_id: 1, required_count: 4 }, { event_id: 4, skill_id: 6, required_count: 1 },
    { event_id: 5, skill_id: 4, required_count: 5 }, { event_id: 5, skill_id: 3, required_count: 2 },
    { event_id: 6, skill_id: 2, required_count: 3 }, { event_id: 6, skill_id: 7, required_count: 3 }
  ],
  event_volunteers: [
    { event_id: 1, volunteer_id: 1, status: 'Approved', hours: 0 },
    { event_id: 1, volunteer_id: 6, status: 'Approved', hours: 0 },
    { event_id: 1, volunteer_id: 2, status: 'Applied', hours: 0 },
    { event_id: 2, volunteer_id: 2, status: 'Approved', hours: 0 },
    { event_id: 2, volunteer_id: 5, status: 'Applied', hours: 0 },
    { event_id: 3, volunteer_id: 1, status: 'Approved', hours: 0 },
    { event_id: 3, volunteer_id: 6, status: 'Approved', hours: 0 },
    { event_id: 3, volunteer_id: 8, status: 'Applied', hours: 0 },
    { event_id: 4, volunteer_id: 3, status: 'Completed', hours: 3.5 },
    { event_id: 4, volunteer_id: 9, status: 'Completed', hours: 3.5 },
    { event_id: 4, volunteer_id: 1, status: 'Completed', hours: 3 },
    { event_id: 5, volunteer_id: 5, status: 'Applied', hours: 0 },
    { event_id: 5, volunteer_id: 2, status: 'Applied', hours: 0 },
    { event_id: 6, volunteer_id: 6, status: 'Completed', hours: 4 },
    { event_id: 6, volunteer_id: 8, status: 'Completed', hours: 4 },
    { event_id: 6, volunteer_id: 11, status: 'Completed', hours: 3.5 }
  ],
  donations: [
    { donation_id: 1, donor_id: 1, amount: 5000, donation_type: 'Money', purpose: 'Food Distribution Drive', donation_date: '2026-09-01', payment_method: 'UPI', transaction_id: 'TXN10001', status: 'Completed' },
    { donation_id: 2, donor_id: 1, amount: 2500, donation_type: 'Money', purpose: 'General Fund', donation_date: '2026-09-10', payment_method: 'Card', transaction_id: 'TXN10002', status: 'Completed' },
    { donation_id: 3, donor_id: 2, amount: 1200, donation_type: 'Money', purpose: 'Education for All Workshop', donation_date: '2026-08-20', payment_method: 'UPI', transaction_id: 'TXN10003', status: 'Completed' },
    { donation_id: 4, donor_id: 3, amount: 50000, donation_type: 'Money', purpose: 'Health Awareness Camp', donation_date: '2026-08-28', payment_method: 'Bank Transfer', transaction_id: 'TXN10004', status: 'Completed' },
    { donation_id: 5, donor_id: 3, amount: 15000, donation_type: 'Money', purpose: 'Tree Plantation Program', donation_date: '2026-09-05', payment_method: 'Bank Transfer', transaction_id: 'TXN10005', status: 'Pending' },
    { donation_id: 6, donor_id: 4, amount: 0, donation_type: 'Clothes', purpose: 'Cloth Donation Camp', donation_date: '2026-09-12', payment_method: 'N/A', transaction_id: 'TXN10006', status: 'Completed' },
    { donation_id: 7, donor_id: 5, amount: 30000, donation_type: 'Money', purpose: 'Winter Blanket Drive', donation_date: '2026-08-05', payment_method: 'Bank Transfer', transaction_id: 'TXN10007', status: 'Completed' },
    { donation_id: 8, donor_id: 5, amount: 0, donation_type: 'Other', purpose: 'Winter Blanket Drive', donation_date: '2026-08-06', payment_method: 'N/A', transaction_id: 'TXN10008', status: 'Completed' },
    { donation_id: 9, donor_id: 6, amount: 800, donation_type: 'Money', purpose: 'General Fund', donation_date: '2026-09-15', payment_method: 'UPI', transaction_id: 'TXN10009', status: 'Completed' },
    { donation_id: 10, donor_id: 7, amount: 0, donation_type: 'Books', purpose: 'Education for All Workshop', donation_date: '2026-08-18', payment_method: 'N/A', transaction_id: 'TXN10010', status: 'Completed' },
    { donation_id: 11, donor_id: 8, amount: 75000, donation_type: 'Money', purpose: 'General Fund', donation_date: '2026-07-30', payment_method: 'Bank Transfer', transaction_id: 'TXN10011', status: 'Completed' },
    { donation_id: 12, donor_id: 2, amount: 3000, donation_type: 'Money', purpose: 'Food Distribution Drive', donation_date: '2026-09-18', payment_method: 'Cash', transaction_id: 'TXN10012', status: 'Pending' },
    { donation_id: 13, donor_id: 1, amount: 0, donation_type: 'Food', purpose: 'Food Distribution Drive', donation_date: '2026-09-19', payment_method: 'N/A', transaction_id: 'TXN10013', status: 'Completed' },
    { donation_id: 14, donor_id: 6, amount: 1500, donation_type: 'Money', purpose: 'Health Awareness Camp', donation_date: '2026-09-08', payment_method: 'Cheque', transaction_id: 'TXN10014', status: 'Cancelled' },
    { donation_id: 15, donor_id: 4, amount: 4200, donation_type: 'Money', purpose: 'General Fund', donation_date: '2026-06-25', payment_method: 'UPI', transaction_id: 'TXN10015', status: 'Completed' },
    { donation_id: 16, donor_id: 7, amount: 900, donation_type: 'Money', purpose: 'General Fund', donation_date: '2026-07-12', payment_method: 'Card', transaction_id: 'TXN10016', status: 'Completed' }
  ]
};

export function loadMockData() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  const initial = structuredClone(initialMockData);
  saveMockData(initial);
  return initial;
}

export function saveMockData(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetMockData() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem('gh_token');
  window.localStorage.removeItem('gh_role');
}
