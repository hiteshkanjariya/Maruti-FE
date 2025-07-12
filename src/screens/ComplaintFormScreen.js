import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, TextInput, Button, Text, SegmentedButtons, HelperText } from 'react-native-paper';
import Complaint from '../models/Complaint';
import api from '../services/api';

const ComplaintFormScreen = ({ route, navigation }) => {
  const { complaintId } = route.params || {};
  const [complaint, setComplaint] = useState(new Complaint());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [title, setTitle] = useState('AC Not Cooling');
  const [description, setDescription] = useState('The AC is not cooling properly');
  const [customerName, setCustomerName] = useState('John Doe');
  const [customerPhone, setCustomerPhone] = useState('1234567890');
  const [customerAddress, setCustomerAddress] = useState('123 Main St');
  const [acType, setAcType] = useState('Split');
  const [acBrand, setAcBrand] = useState('LG');
  const [acModel, setAcModel] = useState('XYZ123');
  const [acSerialNumber, setAcSerialNumber] = useState('SN123456');
  const [serviceType, setServiceType] = useState('repair');
  const [priority, setPriority] = useState('medium');
  const [status, setStaus] = useState("open");
  const [amount, setAmount] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');

  useEffect(() => {
    if (complaintId) {
      const mockComplaint = new Complaint({
        id: complaintId,
        title: 'AC Not Cooling',
        description: 'The AC is not cooling properly',
        customerName: 'John Doe',
        customerPhone: '1234567890',
        customerAddress: '123 Main St',
        acType: 'Split',
        acBrand: 'LG',
        acModel: 'XYZ123',
        acSerialNumber: 'SN123456',
        serviceType: 'repair',
        priority: 'high',
        status: 'open',
        payment: {
          amount: 1500,
          status: 'unpaid',
          method: 'cash',
        },
        technicianNotes: 'Initial inspection required',
      });

      setComplaint(mockComplaint);
      setTitle(mockComplaint.title);
      setDescription(mockComplaint.description);
      setCustomerName(mockComplaint.customerName);
      setCustomerPhone(mockComplaint.customerPhone);
      setCustomerAddress(mockComplaint.customerAddress);
      setAcType(mockComplaint.acType);
      setAcBrand(mockComplaint.acBrand);
      setAcModel(mockComplaint.acModel);
      setAcSerialNumber(mockComplaint.acSerialNumber);
      setServiceType(mockComplaint.serviceType);
      setPriority(mockComplaint.priority);
      setAmount(mockComplaint.payment.amount.toString());
      setTechnicianNotes(mockComplaint.technicianNotes);
    }
  }, [complaintId]);

  const handleSubmit = async () => {
    if (!title || !description || !customerName || !customerPhone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(
        'complaint',
        {
          title,
          description,
          customerName,
          customerPhone,
          customerAddress,
          acType,
          acBrand,
          acModel,
          acSerialNumber,
          serviceType,
          priority,
          status,
          payment: {
            amount: parseFloat(amount) || 0,
            status: 'unpaid',
            method: 'cash',
          },
          technicianNotes,
        }
      );

      console.log('Complaint created:', response.data);
      navigation.goBack();
    } catch (err) {
      console.error('API error:', err.response?.data || err.message);
      setError('Failed to create complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{complaintId ? 'Edit Complaint' : 'New Complaint'}</Title>

          <Text style={styles.sectionTitle}>Customer Information</Text>
          <TextInput
            label="Customer Name *"
            value={customerName}
            onChangeText={setCustomerName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Phone Number *"
            value={customerPhone}
            onChangeText={setCustomerPhone}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            label="Address"
            value={customerAddress}
            onChangeText={setCustomerAddress}
            mode="outlined"
            style={styles.input}
            multiline
          />

          <Text style={styles.sectionTitle}>AC Information</Text>
          <TextInput
            label="AC Type"
            value={acType}
            onChangeText={setAcType}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Brand"
            value={acBrand}
            onChangeText={setAcBrand}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Model"
            value={acModel}
            onChangeText={setAcModel}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Serial Number"
            value={acSerialNumber}
            onChangeText={setAcSerialNumber}
            mode="outlined"
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Service Details</Text>
          <TextInput
            label="Title *"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Description *"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Service Type</Text>
          <SegmentedButtons
            value={serviceType}
            onValueChange={setServiceType}
            buttons={[
              { value: 'repair', label: 'Repair' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'installation', label: 'Installation' },
            ]}
            style={styles.segmentedButtons}
          />

          <Text style={styles.label}>Priority</Text>
          <SegmentedButtons
            value={priority}
            onValueChange={setPriority}
            buttons={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
            style={styles.segmentedButtons}
          />
          <Text style={styles.label}>status</Text>
          <SegmentedButtons
            value={status}
            onValueChange={setStaus}
            buttons={[
              { value: 'open', label: 'Open' },
              { value: 'in_progress', label: 'In_progress' },
              { value: 'done', label: 'Done' },
              { value: 'closed', label: 'Closed' },
            ]}
            style={styles.segmentedButtons}
          />

          <Text style={styles.sectionTitle}>Payment Information</Text>
          <TextInput
            label="Total Amount"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Technician Notes</Text>
          <TextInput
            label="Notes"
            value={technicianNotes}
            onChangeText={setTechnicianNotes}
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
            {complaintId ? 'Update Complaint' : 'Create Complaint'}
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

export default ComplaintFormScreen;
