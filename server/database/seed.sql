-- ================================================================
-- Seed / demo data
-- All demo accounts use password: password123
-- ================================================================
USE volunteer_donor_management;

SET @PW = '$2b$10$KGtol0o2zztjQNuL0KdIG.RQDmzKcZfa7Qnj2s8xDSSDXAgOug8WG';

-- ---------------- Admin ----------------
INSERT INTO admins (name, email, password) VALUES
('Anita Rao', 'admin@ngo.org', @PW);

-- ---------------- Skills ----------------
INSERT INTO skills (skill_name, description) VALUES
('Teaching', 'Tutoring and classroom facilitation'),
('Food Distribution', 'Packing and distributing food kits'),
('Event Management', 'Planning and coordinating on-ground logistics'),
('First Aid', 'Basic medical and emergency response'),
('Fundraising', 'Donor outreach and campaign support'),
('Social Media', 'Content creation and online promotion'),
('Team Work', 'Collaborative on-ground support'),
('Photography', 'Event documentation');

-- ---------------- Volunteers ----------------
INSERT INTO volunteers (name, email, password, phone, address, availability, status, joined_date) VALUES
('Priya Sharma',   'priya.sharma@mail.com',   @PW, '9876500001', 'Jodhpur, Rajasthan',   'Weekends',  'Approved', '2025-01-12'),
('Rohit Verma',    'rohit.verma@mail.com',    @PW, '9876500002', 'Jaipur, Rajasthan',    'Flexible',  'Approved', '2025-02-03'),
('Ananya Gupta',   'ananya.gupta@mail.com',   @PW, '9876500003', 'Delhi',                'Weekdays',  'Approved', '2025-02-18'),
('Karan Mehta',    'karan.mehta@mail.com',    @PW, '9876500004', 'Udaipur, Rajasthan',   'Evenings',  'Pending',  '2025-03-05'),
('Sneha Iyer',     'sneha.iyer@mail.com',     @PW, '9876500005', 'Bengaluru',            'Weekends',  'Approved', '2025-03-10'),
('Arjun Nair',     'arjun.nair@mail.com',     @PW, '9876500006', 'Kochi',                'Flexible',  'Approved', '2025-03-22'),
('Ishita Singh',   'ishita.singh@mail.com',   @PW, '9876500007', 'Jodhpur, Rajasthan',   'Weekends',  'Rejected', '2025-04-01'),
('Vikram Rathore', 'vikram.rathore@mail.com', @PW, '9876500008', 'Jodhpur, Rajasthan',   'Weekdays',  'Approved', '2025-04-14'),
('Meera Joshi',    'meera.joshi@mail.com',    @PW, '9876500009', 'Ajmer, Rajasthan',     'Flexible',  'Approved', '2025-05-02'),
('Aditya Kapoor',  'aditya.kapoor@mail.com',  @PW, '9876500010', 'Mumbai',               'Evenings',  'Inactive', '2025-05-19'),
('Neha Chawla',    'neha.chawla@mail.com',    @PW, '9876500011', 'Pune',                 'Weekends',  'Approved', '2025-06-01'),
('Rahul Bansal',   'rahul.bansal@mail.com',   @PW, '9876500012', 'Jodhpur, Rajasthan',   'Weekdays',  'Pending',  '2025-06-20');

-- ---------------- Volunteer Skills ----------------
INSERT INTO volunteer_skills (volunteer_id, skill_id, proficiency) VALUES
(1, 2, 'Expert'), (1, 3, 'Intermediate'), (1, 7, 'Expert'),
(2, 2, 'Intermediate'), (2, 4, 'Expert'), (2, 7, 'Intermediate'),
(3, 1, 'Expert'), (3, 6, 'Intermediate'),
(4, 3, 'Beginner'), (4, 5, 'Intermediate'),
(5, 1, 'Intermediate'), (5, 4, 'Expert'), (5, 7, 'Intermediate'),
(6, 2, 'Expert'), (6, 3, 'Expert'), (6, 7, 'Expert'),
(8, 2, 'Intermediate'), (8, 4, 'Intermediate'), (8, 7, 'Beginner'),
(9, 5, 'Expert'), (9, 6, 'Expert'),
(11, 1, 'Intermediate'), (11, 8, 'Expert');

-- ---------------- Events ----------------
INSERT INTO events (event_name, description, event_date, start_time, end_time, location, required_volunteers, status, created_by) VALUES
('Food Distribution Drive', 'Packing and distributing food kits to underprivileged families.', '2026-10-05', '09:00:00', '13:00:00', 'Community Hall, Jodhpur', 8, 'Upcoming', 1),
('Tree Plantation Program', 'Plantation drive along the city ring road to improve green cover.', '2026-10-12', '07:00:00', '10:00:00', 'Ring Road, Jodhpur', 15, 'Upcoming', 1),
('Cloth Donation Camp', 'Collection and sorting of donated clothes for winter distribution.', '2026-09-25', '10:00:00', '16:00:00', 'City Ground, Jodhpur', 6, 'Ongoing', 1),
('Education for All Workshop', 'Free weekend tutoring workshop for children from nearby slums.', '2026-08-30', '10:00:00', '13:00:00', 'Govt. School No. 4, Jodhpur', 5, 'Completed', 1),
('Health Awareness Camp', 'Free health checkup and first-aid awareness camp for senior citizens.', '2026-11-02', '09:00:00', '14:00:00', 'Community Hall, Jodhpur', 10, 'Upcoming', 1),
('Winter Blanket Drive', 'Distribution of blankets to homeless individuals before winter.', '2026-08-15', '08:00:00', '12:00:00', 'Railway Station Area, Jodhpur', 6, 'Completed', 1);

-- ---------------- Event Requirements ----------------
INSERT INTO event_requirements (event_id, skill_id, required_count) VALUES
(1, 2, 4), (1, 3, 2), (1, 7, 4),
(2, 3, 3), (2, 7, 10),
(3, 2, 2), (3, 7, 4),
(4, 1, 4), (4, 6, 1),
(5, 4, 5), (5, 3, 2),
(6, 2, 3), (6, 7, 3);

-- ---------------- Event Volunteers ----------------
INSERT INTO event_volunteers (event_id, volunteer_id, status, hours) VALUES
(1, 1, 'Approved', 0), (1, 6, 'Approved', 0), (1, 2, 'Applied', 0),
(2, 2, 'Approved', 0), (2, 5, 'Applied', 0),
(3, 1, 'Approved', 0), (3, 6, 'Approved', 0), (3, 8, 'Applied', 0),
(4, 3, 'Completed', 3.5), (4, 9, 'Completed', 3.5), (4, 1, 'Completed', 3),
(5, 5, 'Applied', 0), (5, 2, 'Applied', 0),
(6, 6, 'Completed', 4), (6, 8, 'Completed', 4), (6, 11, 'Completed', 3.5);

-- ---------------- Donors ----------------
INSERT INTO donors (name, email, password, phone, address, donor_type, created_at) VALUES
('Suresh Agarwal',        'suresh.agarwal@mail.com', @PW, '9911100001', 'Jodhpur, Rajasthan', 'Individual',   '2025-01-05 10:00:00'),
('Kavita Malhotra',       'kavita.malhotra@mail.com', @PW, '9911100002', 'Jaipur, Rajasthan',  'Individual',   '2025-02-11 10:00:00'),
('Sunrise Traders Pvt Ltd','contact@sunrisetraders.com', @PW, '9911100003', 'Jodhpur, Rajasthan', 'Organization', '2025-02-20 10:00:00'),
('Deepak Choudhary',      'deepak.choudhary@mail.com', @PW, '9911100004', 'Bikaner, Rajasthan', 'Individual',   '2025-03-08 10:00:00'),
('Green Earth Foundation','info@greenearthfdn.org',    @PW, '9911100005', 'Delhi',              'Organization', '2025-03-15 10:00:00'),
('Ritu Bhandari',         'ritu.bhandari@mail.com',    @PW, '9911100006', 'Jodhpur, Rajasthan', 'Individual',   '2025-04-02 10:00:00'),
('Manish Oswal',          'manish.oswal@mail.com',     @PW, '9911100007', 'Jodhpur, Rajasthan', 'Individual',   '2025-04-25 10:00:00'),
('TechNova Solutions',    'csr@technova.com',          @PW, '9911100008', 'Bengaluru',          'Organization', '2025-05-10 10:00:00');

-- ---------------- Donations ----------------
INSERT INTO donations (donor_id, amount, donation_type, purpose, donation_date, payment_method, transaction_id, status) VALUES
(1, 5000.00, 'Money',   'Food Distribution Drive',      '2026-09-01', 'UPI',           'TXN10001', 'Completed'),
(1, 2500.00, 'Money',   'General Fund',                 '2026-09-10', 'Card',          'TXN10002', 'Completed'),
(2, 1200.00, 'Money',   'Education for All Workshop',   '2026-08-20', 'UPI',           'TXN10003', 'Completed'),
(3, 50000.00,'Money',   'Health Awareness Camp',        '2026-08-28', 'Bank Transfer', 'TXN10004', 'Completed'),
(3, 15000.00,'Money',   'Tree Plantation Program',      '2026-09-05', 'Bank Transfer', 'TXN10005', 'Pending'),
(4, 0.00,    'Clothes', 'Cloth Donation Camp',          '2026-09-12', 'N/A',           'TXN10006', 'Completed'),
(5, 30000.00,'Money',   'Winter Blanket Drive',         '2026-08-05', 'Bank Transfer', 'TXN10007', 'Completed'),
(5, 0.00,    'Other',   'Winter Blanket Drive',         '2026-08-06', 'N/A',           'TXN10008', 'Completed'),
(6, 800.00,  'Money',   'General Fund',                 '2026-09-15', 'UPI',           'TXN10009', 'Completed'),
(7, 0.00,    'Books',   'Education for All Workshop',   '2026-08-18', 'N/A',           'TXN10010', 'Completed'),
(8, 75000.00,'Money',   'General Fund',                 '2026-07-30', 'Bank Transfer', 'TXN10011', 'Completed'),
(2, 3000.00, 'Money',   'Food Distribution Drive',      '2026-09-18', 'Cash',          'TXN10012', 'Pending'),
(1, 0.00,    'Food',    'Food Distribution Drive',      '2026-09-19', 'N/A',           'TXN10013', 'Completed'),
(6, 1500.00, 'Money',   'Health Awareness Camp',        '2026-09-08', 'Cheque',        'TXN10014', 'Cancelled'),
(4, 4200.00, 'Money',   'General Fund',                 '2026-06-25', 'UPI',           'TXN10015', 'Completed'),
(7, 900.00,  'Money',   'General Fund',                 '2026-07-12', 'Card',          'TXN10016', 'Completed');
