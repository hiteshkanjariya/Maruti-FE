import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Appbar, Card, Button, Text, IconButton, Menu, Divider } from 'react-native-paper';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const AdminDashboardScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    openComplaints: 0,
    totalRevenue: 0,
    pendingPayments: 0,
  });

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('dashboard');

      const { totalUsers, totalComplaints, openComplaints, totalRevenue, pendingPayments } = res.data;

      setStats({
        totalUsers,
        totalComplaints,
        openComplaints,
        totalRevenue,
        pendingPayments,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardStats();
    }, [])
  );


  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleAddUser = () => {
    navigation.navigate('UserForm');
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Admin Dashboard" />
        <IconButton
          icon="dots-vertical"
          onPress={() => setMenuVisible(true)}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={{ x: 0, y: 0 }}
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              handleAddUser();
            }}
            title="Add User"
            leadingIcon="account-plus"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('ComplaintForm');
            }}
            title="New Complaint"
            leadingIcon="plus-circle"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              handleProfile();
            }}
            title="Profile"
            leadingIcon="account"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              handleLogout();
            }}
            title="Logout"
            leadingIcon="logout"
          />
        </Menu>
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsTitle}>Total Users</Text>
              <Text style={styles.statsValue}>{stats.totalUsers}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsTitle}>Total Complaints</Text>
              <Text style={styles.statsValue}>{stats.totalComplaints}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsTitle}>Open Complaints</Text>
              <Text style={styles.statsValue}>{stats.openComplaints}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsTitle}>Total Revenue</Text>
              <Text style={styles.statsValue}>₹{stats.totalRevenue}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsTitle}>Pending Payments</Text>
              <Text style={styles.statsValue}>₹{stats.pendingPayments}</Text>
            </Card.Content>
          </Card>
        </View>

        {/* <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon="account-group"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Users')}
          >
            Manage Users
          </Button>
          <Button
            mode="contained"
            icon="alert-circle"
            style={styles.actionButton}
            onPress={() => navigation.navigate('Complaints')}
          >
            View Complaints
          </Button>
          <Button
            mode="contained"
            icon="plus-circle"
            style={styles.actionButton}
            onPress={() => navigation.navigate('ComplaintForm')}
          >
            New Complaint
          </Button>
          <Button
            mode="contained"
            icon="account-plus"
            style={styles.actionButton}
            onPress={handleAddUser}
          >
            Add User
          </Button>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
    margin: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 14,
    color: '#666',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
});

export default AdminDashboardScreen;
