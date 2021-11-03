import { BaseQuery } from "./result";

export interface CertbotModel {
  id: number;
  name: string;
  directoryUrl: string;
  email: string;
}
export interface CertbotQuery extends BaseQuery {
  name?: string;
  email?: string;
}
