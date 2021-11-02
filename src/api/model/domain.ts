import { BaseQuery } from "./resultModel";

export interface DomainModel {
  id: number;
  dnsId: number;
  dnsName?: String;
  domain: string;
}

export interface DomainQuery extends BaseQuery {
  domain?: number;
  dnsId?: number;
}
