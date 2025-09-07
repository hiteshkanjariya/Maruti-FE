import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, TextInput, Button, Text, SegmentedButtons, HelperText, ActivityIndicator, Portal, Dialog, List, Chip, Searchbar } from 'react-native-paper';
import Complaint from '../models/Complaint';
import api from '../services/api';

const ComplaintFormScreen = ({ route, navigation }) => {
  const { complaintId } = route.params || {};
  const [complaint, setComplaint] = useState(new Complaint());
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
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
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [assigneePickerVisible, setAssigneePickerVisible] = useState(false);
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  // useEffect(() => {
  //   if (complaintId) {
  //     const mockComplaint = new Complaint({
  //       id: complaintId,
  //       title: 'AC Not Cooling',
  //       description: 'The AC is not cooling properly',
  //       customerName: 'John Doe',
  //       customerPhone: '1234567890',
  //       customerAddress: '123 Main St',
  //       acType: 'Split',
  //       acBrand: 'LG',
  //       acModel: 'XYZ123',
  //       acSerialNumber: 'SN123456',
  //       serviceType: 'repair',
  //       priority: 'high',
  //       status: 'open',
  //       payment: {
  //         amount: 1500,
  //         status: 'unpaid',
  //         method: 'cash',
  //       },
  //       technicianNotes: 'Initial inspection required',
  //     });

  //     setComplaint(mockComplaint);
  //     setTitle(mockComplaint.title);
  //     setDescription(mockComplaint.description);
  //     setCustomerName(mockComplaint.customerName);
  //     setCustomerPhone(mockComplaint.customerPhone);
  //     setCustomerAddress(mockComplaint.customerAddress);
  //     setAcType(mockComplaint.acType);
  //     setAcBrand(mockComplaint.acBrand);
  //     setAcModel(mockComplaint.acModel);
  //     setAcSerialNumber(mockComplaint.acSerialNumber);
  //     setServiceType(mockComplaint.serviceType);
  //     setPriority(mockComplaint.priority);
  //     setAmount(mockComplaint.payment.amount.toString());
  //     setTechnicianNotes(mockComplaint.technicianNotes);
  //   }
  // }, [complaintId]);
  useEffect(() => {
    fetchUsers();

    if (complaintId) {

      const fetchComplaint = async () => {
        setGetLoading(true);
        console.log("🚀 ~ fetchComplaint ~ fetchComplaint:")
        try {
          const response = await api.get(`complaint/${complaintId}`);

          console.log("🚀 ~ fetchComplaint ~ response:", response)
          const data = response?.data?.data;

          // Convert dates if needed
          setComplaint({
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
          });

          setTitle(data.title);
          setDescription(data.description);
          setCustomerName(data.customerName);
          setCustomerPhone(data.customerPhone);
          setCustomerAddress(data.customerAddress);
          setAcType(data.acType);
          setAcBrand(data.acBrand);
          setAcModel(data.acModel);
          setAcSerialNumber(data.acSerialNumber);
          setServiceType(data.serviceType);
          setPriority(data.priority);
          setStaus(data.status);
          setAmount(data?.payment?.amount?.toString() || '');
          setTechnicianNotes(data.technicianNotes || '');
          setAssignedTo(data?.assignedTo?._id || '');

        } catch (error) {
          console.error('Error fetching complaint:', error.response?.data || error.message);
        } finally {
          setGetLoading(false);
        }
      };

      fetchComplaint();
    }
  }, [complaintId]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await api.get('/user');
      // Filter out admin users and only show technicians/users who can be assigned complaints
      const filteredUsers = response.data.data.filter(user => user.role !== 'admin');
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  if (getLoading || !complaint) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  // const handleSubmit = async () => {
  //   if (!title || !description || !customerName || !customerPhone) {
  //     setError('Please fill in all required fields');
  //     return;
  //   }

  //   setLoading(true);
  //   setError('');

  //   try {
  //     const response = await api.post(
  //       'complaint',
  //       {
  //         title,
  //         description,
  //         customerName,
  //         customerPhone,
  //         customerAddress,
  //         acType,
  //         acBrand,
  //         acModel,
  //         acSerialNumber,
  //         serviceType,
  //         priority,
  //         status,
  //         payment: {
  //           amount: parseFloat(amount) || 0,
  //           status: 'unpaid',
  //           method: 'cash',
  //         },
  //         technicianNotes,
  //       }
  //     );

  //     console.log('Complaint created:', response.data);
  //     navigation.goBack();
  //   } catch (err) {
  //     console.error('API error:', err.response?.data || err.message);
  //     setError('Failed to create complaint. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!title || !description || !customerName || !customerPhone) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
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
      assignedTo: assignedTo || undefined,
    };

    try {
      let response;
      if (complaintId) {
        response = await api.put(`complaint/${complaintId}`, payload);
        console.log('Complaint updated:', response.data);
        navigation.navigate('ComplaintDetail', {
          complaint: {
            _id: complaintId
          }
        });
      } else {
        response = await api.post('complaint', payload);
        console.log('Complaint created:', response.data);
        navigation.goBack();
      }

    } catch (err) {
      console.error('API error:', err.response?.data || err.message);
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find(u => u._id === assignedTo);

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

          <Text style={styles.sectionTitle}>Assignment</Text>
          <Text style={styles.helper}>Assign to a technician/user</Text>
          <TextInput
            label="Assigned To"
            value={selectedUser ? `${selectedUser.name} (${selectedUser.phone})` : ''}
            mode="outlined"
            style={styles.input}
            placeholder="Select assignee"
            editable={false}
            right={<TextInput.Icon icon="chevron-down" onPress={() => setAssigneePickerVisible(true)} />}
            onPressIn={() => setAssigneePickerVisible(true)}
          />
          {selectedUser ? (
            <View style={styles.assigneeRow}>
              <List.Item
                title={selectedUser.name}
                description={`Phone: ${selectedUser.phone}  |  Role: ${selectedUser.role}`}
                left={props => <List.Icon {...props} icon="account" />}
              />
              <Chip icon="close" mode="outlined" onPress={() => setAssignedTo('')} style={styles.clearChip}>
                Clear
              </Chip>
            </View>
          ) : null}

          <Portal>
            <Dialog visible={assigneePickerVisible} onDismiss={() => setAssigneePickerVisible(false)}>
              <Dialog.Title>Select Assignee</Dialog.Title>
              <Dialog.Content>
                <Searchbar
                  placeholder="Search users by name or phone..."
                  value={assigneeSearch}
                  onChangeText={setAssigneeSearch}
                  style={{ marginBottom: 8 }}
                />
                {usersLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" />
                  </View>
                ) : (
                  <List.Section>
                    {users
                      .filter(u =>
                        (u.name || '').toLowerCase().includes(assigneeSearch.toLowerCase()) ||
                        (u.phone || '').includes(assigneeSearch)
                      )
                      .map(u => (
                        <List.Item
                          key={u._id}
                          title={u.name}
                          description={`Phone: ${u.phone}`}
                          left={props => <List.Icon {...props} icon="account" />}
                          onPress={() => {
                            setAssignedTo(u._id);
                            setAssigneePickerVisible(false);
                          }}
                        />
                      ))}
                    {users.length === 0 && (
                      <Text>No users available to assign.</Text>
                    )}
                  </List.Section>
                )}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setAssigneePickerVisible(false)}>Close</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

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
  helper: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  clearChip: {
    alignSelf: 'flex-start',
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

export default ComplaintFormScreen;
