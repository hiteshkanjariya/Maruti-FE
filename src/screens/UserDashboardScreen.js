import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Card, List, FAB, Snackbar, Text } from 'react-native-paper';

const userComplaints = [
  { id: 'c1', title: 'AC not cooling', status: 'open' },
  { id: 'c2', title: 'Leaking pipe', status: 'in progress' },
];

const UserDashboardScreen = ({ navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="User Dashboard" />
        <Appbar.Action icon="account-circle" onPress={handleProfile} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <FlatList
        data={userComplaints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <List.Item
              title={item.title}
              description={`Status: ${item.status}`}
              left={props => <List.Icon {...props} icon="wrench" />}
            />
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No complaints found.</Text>}
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
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  card: { margin: 10 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 },
});

export default UserDashboardScreen; 