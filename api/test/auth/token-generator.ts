import {sign} from 'jsonwebtoken';
import {user, secret, expiration} from './jwt.config.json'

const retrieveToken = (firstName, lastName, email, role, owner) => {
  const token = sign(
    { firstName, lastName, sub: email, role, owner },
    secret,
    { expiresIn: expiration },
  );
  return token;
}

export const generateToken = () => {
  return {
    token: retrieveToken(user.firstName, user.lastName, user.email, user.role, 'test'),
    role: user.role,
  }
}

