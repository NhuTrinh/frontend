import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployerCandidatesScreen from '../screens/employer/EmployerCandidatesScreen';
import EmployerCompanyInfoScreen from '../screens/employer/EmployerCompanyInfoScreen';
import EmployerDashboardScreen from '../screens/employer/EmployerDashboardScreen';
import EmployerLoginScreen from '../screens/employer/EmployerLoginScreen';
import EmployerNotificationsScreen from '../screens/employer/EmployerNotificationsScreen';
import EmployerRegisterScreen from '../screens/employer/EmployerRegisterScreen';

const Stack = createNativeStackNavigator();

export default function EmployerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EmployerLogin"
        component={EmployerLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmployerRegister"
        component={EmployerRegisterScreen}
        options={{ title: 'Đăng ký nhà tuyển dụng' }}
      />
      <Stack.Screen
        name="EmployerDashboard"
        component={EmployerDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmployerCompanyInfo"
        component={EmployerCompanyInfoScreen}
        options={{ title: 'Thông tin công ty' }}
      />
      <Stack.Screen
        name="EmployerCandidates"
        component={EmployerCandidatesScreen}
        options={{ title: 'Ứng viên đã ứng tuyển' }}
      />
      <Stack.Screen
        name="EmployerNotifications"
        component={EmployerNotificationsScreen}
        options={{ title: 'Thông báo tuyển dụng' }}
      />
    </Stack.Navigator>
  );
}
