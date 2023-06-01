import Garage from '../../garage/garage';
import Score from '../../score/score';

export default class Header {
  createHeader(garage: Garage, score: Score): HTMLElement {
    const header: HTMLElement = document.createElement('header');
    const garageBtn: HTMLButtonElement = document.createElement('button');
    garageBtn.innerHTML = 'to garage';
    const showMain = (event: Event) => {
      const page = <HTMLElement>event.target;
      if ((page.innerHTML !== 'to garage' && garage.isShow()) || (page.innerHTML !== 'to winners' && score.isShow())) {
        garage.togglePage();
        score.togglePage();
      }
    };
    garageBtn.addEventListener('click', (event: Event) => showMain(event));
    const scoreBtn: HTMLButtonElement = document.createElement('button');
    scoreBtn.addEventListener('click', (event: Event) => showMain(event));
    scoreBtn.innerHTML = 'to winners';
    header.append(garageBtn, scoreBtn);
    return header;
  }
}
