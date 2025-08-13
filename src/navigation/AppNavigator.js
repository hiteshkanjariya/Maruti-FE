import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import UserDashboardScreen from '../screens/UserDashboardScreen';
import UserListScreen from '../screens/UserListScreen';
import UserFormScreen from '../screens/UserFormScreen';
import ComplaintListScreen from '../screens/ComplaintListScreen';
import ComplaintDetailScreen from '../screens/ComplaintDetailScreen';
import ComplaintFormScreen from '../screens/ComplaintFormScreen';
import UpdatePaymentScreen from '../screens/UpdatePaymentScreen';
import AssignComplaintScreen from '../screens/AssignComplaintScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Admin Tab Navigator
const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'AdminDashboard':
            iconName = 'view-dashboard';
            break;
          case 'Users':
            iconName = 'account-group';
            break;
          case 'Complaints':
            iconName = 'alert-circle';
            break;
          case 'Profile':
            iconName = 'account';
            break;
          default:
            iconName = 'help-circle';
        }

        return <IconButton icon={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{
        title: 'Dashboard',
        headerShown: false
      }}
    />
    <Tab.Screen
      name="Users"
      component={UserListScreen}
      options={{
        title: 'Users',
        headerShown: false
      }}
    />
    <Tab.Screen
      name="Complaints"
      component={ComplaintListScreen}
      options={{
        title: 'Complaints',
        headerShown: false
      }}
    />
    {/* <Tab.Screen 
      name="Profile" 
      component={UserFormScreen} 
      options={{ 
        title: 'Profile',
        headerShown: false 
      }} 
    /> */}
  </Tab.Navigator>
);

// User Tab Navigator
const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'UserDashboard':
            iconName = 'view-dashboard';
            break;
          case 'MyComplaints':
            iconName = 'alert-circle';
            break;
          case 'Profile':
            iconName = 'account';
            break;
          default:
            iconName = 'help-circle';
        }

        return <IconButton icon={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen
      name="UserDashboard"
      component={UserDashboardScreen}
      options={{
        title: 'Dashboard',
        headerShown: false
      }}
    />
    <Tab.Screen
      name="MyComplaints"
      component={ComplaintListScreen}
      options={{
        title: 'All Complaints',
        headerShown: false
      }}
    />
    {/* <Tab.Screen
      name="Profile"
      component={UserFormScreen}
      options={{
        title: 'Profile',
        headerShown: false
      }}
    /> */}
  </Tab.Navigator>
);

// Main Stack Navigator
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AdminFlow"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserFlow"
        component={UserTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserForm"
        component={UserFormScreen}
        options={{ title: 'User Details' }}
      />
      <Stack.Screen
        name="ComplaintForm"
        component={ComplaintFormScreen}
        options={{ title: 'Complaint Details' }}
      />
      <Stack.Screen
        name="ComplaintDetail"
        component={ComplaintDetailScreen}
        options={{ title: 'Complaint Details' }}
      />
      <Stack.Screen
        name="UpdatePayment"
        component={UpdatePaymentScreen}
        options={{ title: 'Update Payment' }}
      />
      <Stack.Screen
        name="AssignComplaint"
        component={AssignComplaintScreen}
        options={{ title: 'Assign Complaint' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator; 