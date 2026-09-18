import type {
  Complaint,
  ComplaintInput,
  ComplaintStatus,
  ComplaintCategory,
  PriorityLevel,
  Team,
} from '@/types/complaint';

import { supabase } from '@/lib/supabase';
import { mockTeams } from '@/data/mockComplaints';

type SupabaseComplaintRow = {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: ComplaintStatus;
  priority: PriorityLevel;
  assigned_team: string | null;
  citizen_name: string | null;
  citizen_email: string | null;
  created_at: string;
  updated_at: string;
};

function mapRowToComplaint(row: SupabaseComplaintRow): Complaint {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    lat: row.latitude ?? 12.9716,
    lng: row.longitude ?? 77.5946,
    status: row.status,
    priority: row.priority,
    assignedTeam: row.assigned_team ?? undefined,
    reporterName: row.citizen_name ?? 'Anonymous Citizen',
    reporterContact: row.citizen_email ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function handleSupabaseError(
  error: { message: string } | null,
  action: string
): void {
  if (error) {
    console.error(`Supabase ${action} error:`, error.message);
    throw new Error(error.message);
  }
}

export const complaintService = {
  async getAll(): Promise<Complaint[]> {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    handleSupabaseError(error, 'fetch');

    return (data ?? []).map((row) =>
      mapRowToComplaint(row as SupabaseComplaintRow)
    );
  },

  async getById(id: string): Promise<Complaint | undefined> {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    handleSupabaseError(error, 'getById');

    if (!data) {
      return undefined;
    }

    return mapRowToComplaint(data as SupabaseComplaintRow);
  },

  async create(input: ComplaintInput): Promise<Complaint> {
    const now = new Date().toISOString();

    const payload = {
      title: input.title,
      description: input.description,
      category: input.category,
      location: input.location,
      latitude: input.lat ?? 12.9716,
      longitude: input.lng ?? 77.5946,
      status: 'submitted' as ComplaintStatus,
      priority: inferPriority(input.category),
      assigned_team: null,
      citizen_name: input.reporterName,
      citizen_email: input.reporterContact,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('complaints')
      .insert(payload)
      .select('*')
      .single();

    handleSupabaseError(error, 'create');

    return mapRowToComplaint(data as SupabaseComplaintRow);
  },

  async updateStatus(
    id: string,
    status: ComplaintStatus
  ): Promise<Complaint | undefined> {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    handleSupabaseError(error, 'updateStatus');

    if (!data) {
      return undefined;
    }

    return mapRowToComplaint(data as SupabaseComplaintRow);
  },

  async assignTeam(
    id: string,
    teamName: string
  ): Promise<Complaint | undefined> {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        assigned_team: teamName,
        status: 'assigned' as ComplaintStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    handleSupabaseError(error, 'assignTeam');

    if (!data) {
      return undefined;
    }

    return mapRowToComplaint(data as SupabaseComplaintRow);
  },

  async updatePriority(
    id: string,
    priority: PriorityLevel
  ): Promise<Complaint | undefined> {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        priority,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    handleSupabaseError(error, 'updatePriority');

    if (!data) {
      return undefined;
    }

    return mapRowToComplaint(data as SupabaseComplaintRow);
  },

  async getTeams(): Promise<Team[]> {
    return [...mockTeams];
  },

  async getStats(): Promise<{
    total: number;
    pending: number;
    highPriority: number;
    resolved: number;
  }> {
    const complaints = await this.getAll();

    return {
      total: complaints.length,
      pending: complaints.filter(
        (complaint) =>
          complaint.status === 'submitted' ||
          complaint.status === 'under_review'
      ).length,
      highPriority: complaints.filter(
        (complaint) =>
          complaint.priority === 'high' ||
          complaint.priority === 'critical'
      ).length,
      resolved: complaints.filter(
        (complaint) => complaint.status === 'resolved'
      ).length,
    };
  },
};

function inferPriority(category: ComplaintCategory): PriorityLevel {
  const priorityMap: Record<ComplaintCategory, PriorityLevel> = {
    waterlogging: 'critical',
    pothole: 'high',
    road_damage: 'high',
    garbage: 'medium',
    streetlight: 'low',
    other: 'low',
  };

  return priorityMap[category];
}
