import { UserSession, AppConfig } from 'blockstack'
import { configure } from 'radiks';
import {getPublicKeyFromPrivate} from 'blockstack/lib/keys';
import {decodeToken} from 'jsontokens'

export const appConfig = new AppConfig(['store_write', 'publish_data', 'email'])
export const userSession = new UserSession({ appConfig })

configure({
  apiServer: 'http://localhost:5000',
  userSession
});

export const decodeResponseToken = () => {
  const {authResponseToken} = userSession.loadUserData();
  return decodeToken(authResponseToken);
};

export const getUsername = () => {
  const {username} = decodeResponseToken().payload;
  if (username) {
    return username.split('.')[0];
  }

  const chars = getUserPublicKey().split('');
  const userRnd = [1, 3, 11, 13, 21, 23, 31, 33].map(x => chars[x]).join('');
  return `p-${userRnd}`;
};

export const getUserPublicKey = () => {
  const {appPrivateKey} = userSession.loadUserData();

  return getPublicKeyFromPrivate(appPrivateKey);
};



