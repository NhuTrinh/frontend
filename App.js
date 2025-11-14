import React from "react";
import AppNavigator from "./navigation/AppNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
       <Toast />
    </PaperProvider>
  );
}
