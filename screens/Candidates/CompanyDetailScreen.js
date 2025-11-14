// pages/CompanyDetailPage.js
import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getCompanyDetail } from "../../service/candidate/companyService";

function formatAddress(addr) {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  const { line, street, ward, district, city, country } = addr;
  return [line, street, ward, district, city, country].filter(Boolean).join(", ");
}

export default function CompanyDetailPage({ route, navigation }) {
  const { id } = route.params || {};
  const [company, setCompany] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchDetail = React.useCallback(async () => {
    try {
      setError(null);
      const data = await getCompanyDetail(id);
      setCompany(data);
    } catch (e) {
      console.log("getCompanyDetail error", e);
      setError("Không tải được thông tin công ty.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Đang tải...</Text>
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

  if (!company) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không có dữ liệu công ty.</Text>
      </View>
    );
  }

  const name = company.name || company.companyName || "Công ty";
  const industry =
    company.industry || company.field || company.category || "Chưa cập nhật";
  const address = formatAddress(
    company.address || company.location || company.city || company.headOffice
  );
  const website = company.website || company.web || company.site;
  const size =
    company.size ||
    company.companySize ||
    company.employeeCount ||
    company.numberOfEmployees;

  const description =
    company.description ||
    company.about ||
    company.bio ||
    "Chưa có mô tả cho công ty này.";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f9fafb" }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="office-building-outline"
            size={26}
            color="#111827"
          />
          <Text
            style={{
              marginLeft: 10,
              fontSize: 20,
              fontWeight: "800",
              flex: 1,
              flexWrap: "wrap",
            }}
          >
            {name}
          </Text>
        </View>

        <Text style={{ marginTop: 8, color: "#374151" }}>{industry}</Text>

        {!!address && (
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={20}
              color="#6b7280"
            />
            <Text style={{ marginLeft: 6, color: "#4b5563", flex: 1 }}>
              {address}
            </Text>
          </View>
        )}

        {!!size && (
          <View style={{ flexDirection: "row", marginTop: 6 }}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={20}
              color="#6b7280"
            />
            <Text style={{ marginLeft: 6, color: "#4b5563" }}>
              Quy mô: {size}
            </Text>
          </View>
        )}

        {!!website && (
          <TouchableOpacity
            onPress={() => Linking.openURL(website.startsWith("http") ? website : `https://${website}`)}
            style={{ flexDirection: "row", marginTop: 6 }}
          >
            <MaterialCommunityIcons
              name="web"
              size={20}
              color="#2563EB"
            />
            <Text style={{ marginLeft: 6, color: "#2563EB" }}>{website}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          marginTop: 16,
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 8 }}>
          Giới thiệu công ty
        </Text>
        <Text style={{ color: "#4b5563", lineHeight: 20 }}>{description}</Text>
      </View>
    </ScrollView>
  );
}
