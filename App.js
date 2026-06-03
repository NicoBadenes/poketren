import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importamos las pantallas desde sus nuevos archivos
import Home from "./src/screens/Home";
import Detalles from "./src/screens/Detalles";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="home" 
            component={Home} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="detalles" 
            component={Detalles} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}