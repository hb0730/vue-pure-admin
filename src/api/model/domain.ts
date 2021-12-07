import { BaseQuery } from "./result";

export interface DomainModel {
  id: number;
  dnsId: number;
  caManagerId: number;
  dnsName?: String;
  domain: string;
}

export interface DomainQuery extends BaseQuery {
  domain?: number;
  caManagerId?: number;
  dnsId?: number;
}
