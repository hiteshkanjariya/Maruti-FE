import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, Snackbar, Text, Card, HelperText, IconButton, Menu } from 'react-native-paper';
import api from '../services/api';

const ROLES = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Client', value: 'client' },
];

const UserFormScreen = ({ navigation, route }) => {
  const { user } = route.params || {};
  const [name, setName] = useState(user?.name || 'hk');
  const [phone, setPhone] = useState(user?.phone || '9904186384');
  const [password, setPassword] = useState('hk');
  const [confirmPassword, setConfirmPassword] = useState('hk');
  const [role, setRole] = useState(user?.role || 'user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roleMenuVisible, setRoleMenuVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');

    if (!name || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true); // Start loading

    try {
      const payload = {
        name,
        phone,
        password,
        role,
      };

      let response;
      if (user?._id) {
        // Update existing user
        response = await api.put(`/user/${user._id}`, payload);
        setSnackbarMsg('User updated successfully!');
      } else {
        // Add new user
        response = await api.post('/user', payload);
        setSnackbarMsg('User added successfully!');
      }

      setSnackbarVisible(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      console.log("🚨 ~ handleSave ~ err:", err);
      const msg =
        err.response?.data?.message || 'Failed to save user. Please try again.';
      setError(msg);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  const getRoleLabel = (roleValue) => {
    const roleObj = ROLES.find(r => r.value === roleValue);
    return roleObj ? roleObj.label : roleValue;
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={user ? 'Edit User' : 'Add User'} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={10}
              left={<TextInput.Icon icon="phone" />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Role</Text>
              <Menu
                visible={roleMenuVisible}
                onDismiss={() => setRoleMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setRoleMenuVisible(true)}
                    style={styles.roleButton}
                    icon="account-cog"
                  >
                    {getRoleLabel(role)}
                  </Button>
                }
              >
                {ROLES.map((roleOption) => (
                  <Menu.Item
                    key={roleOption.value}
                    onPress={() => {
                      setRole(roleOption.value);
                      setRoleMenuVisible(false);
                    }}
                    title={roleOption.label}
                    leadingIcon={
                      roleOption.value === 'admin'
                        ? 'account-tie'
                        : roleOption.value === 'user'
                          ? 'account'
                          : 'account-tie-hat'
                    }
                  />
                ))}
              </Menu>
            </View>
            {error ? <HelperText type="error">{error}</HelperText> : null}

            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              {user ? 'Update User' : 'Add User'}
            </Button>

          </Card.Content>
        </Card>
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  input: {
    marginBottom: 12,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  roleButton: {
    borderColor: '#666',
  },
  button: {
    marginTop: 8,
  },
});

export default UserFormScreen; 