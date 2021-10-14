export interface Result<T> {
  code: number;
  msg: string;
  data: T;
}

export interface Page<T> {
  total: number;
  records: T[];
  currentPage: number;
  pageSize: number;
  pages: number;
}
