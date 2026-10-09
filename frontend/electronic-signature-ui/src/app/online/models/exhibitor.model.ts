export interface RegisterExhibitorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  exhibitorType: string;
  organization?: string;
  password: string;
}

export interface RegisterExhibitorResponse {
  message: string;
  exhibitorId: number;
}
