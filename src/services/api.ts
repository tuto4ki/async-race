import { ICar, IDataResponse, IWinCar, ECodeStatus } from '../type';

export default class Api {
  private path: string;
  constructor(path = 'http://127.0.0.1:3000') {
    this.path = path;
  }

  async getList<TypeList>(
    table: string,
    queryParam: IDataResponse,
    func: (data: TypeList, dataResponse: IDataResponse) => void
  ): Promise<void> {
    const response: Response = await fetch(`${this.path}/${table}/?${this.getQueryString(queryParam)}`, {
      method: 'GET',
    });
    const dataResponse: IDataResponse = {
      limit: Number(response.headers.get('X-Total-Count')),
      page: queryParam.page,
    };
    response.json().then((data: TypeList) => func(data, dataResponse));
  }

  private getQueryString(queryParam: IDataResponse): string {
    const queryArr: string[] = [];
    Object.entries(queryParam).forEach((value) => {
      queryArr.push(`_${value[0]}=${value[1]}`);
    });
    return queryArr.join('&');
  }

  async createItem<TypeItem>(table: string, item: TypeItem): Promise<TypeItem | boolean> {
    const response: Response = await fetch(`${this.path}/${table}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (response.status === ECodeStatus.created) {
      const resp: TypeItem = await response.json();
      return resp;
    }
    return false;
  }

  async updateCar(car: ICar, func: (data: ICar) => void): Promise<void> {
    const response: Response = await fetch(`${this.path}/garage/${car.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: car.name, color: car.color }),
    });
    if (response.status === ECodeStatus.success) {
      response.json().then((data) => func(data));
    }
  }

  async updateWinner(win: IWinCar): Promise<void> {
    await fetch(`${this.path}/winners/${win.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wins: win.wins, time: win.time }),
    });
  }

  async removeItem(table: string, idCar: number): Promise<boolean> {
    const response: Response = await fetch(`${this.path}/${table}/${idCar}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === ECodeStatus.success) {
      return true;
    }
    return false;
  }

  async driveCar(idCar: number, statusCar: string): Promise<IDataResponse | null> {
    const response: Response = await fetch(`${this.path}/engine?id=${idCar}&status=${statusCar}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === ECodeStatus.success) {
      const resp: IDataResponse = await response.json();
      return resp;
    }
    return null;
  }

  async getItem<TypeItem>(table: string, idCar: number): Promise<TypeItem | null> {
    const response: Response = await fetch(`${this.path}/${table}/${idCar}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === ECodeStatus.success) {
      const resp: TypeItem = await response.json();
      return resp;
    }
    return null;
  }
}
