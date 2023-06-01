import { EOrderSort, ESortType, ETableData, ICar, IDataResponse, IWinCar } from '../../type';
import Page from '../shared/page';
import Winner from '../winner/winner';
import './score.scss';

export default class Score extends Page {
  private sortType: ESortType;

  private orderSort: EOrderSort;

  constructor() {
    super();
    this.pagination.setLimit = 10;
    this.container.classList.add('winners');
    this.sortType = ESortType.id;
    this.orderSort = EOrderSort.ASC;
  }

  createScore(): HTMLElement {
    const winnersTable: HTMLDivElement = document.createElement('div');
    winnersTable.classList.add('table-winners');
    const numberHeaderTable: HTMLDivElement = document.createElement('div');
    numberHeaderTable.innerHTML = 'Number';
    const carPictureHeader: HTMLDivElement = document.createElement('div');
    carPictureHeader.innerHTML = 'Car';
    const nameHeaderTable: HTMLDivElement = document.createElement('div');
    nameHeaderTable.innerHTML = 'Name';
    const winsHeaderTable: HTMLDivElement = document.createElement('div');
    winsHeaderTable.classList.add('button');
    winsHeaderTable.addEventListener('click', (event: Event) => this.sortScore(event, ESortType.wins));
    winsHeaderTable.innerHTML = 'Wins';
    const timeHeaderTable: HTMLDivElement = document.createElement('div');
    timeHeaderTable.innerHTML = 'Beast time(seconds)';
    timeHeaderTable.classList.add('button');
    timeHeaderTable.addEventListener('click', (event: Event) => this.sortScore(event, ESortType.time));
    winnersTable.append(numberHeaderTable, carPictureHeader, nameHeaderTable, winsHeaderTable, timeHeaderTable);
    this.listCars.classList.add('table-winners');
    this.container.append(
      this.title,
      this.page,
      winnersTable,
      this.listCars,
      this.pagination.createPagination(
        (data: IWinCar[], dataResp: IDataResponse) => this.createListWinners(data, dataResp),
        ETableData.winners,
        () => this.getSortParam()
      )
    );
    this.container.classList.add('hidden');
    this.getListScore();
    return this.container;
  }

  async createListWinners(winsCar: IWinCar[], data?: IDataResponse): Promise<void> {
    if (winsCar.length === 0 && this.pagination.getPage > 1) {
      this.pagination.setTotalCounter = this.pagination.getTotalCounter - 1;
      this.pagination.updatePage();
      this.getListScore();
      return;
    }
    if (data) {
      this.title.innerHTML = `Winners(${data.limit})`;
      this.page.innerHTML = `Page #${data.page}`;
      this.pagination.setTotalCounter = data.limit ? +data.limit : 0;
    }
    const carsList: DocumentFragment = new DocumentFragment();
    const requests = winsCar.map((car) => this.api.getItem<ICar>(ETableData.garage, car.id));
    await Promise.all(requests).then((responses) => {
      const indexStart = this.pagination.getLimit * (this.pagination.getPage - 1) + 1;
      responses.forEach((car, index) => {
        if (car) {
          const winner: Winner = new Winner(car, winsCar[index]);
          carsList.append(winner.createWinner(index + indexStart));
        }
      });
    });
    this.listCars.innerHTML = '';
    this.listCars.append(carsList);
  }

  sortScore(event: Event, typeSort: ESortType) {
    const btnSort: HTMLDivElement = <HTMLDivElement>event.target;
    this.sortType = typeSort;
    this.orderSort = this.orderSort === EOrderSort.ASC ? EOrderSort.DESC : EOrderSort.ASC;
    this.changeSortIcon(btnSort);
    this.getListScore();
  }

  getSortParam(): IDataResponse {
    return { sort: this.sortType, order: this.orderSort };
  }

  changeSortIcon(btnSort: HTMLDivElement) {
    document.querySelector('.sort-asc')?.classList.remove('sort-asc');
    document.querySelector('.sort-desc')?.classList.remove('sort-desc');
    if (this.orderSort === EOrderSort.ASC) {
      btnSort.classList.add('sort-asc');
    } else {
      btnSort.classList.add('sort-desc');
    }
  }

  togglePage() {
    this.getListScore();
    super.togglePage();
  }

  getListScore(): void {
    this.api.getList(
      ETableData.winners,
      { page: this.pagination.getPage, limit: this.pagination.getLimit, ...this.getSortParam() },
      (data: IWinCar[], dataResp: IDataResponse) => this.createListWinners(data, dataResp)
    );
  }
}
