import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getJobById } from "../../service/candidate/jobService";
import { getMyApplications, applyMyselfToJob } from "../../service/candidate/applicationService";
import { AuthContext } from "../../context/AuthContext";

function formatAddress(addr) {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  const { line, city, country } = addr;
  return [line, city, country].filter(Boolean).join(", ");
}

export default function JobDetailPage({ route, navigation }) {
  const { id } = route.params || {};
  const jobId = id || "685580429987274195c88c3e";

  const { isLoggedIn, user } = React.useContext(AuthContext);
  const insets = useSafeAreaInsets();

  const [job, setJob] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [applying, setApplying] = React.useState(false);
  const [alreadyApplied, setAlreadyApplied] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchDetail = React.useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getJobById(jobId);
      setJob(data);
    } catch (e) {
      setError("Không tải được chi tiết công việc.");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  const checkApplied = React.useCallback(async () => {
    try {
      const myApps = await getMyApplications();
      const found = (myApps || []).some((a) => {
        const jid = a.jobId?._id || a.jobId?.id || a.jobId || a.job?._id || a.job;
        return String(jid) === String(jobId);
      });
      setAlreadyApplied(found);
    } catch {
      setAlreadyApplied(false);
    }
  }, [jobId]);

  React.useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  React.useEffect(() => {
    if (isLoggedIn) checkApplied();
  }, [isLoggedIn, checkApplied]);

  const navigateToLogin = React.useCallback(() => {
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate("Login");
    } else {
      navigation.navigate("Login");
    }
  }, [navigation]);

  const handleApply = async () => {
    if (!isLoggedIn) {
      Alert.alert("Cần đăng nhập", "Vui lòng đăng nhập để ứng tuyển.", [
        { text: "Huỷ" },
        { text: "Đến trang đăng nhập", onPress: navigateToLogin },
      ]);
      return;
    }
    if (alreadyApplied) return;

    try {
      setApplying(true);
      await applyMyselfToJob(jobId, {
        note: "Ứng tuyển từ ứng dụng di động",
        email: user?.email,
        fullName: user?.fullName || user?.name,
      });
      setAlreadyApplied(true);
      Alert.alert("Thành công", "Bạn đã ứng tuyển công việc này.");
    } catch (e) {
      Alert.alert("Không thể ứng tuyển", "Vui lòng thử lại sau.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchDetail}
          style={{
            backgroundColor: "#2563EB",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const title = job?.title || job?.jobTitle || "Chi tiết công việc";
  const location = formatAddress(job?.address);
  const salary =
    job?.salaryMin && job?.salaryMax
      ? `${job.salaryMin} - ${job.salaryMax}`
      : job?.salaryMin
      ? `Từ ${job.salaryMin}`
      : job?.salaryMax
      ? `Đến ${job.salaryMax}`
      : "";
  const employmentType = job?.employmentType || "";
  const description = job?.description || "Chưa có mô tả.";
  const skills = Array.isArray(job?.skills) ? job.skills : [];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: Math.max(24, insets.bottom + 24) }}>
        <Text style={{ fontSize: 22, fontWeight: "800" }}>{title}</Text>

        {!!location && <Text style={{ marginTop: 6, color: "#6b7280" }}>{location}</Text>}
        {!!salary && <Text style={{ marginTop: 2, color: "#16a34a" }}>{salary}</Text>}
        {!!employmentType && <Text style={{ marginTop: 2, color: "#374151" }}>{employmentType}</Text>}

        <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "700" }}>Mô tả công việc</Text>
        <Text style={{ marginTop: 6, color: "#111827", lineHeight: 22 }}>{description}</Text>

        {skills.length > 0 && (
          <>
            <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "700" }}>Kỹ năng</Text>
            <Text style={{ marginTop: 6, color: "#111827", lineHeight: 22 }}>
              {skills.join(", ")}
            </Text>
          </>
        )}
        <View style={{ marginTop: 24, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={handleApply}
            disabled={applying || alreadyApplied}
            style={{
              backgroundColor: alreadyApplied ? "#9ca3af" : applying ? "#93c5fd" : "#2563EB",
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              {alreadyApplied ? "Bạn đã ứng tuyển" : applying ? "Đang ứng tuyển..." : "Ứng tuyển"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
