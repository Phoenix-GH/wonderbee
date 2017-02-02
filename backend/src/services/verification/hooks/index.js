import verifyPhone from './verifyPhone';
import sendVerificationCode from './sendVerificationCode';
import getDialCodes from './getDialCodes';

export const before = {
  find: [
    getDialCodes(),
  ],
  create: [
    sendVerificationCode(),
  ],
  patch: [
    verifyPhone(),
  ],
};
export const after = {};
