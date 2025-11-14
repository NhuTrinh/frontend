// pages/JobPage.js
import * as React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getJobs } from "../../service/candidate/jobService";

// ✅ Helper: chuẩn hóa địa chỉ (object -> string)
function formatAddress(addr) {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  const { line, city, country } = addr;
  return [line, city, country].filter(Boolean).join(", ");
}

export default function JobPage({ navigation }) {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [searching, setSearching] = React.useState(false);

  const fetchJobs = React.useCallback(async (keyword = "") => {
    try {
      setError(null);
      if (!loading && keyword !== "") setSearching(true);
      const data = await getJobs(
        keyword
          ? {
              search: keyword,
            }
          : undefined
      );
      const list = Array.isArray(data) ? data : data?.items || [];
      setJobs(list);
    } catch (e) {
      setError("Không tải được danh sách công việc.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setSearching(false);
    }
  }, [loading]);

  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  React.useEffect(() => {
    const handle = setTimeout(() => {
      fetchJobs(search.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [search, fetchJobs]);

  const renderItem = ({ item }) => {
    // mapping field, tránh crash khi field là object
    const id = item.id || item._id || item.uuid || item.slug;
    const title = item.title || item.name || "Công việc";
    const company = item.company?.name || item.companyName || item.org || "Công ty";

    const rawLocation = item.location || item.city || item.address || "";
    const location = formatAddress(rawLocation); // ✅ xử lý object address

    const salary =
      item.salary ||
      item.range ||
      (item.salaryMin && item.salaryMax
        ? `${item.salaryMin} - ${item.salaryMax}`
        : item.salaryMin
        ? `Từ ${item.salaryMin}`
        : item.salaryMax
        ? `Đến ${item.salaryMax}`
        : "");

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("JobDetail", { id })}
        style={{
          padding: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          marginHorizontal: 16,
          marginVertical: 8,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 1,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name="briefcase-outline" size={22} />
          <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "700" }}>
            {title}
          </Text>
        </View>
        <Text style={{ marginTop: 6, color: "#374151" }}>{company}</Text>
        {!!location && (
          <Text style={{ marginTop: 2, color: "#6b7280" }}>{location}</Text>
        )}
        {!!salary && (
          <Text style={{ marginTop: 2, color: "#16a34a" }}>{salary}</Text>
        )}
        <Text style={{ marginTop: 10, color: "#2563EB" }}>Xem chi tiết →</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Đang tải công việc...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchJobs}
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

  const showEmpty = !loading && jobs.length === 0;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          margin: 16,
          marginBottom: 8,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#d1d5db",
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
        }}
      >
        <MaterialCommunityIcons name="magnify" size={22} color="#6b7280" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm kiếm công việc..."
          style={{ flex: 1, marginLeft: 8, paddingVertical: 10 }}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} style={{ padding: 4 }}>
            <MaterialCommunityIcons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item, idx) => String(item.id || item._id || idx)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing || searching} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>Không tìm thấy công việc.</Text>
            {!!search && (
              <Text style={{ color: "#6b7280", textAlign: "center" }}>
                Thử đổi từ khóa khác hoặc xóa bộ lọc để xem danh sách đầy đủ.
              </Text>
            )}
          </View>
        }
      />
    </View>
  );
}
