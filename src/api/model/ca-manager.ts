import { BaseQuery } from "./result";

export interface CAManagerModel {
  id: number;
  name: string;
  directoryUrl: string;
  email: string;
}
export interface CAManagerQuery extends BaseQuery {
  name?: string;
  email?: string;
}
