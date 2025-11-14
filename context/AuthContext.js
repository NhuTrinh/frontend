import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, setAuthToken } from "../service/api";
import { registerAndSyncPushToken } from "../utils/pushToken";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("@auth");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.token) {
            setAuthToken(parsed.token);
            setHasToken(true); // ⬅️ có token là coi như đã đăng nhập
            setUser(parsed.account ?? null);
          }
        }
      } catch (e) {
        console.error("Load @auth error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (emailOrPayload, maybePassword) => {
    try {
      console.log("🔸 login() args =", emailOrPayload, maybePassword);

      // ✅ Nhánh đã có token sẵn
      if (typeof emailOrPayload === "object" && emailOrPayload?.token) {
        const token = emailOrPayload.token;
        let account = emailOrPayload.user || emailOrPayload.account || null;

        // Lấy accountId từ JWT (nếu có)
        let accountId = null;
        try {
          const claims = jwtDecode(token);
          accountId = claims?.accountId ?? claims?.sub ?? null;
          console.log("🔎 accountId từ JWT =", accountId);
        } catch (e) {
          console.log("jwtDecode error:", e);
        }

        setAuthToken(token);
        setHasToken(true); 

        if (!account || !accountId) {
          try {
            console.log("GET /accounts/me");
            const me = await api.get("/accounts/me");
            const meData = me.data?.data || me.data?.account || me.data || null;
            if (meData) {
              account = account || meData;
              accountId = accountId || meData?._id || meData?.id || null;
            }
          } catch (e) {
            console.warn("⚠️ Không fetch được /accounts/me:", e?.response?.data || e.message);
          }
        }

        await AsyncStorage.setItem("@auth", JSON.stringify({ token, accountId, account }));
        setUser(account ?? null);

        console.log("🔑 Đã nhận token & user — sync push token…");
        await registerAndSyncPushToken(api, accountId);
        return account;
      }

      // 🔽 Nhánh email/password (giữ nguyên)
      const payload =
        typeof emailOrPayload === "object"
          ? emailOrPayload
          : { email: emailOrPayload, password: maybePassword };

      const email = (payload.email ?? payload.username ?? "").trim();
      const password = payload.password ?? "";
      if (!email || !password) throw new Error("Thiếu email hoặc password.");

      console.log("🔗 POST /accounts/candidate/login", { email });
      const res = await api.post("/accounts/candidate/login", { email, password });

      const token = res.data?.token;
      let account = res.data?.account || null;
      if (!token) throw new Error("Thiếu token từ server.");

      setAuthToken(token);
      setHasToken(true); // ⬅️ bật điều hướng ngay khi có token

      if (!account) {
        try {
          console.log("🔗 GET /accounts/me");
          const me = await api.get("/accounts/me");
          account = me.data?.data || me.data?.account || me.data || null;
        } catch (e) {
          console.warn("⚠️ Không fetch được /accounts/me:", e?.response?.data || e.message);
        }
      }

      let accountId = account?._id ?? account?.id ?? null;
      try {
        if (!accountId && token) {
          const claims = jwtDecode(token);
          accountId = claims?.accountId ?? claims?.sub ?? null;
        }
      } catch {}

      await AsyncStorage.setItem("@auth", JSON.stringify({ token, accountId, account }));
      setUser(account ?? null);

      console.log("🔑 Đăng nhập thành công — sync push token…");
      await registerAndSyncPushToken(api, accountId);

      return account;
    } catch (error) {
      console.error("❌ Login error:", error?.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@auth");
      setAuthToken(null);
      setHasToken(false); // ⬅️ tắt điều hướng
      setUser(null);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: hasToken, // ⬅️ dựa vào token để switch tab ngay
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
