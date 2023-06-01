import Api from '../../services/api';
import Car from '../car/car';

export default class UpdateCar {
  public selectedCar: Car | null;

  private nameCar: HTMLInputElement;

  private colorCar: HTMLInputElement;

  constructor() {
    this.selectedCar = null;
    this.nameCar = document.createElement('input');
    this.nameCar.name = 'name';
    this.nameCar.type = 'text';
    this.colorCar = document.createElement('input');
    this.colorCar.name = 'color';
    this.colorCar.type = 'color';
  }

  createFormUpdateCar(): HTMLElement {
    const form: HTMLElement = document.createElement('form');
    form.setAttribute('name', 'update-car');
    form.classList.add('update-car');
    const btnUpdate: HTMLButtonElement = document.createElement('button');
    btnUpdate.innerHTML = 'Update';
    form.addEventListener('submit', async (event: Event) => {
      event.preventDefault();
      if (this.selectedCar) {
        const nameCar: string = this.nameCar.value.trim();
        const colorCar: string = this.colorCar.value.trim();
        const api = new Api();
        await api.updateCar({ id: this.selectedCar.getId(), name: nameCar, color: colorCar }, (data) => {
          this.selectedCar?.updateCar(data);
          this.defaultCar();
        });
      }
    });
    form.append(this.nameCar, this.colorCar, btnUpdate);
    return form;
  }

  updateCar(car: Car): void {
    this.selectedCar = car;
    this.nameCar.value = this.selectedCar.getName();
    this.colorCar.value = this.selectedCar.getColor();
  }

  defaultCar(): void {
    this.nameCar.value = '';
    this.colorCar.value = '#000000';
    this.selectedCar = null;
  }
}
