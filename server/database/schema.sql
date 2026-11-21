-- ================================================================
-- Volunteer & Donor Management System - Database Schema
-- ================================================================
DROP DATABASE IF EXISTS volunteer_donor_management;
CREATE DATABASE volunteer_donor_management CHARACTER SET utf8mb4;
USE volunteer_donor_management;

-- ---------------------------------------------------------------
-- admins
-- ---------------------------------------------------------------
CREATE TABLE admins (
  admin_id      INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- volunteers
-- ---------------------------------------------------------------
CREATE TABLE volunteers (
  volunteer_id  INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  address       VARCHAR(255),
  availability  ENUM('Weekdays','Weekends','Evenings','Flexible') DEFAULT 'Flexible',
  status        ENUM('Pending','Approved','Rejected','Inactive') DEFAULT 'Pending',
  joined_date   DATE DEFAULT (CURRENT_DATE),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_volunteer_status (status)
);

-- ---------------------------------------------------------------
-- skills
-- ---------------------------------------------------------------
CREATE TABLE skills (
  skill_id      INT AUTO_INCREMENT PRIMARY KEY,
  skill_name    VARCHAR(100) NOT NULL UNIQUE,
  description   VARCHAR(255)
);

-- ---------------------------------------------------------------
-- volunteer_skills (M:N junction)
-- ---------------------------------------------------------------
CREATE TABLE volunteer_skills (
  volunteer_id  INT NOT NULL,
  skill_id      INT NOT NULL,
  proficiency   ENUM('Beginner','Intermediate','Expert') DEFAULT 'Intermediate',
  PRIMARY KEY (volunteer_id, skill_id),
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(volunteer_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ---------------------------------------------------------------
-- events
-- ---------------------------------------------------------------
CREATE TABLE events (
  event_id            INT AUTO_INCREMENT PRIMARY KEY,
  event_name          VARCHAR(150) NOT NULL,
  description          TEXT,
  event_date          DATE NOT NULL,
  start_time          TIME NOT NULL,
  end_time            TIME NOT NULL,
  location            VARCHAR(255) NOT NULL,
  required_volunteers INT DEFAULT 0,
  status              ENUM('Upcoming','Ongoing','Completed','Cancelled') DEFAULT 'Upcoming',
  created_by          INT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admins(admin_id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_event_status (status),
  INDEX idx_event_date (event_date)
);

-- ---------------------------------------------------------------
-- event_requirements (M:N event <-> skill)
-- ---------------------------------------------------------------
CREATE TABLE event_requirements (
  requirement_id  INT AUTO_INCREMENT PRIMARY KEY,
  event_id        INT NOT NULL,
  skill_id        INT NOT NULL,
  required_count  INT DEFAULT 1,
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uniq_event_skill (event_id, skill_id)
);

-- ---------------------------------------------------------------
-- event_volunteers (M:N volunteer <-> event)
-- ---------------------------------------------------------------
CREATE TABLE event_volunteers (
  event_id           INT NOT NULL,
  volunteer_id       INT NOT NULL,
  registration_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status             ENUM('Applied','Approved','Rejected','Completed') DEFAULT 'Applied',
  hours              DECIMAL(5,2) DEFAULT 0,
  PRIMARY KEY (event_id, volunteer_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(volunteer_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_ev_status (status)
);

-- ---------------------------------------------------------------
-- donors
-- ---------------------------------------------------------------
CREATE TABLE donors (
  donor_id      INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  phone         VARCHAR(20),
  address       VARCHAR(255),
  donor_type    ENUM('Individual','Organization') DEFAULT 'Individual',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- donations
-- ---------------------------------------------------------------
CREATE TABLE donations (
  donation_id     INT AUTO_INCREMENT PRIMARY KEY,
  donor_id        INT NOT NULL,
  amount          DECIMAL(10,2) NOT NULL DEFAULT 0,
  donation_type   ENUM('Money','Food','Clothes','Books','Other') DEFAULT 'Money',
  purpose         VARCHAR(255),
  donation_date   DATE NOT NULL,
  payment_method  ENUM('Cash','UPI','Card','Bank Transfer','Cheque','N/A') DEFAULT 'N/A',
  transaction_id  VARCHAR(100) UNIQUE,
  status          ENUM('Pending','Completed','Cancelled') DEFAULT 'Pending',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES donors(donor_id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_donation_status (status),
  INDEX idx_donation_date (donation_date)
);
