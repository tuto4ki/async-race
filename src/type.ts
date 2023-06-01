export interface ICar {
  name: string;
  color: string;
  id?: number;
}
export interface IWinCar {
  id: number;
  wins: number;
  time: number;
}
export interface IDataResponse {
  page?: number;
  limit?: number;
  counter?: number;
  distance?: number;
  velocity?: number;
  success?: boolean;
  sort?: ESortType;
  order?: EOrderSort;
}

export enum EDriveCar {
  start = 'started',
  stop = 'stopped',
  drive = 'drive',
}

export enum ETableData {
  garage = 'garage',
  winners = 'winners',
}

export enum ESortType {
  id = 'id',
  wins = 'wins',
  time = 'time',
}

export enum EOrderSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ECodeStatus {
  success = 200,
  created = 201,
}
