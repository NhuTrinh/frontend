// service/authService.js
import { api } from "./api";

/** Đăng nhập ứng viên
 * POST /accounts/candidate/login
 * body: { email, password }
 * kỳ vọng: { status: "success", token, user } hoặc tương tự
 */
export async function candidateLogin({ email, password }) {
  const res = await api.post("/accounts/candidate/login", { email, password });
  const data = res.data || {};

  return {
    token: data.token || data.accessToken || data.data?.token,
    user: data.user || null,
  };
}

/** Đăng nhập bằng Google
 * POST /accounts/candidate/google-login
 * body: { idToken }
 * response: { status, token, account } (backend hiện tại)
 */
export async function candidateGoogleLogin({ idToken }) {
  const res = await api.post("/accounts/candidate/google-login", { idToken });
  const data = res.data || {};

  return {
    token: data.token || data.accessToken || data.data?.token,
    user: data.account || data.user || null,
  };
}
