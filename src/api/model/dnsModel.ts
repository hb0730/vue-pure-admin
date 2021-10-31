import { BaseQuery } from "./resultModel";

export interface DNSProvider {
  label: string;
  value: string;
}
export interface DNSModel {
  id: number;
  userId: number;
  name: string;
  alias: string;
  accountId: string;
  secret: string;
  endpoint?: string;
  region?: string;
  email?: string;
}
export interface DNSQuery extends BaseQuery {
  name?: string;
  addr?: string;
}
