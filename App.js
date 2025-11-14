import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <AppNavigator />
        <Toast />
      </PaperProvider>
    </AuthProvider>
  );
}
