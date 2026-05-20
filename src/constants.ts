import { Fab, Robot } from './types';

export const INITIAL_FABS: Fab[] = [
  {
    id: 'fab-1',
    name: 'Silicon Valley North (SVN-1)',
    address: '48400 Kato Rd, Fremont, CA 94538',
    capacity: '45,000 WPM',
    status: 'active',
    description: 'High-volume logic production facility focusing on 7nm processes.'
  },
  {
    id: 'fab-2',
    name: 'Pacific Core (PC-2)',
    address: '37500 Cedar Blvd, Newark, CA 94560',
    capacity: '32,000 WPM',
    status: 'maintenance',
    description: 'Specialized memory and analog component fabrication.'
  },
  {
    id: 'fab-3',
    name: 'Mission Peak Labs',
    address: '30995 Huntwood Ave, Hayward, CA 94544',
    capacity: '12,000 WPM',
    status: 'planned',
    description: 'Research and development facility for next-gen 2nm architectures.'
  },
  {
    id: 'fab-4',
    name: 'San Jose Foundry',
    address: '2107 N First St, San Jose, CA 95131',
    capacity: '28,000 WPM',
    status: 'active',
    description: 'Advanced packaging and chiplet integration hub.'
  }
];

export const INITIAL_ROBOTS: Robot[] = [
  {
    id: 'rob-1',
    fabId: 'fab-1',
    model: 'Nexus-6 Arm',
    serialNumber: 'NX-4400-A',
    status: 'operational',
    lastService: '2026-04-12',
    loadCapacity: '10kg'
  },
  {
    id: 'rob-2',
    fabId: 'fab-1',
    model: 'Nexus-6 Arm',
    serialNumber: 'NX-4400-B',
    status: 'operational',
    lastService: '2026-05-01',
    loadCapacity: '10kg'
  },
  {
    id: 'rob-3',
    fabId: 'fab-1',
    model: 'Heavy-Lift X1',
    serialNumber: 'HL-9000-Z',
    status: 'error',
    lastService: '2026-03-15',
    loadCapacity: '50kg'
  },
  {
    id: 'rob-4',
    fabId: 'fab-2',
    model: 'Precision-P8',
    serialNumber: 'PP-221-X',
    status: 'operational',
    lastService: '2026-05-10',
    loadCapacity: '2kg'
  },
  {
    id: 'rob-5',
    fabId: 'fab-2',
    model: 'Precision-P8',
    serialNumber: 'PP-221-Y',
    status: 'offline',
    lastService: '2026-05-12',
    loadCapacity: '2kg'
  },
  {
    id: 'rob-6',
    fabId: 'fab-4',
    model: 'Nexus-7 High-G',
    serialNumber: 'NX-7700-S',
    status: 'operational',
    lastService: '2026-05-13',
    loadCapacity: '5kg'
  },
  {
    id: 'rob-7',
    fabId: 'fab-4',
    model: 'Precision-P8',
    serialNumber: 'PP-222-A',
    status: 'operational',
    lastService: '2026-05-11',
    loadCapacity: '2kg'
  }
];
