
export interface CompanyConfig {
  id: string;
  name: string;
  rut: string;
  address: string;
  phone: string;
  email: string;
  folio_format: string;
  next_folio: number;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemConfig {
  id: string;
  backup_enabled: boolean;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  backup_retention_days: number;
  auto_backup_time: string;
  database_optimization: boolean;
  log_retention_days: number;
  performance_monitoring: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationConfig {
  id: string;
  user_id?: string; // null for global settings
  email_notifications: boolean;
  service_reminders: boolean;
  invoice_alerts: boolean;
  expiry_notifications: boolean;
  system_updates: boolean;
  email_frequency: 'immediate' | 'daily' | 'weekly';
  reminder_days_before: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'administrator' | 'operator' | 'viewer' | 'client';
  active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export type ConfigurationSection = 'company' | 'system' | 'notifications' | 'users';
