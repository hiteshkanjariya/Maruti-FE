import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, Chip, Divider, List, IconButton, ActivityIndicator } from 'react-native-paper';
import api from '../services/api';

const ComplaintDetailScreen = ({ route, navigation }) => {
  const complaintId = route.params.complaint?._id;

  console.log("🚀 ~ ComplaintDetailScreen ~ complaintId:", complaintId)
  const [complaint, setComplaint] = useState(null);
  console.log("🚀 ~ ComplaintDetailScreen ~ complaint:", complaint)
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // In a real app, fetch complaint data from your storage
  //   const mockComplaint = new Complaint({
  //     id: complaintId,
  //     title: 'AC Not Cooling',
  //     description: 'The AC is not cooling properly',
  //     customerName: 'John Doe',
  //     customerPhone: '1234567890',
  //     customerAddress: '123 Main St',
  //     acType: 'Split',
  //     acBrand: 'LG',
  //     acModel: 'XYZ123',
  //     acSerialNumber: 'SN123456',
  //     serviceType: 'repair',
  //     priority: 'high',
  //     status: 'in_progress',
  //     payment: {
  //       amount: 1500,
  //       advanceAmount: 500,
  //       balanceAmount: 1000,
  //       status: 'partial',
  //       method: 'cash',
  //       paidAt: new Date(),
  //       notes: 'Initial payment received',
  //     },
  //     technicianNotes: 'Initial inspection required',
  //     createdBy: 'Admin User',
  //     updatedBy: 'Tech User',
  //     createdAt: new Date(Date.now() - 86400000), // 1 day ago
  //     updatedAt: new Date(),
  //   });

  //   setComplaint(mockComplaint);
  //   setLoading(false);
  // }, [complaintId]);
  useEffect(() => {
    const fetchComplaint = async () => {
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
      } catch (error) {
        console.error('Error fetching complaint:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [complaintId]);

  if (loading || !complaint) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#2196F3';
      case 'in_progress': return '#FFA000';
      case 'closed': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FFA000';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#4CAF50';
      case 'partial': return '#FFA000';
      case 'pending': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>{complaint?.title}</Title>
            <Chip
              mode="outlined"
              style={[styles.statusChip, { borderColor: getStatusColor(complaint?.status) }]}
              textStyle={{ color: getStatusColor(complaint?.status) }}
            >
              {complaint?.status?.replace('_', ' ').toUpperCase()}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Customer Information</Text>
          <List.Item
            title="Name"
            description={complaint?.customerName}
            left={props => <List.Icon {...props} icon="account" />}
          />
          <List.Item
            title="Phone"
            description={complaint?.customerPhone}
            left={props => <List.Icon {...props} icon="phone" />}
          />
          <List.Item
            title="Address"
            description={complaint?.customerAddress}
            left={props => <List.Icon {...props} icon="map-marker" />}
          />

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>AC Information</Text>
          <List.Item
            title="Type"
            description={complaint?.acType}
            left={props => <List.Icon {...props} icon="air-conditioner" />}
          />
          <List.Item
            title="Brand"
            description={complaint?.acBrand}
            left={props => <List.Icon {...props} icon="tag" />}
          />
          <List.Item
            title="Model"
            description={complaint?.acModel}
            left={props => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Serial Number"
            description={complaint?.acSerialNumber}
            left={props => <List.Icon {...props} icon="barcode" />}
          />

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Service Details</Text>
          <List.Item
            title="Description"
            description={complaint?.description}
            left={props => <List.Icon {...props} icon="text" />}
          />
          <List.Item
            title="Service Type"
            description={complaint?.serviceType?.toUpperCase()}
            left={props => <List.Icon {...props} icon="wrench" />}
          />
          <List.Item
            title="Priority"
            description={
              <Chip
                mode="outlined"
                style={[styles.priorityChip, { borderColor: getPriorityColor(complaint?.priority) }]}
                textStyle={{ color: getPriorityColor(complaint?.priority) }}
              >
                {complaint?.priority?.toUpperCase()}
              </Chip>
            }
            left={props => <List.Icon {...props} icon="flag" />}
          />

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Payment Information</Text>
          <List.Item
            title="Total Amount"
            description={`₹${complaint?.payment?.amount}`}
            left={props => <List.Icon {...props} icon="currency-inr" />}
          />

          <List.Item
            title="Payment Status"
            description={
              <Chip
                mode="outlined"
                style={[styles.paymentChip, { borderColor: getPaymentStatusColor(complaint?.payment?.status) }]}
                textStyle={{ color: getPaymentStatusColor(complaint?.payment?.status) }}
              >
                {complaint?.payment?.status.toUpperCase()}
              </Chip>
            }
            left={props => <List.Icon {...props} icon="cash-multiple" />}
          />
          {complaint?.payment?.notes && (
            <List.Item
              title="Payment Notes"
              description={complaint?.payment?.notes}
              left={props => <List.Icon {...props} icon="note-text" />}
            />
          )}

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Technician Notes</Text>
          <List.Item
            title="Notes"
            description={complaint?.technicianNotes}
            left={props => <List.Icon {...props} icon="note" />}
          />

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Audit Information</Text>
          <List.Item
            title="Created By"
            description={complaint?.createdBy?.name}
            left={props => <List.Icon {...props} icon="account-plus" />}
          />
          <List.Item
            title="Created At"
            description={complaint?.createdAt.toLocaleString()}
            left={props => <List.Icon {...props} icon="clock-outline" />}
          />
          <List.Item
            title="Updated By"
            description={complaint?.updatedBy?.name}
            left={props => <List.Icon {...props} icon="account-edit" />}
          />
          <List.Item
            title="Updated At"
            description={complaint?.updatedAt.toLocaleString()}
            left={props => <List.Icon {...props} icon="clock-edit-outline" />}
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('ComplaintForm', { complaintId: complaintId })}
          style={styles.button}
        >
          Edit Complaint
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('UpdatePayment', { complaintId: complaintId })}
          style={styles.button}
        >
          Update Payment
        </Button>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
  },
  statusChip: {
    marginLeft: 8,
  },
  priorityChip: {
    marginLeft: 8,
  },
  paymentChip: {
    marginLeft: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ComplaintDetailScreen; 