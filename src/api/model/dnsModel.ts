export interface DNSProvider {
  label: string;
  value: string;
}
export interface DNSModel {
  id: number;
  userId: number;
  name: string;
  alisa: string;
  accountId: string;
  secret: string;
  endpoint?: string;
  region?: string;
  email?: string;
}
