import { BaseQuery } from "./result";

export interface CertRecordsQuery extends BaseQuery {
  subDomainId: number;
}

export interface CertRecordModel {
  id?: number;
  subDomainId?: number;
  orderURL?: string;
  createTime?: string;
  status?: number;
  dnsRecord?: Array<DNSCertRecordModel>;
}

export interface DNSCertRecordModel {
  id?: number;
  certRecordId?: number;
  key?: string;
  value?: string;
}
