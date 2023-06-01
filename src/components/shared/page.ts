import Api from '../../services/api';
import Pagination from '../pagination/pagination';

export default class Page {
  protected container: HTMLElement;

  protected listCars: HTMLElement;

  protected title: HTMLElement;

  protected page: HTMLElement;

  protected pagination: Pagination;

  protected api: Api;

  constructor() {
    this.container = document.createElement('div');
    this.listCars = document.createElement('div');
    this.listCars.classList.add('list-cars');
    this.title = document.createElement('h1');
    this.page = document.createElement('p');
    this.pagination = new Pagination();
    this.api = new Api();
  }

  togglePage(): void {
    this.container.classList.toggle('hidden');
  }

  isShow(): boolean {
    return !this.container.classList.contains('hidden');
  }
}
