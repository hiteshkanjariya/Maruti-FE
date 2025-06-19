import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, List, FAB, Snackbar, Card } from 'react-native-paper';

const users = [
  { id: '1', name: 'Alice', email: 'alice@mail.com', role: 'admin' },
  { id: '2', name: 'Bob', email: 'bob@mail.com', role: 'user' },
];

const UserListScreen = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleEdit = (user) => navigation.navigate('UserForm', { user });
  const handleDelete = (user) => {
    setSnackbarMsg(`Deleted user: ${user.name}`);
    setSnackbarVisible(true);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="User List" />
      </Appbar.Header>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Card style={styles.card}>
              <List.Item
                title={item.name}
                description={`${item.email} | Role: ${item.role}`}
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