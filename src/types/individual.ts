export interface Individual {
  // Basic Info
  id: number;
  individual_ref: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: 'male' | 'female';
  date_of_birth: string;

  // Government IDs
  nin?: string;
  bvn?: string;
  drivers_license?: string;
  passport_number?: string;
  voters_card?: string;
  tin?: string;

  // Personal Details
  title?: string;
  marital_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  nationality?: string;
  state_of_origin?: string;
  lga_of_origin?: string;
  religion?: 'Christianity' | 'Islam' | 'Traditional' | 'Other';

  // Economic Profile
  employment_status?: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired' | 'Student';
  employer_name?: string;
  employer_address?: string;
  occupation?: string;
  industry_sector?: string;
  estimated_annual_income?: number;
  income_bracket?: 'Below 100k' | '100k-500k' | '500k-1M' | '1M-5M' | '5M-10M' | 'Above 10M';

  // Location
  address: string;
  address_line2?: string;
  area?: string;
  city?: string;
  lga_id?: number;
  lga?: LGA;
  ward?: string;
  community?: string;
  postal_code?: string;
  landmark?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  address_type?: 'Owned' | 'Rented' | 'Family House' | 'Other';
  office_address?: string;
  office_lga_id?: number;

  // Contact
  email: string;
  mobile_number?: string;
  secondary_phone?: string;
  work_phone?: string;
  whatsapp_number?: string;
  secondary_email?: string;
  preferred_contact_method?: 'Phone' | 'Email' | 'SMS' | 'WhatsApp';

  // Verification
  email_verified: boolean;
  email_verified_at?: string;
  phone_verified: boolean;
  phone_verified_at?: string;
  nin_verified: boolean;
  nin_verified_at?: string;
  bvn_verified: boolean;
  bvn_verified_at?: string;
  address_verified: boolean;
  address_verified_at?: string;
  verification_level: 1 | 2 | 3 | 4;
  verification_notes?: string;

  // Compliance & Risk
  compliance_score: number;
  risk_category: 'Low' | 'Medium' | 'High';
  is_defaulter: boolean;
  is_blacklisted: boolean;
  blacklist_reason?: string;
  is_on_watchlist: boolean;
  watchlist_reason?: string;

  // Payment Behavior
  total_invoices_generated: number;
  total_amount_paid: number;
  total_amount_outstanding: number;
  last_payment_date?: string;
  payment_punctuality_score: number;
  preferred_payment_method?: string;

  // Categorization
  payer_category: 'VIP' | 'Regular' | 'Emerging' | 'Non-Compliant' | 'HNWI';
  payer_segment?: string;

  // Metadata
  registration_source: 'Web' | 'Mobile' | 'Field Officer' | 'Bulk Import' | 'API';
  registered_by_agent_id?: number;
  assigned_tax_officer_id?: number;
  data_quality_score: number;
  created_by_id?: number;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Deceased';
  suspension_reason?: string;
  notes?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface LGA {
  id: number;
  name: string;
  state_id: number;
}

// Form data interfaces for creating/updating individuals
export interface IndividualFormData {
  // Basic fields (always required for creation)
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: 'male' | 'female' | 'Male' | 'Female';
  date_of_birth: string;
  address: string;
  email: string;
  mobile_number?: string;

  // Optional enhanced fields
  nin?: string;
  bvn?: string;
  drivers_license?: string;
  passport_number?: string;
  voters_card?: string;
  tin?: string;
  title?: string;
  marital_status?: string;
  nationality?: string;
  state_of_origin?: string;
  lga_of_origin?: string;
  religion?: string;
  employment_status?: string;
  employer_name?: string;
  employer_address?: string;
  occupation?: string;
  industry_sector?: string;
  estimated_annual_income?: number;
  income_bracket?: string;
  address_line2?: string;
  area?: string;
  city?: string;
  lga_id?: number;
  ward?: string;
  community?: string;
  postal_code?: string;
  landmark?: string;
  gps_latitude?: number;
  gps_longitude?: number;
  address_type?: string;
  office_address?: string;
  office_lga_id?: number;
  secondary_phone?: string;
  work_phone?: string;
  whatsapp_number?: string;
  secondary_email?: string;
  preferred_contact_method?: string;
  notes?: string;
}
