import { loadMockData, saveMockData } from './mockData.js';

const clone = (value) => structuredClone(value);
const compareDateDesc = (a, b) => String(b).localeCompare(String(a));
const nextId = (rows, key) => rows.reduce((max, row) => Math.max(max, Number(row[key]) || 0), 0) + 1;
const today = () => new Date().toISOString().slice(0, 10);

function fail(message, status = 400) {
  const error = new Error(message);
  error.response = { status, data: { message } };
  throw error;
}

function withoutPassword(user) {
  const { password, ...publicUser } = user;
  return clone(publicUser);
}

function userFromToken(data) {
  const token = window.localStorage.getItem('gh_token') || '';
  const match = token.match(/^gh-mock:(admin|volunteer|donor):(\d+)$/);
  if (!match) return null;

  const [, role, id] = match;
  const key = role === 'admin' ? 'admins' : `${role}s`;
  const idKey = `${role}_id`;
  const user = data[key].find((item) => Number(item[idKey]) === Number(id));
  return user ? { role, user } : null;
}

function requireUser(data, role) {
  const session = userFromToken(data);
  if (!session || (role && session.role !== role)) {
    fail('Please log in to continue.', 401);
  }
  return session;
}

function createSession(data, user, role) {
  const id = user[`${role}_id`];
  return { token: `gh-mock:${role}:${id}`, role, user: withoutPassword(user) };
}

function volunteerProfile(data, volunteer) {
  const skills = data.volunteer_skills
    .filter((entry) => entry.volunteer_id === volunteer.volunteer_id)
    .map((entry) => ({
      ...data.skills.find((skill) => skill.skill_id === entry.skill_id),
      proficiency: entry.proficiency
    }))
    .sort((a, b) => a.skill_name.localeCompare(b.skill_name));

  const events = data.event_volunteers
    .filter((entry) => entry.volunteer_id === volunteer.volunteer_id)
    .map((entry) => {
      const event = data.events.find((item) => item.event_id === entry.event_id);
      return event && {
        event_id: event.event_id,
        event_name: event.event_name,
        event_date: event.event_date,
        event_status: event.status,
        participation_status: entry.status,
        hours: Number(entry.hours) || 0
      };
    })
    .filter(Boolean)
    .sort((a, b) => compareDateDesc(a.event_date, b.event_date));

  return {
    ...withoutPassword(volunteer),
    skills,
    events,
    total_hours: events.reduce((sum, event) => sum + event.hours, 0),
    completed_activities: events.filter((event) => event.participation_status === 'Completed').length
  };
}

function donorProfile(data, donor) {
  const donations = data.donations
    .filter((donation) => donation.donor_id === donor.donor_id)
    .sort((a, b) => compareDateDesc(a.donation_date, b.donation_date));

  return {
    ...withoutPassword(donor),
    donations: clone(donations),
    total_donated: donations
      .filter((donation) => donation.status === 'Completed')
      .reduce((sum, donation) => sum + Number(donation.amount), 0)
  };
}

function eventDetail(data, event) {
  const requirements = data.event_requirements
    .filter((entry) => entry.event_id === event.event_id)
    .map((entry) => ({
      requirement_id: entry.requirement_id ?? `${entry.event_id}-${entry.skill_id}`,
      skill_id: entry.skill_id,
      skill_name: data.skills.find((skill) => skill.skill_id === entry.skill_id)?.skill_name,
      required_count: entry.required_count
    }));

  const volunteers = data.event_volunteers
    .filter((entry) => entry.event_id === event.event_id)
    .map((entry) => {
      const volunteer = data.volunteers.find((item) => item.volunteer_id === entry.volunteer_id);
      return volunteer && {
        volunteer_id: volunteer.volunteer_id,
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        status: entry.status,
        hours: Number(entry.hours) || 0,
        registration_date: entry.registration_date || volunteer.created_at
      };
    })
    .filter(Boolean)
    .sort((a, b) => compareDateDesc(a.registration_date, b.registration_date));

  return { ...clone(event), requirements, volunteers };
}

function donationWithDonor(data, donation) {
  const donor = data.donors.find((item) => item.donor_id === donation.donor_id);
  return {
    ...clone(donation),
    donor_name: donor?.name,
    donor_email: donor?.email,
    donor_phone: donor?.phone
  };
}

function getVolunteer(data, id) {
  const volunteer = data.volunteers.find((item) => item.volunteer_id === Number(id));
  if (!volunteer) fail('Volunteer not found.', 404);
  return volunteer;
}

function getDonor(data, id) {
  const donor = data.donors.find((item) => item.donor_id === Number(id));
  if (!donor) fail('Donor not found.', 404);
  return donor;
}

function getEvent(data, id) {
  const event = data.events.find((item) => item.event_id === Number(id));
  if (!event) fail('Event not found.', 404);
  return event;
}

function getDonation(data, id) {
  const donation = data.donations.find((item) => item.donation_id === Number(id));
  if (!donation) fail('Donation not found.', 404);
  return donation;
}

function getVolunteerHours(data, volunteerId) {
  return data.event_volunteers
    .filter((entry) => entry.volunteer_id === volunteerId)
    .reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);
}

function scoreVolunteer(data, volunteer, requiredSkillIds) {
  const skills = data.volunteer_skills
    .filter((entry) => entry.volunteer_id === volunteer.volunteer_id)
    .map((entry) => ({
      ...entry,
      skill_name: data.skills.find((skill) => skill.skill_id === entry.skill_id)?.skill_name
    }));
  const matched = skills.filter((skill) => requiredSkillIds.includes(skill.skill_id));
  const coverage = requiredSkillIds.length ? matched.length / requiredSkillIds.length : (skills.length ? 1 : 0);
  const proficiency = { Beginner: 1, Intermediate: 2, Expert: 3 };
  const average = matched.length
    ? matched.reduce((sum, skill) => sum + (proficiency[skill.proficiency] || 2), 0) / matched.length
    : 0;
  const matchScore = Math.min(100, Math.round(coverage * 70 + (volunteer.availability === 'Flexible' ? 20 : 12) + average / 3 * 10));

  return {
    volunteer_id: volunteer.volunteer_id,
    name: volunteer.name,
    email: volunteer.email,
    availability: volunteer.availability,
    matched_skills: matched.map((skill) => skill.skill_name),
    matched_count: matched.length,
    match_score: matchScore
  };
}

function completedMoneyDonations(data) {
  return data.donations.filter((donation) => donation.status === 'Completed' && donation.donation_type === 'Money');
}

function monthlyDonations(data) {
  const months = new Map();
  completedMoneyDonations(data).forEach((donation) => {
    const month = donation.donation_date.slice(0, 7);
    months.set(month, (months.get(month) || 0) + Number(donation.amount));
  });
  return [...months]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }));
}

// These service signatures mirror the REST API, but all reads and writes stay in this browser.
export const authService = {
  login: async ({ role, email, password }) => {
    const data = loadMockData();
    const key = role === 'admin' ? 'admins' : `${role}s`;
    if (!['admin', 'volunteer', 'donor'].includes(role)) fail('Invalid role specified.');
    const user = data[key].find((item) => item.email.toLowerCase() === String(email).toLowerCase());
    if (!user || user.password !== password) fail('Invalid email or password.', 401);
    if (role === 'volunteer' && user.status === 'Rejected') {
      fail('Your volunteer application was rejected. Contact the admin for details.', 403);
    }
    if (role === 'volunteer' && user.status === 'Inactive') {
      fail('Your volunteer account is inactive. Contact the admin for details.', 403);
    }
    return createSession(data, user, role);
  },
  register: async ({ role, name, email, password, phone, address, availability, donor_type }) => {
    if (!['volunteer', 'donor'].includes(role)) fail('Self-registration is only available for volunteers and donors.');
    if (!name || !email || !password) fail('Name, email and password are required.');

    const data = loadMockData();
    const records = data[`${role}s`];
    if (records.some((item) => item.email.toLowerCase() === String(email).toLowerCase())) {
      fail('An account with this email already exists.', 409);
    }

    const idKey = `${role}_id`;
    const id = nextId(records, idKey);
    const createdAt = new Date().toISOString();
    const user = role === 'volunteer'
      ? {
          [idKey]: id, name, email, password, phone: phone || null, address: address || null,
          availability: availability || 'Flexible', status: 'Pending', joined_date: today(), created_at: createdAt
        }
      : {
          [idKey]: id, name, email, password, phone: phone || null, address: address || null,
          donor_type: donor_type || 'Individual', created_at: createdAt
        };
    records.push(user);
    saveMockData(data);
    return createSession(data, user, role);
  },
  me: async () => {
    const data = loadMockData();
    const session = userFromToken(data);
    if (!session) fail('User not found.', 401);
    return { role: session.role, user: withoutPassword(session.user) };
  }
};

export const volunteerService = {
  list: async ({ search = '', status = '' } = {}) => {
    const data = loadMockData();
    const term = search.toLowerCase();
    return data.volunteers
      .filter((volunteer) => (!term || `${volunteer.name} ${volunteer.email}`.toLowerCase().includes(term))
        && (!status || volunteer.status === status))
      .sort((a, b) => compareDateDesc(a.joined_date, b.joined_date))
      .map(withoutPassword);
  },
  get: async (id) => {
    const data = loadMockData();
    return volunteerProfile(data, getVolunteer(data, id));
  },
  create: async (payload) => {
    const data = loadMockData();
    if (!payload.name || !payload.email || !payload.password) fail('Name, email and password are required.');
    if (data.volunteers.some((item) => item.email.toLowerCase() === payload.email.toLowerCase())) {
      fail('A volunteer with this email already exists.', 409);
    }
    const volunteer_id = nextId(data.volunteers, 'volunteer_id');
    data.volunteers.push({
      volunteer_id, ...payload,
      availability: payload.availability || 'Flexible',
      status: payload.status || 'Pending',
      joined_date: today(),
      created_at: new Date().toISOString()
    });
    saveMockData(data);
    return { volunteer_id };
  },
  update: async (id, payload) => {
    const data = loadMockData();
    Object.assign(getVolunteer(data, id), payload);
    saveMockData(data);
    return { message: 'Volunteer updated.' };
  },
  setStatus: async (id, status) => {
    const data = loadMockData();
    const volunteer = getVolunteer(data, id);
    if (!['Pending', 'Approved', 'Rejected', 'Inactive'].includes(status)) fail('Invalid status.');
    volunteer.status = status;
    saveMockData(data);
    return { message: `Volunteer marked as ${status}.` };
  },
  remove: async (id) => {
    const data = loadMockData();
    getVolunteer(data, id);
    data.volunteers = data.volunteers.filter((item) => item.volunteer_id !== Number(id));
    data.volunteer_skills = data.volunteer_skills.filter((item) => item.volunteer_id !== Number(id));
    data.event_volunteers = data.event_volunteers.filter((item) => item.volunteer_id !== Number(id));
    saveMockData(data);
    return { message: 'Volunteer deleted.' };
  },
  myProfile: async () => {
    const data = loadMockData();
    const { user } = requireUser(data, 'volunteer');
    return volunteerProfile(data, user);
  },
  updateMyProfile: async (payload) => {
    const data = loadMockData();
    const { user } = requireUser(data, 'volunteer');
    Object.assign(user, payload);
    saveMockData(data);
    return { message: 'Volunteer updated.' };
  }
};

export const donorService = {
  list: async ({ search = '' } = {}) => {
    const data = loadMockData();
    const term = search.toLowerCase();
    return data.donors
      .filter((donor) => !term || `${donor.name} ${donor.email}`.toLowerCase().includes(term))
      .sort((a, b) => compareDateDesc(a.created_at, b.created_at))
      .map((donor) => ({
        ...withoutPassword(donor),
        total_donated: data.donations
          .filter((donation) => donation.donor_id === donor.donor_id && donation.status === 'Completed')
          .reduce((sum, donation) => sum + Number(donation.amount), 0)
      }));
  },
  get: async (id) => {
    const data = loadMockData();
    return donorProfile(data, getDonor(data, id));
  },
  create: async (payload) => {
    const data = loadMockData();
    if (!payload.name || !payload.email || !payload.password) fail('Name, email and password are required.');
    if (data.donors.some((item) => item.email.toLowerCase() === payload.email.toLowerCase())) {
      fail('A donor with this email already exists.', 409);
    }
    const donor_id = nextId(data.donors, 'donor_id');
    data.donors.push({
      donor_id, ...payload,
      donor_type: payload.donor_type || 'Individual',
      created_at: new Date().toISOString()
    });
    saveMockData(data);
    return { donor_id };
  },
  update: async (id, payload) => {
    const data = loadMockData();
    Object.assign(getDonor(data, id), payload);
    saveMockData(data);
    return { message: 'Donor updated.' };
  },
  myProfile: async () => {
    const data = loadMockData();
    const { user } = requireUser(data, 'donor');
    return donorProfile(data, user);
  },
  updateMyProfile: async (payload) => {
    const data = loadMockData();
    const { user } = requireUser(data, 'donor');
    Object.assign(user, payload);
    saveMockData(data);
    return { message: 'Donor updated.' };
  }
};

export const eventService = {
  list: async ({ search = '', status = '' } = {}) => {
    const data = loadMockData();
    const term = search.toLowerCase();
    return data.events
      .filter((event) => (!term || event.event_name.toLowerCase().includes(term))
        && (!status || event.status === status))
      .sort((a, b) => a.event_date.localeCompare(b.event_date))
      .map((event) => ({
        ...clone(event),
        assigned_count: data.event_volunteers.filter((entry) => entry.event_id === event.event_id
          && ['Approved', 'Completed'].includes(entry.status)).length
      }));
  },
  get: async (id) => {
    const data = loadMockData();
    return eventDetail(data, getEvent(data, id));
  },
  create: async (payload) => {
    const data = loadMockData();
    if (!payload.event_name || !payload.event_date || !payload.start_time || !payload.end_time || !payload.location) {
      fail('Event name, date, start time, end time and location are required.');
    }
    const event_id = nextId(data.events, 'event_id');
    const { requirements = [], ...eventFields } = payload;
    data.events.push({
      event_id, ...eventFields,
      required_volunteers: Number(payload.required_volunteers) || 0,
      status: payload.status || 'Upcoming',
      created_by: userFromToken(data)?.user.admin_id || 1
    });
    requirements.filter((entry) => entry.skill_id).forEach((entry) => {
      data.event_requirements.push({
        requirement_id: nextId(data.event_requirements, 'requirement_id'),
        event_id,
        skill_id: Number(entry.skill_id),
        required_count: Number(entry.required_count) || 1
      });
    });
    saveMockData(data);
    return { event_id };
  },
  update: async (id, payload) => {
    const data = loadMockData();
    Object.assign(getEvent(data, id), payload);
    saveMockData(data);
    return { message: 'Event updated.' };
  },
  cancel: async (id) => {
    const data = loadMockData();
    getEvent(data, id).status = 'Cancelled';
    saveMockData(data);
    return { message: 'Event cancelled.' };
  },
  setRequirements: async (id, requirements) => {
    const data = loadMockData();
    getEvent(data, id);
    data.event_requirements = data.event_requirements.filter((entry) => entry.event_id !== Number(id));
    requirements.filter((entry) => entry.skill_id).forEach((entry) => {
      data.event_requirements.push({
        requirement_id: nextId(data.event_requirements, 'requirement_id'),
        event_id: Number(id),
        skill_id: Number(entry.skill_id),
        required_count: Number(entry.required_count) || 1
      });
    });
    saveMockData(data);
    return { message: 'Requirements updated.' };
  },
  matches: async (id) => {
    const data = loadMockData();
    const event = getEvent(data, id);
    const requiredSkillIds = data.event_requirements
      .filter((entry) => entry.event_id === event.event_id)
      .map((entry) => entry.skill_id);
    const registered = new Set(data.event_volunteers
      .filter((entry) => entry.event_id === event.event_id)
      .map((entry) => entry.volunteer_id));
    return data.volunteers
      .filter((volunteer) => volunteer.status === 'Approved' && !registered.has(volunteer.volunteer_id))
      .map((volunteer) => scoreVolunteer(data, volunteer, requiredSkillIds))
      .sort((a, b) => b.match_score - a.match_score);
  },
  assign: async (id, volunteer_id) => {
    const data = loadMockData();
    getEvent(data, id);
    getVolunteer(data, volunteer_id);
    const existing = data.event_volunteers.find((entry) => entry.event_id === Number(id)
      && entry.volunteer_id === Number(volunteer_id));
    if (existing) existing.status = 'Approved';
    else data.event_volunteers.push({
      event_id: Number(id), volunteer_id: Number(volunteer_id), status: 'Approved', hours: 0,
      registration_date: new Date().toISOString()
    });
    saveMockData(data);
    return { message: 'Volunteer assigned to event.' };
  },
  apply: async (id) => {
    const data = loadMockData();
    const event = getEvent(data, id);
    const { user } = requireUser(data, 'volunteer');
    if (user.status !== 'Approved') fail('Only approved volunteers can apply to events.', 403);
    if (data.event_volunteers.some((entry) => entry.event_id === event.event_id && entry.volunteer_id === user.volunteer_id)) {
      fail('You have already applied to this event.', 409);
    }
    data.event_volunteers.push({
      event_id: event.event_id, volunteer_id: user.volunteer_id, status: 'Applied', hours: 0,
      registration_date: new Date().toISOString()
    });
    saveMockData(data);
    return { message: 'Application submitted.' };
  },
  updateVolunteer: async (id, volunteerId, payload) => {
    const data = loadMockData();
    getEvent(data, id);
    const entry = data.event_volunteers.find((item) => item.event_id === Number(id)
      && item.volunteer_id === Number(volunteerId));
    if (!entry) fail('Volunteer participation not found.', 404);
    if (payload.status !== undefined) entry.status = payload.status;
    if (payload.hours !== undefined) entry.hours = Number(payload.hours);
    saveMockData(data);
    return { message: 'Volunteer participation updated.' };
  }
};

export const donationService = {
  list: async ({ search = '', type = '', status = '' } = {}) => {
    const data = loadMockData();
    const term = search.toLowerCase();
    return data.donations
      .filter((donation) => {
        const donor = data.donors.find((item) => item.donor_id === donation.donor_id);
        const matchesSearch = !term || `${donor?.name} ${donation.transaction_id} ${donation.purpose}`.toLowerCase().includes(term);
        return matchesSearch && (!type || donation.donation_type === type) && (!status || donation.status === status);
      })
      .sort((a, b) => compareDateDesc(a.donation_date, b.donation_date))
      .map((donation) => donationWithDonor(data, donation));
  },
  mine: async () => {
    const data = loadMockData();
    const { user } = requireUser(data, 'donor');
    return clone(data.donations
      .filter((donation) => donation.donor_id === user.donor_id)
      .sort((a, b) => compareDateDesc(a.donation_date, b.donation_date)));
  },
  get: async (id) => {
    const data = loadMockData();
    const donation = getDonation(data, id);
    const session = userFromToken(data);
    if (!session) fail('Please log in to continue.', 401);
    if (session.role === 'donor' && donation.donor_id !== session.user.donor_id) {
      fail('You cannot view this donation.', 403);
    }
    return donationWithDonor(data, donation);
  },
  receipt: async (id) => {
    const data = loadMockData();
    const donation = getDonation(data, id);
    const session = userFromToken(data);
    if (!session) fail('Please log in to continue.', 401);
    if (session.role === 'donor' && donation.donor_id !== session.user.donor_id) {
      fail('You cannot view this receipt.', 403);
    }
    const donor = data.donors.find((item) => item.donor_id === donation.donor_id);
    return {
      receipt_id: `RCPT-${String(donation.donation_id).padStart(5, '0')}`,
      ngo_name: 'Greenhands Community Foundation',
      donor_id: donation.donor_id,
      donor_name: donor.name,
      date: donation.donation_date,
      purpose: donation.purpose,
      donation_type: donation.donation_type,
      amount: donation.amount,
      payment_method: donation.payment_method,
      status: donation.status,
      thank_you_message: 'Thank you for your generous contribution. Your support helps us bring real change to the communities we serve.'
    };
  },
  create: async (payload) => {
    const data = loadMockData();
    const session = requireUser(data);
    const donor_id = session.role === 'donor' ? session.user.donor_id : Number(payload.donor_id);
    if (!donor_id || !payload.donation_date) fail('Donor and donation date are required.');
    getDonor(data, donor_id);
    const donation_id = nextId(data.donations, 'donation_id');
    data.donations.push({
      donation_id,
      donor_id,
      amount: Number(payload.amount) || 0,
      donation_type: payload.donation_type || 'Money',
      purpose: payload.purpose || null,
      donation_date: payload.donation_date,
      payment_method: payload.payment_method || 'N/A',
      transaction_id: `TXN${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`,
      status: payload.status || 'Pending'
    });
    saveMockData(data);
    return { donation_id };
  },
  update: async (id, payload) => {
    const data = loadMockData();
    Object.assign(getDonation(data, id), payload);
    saveMockData(data);
    return { message: 'Donation updated.' };
  }
};

export const skillService = {
  list: async () => clone(loadMockData().skills.sort((a, b) => a.skill_name.localeCompare(b.skill_name))),
  create: async ({ skill_name, description }) => {
    const data = loadMockData();
    if (!skill_name?.trim()) fail('Skill name is required.');
    if (data.skills.some((skill) => skill.skill_name.toLowerCase() === skill_name.trim().toLowerCase())) {
      fail('This skill already exists.', 409);
    }
    const skill = { skill_id: nextId(data.skills, 'skill_id'), skill_name: skill_name.trim(), description: description || null };
    data.skills.push(skill);
    saveMockData(data);
    return clone(skill);
  },
  mine: async () => {
    const data = loadMockData();
    const { user } = requireUser(data, 'volunteer');
    return data.volunteer_skills
      .filter((entry) => entry.volunteer_id === user.volunteer_id)
      .map((entry) => ({
        ...data.skills.find((skill) => skill.skill_id === entry.skill_id),
        proficiency: entry.proficiency
      }))
      .sort((a, b) => a.skill_name.localeCompare(b.skill_name));
  },
  addMine: async ({ skill_id, proficiency }) => {
    const data = loadMockData();
    const { user } = requireUser(data, 'volunteer');
    const skill = data.skills.find((item) => item.skill_id === Number(skill_id));
    if (!skill) fail('Skill not found.', 404);
    const existing = data.volunteer_skills.find((entry) => entry.volunteer_id === user.volunteer_id
      && entry.skill_id === skill.skill_id);
    if (existing) existing.proficiency = proficiency || 'Intermediate';
    else data.volunteer_skills.push({
      volunteer_id: user.volunteer_id,
      skill_id: skill.skill_id,
      proficiency: proficiency || 'Intermediate'
    });
    saveMockData(data);
    return { message: 'Skill added.' };
  },
  removeMine: async (skillId) => {
    const data = loadMockData();
    const { user } = requireUser(data, 'volunteer');
    data.volunteer_skills = data.volunteer_skills.filter((entry) => !(entry.volunteer_id === user.volunteer_id
      && entry.skill_id === Number(skillId)));
    saveMockData(data);
    return { message: 'Skill removed.' };
  }
};

export const applicationService = {
  volunteers: async () => loadMockData().volunteers
    .filter((volunteer) => volunteer.status === 'Pending')
    .sort((a, b) => compareDateDesc(a.joined_date, b.joined_date))
    .map(withoutPassword),
  events: async () => {
    const data = loadMockData();
    return data.event_volunteers
      .filter((entry) => entry.status === 'Applied')
      .map((entry) => {
        const event = data.events.find((item) => item.event_id === entry.event_id);
        const volunteer = data.volunteers.find((item) => item.volunteer_id === entry.volunteer_id);
        return {
          event_id: entry.event_id,
          event_name: event?.event_name,
          event_date: event?.event_date,
          volunteer_id: entry.volunteer_id,
          volunteer_name: volunteer?.name,
          volunteer_email: volunteer?.email,
          status: entry.status,
          registration_date: entry.registration_date || volunteer?.created_at
        };
      })
      .sort((a, b) => compareDateDesc(a.registration_date, b.registration_date));
  },
  mine: async () => {
    const data = loadMockData();
    const { user } = requireUser(data, 'volunteer');
    return data.event_volunteers
      .filter((entry) => entry.volunteer_id === user.volunteer_id)
      .map((entry) => {
        const event = data.events.find((item) => item.event_id === entry.event_id);
        return event && {
          event_id: event.event_id,
          event_name: event.event_name,
          event_date: event.event_date,
          event_status: event.status,
          status: entry.status,
          hours: Number(entry.hours) || 0,
          registration_date: entry.registration_date || event.event_date
        };
      })
      .filter(Boolean)
      .sort((a, b) => compareDateDesc(a.registration_date, b.registration_date));
  }
};

export const dashboardService = {
  admin: async () => {
    const data = loadMockData();
    const upcoming = data.events.filter((event) => event.event_date >= today()
      && ['Upcoming', 'Ongoing'].includes(event.status)).sort((a, b) => a.event_date.localeCompare(b.event_date));
    const donations = [...data.donations].sort((a, b) => compareDateDesc(a.donation_date, b.donation_date));
    const volunteers = [...data.volunteers].sort((a, b) => compareDateDesc(a.created_at, b.created_at));
    return {
      kpis: {
        total_volunteers: data.volunteers.length,
        active_volunteers: data.volunteers.filter((volunteer) => volunteer.status === 'Approved').length,
        total_donors: data.donors.length,
        total_donations: completedMoneyDonations(data).reduce((sum, donation) => sum + Number(donation.amount), 0),
        upcoming_events: upcoming.length,
        total_hours: data.event_volunteers.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0)
      },
      monthly_donations: monthlyDonations(data).slice(-6),
      upcoming_events: upcoming.slice(0, 5).map((event) => ({
        event_id: event.event_id,
        event_name: event.event_name,
        event_date: event.event_date,
        location: event.location,
        status: event.status
      })),
      recent_donations: donations.slice(0, 5).map((donation) => {
        const donor = data.donors.find((item) => item.donor_id === donation.donor_id);
        return {
          donation_id: donation.donation_id,
          donor_name: donor?.name,
          amount: donation.amount,
          donation_type: donation.donation_type,
          status: donation.status,
          donation_date: donation.donation_date
        };
      }),
      recent_volunteers: volunteers.slice(0, 5).map((volunteer) => ({
        volunteer_id: volunteer.volunteer_id,
        name: volunteer.name,
        email: volunteer.email,
        status: volunteer.status,
        joined_date: volunteer.joined_date
      })),
      participation_breakdown: Object.entries(data.event_volunteers.reduce((counts, entry) => {
        counts[entry.status] = (counts[entry.status] || 0) + 1;
        return counts;
      }, {})).map(([status, count]) => ({ status, count }))
    };
  },
  volunteer: async () => {
    const data = loadMockData();
    const { user } = requireUser(data, 'volunteer');
    const applications = data.event_volunteers.filter((entry) => entry.volunteer_id === user.volunteer_id);
    const upcoming = applications
      .map((entry) => ({ entry, event: data.events.find((event) => event.event_id === entry.event_id) }))
      .filter(({ event }) => event?.event_date >= today())
      .sort((a, b) => a.event.event_date.localeCompare(b.event.event_date));
    return {
      kpis: {
        total_hours: getVolunteerHours(data, user.volunteer_id),
        completed_events: applications.filter((entry) => entry.status === 'Completed').length,
        upcoming_events: upcoming.filter(({ entry }) => entry.status === 'Approved').length,
        pending_applications: applications.filter((entry) => entry.status === 'Applied').length
      },
      upcoming: upcoming.slice(0, 5).map(({ entry, event }) => ({
        event_id: event.event_id,
        event_name: event.event_name,
        event_date: event.event_date,
        location: event.location,
        status: entry.status
      }))
    };
  },
  donor: async () => {
    const data = loadMockData();
    const { user } = requireUser(data, 'donor');
    const donations = data.donations
      .filter((donation) => donation.donor_id === user.donor_id)
      .sort((a, b) => compareDateDesc(a.donation_date, b.donation_date));
    return {
      kpis: {
        total_donated: donations.filter((donation) => donation.status === 'Completed')
          .reduce((sum, donation) => sum + Number(donation.amount), 0),
        donation_count: donations.length
      },
      recent_donations: clone(donations.slice(0, 5))
    };
  },
  reports: async () => {
    const data = loadMockData();
    const eventParticipation = data.events.map((event) => {
      const entries = data.event_volunteers.filter((entry) => entry.event_id === event.event_id);
      return {
        event_id: event.event_id,
        event_name: event.event_name,
        volunteer_count: entries.length,
        total_hours: entries.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0)
      };
    }).sort((a, b) => compareDateDesc(
      data.events.find((event) => event.event_id === a.event_id).event_date,
      data.events.find((event) => event.event_id === b.event_id).event_date
    ));
    const volunteerStatusBreakdown = Object.entries(data.volunteers.reduce((counts, volunteer) => {
      counts[volunteer.status] = (counts[volunteer.status] || 0) + 1;
      return counts;
    }, {})).map(([status, count]) => ({ status, count }));
    const donationTypeBreakdown = Object.entries(data.donations.reduce((counts, donation) => {
      const current = counts[donation.donation_type] || { count: 0, amount: 0 };
      current.count += 1;
      current.amount += Number(donation.amount);
      counts[donation.donation_type] = current;
      return counts;
    }, {})).map(([donation_type, totals]) => ({ donation_type, ...totals }));
    const topVolunteers = data.volunteers
      .map((volunteer) => ({
        volunteer_id: volunteer.volunteer_id,
        name: volunteer.name,
        total_hours: getVolunteerHours(data, volunteer.volunteer_id)
      }))
      .sort((a, b) => b.total_hours - a.total_hours)
      .slice(0, 5);

    return {
      monthlyDonations: monthlyDonations(data),
      eventParticipation,
      volunteerStatusBreakdown,
      donationTypeBreakdown,
      topVolunteers
    };
  }
};
