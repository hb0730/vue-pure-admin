import { BaseQuery } from "./result";

export interface DomainListQuery extends BaseQuery {
  domainId?: number;
  certbotId?: number;
}

export interface DomainListModel {
  id: number;
  domainId: number;
  domainList: string;
}
