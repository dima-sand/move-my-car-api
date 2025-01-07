import { ObjectId } from '@fastify/mongodb';
import { LocaleLang } from '../../../constants/locales/index.js';
import { Data } from 'dataclass';

export default class Car extends Data {
  id: ObjectId = ObjectId.createFromTime(Date.now());
  index: number = 0;
  carNumber: string = '';
  carName: string = '';
  carLocation: ICarLocation | null = null;
  carCalls: ICarCall[] = [];
  carPrefs: ICarPreferencies = {
    isVisibleCarName: true,
    isVisibleCarNumber: true,
    autoMessage: '',
  };

  static from(data: any) {
    return Car.create(data);
  }

  public get idString() {
    return this.id.toString();
  }

  public setNewCarLocation(this: Car, newLocation: ICarLocation | null) {
    return this.copy({
      carLocation: newLocation,
    });
  }

  public addCarCall(this: Car, call: ICarCall) {
    return this.copy({
      carCalls: [...this.carCalls, call],
    });
  }

  public deleteCarCall(this: Car, callId: string) {
    return this.copy({
      carCalls: this.carCalls.filter(call => call.id !== callId),
    });
  }

  public toggleCarCallisRead(this: Car, callId: string) {
    return this.copy({
      carCalls: this.carCalls.map(call =>
        call.id === callId ? { ...call, isRead: !call.isRead } : call
      ),
    });
  }
}

export interface ICarCall {
  timeStamp: Date;
  message: string;
  id: string;
  lang: LocaleLang;
  isRead: boolean;
  chat: any[];
}

export interface ICarPreferencies {
  isVisibleCarName: boolean;
  isVisibleCarNumber: boolean;
  autoMessage: string;
}

export interface ICarLocation {
  lat: number;
  lng: number;
}
