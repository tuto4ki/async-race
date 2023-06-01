import { EDriveCar, ICar, IDataResponse } from '../../type';
import './car.scss';
import '../../images/car.svg';
import Api from '../../services/api';
import GenerationCar from '../shared/generationCar';

export default class Car {
  private car: ICar;

  private nameHTML: HTMLSpanElement;

  private pictureCar: SVGSVGElement;

  private btnStart: HTMLButtonElement;

  private btnEnd: HTMLButtonElement;

  private animation: Animation;

  private distance: number;

  private velocity: number;

  constructor(car: ICar) {
    this.car = car;
    this.nameHTML = document.createElement('span');
    this.nameHTML.innerHTML = car.name;
    const svgCar = new GenerationCar();
    this.pictureCar = svgCar.createPicture(this.car.color);
    this.btnStart = document.createElement('button');
    this.btnEnd = document.createElement('button');
    this.animation = new Animation();
    this.velocity = 0;
    this.distance = 0;
  }

  getId(): number {
    return this.car.id ? this.car.id : -1;
  }

  getName(): string {
    return this.car.name;
  }

  getColor(): string {
    return this.car.color;
  }

  getFinishTime(): number {
    return this.distance / this.velocity;
  }

  gerViewCar(): HTMLElement {
    const car: HTMLElement = document.createElement('div');
    car.classList.add('item-car');
    car.dataset.indexNumber = `${this.car.id}`;
    const btnEdit: HTMLButtonElement = document.createElement('button');
    btnEdit.classList.add('select');
    btnEdit.innerHTML = 'select';
    const btnDelete: HTMLButtonElement = document.createElement('button');
    btnDelete.classList.add('remove');
    btnDelete.innerHTML = 'remove';
    const blockEditCar: HTMLDivElement = document.createElement('div');
    blockEditCar.append(btnEdit, btnDelete, this.nameHTML);
    this.btnStart.classList.add('start-move');
    this.btnStart.innerHTML = 'A';
    this.btnEnd.classList.add('end-move');
    this.btnEnd.classList.add('no-active');
    this.btnEnd.innerHTML = 'B';
    const blockCarPicture: HTMLDivElement = document.createElement('div');
    blockCarPicture.classList.add('picture-car');
    blockCarPicture.append(this.pictureCar);
    const blockMoveCar: HTMLDivElement = document.createElement('div');
    blockMoveCar.classList.add('item-car_move');
    blockMoveCar.append(this.btnStart, this.btnEnd, blockCarPicture);

    car.append(blockEditCar, blockMoveCar);
    return car;
  }

  updateCar(car: ICar): void {
    this.car.name = car.name;
    this.nameHTML.innerHTML = this.car.name;
    this.car.color = car.color;
    this.pictureCar.style.fill = this.car.color;
  }

  async startCar(): Promise<void> {
    if (this.car.id) {
      const api = new Api();
      this.btnStart.classList.add('no-active');
      const resp = await api.driveCar(this.car.id, EDriveCar.start);
      if (resp) {
        this.driveCar(resp);
      }
    }
  }

  async driveCar(resp: IDataResponse, setWin?: (data: Car) => void): Promise<void> {
    if (resp.distance && resp.velocity && this.car.id) {
      this.distance = resp.distance;
      this.velocity = resp.velocity;
      const api = new Api();
      const time: number = resp.distance / resp.velocity;
      const distanceBlock = document.querySelector('.picture-car');
      if (distanceBlock) {
        this.btnEnd.classList.remove('no-active');
        const distance: number = distanceBlock.getBoundingClientRect().width - +this.pictureCar.width.animVal.value;
        this.animationCar(time, distance);
        const statusDrive = await api.driveCar(this.car.id, EDriveCar.drive);
        if (!statusDrive) {
          this.animation.pause();
        } else if (statusDrive.success && setWin) {
          setWin(this);
        }
      } else {
        this.btnStart.classList.remove('no-active');
      }
    }
  }

  async finishCar(): Promise<void> {
    if (this.car.id) {
      this.btnEnd.classList.add('no-active');
      const api = new Api();
      const resp = await api.driveCar(this.car.id, EDriveCar.stop);
      if (resp) {
        this.animation.cancel();
        this.pictureCar.style.transform = 'translate(0, 0)';
        this.btnStart.classList.remove('no-active');
        this.btnEnd.classList.add('no-active');
      } else {
        this.btnEnd.classList.remove('no-active');
      }
    }
  }

  animationCar(time: number, distance: number) {
    this.animation = this.pictureCar.animate(
      [{ transform: 'translate(0)' }, { transform: `translate(${distance}px, 0)` }],
      time
    );
    this.animation.addEventListener(
      'finish',
      () => {
        this.pictureCar.style.transform = `translate(${distance}px, 0)`;
      },
      { once: true }
    );
  }

  blockButton() {
    this.btnStart.classList.add('no-active');
    this.btnEnd.classList.remove('no-active');
  }
}
