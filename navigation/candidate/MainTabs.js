// navigation/MainTabs.js
import * as React from "react";
import { Text, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AuthContext } from "../../context/AuthContext";

/* ---------- Stacks (đã chuyển vào thư mục navigation/candidate) ---------- */
import JobStack from "./JobStack";
import CompanyStack from "./CompanyStack";
import ProfileStack from "./ProfileStack";

/* ---------- Screens (thay cho pages) ---------- */
// điều chỉnh path đúng với project của bạn, theo hình thì là:
import EmployerScreen from "../../screens/Candidates/EmployerScreen";
import LoginScreen from "../../screens/Candidates/LoginScreen";     
import RegisterScreen from "../../screens/Candidates/RegisterScreen";

const Tab = createBottomTabNavigator();

function ensure(name, Comp) {
  if (!Comp) {
    console.error(`[MainTabs] ${name} is undefined (import/export sai?)`);
    return () => (
      <Text style={{ padding: 20, color: "red" }}>{name} is undefined</Text>
    );
  }
  return Comp;
}

/* ----------------------------- Common tab options ----------------------------- */
function useTabScreenOptions() {
  const insets = useSafeAreaInsets();
  const bottomSpacer = React.useMemo(() => {
    if (insets.bottom > 0) return insets.bottom;
    return 0;
  }, [insets.bottom]);

  return React.useMemo(
    () => ({
      headerTitleAlign: "center",
      headerStatusBarHeight: Platform.OS === "android" ? 0 : undefined,
      headerStyle: {
        backgroundColor: "#ffffff",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: "600",
      },

      tabBarActiveTintColor: "#2563EB",
      tabBarInactiveTintColor: "#8e8e93",
      tabBarAllowFontScaling: false,
      tabBarLabelStyle: {
        fontSize: 11,
        marginBottom: 6,
        includeFontPadding: false,
      },
      tabBarItemStyle: { paddingVertical: 4, maxWidth: 92 },
      tabBarStyle: {
        position: "absolute",
        left: 12,
        right: 12,
        bottom: bottomSpacer,
        borderRadius: 20,
        backgroundColor: "#ffffff",
        borderTopWidth: 0,
        paddingTop: 6,
        paddingBottom: Math.max(6, insets.bottom + 6),
        elevation: 8,
        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      tabBarHideOnKeyboard: true,
    }),
    [bottomSpacer, insets.bottom]
  );
}

/* ----------------------------- Guest Tabs ----------------------------- */
function GuestTabs() {
  const screenOptions = useTabScreenOptions();

  return (
    <Tab.Navigator initialRouteName="Jobs" screenOptions={screenOptions}>
      {/* Việc */}
      <Tab.Screen
        name="Jobs"
        component={ensure("JobStack", JobStack)}
        options={{
          title: "Công việc",
          tabBarLabel: "Công Việc",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="briefcase-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Công ty */}
      <Tab.Screen
        name="Company"
        component={ensure("CompanyStack", CompanyStack)}
        options={{
          title: "Công ty",
          tabBarLabel: "Công Ty",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="office-building"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Nhà tuyển dụng */}
      <Tab.Screen
        name="Employer"
        component={ensure("EmployerScreen", EmployerScreen)}
        options={{
          title: "Nhà tuyển dụng",
          tabBarLabel: "Nhà Tuyển Dụng",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-tie"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Đăng nhập */}
      <Tab.Screen
        name="Login"
        component={ensure("LoginScreen", LoginScreen)}
        options={{
          title: "Đăng nhập",
          tabBarLabel: "Đăng Nhập",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="login" size={size} color={color} />
          ),
        }}
      />

      {/* Đăng ký */}
      <Tab.Screen
        name="Register"
        component={ensure("RegisterScreen", RegisterScreen)}
        options={{
          title: "Đăng ký",
          tabBarLabel: "Đăng Ký",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-plus"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* ------------------------------ App Tabs (đã đăng nhập) ------------------------------ */
function AppTabs() {
  const screenOptions = useTabScreenOptions();

  return (
    <Tab.Navigator initialRouteName="Profile" screenOptions={screenOptions}>
      {/* Việc */}
      <Tab.Screen
        name="Jobs"
        component={ensure("JobStack", JobStack)}
        options={{
          title: "Công việc",
          tabBarLabel: "Công Việc",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="briefcase-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Công ty */}
      <Tab.Screen
        name="Company"
        component={ensure("CompanyStack", CompanyStack)}
        options={{
          title: "Công ty",
          tabBarLabel: "Công Ty",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="office-building"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Nhà tuyển dụng */}
      <Tab.Screen
        name="Employer"
        component={ensure("EmployerScreen", EmployerScreen)}
        options={{
          title: "Nhà tuyển dụng",
          tabBarLabel: "Nhà Tuyển Dụng",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-tie"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Hồ sơ */}
      <Tab.Screen
        name="Profile"
        component={ensure("ProfileStack", ProfileStack)}
        options={{
          title: "Hồ sơ",
          tabBarLabel: "Hồ sơ",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* -------------------------- Switch theo login ------------------------- */
export default function MainTabs() {
  const { isLoggedIn } = React.useContext(AuthContext);
  return isLoggedIn ? <AppTabs /> : <GuestTabs />;
}

const styles = StyleSheet.create({});
