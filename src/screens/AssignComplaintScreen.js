import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Appbar, Card, List, Button, Text, Searchbar, Chip, Snackbar } from 'react-native-paper';
import api from '../services/api';

const AssignComplaintScreen = ({ route, navigation }) => {
  const { currentAssignedUser, complaintId } = route.params;
  // const complaintId = route.params.complaint?._id;
  console.log("🚀 ~ AssignComplaintScreen ~ complaintId:", complaintId)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user');
      // Filter out admin users and only show technicians/users who can be assigned complaints
      const filteredUsers = response.data.data.filter(user => user.role !== 'admin');
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbarMsg('Failed to load users');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignComplaint = async (user) => {
    try {
      setAssigning(true);
      const response = await api.put(`/complaint/${complaintId}/assign`, {
        userId: user._id
      });
      console.log("🚀 ~ handleAssignComplaint ~ response:", response)

      console.log('Complaint assigned successfully:', response.data);
      setSnackbarMsg(`Complaint assigned to ${user.name}`);
      setSnackbarVisible(true);

      // Navigate back to complaint detail after successful assignment
      // setTimeout(() => {
      //   navigation.goBack();
      // }, 1500);
      setTimeout(() => {
        navigation.goBack(); // ComplaintDetailScreen will refresh on focus
      }, 1500);
    } catch (error) {
      console.error('Error assigning complaint:', error);
      setSnackbarMsg('Failed to assign complaint');
      setSnackbarVisible(true);
    } finally {
      setAssigning(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#FFA000';
      case 'user': return '#4CAF50';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Assign Complaint" />
      </Appbar.Header>

      <Searchbar
        placeholder="Search users..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {currentAssignedUser && (
        <Card style={styles.currentAssignmentCard}>
          <Card.Content>
            <Text style={styles.currentAssignmentTitle}>Currently Assigned To:</Text>
            <List.Item
              title={currentAssignedUser.name}
              description={`Phone: ${currentAssignedUser.phone} | Role: ${currentAssignedUser.role}`}
              left={props => <List.Icon {...props} icon="account-check" />}
            />
          </Card.Content>
        </Card>
      )}

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card style={styles.userCard}>
            <Card.Content>
              <List.Item
                title={item.name}
                description={`Phone: ${item.phone}`}
                left={props => <List.Icon {...props} icon="account" />}
                right={props => (
                  <View style={styles.userCardRight}>
                    <Chip
                      mode="outlined"
                      style={[styles.roleChip, { borderColor: getRoleColor(item.role) }]}
                      textStyle={{ color: getRoleColor(item.role) }}
                    >
                      {item.role.toUpperCase()}
                    </Chip>
                    <Button
                      mode="contained"
                      onPress={() => handleAssignComplaint(item)}
                      loading={assigning}
                      disabled={assigning}
                      style={styles.assignButton}
                    >
                      Assign
                    </Button>
                  </View>
                )}
              />
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMsg}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    margin: 16,
  },
  currentAssignmentCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
  },
  currentAssignmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976D2',
  },
  userCard: {
    margin: 8,
    marginHorizontal: 16,
  },
  userCardRight: {
    alignItems: 'center',
    gap: 8,
  },
  roleChip: {
    marginBottom: 8,
  },
  assignButton: {
    minWidth: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AssignComplaintScreen; 