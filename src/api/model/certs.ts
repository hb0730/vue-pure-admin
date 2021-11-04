import { BaseQuery } from "./result";

export interface CertQuery extends BaseQuery {
  domainId?: number;
  certbotId?: number;
}

export interface CertModel {
  id: number;
  domainId: number;
  domainList: string;
}
