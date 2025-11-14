// src/services/employer.js
import { api } from './api';


function unwrap(res) {
  if (!res || !res.data) return null;
  if (res.data.data !== undefined) return res.data.data;
  return res.data;
}


function withToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

/* ===========================================
 *  A. AUTH — REGISTER & LOGIN RECRUITER
 * =========================================== */


export async function registerRecruiter({ fullName, email, password, companyName }) {
  const body = {
    fullName,
    email,
    password,
    company: {
      name: companyName,
      address: {
        line: '',
        city: '',
        country: '',
      },
    },
  };

  console.log('REGISTER PAYLOAD >>>', body);

  const res = await api.post('/accounts/recruiter/register', body);
  return res.data;
}

/**
 * Đăng nhập recruiter
 * POST /accounts/recruiter/login
 */
export async function loginRecruiter(email, password) {
  const res = await api.post('/accounts/recruiter/login', { email, password });
  const data = res.data || {};
  return {
    token: data.token,
    status: data.status,
    raw: data,
  };
}

/* ===========================================
 *  B. RECRUITER PROFILE
 * =========================================== */

export async function getRecruiterProfile(token) {
  withToken(token);
  const res = await api.get('/recruiter/profile');
  return unwrap(res);
}

export async function updateRecruiterProfile(token, body) {
  withToken(token);
  const res = await api.put('/recruiter/profile', body);
  return unwrap(res);
}

/* ===========================================
 *  C. APPLICATIONS (Danh sách ứng viên)
 * =========================================== */

export async function getRecruiterApplications(token) {
  withToken(token);
  const res = await api.get('/applications/recruiter');
  return unwrap(res);
}

export async function acceptApplication(token, applicationId) {
  withToken(token);
  const res = await api.patch(`/applications/${applicationId}/accept`);
  return res.data;
}

export async function rejectApplication(token, applicationId) {
  withToken(token);
  const res = await api.patch(`/applications/${applicationId}/reject`);
  return res.data;
}

export async function getRecruiterCandidates(token) {
  return getRecruiterApplications(token);
}

/* ===========================================
 *  D. COMPANY — CRUD
 * =========================================== */

export async function getCompanies() {
  const res = await api.get('/companies');
  return unwrap(res);
}

export async function getCompanyById(id) {
  const res = await api.get(`/companies/${id}`);
  return unwrap(res);
}

export async function createCompany(token, body) {
  withToken(token);
  const res = await api.post('/companies', body);
  return unwrap(res);
}

export async function updateCompany(token, id, body) {
  withToken(token);
  const res = await api.put(`/companies/${id}`, body);
  return unwrap(res);
}

export async function deleteCompany(token, id) {
  withToken(token);
  const res = await api.delete(`/companies/${id}`);
  return res.data;
}
