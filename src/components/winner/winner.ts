import { ICar, IWinCar } from '../../type';
import '../../images/car.svg';
import GenerationCar from '../shared/generationCar';

export default class Winner {
  private car: ICar;

  private score: IWinCar;

  constructor(car: ICar, score: IWinCar) {
    this.car = car;
    this.score = score;
  }

  createWinner(index: number): DocumentFragment {
    const fragment: DocumentFragment = new DocumentFragment();
    const numberCar: HTMLDivElement = document.createElement('div');
    numberCar.innerHTML = index.toString();
    const nameCar: HTMLDivElement = document.createElement('div');
    nameCar.innerHTML = this.car.name;
    const winsCar: HTMLDivElement = document.createElement('div');
    winsCar.innerHTML = this.score.wins.toString();
    const timeCar: HTMLDivElement = document.createElement('div');
    timeCar.innerHTML = this.score.time.toString();
    const svgCar = new GenerationCar();
    fragment.append(numberCar, svgCar.createPicture(this.car.color), nameCar, winsCar, timeCar);
    return fragment;
  }
}
