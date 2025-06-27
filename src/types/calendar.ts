
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  event_type: 'service' | 'maintenance' | 'meeting' | 'other';
  service_id?: string;
  client_id?: string;
  client_name?: string;
  operator_id?: string;
  operator_name?: string;
  crane_id?: string;
  crane_name?: string;
  location?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  color?: string;
  all_day?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  event_type: 'service' | 'maintenance' | 'meeting' | 'other';
  service_id?: string;
  client_id?: string;
  operator_id?: string;
  crane_id?: string;
  location?: string;
  priority: 'low' | 'medium' | 'high';
  all_day?: boolean;
}

export type CalendarView = 'month' | 'week' | 'day';
