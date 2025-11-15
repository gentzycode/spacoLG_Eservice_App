export interface Corporate {
  // Basic Info
  id: number;
  corporate_ref: string;
  company_name: string;
  registration_number: string;
  contact_person: string;

  // Business Registration
  rc_number?: string;
  rc_type?: 'RC' | 'BN' | 'IT' | 'NGO';
  business_type?: 'LLC' | 'PLC' | 'Partnership' | 'Sole Proprietorship' | 'NGO' | 'IT' | 'Foreign';
  date_of_incorporation?: string;
  trading_name?: string;
  previous_names?: string[];

  // Tax & Financial
  corporate_tin?: string;
  vat_registered?: boolean;
  vat_number?: string;
  wht_registered?: boolean;
  annual_turnover_bracket?: 'Below 1M' | '1M-10M' | '10M-50M' | '50M-100M' | '100M-500M' | 'Above 500M';
  company_size?: 'Micro' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  number_of_employees?: number;
  employee_count_bracket?: 'Below 10' | '10-50' | '51-200' | '201-500' | 'Above 500';

  // Industry
  industry_sector?: string;
  sub_sector?: string;
  business_description?: string;
  main_products_services?: string;

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
  operational_address?: string;
  operational_lga_id?: number;
  gps_latitude?: number;
  gps_longitude?: number;

  // Contact
  email: string;
  phone_number?: string;
  secondary_phone?: string;
  mobile_phone?: string;
  fax_number?: string;
  website?: string;
  secondary_email?: string;
  social_media_links?: string[];
  preferred_contact_method?: 'Phone' | 'Email' | 'SMS' | 'WhatsApp';
  receive_sms?: boolean;
  receive_email?: boolean;

  // Key Personnel
  contact_person_phone?: string;
  contact_person_email?: string;
  contact_person_designation?: string;
  contact_person_nin?: string;
  company_secretary_name?: string;
  company_secretary_phone?: string;
  accountant_name?: string;
  accountant_phone?: string;

  // Banking
  primary_bank_name?: string;
  primary_account_number?: string;
  primary_account_name?: string;
  bank_account_verified?: boolean;
  bank_account_verified_at?: string;

  // Licenses
  business_permit_number?: string;
  business_permit_expiry?: string;
  scuml_registration?: string;
  other_licenses?: string[];
  professional_registrations?: string[];

  // Verification
  cac_verified?: boolean;
  cac_verified_at?: string;
  tin_verified?: boolean;
  tin_verified_at?: string;
  address_verified?: boolean;
  address_verified_at?: string;
  bank_account_verified_flag?: boolean;
  verification_level?: 1 | 2 | 3 | 4;
  verification_notes?: string;

  // Compliance & Risk
  compliance_score: number;
  risk_category: 'Low' | 'Medium' | 'High';
  tax_clearance_status?: 'Current' | 'Expired' | 'Not Filed' | 'Under Review';
  tax_clearance_expiry?: string;
  is_blacklisted: boolean;
  blacklist_reason?: string;
  is_on_watchlist: boolean;
  watchlist_reason?: string;

  // Payment Behavior
  total_invoices_generated: number;
  total_amount_paid: number;
  total_amount_outstanding: number;
  last_payment_date?: string;
  last_filing_date?: string;
  payment_punctuality_score: number;
  preferred_payment_method?: string;

  // Business Intelligence
  revenue_potential_score: number;
  growth_rate_category?: 'Declining' | 'Stable' | 'Growing' | 'Fast Growing';
  sector_rank?: number;
  business_relationships?: string[];

  // Categorization
  corporate_category?: 'Large Enterprise' | 'SME' | 'Startup' | 'Government Parastatal' | 'MNC';
  special_category?: 'Priority' | 'Strategic' | 'High Value' | 'Standard';
  payer_segment?: string;

  // Metadata
  registration_source: 'Web' | 'Mobile' | 'Field Officer' | 'Bulk Import' | 'API';
  registered_by_agent_id?: number;
  assigned_tax_officer_id?: number;
  data_quality_score: number;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Dissolved';
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

export interface CorporateDirector {
  id: number;
  corporate_id: number;
  director_type: 'Executive' | 'Non-Executive' | 'Chairman' | 'Shareholder' | 'Secretary';
  is_signatory: boolean;

  title?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender?: 'male' | 'female';
  date_of_birth?: string;
  nationality?: string;

  nin?: string;
  bvn?: string;
  passport_number?: string;
  drivers_license?: string;

  phone_number?: string;
  email?: string;
  residential_address?: string;
  residential_lga_id?: number;

  occupation?: string;
  professional_qualification?: string;
  other_business_interests?: string;

  shareholding_percentage?: number;
  number_of_shares?: number;
  share_value?: number;
  date_appointed?: string;
  date_resigned?: string;

  nin_verified: boolean;
  nin_verified_at?: string;
  identity_verified: boolean;
  identity_verified_at?: string;

  status: 'Active' | 'Resigned' | 'Removed';
  notes?: string;

  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Form data interfaces for creating/updating corporates
export interface CorporateFormData {
  // Basic fields (always required for creation)
  company_name: string;
  registration_number: string;
  contact_person: string;
  address: string;
  email: string;
  phone_number?: string;

  // Optional enhanced fields
  rc_number?: string;
  rc_type?: string;
  business_type?: string;
  date_of_incorporation?: string;
  trading_name?: string;
  corporate_tin?: string;
  vat_registered?: boolean;
  vat_number?: string;
  wht_registered?: boolean;
  annual_turnover_bracket?: string;
  company_size?: string;
  number_of_employees?: number;
  employee_count_bracket?: string;
  industry_sector?: string;
  sub_sector?: string;
  business_description?: string;
  main_products_services?: string;
  address_line2?: string;
  area?: string;
  city?: string;
  lga_id?: number;
  ward?: string;
  community?: string;
  postal_code?: string;
  landmark?: string;
  operational_address?: string;
  operational_lga_id?: number;
  gps_latitude?: number;
  gps_longitude?: number;
  secondary_phone?: string;
  mobile_phone?: string;
  fax_number?: string;
  website?: string;
  secondary_email?: string;
  preferred_contact_method?: string;
  receive_sms?: boolean;
  receive_email?: boolean;
  contact_person_phone?: string;
  contact_person_email?: string;
  contact_person_designation?: string;
  contact_person_nin?: string;
  company_secretary_name?: string;
  company_secretary_phone?: string;
  accountant_name?: string;
  accountant_phone?: string;
  primary_bank_name?: string;
  primary_account_number?: string;
  primary_account_name?: string;
  business_permit_number?: string;
  business_permit_expiry?: string;
  scuml_registration?: string;
  notes?: string;
}
