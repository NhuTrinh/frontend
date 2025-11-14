import { api } from './api';

export const employerLogin = async (email, password) => {
  const res = await api.post('/auth/login', {
    email,
    password,
    role: 'employer',
  });
  return res.data; // { token, user }
};

export const employerRegister = async (payload) => {
  const res = await api.post('/auth/register', {
    ...payload,
    role: 'employer',
  });
  return res.data;
};

// Social login: gửi token Google/Facebook lên backend
export const employerLoginWithProvider = async (provider, providerToken) => {
  const res = await api.post(`/auth/${provider}-employer`, {
    token: providerToken,
  });
  return res.data;
};
