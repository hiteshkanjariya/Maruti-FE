import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Appbar, Card, List, FAB, Snackbar, Text, Searchbar, Chip, Menu, Divider } from 'react-native-paper';

const complaints = [
  { id: 'c1', title: 'AC not cooling', status: 'open', assignedUser: 'Alice', priority: 'high', date: '2024-03-20' },
  { id: 'c2', title: 'Leaking pipe', status: 'in_progress', assignedUser: 'Bob', priority: 'medium', date: '2024-03-19' },
  { id: 'c3', title: 'Noisy fan', status: 'closed', assignedUser: 'Alice', priority: 'low', date: '2024-03-18' },
];

const ComplaintListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
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

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.assignedUser.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || complaint.priority === selectedPriority;
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
          <Chip
            selected={selectedStatus === 'all'}
            onPress={() => setSelectedStatus('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={selectedStatus === 'open'}
            onPress={() => setSelectedStatus('open')}
            style={styles.filterChip}
          >
            Open
          </Chip>
          <Chip
            selected={selectedStatus === 'in_progress'}
            onPress={() => setSelectedStatus('in_progress')}
            style={styles.filterChip}
          >
            In Progress
          </Chip>
          <Chip
            selected={selectedStatus === 'closed'}
            onPress={() => setSelectedStatus('closed')}
            style={styles.filterChip}
          >
            Closed
          </Chip>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.priorityFilterContainer}>
          <Chip
            selected={selectedPriority === 'all'}
            onPress={() => setSelectedPriority('all')}
            style={styles.filterChip}
          >
            All Priorities
          </Chip>
          <Chip
            selected={selectedPriority === 'high'}
            onPress={() => setSelectedPriority('high')}
            style={styles.filterChip}
          >
            High
          </Chip>
          <Chip
            selected={selectedPriority === 'medium'}
            onPress={() => setSelectedPriority('medium')}
            style={styles.filterChip}
          >
            Medium
          </Chip>
          <Chip
            selected={selectedPriority === 'low'}
            onPress={() => setSelectedPriority('low')}
            style={styles.filterChip}
          >
            Low
          </Chip>
        </ScrollView>
      </View>

      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card 
            style={styles.card}
            onPress={() => handleViewDetails(item)}
          >
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <Chip
                  mode="outlined"
                  style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
                  textStyle={{ color: getStatusColor(item.status) }}
                >
                  {item.status.replace('_', ' ').toUpperCase()}
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
              <Text style={styles.date}>Date: {item.date}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No complaints found</Text>
          </View>
        }
      />

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
});

export default ComplaintListScreen; 