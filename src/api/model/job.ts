import { BaseQuery } from "./result";

export interface DomainJobModel {
  id: number;
  userId: number;
  name: string;
  subDomainId: number;
  domain: string;
  hostId: number;
  remoteAddr: string;
  script: string;
  cron: string;
  enabled: number;
}
export interface Enabled {
  name: string;
  value: number;
}

export interface DomainJobQuery extends BaseQuery {
  name: string;
}
