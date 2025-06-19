class Complaint {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString();
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.assignedTo = data.assignedTo || null;
    this.createdBy = data.createdBy || null;
    this.updatedBy = data.updatedBy || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.customerName = data.customerName || '';
    this.customerPhone = data.customerPhone || '';
    this.customerAddress = data.customerAddress || '';
    this.acType = data.acType || '';
    this.acBrand = data.acBrand || '';
    this.acModel = data.acModel || '';
    this.acSerialNumber = data.acSerialNumber || '';
    this.serviceType = data.serviceType || 'repair'; // repair, maintenance, installation
    this.payment = {
      amount: data.payment?.amount || 0,
      status: data.payment?.status || 'pending', // pending, partial, paid
      method: data.payment?.method || '', // cash, card, online
      paidAt: data.payment?.paidAt || null,
      notes: data.payment?.notes || '',
      advanceAmount: data.payment?.advanceAmount || 0,
      balanceAmount: data.payment?.balanceAmount || 0,
    };
    this.technicianNotes = data.technicianNotes || '';
    this.partsReplaced = data.partsReplaced || [];
    this.warrantyInfo = data.warrantyInfo || {
      valid: false,
      expiryDate: null,
      terms: '',
    };
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      assignedTo: this.assignedTo,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerAddress: this.customerAddress,
      acType: this.acType,
      acBrand: this.acBrand,
      acModel: this.acModel,
      acSerialNumber: this.acSerialNumber,
      serviceType: this.serviceType,
      payment: this.payment,
      technicianNotes: this.technicianNotes,
      partsReplaced: this.partsReplaced,
      warrantyInfo: this.warrantyInfo,
    };
  }

  static fromJSON(data) {
    return new Complaint(data);
  }
}

export default Complaint;