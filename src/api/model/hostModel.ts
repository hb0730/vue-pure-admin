export interface HostModel {
  id: number;
  name: string;
  addr: string;
  username: string;
  port: number;
  password: string;
  userId: number;
}

export interface HostTestModel {
  addr: string;
  port: number;
  username: string;
  password: string;
}

export interface HostQuery {
  name?: string;
  addr?: string;
  total: number;
  pageNum: number;
  pageSize: number;
}
