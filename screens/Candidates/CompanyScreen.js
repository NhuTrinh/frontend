// pages/CompanyPage.js
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
import { getCompanies } from "../../service/candidate/companyService";

// ✅ Chuẩn hoá địa chỉ
function formatAddress(addr) {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  const { line, street, ward, district, city, country } = addr;
  return [line, street, ward, district, city, country].filter(Boolean).join(", ");
}

export default function CompanyPage({ navigation }) {
  const [companies, setCompanies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [searching, setSearching] = React.useState(false);

  const fetchCompanies = React.useCallback(
    async (keyword = "") => {
      try {
        setError(null);
        if (!loading && keyword !== "") setSearching(true);

        const data = await getCompanies(
          keyword
            ? {
                search: keyword,
              }
            : undefined
        );

        const list = Array.isArray(data) ? data : data?.items || [];
        setCompanies(list);
      } catch (e) {
        console.log("fetchCompanies error", e);
        setError("Không tải được danh sách công ty.");
      } finally {
        setLoading(false);
        setRefreshing(false);
        setSearching(false);
      }
    },
    [loading]
  );

  React.useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompanies();
  };

  // search debounce
  React.useEffect(() => {
    const handle = setTimeout(() => {
      fetchCompanies(search.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [search, fetchCompanies]);

  const renderItem = ({ item }) => {
    const id = item.id || item._id || item.uuid || item.slug;
    const name = item.name || item.companyName || "Công ty";
    const industry =
      item.industry || item.field || item.category || "Ngành nghề chưa cập nhật";

    const rawAddress =
      item.address || item.location || item.city || item.headOffice || "";
    const address = formatAddress(rawAddress);

    const jobsCount =
      item.jobsCount ||
      item.openJobs ||
      item.totalJobs ||
      (Array.isArray(item.jobs) ? item.jobs.length : null);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("CompanyDetail", { id })}
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
          <MaterialCommunityIcons name="office-building-outline" size={22} />
          <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "700" }}>
            {name}
          </Text>
        </View>

        <Text style={{ marginTop: 6, color: "#374151" }}>{industry}</Text>

        {!!address && (
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color="#6b7280"
            />
            <Text style={{ marginLeft: 4, color: "#6b7280", flex: 1 }}>
              {address}
            </Text>
          </View>
        )}

        {!!jobsCount && (
          <Text style={{ marginTop: 4, color: "#16a34a" }}>
            {jobsCount} việc làm đang tuyển
          </Text>
        )}

        <Text style={{ marginTop: 10, color: "#2563EB" }}>Xem chi tiết →</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Đang tải công ty...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchCompanies}
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

  return (
    <View style={{ flex: 1 }}>
      {/* Ô search */}
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
          placeholder="Tìm kiếm công ty..."
          style={{ flex: 1, marginLeft: 8, paddingVertical: 10 }}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch("")}
            style={{ padding: 4 }}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={companies}
        keyExtractor={(item, idx) => String(item.id || item._id || idx)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || searching}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              marginTop: 40,
              paddingHorizontal: 24,
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}
            >
              Không tìm thấy công ty.
            </Text>
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
