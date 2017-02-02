/**
 * Created by nick on 27/07/16.
 */
import RNFS from 'react-native-fs';

export function removeTempDirectory(dirPath, flagRemove) {
  return new Promise((resolve) => {
    RNFS.exists(dirPath).then((flagExist) => {
      if (flagExist && flagRemove) {
        RNFS.unlink(dirPath).then(() => resolve());
      } else {
        resolve();
      }
    });
  });
}

export function createTempDirectory(flagRemove) {
  const dirPath = `${RNFS.DocumentDirectoryPath}/temp`;
  return new Promise((resolve) => {
    removeTempDirectory(dirPath, flagRemove)
      .then(() => {
        RNFS.mkdir(dirPath).then(() => resolve(dirPath));
      });
  });
}

export function readBase64File(filePath) {
  return new Promise((resolve) => {
    RNFS.exists(filePath).then((flagExist) => {
      if (flagExist) {
        RNFS.readFile(filePath, 'base64').then((content) => resolve(content));
      }
    });
  });
}
