import { useState, useEffect, useCallback } from 'react';
import type { Complaint, ComplaintStatus, PriorityLevel } from '@/types/complaint';
import { complaintService } from '@/services/complaintService';

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complaintService.getAll();
      setComplaints(data);
    } catch {
      setError('Failed to load complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateStatus = useCallback(
    async (id: string, status: ComplaintStatus) => {
      const updated = await complaintService.updateStatus(id, status);
      if (updated) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...updated } : c))
        );
      }
      return updated;
    },
    []
  );

  const assignTeam = useCallback(async (id: string, teamName: string) => {
    const updated = await complaintService.assignTeam(id, teamName);
    if (updated) {
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...updated } : c))
      );
    }
    return updated;
  }, []);

  const updatePriority = useCallback(async (id: string, priority: PriorityLevel) => {
    const updated = await complaintService.updatePriority(id, priority);
    if (updated) {
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...updated } : c))
      );
    }
    return updated;
  }, []);

  return {
    complaints,
    loading,
    error,
    refresh,
    updateStatus,
    assignTeam,
    updatePriority,
  };
}
