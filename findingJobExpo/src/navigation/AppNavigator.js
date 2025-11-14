import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmployerStack from './EmployerStack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployerStack" component={EmployerStack} />
    </Stack.Navigator>
  );
}
