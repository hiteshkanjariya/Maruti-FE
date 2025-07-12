import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, List, FAB, Snackbar, Card } from 'react-native-paper';
import api from '../services/api';

const UserListScreen = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user');
      setUsers(res.data.data);
    } catch (err) {
      console.error("🚨 Error fetching users:", err);
      setSnackbarMsg("Failed to load users");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchUsers);
    return unsubscribe;
  }, [navigation]);
  const handleEdit = (user) => navigation.navigate('UserForm', { user });
  const handleDelete = async (user) => {
    try {
      await api.delete(`/user/${user._id}`);
      setSnackbarMsg(`Deleted user: ${user.name}`);
      setSnackbarVisible(true);
      fetchUsers(); // Refresh user list after deletion
    } catch (err) {
      console.error("🚨 Error deleting user:", err);
      setSnackbarMsg("Failed to delete user");
      setSnackbarVisible(true);
    }
  };


  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="User List" />
      </Appbar.Header>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={fetchUsers}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Card style={styles.card}>
              <List.Item
                title={item.name}
                description={`Phone: ${item.phone} | Role: ${item.role}`}
                left={props => <List.Icon {...props} icon={item.role === 'admin' ? 'account-tie' : 'account'} />}
                right={props => (
                  <View style={{ flexDirection: 'row' }}>
                    <List.Icon {...props} icon="pencil" onPress={() => handleEdit(item)} />
                    <List.Icon {...props} icon="delete" onPress={() => handleDelete(item)} />
                  </View>
                )}
              />
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<List.Item title="No users found." />}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add"
        onPress={() => navigation.navigate('UserForm')}
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
  card: { margin: 10 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default UserListScreen; 