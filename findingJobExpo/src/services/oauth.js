import { registerRecruiter, loginRecruiter } from "./employer";

/**
 * Logic mạng xã hội:
 * 1) Thử login bằng email + mật khẩu mặc định
 * 2) Nếu chưa có → auto-register rồi login
 */

export async function loginWithSocial(email, fullName) {
  const defaultPassword = "social-login-password";

  try {
    // Thử đăng nhập nếu email đã tồn tại
    const login = await loginRecruiter(email, defaultPassword);
    return login;
  } catch (err) {
    console.log("SOCIAL LOGIN: email chưa tồn tại → đăng ký mới");

    // Nếu chưa có → đăng ký auto
    const register = await registerRecruiter({
      fullName,
      email,
      password: defaultPassword,
      companyName: "Chưa cập nhật"
    });

    return register;
  }
}
