import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import {
  Appbar,
  Card,
  List,
  FAB,
  Snackbar,
  Text,
  Searchbar,
  Chip,
  Menu,
  Divider
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

const ComplaintListScreen = ({ navigation }) => {
  const [complaints, setComplaints] = useState([]);
  console.log("🚀 ~ ComplaintListScreen ~ complaints:", complaints)
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [loading, setLoading] = useState(false);

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

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get("/complaint"); // Replace with real URL
      console.log("🚀 ~ fetchComplaints ~ response:", response)
      const data = await response.data.data;
      setComplaints(data);
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.response.data.message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchComplaints();
    }, [])
  );

  const filteredComplaints = complaints?.filter((complaint) => {
    const matchesSearch =
      complaint?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint?.assignedUser?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || complaint?.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || complaint?.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewDetails = (item) => {
    navigation.navigate('ComplaintDetail', { complaint: item });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Complaint List" />
        <Appbar.Action icon="filter-variant" onPress={() => setMenuVisible(true)} />
      </Appbar.Header>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
      >
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
            setSelectedStatus('all');
            setSelectedPriority('all');
            setMenuVisible(false);
          }}
          title="Clear Filters"
          leadingIcon="filter-remove"
        />
      </Menu>

      <Searchbar
        placeholder="Search complaints..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'open', 'in_progress', 'closed'].map((status) => (
            <Chip
              key={status}
              selected={selectedStatus === status}
              onPress={() => setSelectedStatus(status)}
              style={styles.filterChip}
            >
              {status.replace('_', ' ').toUpperCase()}
            </Chip>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priorityFilterContainer}>
          {['all', 'high', 'medium', 'low'].map((priority) => (
            <Chip
              key={priority}
              selected={selectedPriority === priority}
              onPress={() => setSelectedPriority(priority)}
              style={styles.filterChip}
            >
              {priority === 'all' ? 'All Priorities' : priority.toUpperCase()}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <Card style={styles.card} onPress={() => handleViewDetails(item)}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Chip
                    mode="outlined"
                    style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
                    textStyle={{ color: getStatusColor(item.status) }}
                  >
                    {item?.status?.replace('_', ' ').toUpperCase()}
                  </Chip>
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.assignedTo}>Assigned to: {item.assignedUser}</Text>
                  <Chip
                    mode="outlined"
                    style={[styles.priorityChip, { borderColor: getPriorityColor(item.priority) }]}
                    textStyle={{ color: getPriorityColor(item.priority) }}
                  >
                    {item.priority.toUpperCase()}
                  </Chip>
                </View>
                <Text style={styles.date}>
                  Date: {new Date(item.date || item.createdAt).toLocaleDateString()}
                </Text>
              </Card.Content>
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
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  searchBar: {
    margin: 16,
    elevation: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  priorityFilterContainer: {
    marginTop: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  card: {
    margin: 8,
    marginHorizontal: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assignedTo: {
    fontSize: 14,
    color: '#666',
  },
  priorityChip: {
    marginLeft: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
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
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ComplaintListScreen;
