import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Appbar, Card, Chip, Snackbar, Text, FAB, Button, Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

const UserDashboardScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#2196F3';
      case 'in_progress': return '#FFA000';
      case 'closed': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FFA000';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const fetchUserComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/complaint/my');
      const data = response.data.data || [];
      setComplaints(data);
      setFilteredComplaints(data); // initial filter
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setSnackbarMsg(error.response?.data?.message || 'Failed to load complaints');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserComplaints();
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredComplaints(complaints);
    } else {
      const filtered = complaints.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.status.toLowerCase().includes(query.toLowerCase()) ||
        item.priority.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredComplaints(filtered);
    }
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleViewDetails = (complaint) => {
    navigation.navigate('ComplaintDetail', { complaint });
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="User Dashboard" />
        <Appbar.Action icon="account-circle" onPress={handleProfile} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <Searchbar
        placeholder="Search complaints..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchBar}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <TouchableOpacity onPress={() => handleViewDetails(item)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Chip
                    mode="outlined"
                    style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
                    textStyle={{ color: getStatusColor(item.status) }}
                  >
                    {item.status?.replace('_', ' ').toUpperCase()}
                  </Chip>
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.assignedTo}>
                    Assigned to: {item.assignedTo?.name || 'Not assigned'}
                  </Text>
                  <Chip
                    mode="outlined"
                    style={[styles.priorityChip, { borderColor: getPriorityColor(item.priority) }]}
                    textStyle={{ color: getPriorityColor(item.priority) }}
                  >
                    {item.priority?.toUpperCase()}
                  </Chip>
                </View>
                <Text style={styles.date}>
                  Date: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <Card.Actions>
                {item?.canAssign && (
                  <Button
                    mode="outlined"
                    onPress={() =>
                      navigation.navigate('AssignComplaint', {
                        complaintId: item._id,
                        currentAssignedUser: item.assignedTo
                      })
                    }
                    icon="account-plus"
                  >
                    Assign
                  </Button>
                )}
              </Card.Actions>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No complaints found</Text>
            </View>
          }
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add"
        onPress={() => navigation.navigate('ComplaintForm')}
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
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  searchBar: { margin: 16, elevation: 4 },
  card: { margin: 8, marginHorizontal: 16, elevation: 4, paddingHorizontal: 16, paddingVertical: 16 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  statusChip: { marginLeft: 8 },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assignedTo: { fontSize: 14, color: '#666' },
  priorityChip: { marginLeft: 8 },
  date: { fontSize: 12, color: '#999' },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: { fontSize: 16, color: '#666' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default UserDashboardScreen;
