import { EDriveCar, ETableData, ICar, IDataResponse, IWinCar } from '../../type';
import Car from '../car/car';
import Popup from '../popup/popup';
import GenerationCar from '../shared/generationCar';
import Page from '../shared/page';
import UpdateCar from '../updateCar/updateCar';
import './garage.scss';

const milliseconds = 1000;

export default class Garage extends Page {
  private totalCar = 100;

  private cars: Array<Car>;

  private updateCar: UpdateCar;

  private carRace: HTMLButtonElement;

  private generationCar: HTMLButtonElement;

  private btnReset: HTMLButtonElement;

  private winCar: Car | null = null;

  private isRace: boolean;

  private popup: Popup;

  constructor() {
    super();
    this.container.classList.add('garage');
    this.updateCar = new UpdateCar();
    this.cars = new Array<Car>();
    this.generationCar = document.createElement('button');
    this.carRace = document.createElement('button');
    this.btnReset = document.createElement('button');
    this.generationCar.innerHTML = 'Generate Cars';
    this.isRace = false;
    this.popup = new Popup();
  }

  createGarage(): HTMLElement {
    this.carRace.innerHTML = 'Race';
    this.btnReset.innerHTML = 'Reset';
    this.btnReset.classList.add('no-active');
    this.container.append(
      this.formCreateCar(),
      this.updateCar.createFormUpdateCar(),
      this.carRace,
      this.btnReset,
      this.generationCar,
      this.title,
      this.page,
      this.listCars,
      this.pagination.createPagination(
        (data: ICar[], dataResp: IDataResponse) => this.createListCars(data, dataResp),
        ETableData.garage
      )
    );
    this.listCars.addEventListener('click', (event) => this.onClickListCar(event));
    this.api.getList(
      ETableData.garage,
      { page: this.pagination.getPage, limit: this.pagination.getLimit },
      (data: ICar[], dataResp: IDataResponse) => this.createListCars(data, dataResp)
    );
    this.generationCar.addEventListener('click', () => this.onClickGenerationCar());
    this.carRace.addEventListener('click', () => this.onClickCarRace());
    this.btnReset.addEventListener('click', () => this.onClickCarReset());
    return this.container;
  }

  formCreateCar(): HTMLElement {
    const form: HTMLFormElement = document.createElement('form');
    form.setAttribute('name', 'create-car');
    form.classList.add('create-car');
    form.innerHTML = `<input name='name' type='text'>
                      <input name='color' type='color'>
                      `;
    const btnCreate: HTMLButtonElement = document.createElement('button');
    btnCreate.innerHTML = 'Create';
    form.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      const formCreate: HTMLFormElement = <HTMLFormElement>event.target;
      const nameCar: string = (<HTMLInputElement>formCreate[0]).value.trim();
      const colorCar: string = (<HTMLInputElement>formCreate[1]).value.trim();
      const isCreated = this.api.createItem<ICar>(ETableData.garage, { name: nameCar, color: colorCar });
      isCreated.then((value: boolean | ICar) => {
        if (value) {
          this.api.getList(
            ETableData.garage,
            { page: this.pagination.getPage, limit: this.pagination.getLimit },
            (data: ICar[], dataResp: IDataResponse) => this.createListCars(data, dataResp)
          );
        }
      });
      (<HTMLInputElement>formCreate[0]).value = '';
      (<HTMLInputElement>formCreate[1]).value = '#000000';
    });
    form.append(btnCreate);
    return form;
  }

  createListCars(cars: ICar[], data?: IDataResponse) {
    this.isRace = false;
    this.winCar = null;
    if (data) {
      this.title.innerHTML = `Garage(${data.limit})`;
      this.page.innerHTML = `Page #${this.pagination.getPage}`;
      this.pagination.setTotalCounter = data.limit ? +data.limit : 0;
    }
    this.carRace.classList.remove('no-active');
    this.btnReset.classList.add('no-active');
    this.winCar = null;
    this.listCars.innerHTML = '';
    this.cars = new Array<Car>();
    cars.forEach((item) => {
      const car = new Car(item);
      this.cars.push(car);
      this.listCars.append(car.gerViewCar());
    });
  }

  onClickListCar(event: Event) {
    const target: HTMLElement = <HTMLElement>event.target;
    const idCar = target.parentElement?.parentElement?.dataset.indexNumber;
    if (idCar) {
      const index = +idCar;
      if (target.classList.contains('select')) {
        console.log('select');
        this.popup.removePopup();
        const selectedCar = this.cars.find((value) => value.getId() === index);
        if (selectedCar) {
          this.updateCar.updateCar(selectedCar);
        }
      } else if (target.classList.contains('remove')) {
        this.popup.removePopup();
        const isRemoved = this.api.removeItem(ETableData.garage, index);
        isRemoved.then((value: boolean) => {
          if (value) {
            this.pagination.setTotalCounter = this.pagination.getTotalCounter - 1;
            this.pagination.updatePage();
            this.api.getList(
              ETableData.garage,
              { page: this.pagination.getPage, limit: this.pagination.getLimit },
              (data: ICar[], dataResp: IDataResponse) => this.createListCars(data, dataResp)
            );
            // remove in winners
            this.api.removeItem(ETableData.winners, index);
          }
        });
      } else if (target.classList.contains('start-move') && !target.classList.contains('no-active')) {
        this.popup.removePopup();
        const movedCar = this.cars.find((item) => item.getId() === index);
        this.winCar = null;
        movedCar?.startCar();
      } else if (target.classList.contains('end-move') && !target.classList.contains('no-active')) {
        this.popup.removePopup();
        const movedCar = this.cars.find((item) => item.getId() === index);
        movedCar?.finishCar();
      }
    }
  }

  onClickGenerationCar() {
    for (let i = 0; i < this.totalCar; i += 1) {
      const carGeneration = new GenerationCar();
      const car = carGeneration.randomCar();
      const isCreated = this.api.createItem(ETableData.garage, car);
      isCreated.then((value: boolean | ICar) => {
        if (value) {
          this.pagination.setTotalCounter = this.pagination.getTotalCounter + 1;
          if (this.cars.length < this.pagination.getLimit) {
            this.api.getList(
              ETableData.garage,
              { page: this.pagination.getPage, limit: this.pagination.getLimit },
              (data: ICar[], dataResp: IDataResponse) => this.createListCars(data, dataResp)
            );
          } else {
            this.title.innerHTML = `Garage(${this.pagination.getTotalCounter})`;
          }
        }
      });
    }
  }

  async onClickCarRace(): Promise<void> {
    this.popup.removePopup();
    this.winCar = null;
    if (this.carRace.classList.contains('no-active')) {
      return;
    }
    this.isRace = true;
    this.carRace.classList.add('no-active');
    this.btnReset.classList.add('no-active');
    this.cars.forEach((car) => car.blockButton());
    const requests = this.cars.map((car) => this.api.driveCar(car.getId(), EDriveCar.start));
    await Promise.all(requests).then((responses) => {
      this.carRace.classList.add('no-active');
      this.btnReset.classList.remove('no-active');
      this.cars.forEach((car) => car.blockButton());
      responses.forEach((resp, index) => {
        if (resp) {
          this.cars[index].driveCar(resp, (car: Car) => this.setWinCar(car));
        }
      });
    });
  }

  onClickCarReset(): void {
    if (this.btnReset.classList.contains('no-active')) {
      return;
    }
    this.carRace.classList.remove('no-active');
    this.btnReset.classList.add('no-active');
    this.isRace = false;
    this.popup.removePopup();
    this.cars.forEach((car) => car?.finishCar());
  }

  async setWinCar(car: Car): Promise<void> {
    if (!this.winCar && this.isRace) {
      this.winCar = car;
      const time = (this.winCar.getFinishTime() / milliseconds).toFixed(2);
      const popupHTML = this.popup.createPopup(this.winCar.getName(), time);
      this.listCars.append(popupHTML);
      const isWinner = await this.api.getItem<IWinCar>(ETableData.winners, this.winCar.getId());
      if (isWinner) {
        let timeUpdate: number = isWinner.time;
        if (isWinner.time > +time && isWinner.id) {
          timeUpdate = +time;
        }
        this.api.updateWinner({ id: isWinner.id, wins: isWinner.wins + 1, time: timeUpdate });
      } else {
        this.api.createItem(ETableData.winners, { id: this.winCar.getId(), wins: 1, time: +time });
      }
    }
  }
}
