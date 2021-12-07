import { BaseQuery } from "./result";

export interface SubDomainQuery extends BaseQuery {
  domainId?: number;
  certbotId?: number;
}

export interface SubDomainModel {
  id: number;
  domainId: number;
  domainList: string;
}
