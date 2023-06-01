import Header from './components/shared/header/header';
import Garage from './components/garage/garage';
import Score from './components/score/score';

export default class App {
  private garage: Garage;

  private score: Score;

  private header: Header;

  constructor() {
    this.garage = new Garage();
    this.score = new Score();
    this.header = new Header();
  }

  start() {
    const main: HTMLElement = document.createElement('main');
    main.classList.add('main');
    main.append(this.garage.createGarage(), this.score.createScore());
    document.body.append(this.header.createHeader(this.garage, this.score), main);
  }
}
