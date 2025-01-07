import { ObjectId } from '@fastify/mongodb';
import { LocaleLang } from '../../../constants/locales/index.js';
import Car, { ICarCall, ICarLocation } from '../car/index.js';
import {
  comparePasswordWithHash,
  encryptString,
} from '../../../helpers/crypto/index.js';
import TokenService from '../../../services/tokenService/index.js';
import { Data } from 'dataclass';
import { IUserPreferencies, UserRole } from './types.js';

export default class User extends Data {
  _id: ObjectId = ObjectId.createFromTime(Date.now());
  userName: string = 'unknown';
  password: string = 'unknown';
  role: UserRole = UserRole.User;
  accessToken: string = '';
  cars: Car[] = [];
  messagingToken: string = '';
  prefs: IUserPreferencies = { lang: LocaleLang.En };

  static from(userDB: any) {
    return User.create({
      ...userDB,
      cars: userDB.cars.map((car: any) => Car.from(car)),
    });
  }

  /**
   * Generates new access token for user and returns new User copy with it.
   * Does not modify the original User instance.
   * @returns {User} new User instance with new access token
   */
  public generateNewAccessToken(this: User): User {
    const { accessToken } = TokenService.generateTokenPair({
      userId: this._id.toJSON(),
    });
    return this.copy({
      accessToken: accessToken,
    });
  }

  /**
   * Checks if the given password matches the one stored in user's password property.
   * Uses bcrypt.compare function to check the password.
   * @param {string} password password to check
   * @returns {Promise<boolean>} true if the password matches, false otherwise
   */
  public async checkPassword(password: string): Promise<boolean> {
    return await comparePasswordWithHash(password, this.password);
  }

  public get clientObject() {
    return {
      userName: this.userName,
      role: this.role,
      cars: this.cars,
      prefs: this.prefs,
    };
  }

  public getUserInfoForExternal(carId: string) {
    const car: Car = this.getCarInfoByObjectId(carId);
    return {
      userName: this.userName,
      carNumber: car.carNumber,
      carName: car.carName,
      autoMessage: car.carPrefs.autoMessage,
    };
  }

  public getCarInfoByObjectId(id: string): Car {
    const car = this.cars.find(car => car.idString === id);
    if (!car) {
      throw new Error('Car not found by id');
    }
    return car;
  }

  public pushCarCall(this: User, carId: string, call: ICarCall): User {
    return this.copy({
      cars: this.cars.map(car => {
        if (car.idString === carId) {
          return car.addCarCall(call);
        } else return car;
      }),
    });
  }

  public deleteCarCall(this: User, carId: string, callId: string): User {
    return this.copy({
      cars: this.cars.map(car => {
        if (car.idString === carId) {
          return car.deleteCarCall(callId);
        } else return car;
      }),
    });
  }

  public toggleCarCallisRead(this: User, carId: string, callId: string): User {
    return this.copy({
      cars: this.cars.map(car => {
        if (car.idString === carId) {
          return car.toggleCarCallisRead(callId);
        } else return car;
      }),
    });
  }

  public saveCarLocation(
    this: User,
    carId: string,
    newLocation: ICarLocation | null
  ): User {
    const updatedCars = this.cars.map(car => {
      if (car.idString === carId) {
        return car.setNewCarLocation(newLocation);
      } else return car;
    });
    return this.copy({
      cars: updatedCars,
    });
  }

  public updateCarInfoById(this: User, data: any) {
    const updatedCar = Car.from(data);
    return this.copy({
      cars: this.cars.map(car => {
        if (car.idString === updatedCar.idString) {
          return updatedCar;
        } else return car;
      }),
    });
  }

  /**
   * Changes the user's password if the old password matches.
   * @param {string} newPassword new password to set
   * @param {string} oldPassword old password to check against
   * @returns {Promise<User | boolean>} new User instance with the new password if the old password matches, false otherwise
   */
  public async changePassword(
    this: User,
    newPassword: string,
    oldPassword: string
  ): Promise<User> {
    const encryptedNewPassword = await encryptString(newPassword);
    return this.copy({ password: encryptedNewPassword });
  }

  public setMessagingToken(this: User, token: string): User {
    return this.copy({ messagingToken: token });
  }

  /**
   * Logs out the user by removing the access token and messaging token from the user's object.
   * @returns {User} new User instance with the access token and messaging token set to empty strings
   */
  public logout(this: User): User {
    return this.copy({
      accessToken: '',
      messagingToken: '',
    });
  }
}
