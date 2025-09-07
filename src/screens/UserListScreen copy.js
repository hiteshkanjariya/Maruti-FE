import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Appbar, List, FAB, Snackbar, Card, Avatar, Button, Portal, Dialog, Paragraph, ActivityIndicator, Chip } from 'react-native-paper';
import api from '../services/api';

const UserListScreen = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const res = await api.get('/user');
      setUsers(res.data.data);
    } catch (err) {
      console.error("🚨 Error fetching users:", err);
      setSnackbarMsg("Failed to load users");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchUsers);
    return unsubscribe;
  }, [navigation]);
  const handleEdit = (user) => navigation.navigate('UserForm', { user });
  const handleDeletePress = (user) => {
    setUserToDelete(user);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      setDeleting(true);
      await api.delete(`/user/${userToDelete._id}`);
      setSnackbarMsg(`Successfully deleted user: ${userToDelete.name}`);
      setSnackbarVisible(true);
      setDeleteDialogVisible(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh user list after deletion
    } catch (err) {
      console.error("🚨 Error deleting user:", err);
      setSnackbarMsg("Failed to delete user");
      setSnackbarVisible(true);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogVisible(false);
    setUserToDelete(null);
  };

  const onRefresh = () => {
    fetchUsers(true);
  };


  const renderUserCard = ({ item }) => (
    <Card style={styles.card} elevation={2}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={50} 
              label={item.name.charAt(0).toUpperCase()}
              style={[
                styles.avatar,
                { backgroundColor: item.role === 'admin' ? '#6200ee' : '#03dac6' }
              ]}
            />
            <View style={styles.userDetails}>
              <List.Item
                title={item.name}
                titleStyle={styles.userName}
                description={`${item.phone}`}
                descriptionStyle={styles.userPhone}
                left={() => null}
                right={() => (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEdit(item)}
                    >
                      <List.Icon icon="pencil" color="#6200ee" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeletePress(item)}
                    >
                      <List.Icon icon="delete" color="#d32f2f" size={20} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </View>
          <Chip 
            mode="outlined"
            style={[
              styles.roleChip,
              { backgroundColor: item.role === 'admin' ? '#e3f2fd' : '#e8f5e8' }
            ]}
            textStyle={{ color: item.role === 'admin' ? '#1976d2' : '#388e3c' }}
          >
            {item.role.toUpperCase()}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Paragraph style={styles.loadingText}>Loading users...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="User Management" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="refresh" onPress={() => fetchUsers(true)} />
      </Appbar.Header>
      
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserCard}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6200ee']}
            tintColor="#6200ee"
          />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Avatar.Icon size={80} icon="account-group" style={styles.emptyIcon} />
            <Paragraph style={styles.emptyText}>No users found</Paragraph>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('UserForm')}
              style={styles.emptyButton}
            >
              Add First User
            </Button>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add User"
        onPress={() => navigation.navigate('UserForm')}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMsg}
      </Snackbar>

      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={handleDeleteCancel}>
          <Dialog.Title>Delete User</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to delete <strong>{userToDelete?.name}</strong>? 
              This action cannot be undone.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDeleteCancel} disabled={deleting}>
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleDeleteConfirm}
              loading={deleting}
              disabled={deleting}
              buttonColor="#d32f2f"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: {
    backgroundColor: '#6200ee',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: { 
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  roleChip: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  emptyButton: {
    borderRadius: 25,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
  },
  snackbar: {
    backgroundColor: '#333',
  },
});

export default UserListScreen; 