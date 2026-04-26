export interface Student {
  id: number;
  name: string;
  group: string;
  arrivalTime: string;
  status: 'present' | 'late' | 'absent';
  image?: string;
}