import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findUserExistance(id): Promise<boolean> {
    // ToDo: integrate with identity service
    // this can be used for more security by checking if the user with this payload is really exist
    return true;
  }
}
