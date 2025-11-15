export interface APIResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from?: number;
  to?: number;
}

export interface ValidationError {
  status: 'error';
  message: string;
  errors: {
    [field: string]: string[];
  };
}

export interface PayerDocument {
  id: number;
  payer_id: number;
  payer_type: 'App\\Models\\Individuals' | 'App\\Models\\Corporate';
  document_type: string;
  document_category: 'Identity' | 'Business' | 'Tax' | 'Financial' | 'Permit' | 'Other';
  document_title?: string;
  document_description?: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  storage_disk: string;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
  issuing_authority?: string;
  is_expired: boolean;
  verification_status: 'Pending' | 'Verified' | 'Rejected' | 'Expired';
  verified_by_agent_id?: number;
  verified_at?: string;
  verification_notes?: string;
  rejection_reason?: string;
  is_sensitive: boolean;
  is_required_for_verification: boolean;
  verification_level_required?: 1 | 2 | 3 | 4;
  document_hash?: string;
  visibility: 'Public' | 'Internal' | 'Restricted';
  download_count: number;
  last_accessed_at?: string;
  uploaded_by_agent_id?: number;
  uploaded_from?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface VerificationLog {
  id: number;
  payer_id: number;
  payer_type: 'App\\Models\\Individuals' | 'App\\Models\\Corporate';
  verification_type: string;
  verification_method: 'API' | 'Manual' | 'Document' | 'Field Visit' | 'Third Party';
  verification_provider?: string;
  provider_reference?: string;
  status: 'Pending' | 'Success' | 'Failed' | 'Partial' | 'Expired' | 'Cancelled';
  is_verified: boolean;
  match_score?: number;
  request_data?: any;
  response_data?: any;
  error_message?: string;
  verification_cost?: number;
  response_time_ms?: number;
  initiated_by_agent_id?: number;
  reviewed_by_agent_id?: number;
  review_notes?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditTrail {
  id: number;
  payer_id: number;
  payer_type: 'App\\Models\\Individuals' | 'App\\Models\\Corporate';
  action_type: string;
  table_name: string;
  record_id?: number;
  field_changed?: string;
  old_value?: string;
  new_value?: string;
  change_reason?: string;
  ip_address?: string;
  user_agent?: string;
  performed_by_agent_id?: number;
  performed_by_user_id?: number;
  approved_by_agent_id?: number;
  is_system_action: boolean;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  reversal_log_id?: number;
  created_at: string;
}

export interface PayerSegment {
  id: number;
  segment_name: string;
  segment_code: string;
  segment_type: 'Demographic' | 'Behavioral' | 'Geographic' | 'Economic' | 'Compliance' | 'Custom';
  description?: string;
  criteria?: any;
  is_dynamic: boolean;
  auto_update_frequency_hours?: number;
  last_updated_at?: string;
  total_members: number;
  total_revenue_potential?: number;
  status: 'Active' | 'Inactive' | 'Archived';
  created_at: string;
  updated_at: string;
}

export interface PayerSegmentAssignment {
  id: number;
  segment_id: number;
  payer_id: number;
  payer_type: 'App\\Models\\Individuals' | 'App\\Models\\Corporate';
  assigned_by_agent_id?: number;
  assignment_reason?: string;
  is_auto_assigned: boolean;
  auto_assignment_score?: number;
  assigned_at: string;
  expires_at?: string;
  status: 'Active' | 'Expired' | 'Removed';
  created_at: string;
  updated_at: string;
}
