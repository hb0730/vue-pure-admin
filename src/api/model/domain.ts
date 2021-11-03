import { BaseQuery } from "./result";

export interface DomainModel {
  id: number;
  dnsId: number;
  certbotId: number;
  dnsName?: String;
  domain: string;
}

export interface DomainQuery extends BaseQuery {
  domain?: number;
  certbotId?: number;
  dnsId?: number;
}
