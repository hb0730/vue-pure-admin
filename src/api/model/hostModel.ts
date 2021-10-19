export interface HostModel {
  Id: number;
  name: string;
  addr: string;
  port: number;
  password: string;
  userId: number;
}

export interface HostQuery {
  name?: string;
  addr?: string;
  total: number;
  pageNum: number;
  pageSize: number;
}
