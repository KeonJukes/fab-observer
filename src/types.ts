export interface Fab {
  id: string;
  name: string;
  address: string;
  capacity: string;
  status: 'active' | 'maintenance' | 'planned';
  description: string;
}

export interface Robot {
  id: string;
  fabId: string;
  model: string;
  serialNumber: string;
  status: 'operational' | 'offline' | 'error';
  lastService: string;
  loadCapacity: string;
}
