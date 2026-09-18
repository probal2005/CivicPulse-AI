export type ComplaintCategory =
  | 'pothole'
  | 'garbage'
  | 'waterlogging'
  | 'streetlight'
  | 'road_damage'
  | 'other';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'resolved';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Complaint {
  id: string;
  title: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  priority: PriorityLevel;
  location: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  reporterName: string;
  reporterContact: string;
  assignedTeam?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintInput {
  title: string;
  category: ComplaintCategory;
  description: string;
  location: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  reporterName: string;
  reporterContact: string;
}

export interface AIDetectionResult {
  category: ComplaintCategory;
  confidence: number | null;
  priority: PriorityLevel;
  explanation: string;
  isSimulated: boolean;
}

export interface Team {
  id: string;
  name: string;
  specialization: ComplaintCategory[];
  activeAssignments: number;
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  pothole: 'Pothole',
  garbage: 'Garbage Overflow',
  waterlogging: 'Waterlogging',
  streetlight: 'Broken Streetlight',
  road_damage: 'Damaged Road',
  other: 'Other',
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  resolved: 'Resolved',
};

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const CATEGORY_ICONS: Record<ComplaintCategory, string> = {
  pothole: 'Construction',
  garbage: 'Trash2',
  waterlogging: 'Droplets',
  streetlight: 'Lightbulb',
  road_damage: 'Road',
  other: 'AlertCircle',
};
