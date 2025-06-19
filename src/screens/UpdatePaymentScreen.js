import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, TextInput, Button, Text, SegmentedButtons, HelperText } from 'react-native-paper';
import Complaint from '../models/Complaint';

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
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');

  useEffect(() => {
    // In a real app, fetch complaint data from your storage
    const mockComplaint = new Complaint({
      id: complaintId,
      title: 'AC Not Cooling',
      payment: {
        amount: 1500,
        advanceAmount: 500,
        balanceAmount: 1000,
        status: 'partial',
        method: 'cash',
        paidAt: new Date(),
        notes: 'Initial payment received',
      },
    });

    setComplaint(mockComplaint);
    setAmount(mockComplaint.payment.amount.toString());
    setAdvanceAmount(mockComplaint.payment.advanceAmount.toString());
    setPaymentMethod(mockComplaint.payment.method);
    setPaymentNotes(mockComplaint.payment.notes || '');
    setLoading(false);
  }, [complaintId]);

  const handleSubmit = () => {
    if (!amount || !advanceAmount) {
      setError('Please fill in all required fields');
      return;
    }

    const totalAmount = parseFloat(amount);
    const advance = parseFloat(advanceAmount);
    const balance = totalAmount - advance;

    if (advance > totalAmount) {
      setError('Advance amount cannot be greater than total amount');
      return;
    }

    setLoading(true);
    setError('');

    const updatedPayment = {
      amount: totalAmount,
      advanceAmount: advance,
      balanceAmount: balance,
      status: balance === 0 ? 'paid' : advance > 0 ? 'partial' : 'pending',
      method: paymentMethod,
      paidAt: new Date(),
      notes: paymentNotes,
    };

    // In a real app, update the payment in your storage
    console.log('Updating payment:', updatedPayment);
    
    setLoading(false);
    navigation.goBack();
  };

  if (loading || !complaint) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
          <TextInput
            label="Advance Amount *"
            value={advanceAmount}
            onChangeText={setAdvanceAmount}
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
});

export default UpdatePaymentScreen;