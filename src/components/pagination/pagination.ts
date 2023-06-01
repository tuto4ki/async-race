import Api from '../../services/api';
import { ETableData, IDataResponse } from '../../type';

export default class Pagination {
  private limit: number;

  private page = 1;

  private btnPrev: HTMLButtonElement;

  private btnNext: HTMLButtonElement;

  private totalCounter: number;

  get getPage() {
    return this.page;
  }

  get getTotalCounter() {
    return this.totalCounter;
  }

  get getLimit() {
    return this.limit;
  }

  set setLimit(limit: number) {
    this.limit = limit;
  }

  set setTotalCounter(value: number) {
    this.totalCounter = value;
    if (this.isNextPage()) {
      this.btnNext.classList.remove('no-active');
    } else {
      this.btnNext.classList.add('no-active');
    }
    if (this.page === 1) {
      this.btnPrev.classList.add('no-active');
    } else {
      this.btnPrev.classList.remove('no-active');
    }
  }

  constructor(limit = 7) {
    this.limit = limit;
    this.totalCounter = 0;
    this.btnPrev = document.createElement('button');
    this.btnPrev.innerHTML = 'prev';
    this.btnPrev.classList.add('prev-page');
    this.btnPrev.classList.add('no-active');
    this.btnNext = document.createElement('button');
    this.btnNext.innerHTML = 'next';
    this.btnNext.classList.add('next-page');
    this.btnNext.classList.add('no-active');
  }

  createPagination<T>(
    func: (data: T, dataResponse: IDataResponse) => void,
    tableData: ETableData,
    queryParamFunc?: () => IDataResponse
  ): HTMLDivElement {
    const blockPagination: HTMLDivElement = document.createElement('div');
    blockPagination.classList.add('pagination');
    blockPagination.append(this.btnPrev, this.btnNext);
    this.btnPrev.addEventListener('click', () => {
      if (this.page === 1) {
        return;
      }
      const api = new Api();
      this.page -= 1;
      if (queryParamFunc) {
        api.getList(tableData, { page: this.page, limit: this.limit, ...queryParamFunc() }, func);
      } else {
        api.getList(tableData, { page: this.page, limit: this.limit }, func);
      }
      if (this.page === 1) {
        this.btnNext.classList.remove('no-active');
        this.btnPrev.classList.add('no-active');
      }
    });
    this.btnNext.addEventListener('click', () => {
      if (!this.isNextPage()) {
        return;
      }
      const api = new Api();
      this.page += 1;
      if (queryParamFunc) {
        api.getList(tableData, { page: this.page, limit: this.limit, ...queryParamFunc() }, func);
      } else {
        api.getList(tableData, { page: this.page, limit: this.limit }, func);
      }
      if (!this.isNextPage()) {
        this.btnNext.classList.add('no-active');
        this.btnPrev.classList.remove('no-active');
      }
    });
    return blockPagination;
  }

  isNextPage(): boolean {
    if (this.totalCounter / this.limit > this.page) {
      return true;
    }
    return false;
  }

  updatePage(): void {
    const limitPage = this.totalCounter / this.limit;
    if (limitPage < this.page) {
      this.page = Math.ceil(limitPage);
    }
  }
}
