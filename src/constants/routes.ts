export enum AuthRoutes {
  Registration = '/registration',
  Login = '/login',
  Logout = '/logout',
}

export enum UserRoutes {
  GetCalls = '/getCalls',
  GetInfo = '/getInfo',
  ChangePassword = '/changePassword',
  SaveMessagingToken = '/saveMessagingToken',
  SendMessageToClient = '/sendMessageToClient',
}

export enum UserCarRoutes {
  SaveCarLocation = '/saveCarLocation',
  ToggleCarCallIsRead = '/toggleCarCallIsRead',
  DeleteCarCall = '/deleteCarCall',
  AddNewCar = '/addNewCar',
  SaveVehicleInfo = '/saveVehicleInfo',
}

export enum ExternalRoutes {
  GetInfoExt = '/getInfoExt',
  CallUser = '/callUser',
}

export const validateTokenExceptions = [
  ...Object.values(ExternalRoutes),
  AuthRoutes.Login,
  AuthRoutes.Registration,
  '/healthCheck',
];
