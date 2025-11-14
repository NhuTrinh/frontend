// pages/candidates/ProfilePage.js
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import {
  getMyApplications,
  cancelApplicationById,
} from "../../service/candidate/applicationService";
import {
  getMyProfile,
  updateMyProfile,
} from "../../service/candidate/profileService";

// Helper: address object -> string
function formatAddress(addr) {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  const { line, city, country } = addr;
  return [line, city, country].filter(Boolean).join(", ");
}

// Helper: style cho trạng thái ứng tuyển
function getStatusStyle(statusRaw) {
  const status = (statusRaw || "").toLowerCase();
  if (["submitted", "pending"].includes(status)) {
    return {
      label: "Đang xử lý",
      bg: "#eff6ff",
      color: "#2563eb",
    };
  }
  if (["accepted", "approved", "hired"].includes(status)) {
    return {
      label: "Đã chấp nhận",
      bg: "#ecfdf5",
      color: "#16a34a",
    };
  }
  if (["rejected", "cancelled", "canceled"].includes(status)) {
    return {
      label: "Đã từ chối",
      bg: "#fef2f2",
      color: "#dc2626",
    };
  }
  return {
    label: statusRaw || "Khác",
    bg: "#f3f4f6",
    color: "#4b5563",
  };
}

export default function ProfileScreen() {
  const { user, logout } = React.useContext(AuthContext);

  // ===== Ứng tuyển =====
  const [apps, setApps] = React.useState([]);
  const [loadingApps, setLoadingApps] = React.useState(true);
  const [cancelingId, setCancelingId] = React.useState(null);

  const fetchApps = React.useCallback(async () => {
    try {
      setLoadingApps(true);
      const data = await getMyApplications();
      setApps(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("getMyApplications error", e);
    } finally {
      setLoadingApps(false);
    }
  }, []);

  // ===== Profile =====
  const [profileData, setProfileData] = React.useState(null);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [editing, setEditing] = React.useState(false);
  const [savingProfile, setSavingProfile] = React.useState(false);

  const [form, setForm] = React.useState({
    jobTitle: "",
    phoneNumber: "",
    addressLine: "",
    addressCity: "",
    addressCountry: "",
    aboutMe: "",
  });

  const fetchProfile = React.useCallback(async () => {
    try {
      setLoadingProfile(true);
      const data = await getMyProfile(); // GET /candidates/profile-cv
      setProfileData(data || null);

      const profile = data?.profile || {};
      setForm({
        jobTitle: profile.jobTitle || "",
        phoneNumber: profile.phoneNumber || user?.phoneNumber || "",
        addressLine: profile.address?.line || "",
        addressCity: profile.address?.city || "",
        addressCountry: profile.address?.country || "",
        aboutMe: profile.aboutMe || "",
      });
    } catch (e) {
      console.log("getMyProfile error", e);
    } finally {
      setLoadingProfile(false);
    }
  }, [user?.phoneNumber]);

  React.useEffect(() => {
    fetchProfile();
    fetchApps();
  }, [fetchProfile, fetchApps]);

  // Thông tin hiển thị
  const profile = profileData?.profile || {};
  const name = user?.fullName || user?.name || "-";
  const email = user?.email || "-";
  const phone = profile.phoneNumber || user?.phoneNumber || "-";
  const addressStr = formatAddress(profile.address) || "-";
  const dob =
    profile.birthDay || user?.birthDay
      ? new Date(profile.birthDay || user.birthDay).toLocaleDateString()
      : "-";
  const aboutMeDisplay = profile.aboutMe || "";

  const onChangeForm = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSaveProfile = async () => {
    try {
      setSavingProfile(true);

      const currentProfile = profileData?.profile || {};
      const updatedProfile = {
        ...currentProfile,
        jobTitle: form.jobTitle,
        phoneNumber: form.phoneNumber,
        address: {
          ...(currentProfile.address || {}),
          line: form.addressLine,
          city: form.addressCity,
          country: form.addressCountry,
        },
        aboutMe: form.aboutMe,
      };

      await updateMyProfile({
        profile: updatedProfile,
        attachments: profileData?.attachments || {}, // giữ lại phần CV/attachment
      });

      setProfileData((prev) => ({
        ...(prev || {}),
        profile: updatedProfile,
      }));
      setEditing(false);
      Alert.alert("Thành công", "Cập nhật hồ sơ thành công.");
    } catch (e) {
      console.log("updateMyProfile error", e);
      Alert.alert("Lỗi", "Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    } finally {
      setSavingProfile(false);
    }
  };

  const onCancel = (application) => {
    const appId = application?._id || application?.id;
    Alert.alert("Hủy ứng tuyển", "Bạn chắc chắn muốn hủy đơn ứng tuyển này?", [
      { text: "Không" },
      {
        text: "Hủy đơn",
        style: "destructive",
        onPress: async () => {
          try {
            setCancelingId(appId);
            await cancelApplicationById(appId); // DELETE /applications/:id
            setApps((prev) => prev.filter((a) => (a._id || a.id) !== appId));
            Alert.alert("Đã hủy", "Bạn đã hủy đơn ứng tuyển.");
          } catch (e) {
            Alert.alert("Không thể hủy", "Vui lòng thử lại sau.");
          } finally {
            setCancelingId(null);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const appId = item._id || item.id;
    const jobObj = item.jobId || item.job; // backend populate jobId
    const jobTitle =
      jobObj?.jobTitle ||
      jobObj?.title ||
      item.jobTitle ||
      item.title ||
      "Vị trí";
    const companyName = jobObj?.companyId?.name || jobObj?.companyName || "";
    const addr =
      formatAddress(jobObj?.address) || formatAddress(jobObj?.location);
    const salary =
      jobObj?.salaryMin && jobObj?.salaryMax
        ? `${jobObj.salaryMin} - ${jobObj.salaryMax}`
        : jobObj?.salaryMin
        ? `Từ ${jobObj.salaryMin}`
        : jobObj?.salaryMax
        ? `Đến ${jobObj.salaryMax}`
        : "";
    const status = item.status || "submitted";
    const createdAt = item.createdAt
      ? new Date(item.createdAt).toLocaleString()
      : "";
    const statusStyle = getStatusStyle(status);

    return (
      <View
        style={{
          padding: 14,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 12,
          marginVertical: 6,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.03,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={{ fontWeight: "800", fontSize: 15 }}>
              {jobTitle}
            </Text>
            {!!companyName && (
              <Text style={{ marginTop: 2, color: "#374151" }}>
                {companyName}
              </Text>
            )}
            {!!addr && (
              <Text style={{ marginTop: 2, color: "#6b7280", fontSize: 12 }}>
                {addr}
              </Text>
            )}
            {!!salary && (
              <Text style={{ marginTop: 2, color: "#16a34a", fontSize: 13 }}>
                {salary}
              </Text>
            )}
          </View>

          <View
            style={{
              backgroundColor: statusStyle.bg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                color: statusStyle.color,
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              {statusStyle.label}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          {!!createdAt && (
            <Text style={{ color: "#6b7280", fontSize: 12 }}>
              Nộp: {createdAt}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => onCancel(item)}
            disabled={cancelingId === appId}
            style={{
              backgroundColor: "#ef4444",
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 8,
              opacity: cancelingId === appId ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
              {cancelingId === appId ? "Đang hủy..." : "Hủy ứng tuyển"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const isLoading = loadingProfile && !profileData;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Card thông tin cá nhân */}
      <View
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          backgroundColor: "#fff",
          marginBottom: 14,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "800", marginBottom: 8 }}>
          Thông tin cá nhân
        </Text>

        {isLoading ? (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            {/* Dòng chỉ đọc */}
            <Text>Họ tên: {name}</Text>
            <Text>Email: {email}</Text>

            {editing ? (
              <>
                <Text style={{ marginTop: 6, fontWeight: "600" }}>
                  Số điện thoại
                </Text>
                <TextInput
                  value={form.phoneNumber}
                  onChangeText={(v) => onChangeForm("phoneNumber", v)}
                  keyboardType="phone-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    marginTop: 4,
                  }}
                />

                <Text style={{ marginTop: 6, fontWeight: "600" }}>Chức danh</Text>
                <TextInput
                  value={form.jobTitle}
                  onChangeText={(v) => onChangeForm("jobTitle", v)}
                  placeholder="VD: Mobile Developer"
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    marginTop: 4,
                  }}
                />

                <Text style={{ marginTop: 6, fontWeight: "600" }}>
                  Địa chỉ (đường)
                </Text>
                <TextInput
                  value={form.addressLine}
                  onChangeText={(v) => onChangeForm("addressLine", v)}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    marginTop: 4,
                  }}
                />

                <Text style={{ marginTop: 6, fontWeight: "600" }}>Thành phố</Text>
                <TextInput
                  value={form.addressCity}
                  onChangeText={(v) => onChangeForm("addressCity", v)}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    marginTop: 4,
                  }}
                />

                <Text style={{ marginTop: 6, fontWeight: "600" }}>Quốc gia</Text>
                <TextInput
                  value={form.addressCountry}
                  onChangeText={(v) => onChangeForm("addressCountry", v)}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    marginTop: 4,
                  }}
                />

                <Text style={{ marginTop: 6, fontWeight: "600" }}>
                  Giới thiệu bản thân
                </Text>
                <TextInput
                  value={form.aboutMe}
                  onChangeText={(v) => onChangeForm("aboutMe", v)}
                  multiline
                  numberOfLines={3}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    marginTop: 4,
                    textAlignVertical: "top",
                  }}
                />
              </>
            ) : (
              <>
                <Text>Điện thoại: {phone}</Text>
                <Text>Địa chỉ: {addressStr}</Text>
                <Text>Ngày sinh: {dob}</Text>
                {!!aboutMeDisplay && (
                  <Text style={{ marginTop: 6 }}>Giới thiệu: {aboutMeDisplay}</Text>
                )}
              </>
            )}

            {/* Nút hành động */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                onPress={editing ? onSaveProfile : () => setEditing(true)}
                disabled={savingProfile}
                style={{
                  backgroundColor: "#2563EB",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  opacity: savingProfile ? 0.7 : 1,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "700" }}
                >
                  {editing
                    ? savingProfile
                      ? "Đang lưu..."
                      : "Lưu hồ sơ"
                    : "Chỉnh sửa hồ sơ"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  fetchProfile();
                  fetchApps();
                }}
                style={{
                  backgroundColor: "#6b7280",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Làm mới</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={logout}
                style={{
                  backgroundColor: "#ef4444",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Danh sách ứng tuyển */}
      <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>
        Đơn ứng tuyển của tôi
      </Text>

      {loadingApps ? (
        <View style={{ paddingTop: 12 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={apps}
          keyExtractor={(item, idx) => String(item._id || item.id || idx)}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{ color: "#6b7280" }}>Chưa có ứng tuyển nào.</Text>
          }
          contentContainerStyle={{ paddingBottom: 12 }}
        />
      )}
    </View>
  );
}
