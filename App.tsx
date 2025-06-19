/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import UserListScreen from './src/screens/UserListScreen';
import ComplaintListScreen from './src/screens/ComplaintListScreen';
import UserDashboardScreen from './src/screens/UserDashboardScreen';
import UserFormScreen from './src/screens/UserFormScreen';
import ComplaintDetailScreen from './src/screens/ComplaintDetailScreen';
import ComplaintFormScreen from './src/screens/ComplaintFormScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: '#ffffff',
    text: '#000000',
    error: '#B00020',
  },
};

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
    <Tab.Screen name="UserList" component={UserListScreen} options={{ title: 'Users' }} />
    <Tab.Screen name="ComplaintList" component={ComplaintListScreen} options={{ title: 'Complaints' }} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdminDashboard" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="UserDashboard" component={UserDashboardScreen} options={{ title: 'User Dashboard' }} />
      <Stack.Screen name="UserForm" component={UserFormScreen} options={{ title: 'Add/Edit User' }} />
      <Stack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} options={{ title: 'Complaint Details' }} />
      <Stack.Screen name="ComplaintForm" component={ComplaintFormScreen} options={{ title: 'Create/Edit Complaint' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
};

export default App;
