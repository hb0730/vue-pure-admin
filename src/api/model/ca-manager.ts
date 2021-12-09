import { BaseQuery } from "./result";

export interface CAManagerModel {
  id: number;
  name: string;
  email: string;
  caCode: string;
  kid: string;
  hmacKey: string;
}
export interface CAType {
  code: string;
  directoryURL: string;
}

export interface CAManagerQuery extends BaseQuery {
  name?: string;
  email?: string;
}
