declare namespace Response {
  export enum EStatus {
    SUCCESS = 1,
    FAIL = 0,
  }

  export interface Common<T> {
    code: number;
    data: T;
    message?: string;
    success?: EStatus;
  }

  export class Pagination<T> {
    data: T[];
    total: number;
    page: number;
    per_page: number;
    success: EStatus;
    message?: string;
    error?: string;

    constructor(params: {
      data: T[];
      total: number;
      page: number;
      per_page: number;
      success: EStatus;
      message?: string;
      error?: string;
    }) {
      this.data = params.data;
      this.total = params.total;
      this.page = params.page;
      this.per_page = params.per_page;
      this.success = params.success;
      this.message = params.message;
      this.error = params.error;
    }

    getTotal(): number {
      return this.total;
    }

    getTotalPage(): number {
      return Math.ceil(this.total / this.per_page);
    }
  }
}
