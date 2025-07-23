import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, TextInput, Button, Text, SegmentedButtons, HelperText, ActivityIndicator } from 'react-native-paper';
import Complaint from '../models/Complaint';
import api from '../services/api';

// Mock data - replace with your actual data storage
const mockComplaints = [
  {
    id: '1',
    title: 'AC Not Cooling',
    description: 'The AC is not cooling properly',
    status: 'pending',
    priority: 'high',
    assignedTo: 'user1',
    createdBy: 'user1',
    updatedBy: 'user1',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    payment: {
      amount: 1500,
      status: 'pending',
      method: 'cash',
      paidAt: null,
      notes: 'Initial service charge',
    },
  },
];

const UpdatePaymentScreen = ({ route, navigation }) => {
  const { complaintId } = route.params;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment form fields
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('unpaid')
  const [paymentNotes, setPaymentNotes] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`complaint/${complaintId}`);
        const data = response?.data?.data;

        const payment = data?.payment || {};

        setComplaint({
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        });

        // Populate fields from payment
        setAmount(payment.amount?.toString() || '');
        setPaymentMethod(payment.method || 'cash');
        setPaymentStatus(payment.status || 'unpaid');
        setPaymentNotes(payment.notes || '');
      } catch (error) {
        console.error('Error fetching complaint:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [complaintId]);

  const handleSubmit = async () => {
    if (!amount) {
      setError('Please enter the total amount');
      return;
    }

    const totalAmount = parseFloat(amount);

    if (isNaN(totalAmount) || totalAmount < 0) {
      setError('Amount must be a valid positive number');
      return;
    }

    const updatedPayment = {
      amount: totalAmount,
      method: paymentMethod,
      status: paymentStatus,
      notes: paymentNotes,
    };

    setLoading(true);
    setError('');

    try {
      const response = await api.put(`/complaint/${complaintId}/payment`, updatedPayment);
      const updatedComplaint = response.data?.data;

      console.log('✅ Payment updated:', updatedComplaint);
      navigation.navigate('ComplaintDetail', { complaint: updatedComplaint });
    } catch (err) {
      console.error('❌ Error updating payment:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !complaint) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Update Payment</Title>

          <Text style={styles.sectionTitle}>Payment Details</Text>
          <TextInput
            label="Total Amount *"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Payment Method</Text>
          <SegmentedButtons
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            buttons={[
              { value: 'cash', label: 'Cash' },
              { value: 'upi', label: 'UPI' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
            ]}
            style={styles.segmentedButtons}
          />
          <Text style={styles.label}>Payment Status</Text>
          <SegmentedButtons
            value={paymentStatus}
            onValueChange={setPaymentStatus}
            buttons={[
              { value: 'paid', label: 'Paid' },
              { value: 'unpaid', label: 'Unpaid' },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Payment Notes"
            value={paymentNotes}
            onChangeText={setPaymentNotes}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          {error ? <HelperText type="error">{error}</HelperText> : null}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Update Payment
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UpdatePaymentScreen;