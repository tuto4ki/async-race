import { ICar } from '../../type';

const colorMaxRGB = 255.0;
const baseHEX = 16;
const markCollection = [
  'Nissan',
  'Porsche',
  'Audi',
  'Hyundai',
  'Ford',
  'Volkswagen',
  'Honda',
  'BMW',
  'Mercedes-Benz',
  'Toyota',
];
const modelCollection = ['7', 'Cayene', '5', 'Civic', 'Accord', 'M5', 'A', 'Cerato', 'Corolla', 'Supra'];
export default class GenerationCar {
  randomCar(): ICar {
    return { name: this.generationNameCar(), color: this.generationColorCar() };
  }

  private generationNameCar(): string {
    const mark = markCollection[this.getRandom(0, markCollection.length)];
    const model = modelCollection[this.getRandom(0, modelCollection.length)];
    return `${mark} ${model}`;
  }

  private getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private generationColorCar(): string {
    const colorR = Math.round(colorMaxRGB * Math.random());
    const r = colorR.toString(baseHEX);
    const colorG = Math.round(colorMaxRGB * Math.random());
    const g = colorG.toString(baseHEX);
    const colorB = Math.round(colorMaxRGB * Math.random());
    const b = colorB.toString(baseHEX);
    return `#${r}${g}${b}`;
  }

  createPicture(color: string): SVGSVGElement {
    const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('car-img');
    const use: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `./images/car.svg#Capa_1`);
    svg.append(use);
    svg.style.fill = color;
    return svg;
  }
}
