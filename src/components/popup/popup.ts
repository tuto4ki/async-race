import './popup.scss';

export default class Popup {
  private title: HTMLParagraphElement | null;

  constructor() {
    this.title = null;
  }

  createPopup(name: string, time: string) {
    this.title = document.createElement('p');
    this.title.classList.add('popup');
    this.title.innerHTML = `${name} went first ${time}s`;
    return this.title;
  }

  removePopup() {
    this.title?.parentNode?.removeChild(this.title);
  }
}
