# 🏥 Healthcare Appointment & Medical Records API

A secure backend REST API for a healthcare application where **patients can book appointments**, **doctors manage consultations and prescriptions**, and **admins oversee and control the system**.

This project is designed to follow **real-world hospital workflows**, focusing on **security, role-based access control, and medical data integrity**.

---

## 📌 Key Features

- Role-based access (**Admin / Doctor / Patient**)
- Doctor registration with **admin approval**
- Patient appointment booking with **doctor & department selection**
- Doctor fills **diagnosis, prescription, do’s & don’ts**
- Patients can view **complete medical history**
- Admin has **full system visibility (read-only medical data)**
- No deletion of data — everything controlled using **status**
- Secure authentication using **JWT + bcryptjs**
- MongoDB-based data modeling

---

## 🛠 Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **Authorization:** Role-Based Access Control (RBAC)

---

## 👥 User Roles

### 👤 Patient
- Register and login
- Book appointments
- Select doctor & department during appointment creation
- View appointment history
- View past medical records

### 👨‍⚕️ Doctor
- Register (requires admin approval)
- Login only after approval
- View assigned appointments
- Create medical records (diagnosis, prescription, advice)

### 🏥 Admin
- Separate login page
- Approve doctors
- Change doctor status
- View doctors, patients, and medical history
- Read-only access to medical records
