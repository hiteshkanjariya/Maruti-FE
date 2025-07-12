import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, Title, HelperText } from 'react-native-paper';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = "https://marutirefrigeration.in/wp-content/uploads/2023/09/MR-Logo.webp";

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('1234567890');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { phone, password });
      if (res.data?.token) {
        const { token } = res.data;
        await AsyncStorage.setItem('authToken', token);
        const role = res.data.user.role;
        if (role === 'admin') {
          navigation.replace('AdminFlow');
        } else {
          navigation.replace('UserFlow');
        }
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Server or network error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={{ uri: logo }}
          style={styles.logo}
          resizeMode="contain"
        />

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Welcome Back</Title>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={10}
            // left={<TextInput.Icon icon="phone" />}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              // left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            {error ? <HelperText type="error">{error}</HelperText> : null}

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Sign In
            </Button>

            <Text style={styles.demoText}>
              Demo Credentials:{'\n'}
              Admin: 1234567890 / admin123{'\n'}
              User: 9876543210 / user123
            </Text>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: Dimensions.get('window').width * 0.6,
    height: 100,
    alignSelf: 'center',
    marginBottom: 32,
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  demoText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
});

export default LoginScreen; 