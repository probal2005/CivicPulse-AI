import type {
  Complaint,
  ComplaintInput,
  ComplaintStatus,
  ComplaintCategory,
  PriorityLevel,
  Team,
} from '@/types/complaint';
import { mockComplaints, mockTeams } from '@/data/mockComplaints';

/**
 * Service layer for complaint management.
 * Currently uses in-memory mock data.
 * Replace the internal storage and methods with real API calls
 * (e.g., Supabase or a FastAPI backend) when ready.
 */

let complaintsStore: Complaint[] = [...mockComplaints];
const teamsStore: Team[] = [...mockTeams];

function generateId(): string {
  const year = new Date().getFullYear();
  const num = String(complaintsStore.length + 1).padStart(3, '0');
  return `CIV-${year}-${num}`;
}

function inferPriority(category: ComplaintCategory): PriorityLevel {
  const map: Record<ComplaintCategory, PriorityLevel> = {
    waterlogging: 'critical',
    pothole: 'high',
    road_damage: 'high',
    garbage: 'medium',
    streetlight: 'low',
    other: 'low',
  };
  return map[category];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const complaintService = {
  async getAll(): Promise<Complaint[]> {
    await delay(300);
    return [...complaintsStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<Complaint | undefined> {
    await delay(200);
    return complaintsStore.find((c) => c.id === id);
  },

  async create(input: ComplaintInput): Promise<Complaint> {
    await delay(600);
    const now = new Date().toISOString();
    const complaint: Complaint = {
      id: generateId(),
      title: input.title,
      category: input.category,
      description: input.description,
      status: 'submitted',
      priority: inferPriority(input.category),
      location: input.location,
      lat: input.lat ?? 12.9716,
      lng: input.lng ?? 77.5946,
      imageUrl: input.imageUrl,
      reporterName: input.reporterName,
      reporterContact: input.reporterContact,
      assignedTeam: undefined,
      createdAt: now,
      updatedAt: now,
    };
    complaintsStore = [complaint, ...complaintsStore];
    return complaint;
  },

  async updateStatus(id: string, status: ComplaintStatus): Promise<Complaint | undefined> {
    await delay(300);
    const complaint = complaintsStore.find((c) => c.id === id);
    if (!complaint) return undefined;
    complaint.status = status;
    complaint.updatedAt = new Date().toISOString();
    return complaint;
  },

  async assignTeam(id: string, teamName: string): Promise<Complaint | undefined> {
    await delay(300);
    const complaint = complaintsStore.find((c) => c.id === id);
    if (!complaint) return undefined;
    complaint.assignedTeam = teamName;
    complaint.status = 'assigned';
    complaint.updatedAt = new Date().toISOString();
    return complaint;
  },

  async updatePriority(id: string, priority: PriorityLevel): Promise<Complaint | undefined> {
    await delay(300);
    const complaint = complaintsStore.find((c) => c.id === id);
    if (!complaint) return undefined;
    complaint.priority = priority;
    complaint.updatedAt = new Date().toISOString();
    return complaint;
  },

  async getTeams(): Promise<Team[]> {
    await delay(200);
    return [...teamsStore];
  },

  async getStats(): Promise<{
    total: number;
    pending: number;
    highPriority: number;
    resolved: number;
  }> {
    await delay(200);
    return {
      total: complaintsStore.length,
      pending: complaintsStore.filter(
        (c) => c.status === 'submitted' || c.status === 'under_review'
      ).length,
      highPriority: complaintsStore.filter(
        (c) => c.priority === 'high' || c.priority === 'critical'
      ).length,
      resolved: complaintsStore.filter((c) => c.status === 'resolved').length,
    };
  },
};
