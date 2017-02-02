// import RNFetchBlob from 'react-native-fetch-blob';
//
// function getTypeFromBuffer(buf) {
//   if (!buf || buf.length <= 1) {
//     return false;
//   }
//
//   if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
//     return {
//       ext: 'jpg',
//       mime: 'image/jpeg'
//     };
//   }
//
//   if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
//     return {
//       ext: 'png',
//       mime: 'image/png'
//     };
//   }
//
//   if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
//     return {
//       ext: 'gif',
//       mime: 'image/gif'
//     };
//   }
//
//   if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
//     return {
//       ext: 'webp',
//       mime: 'image/webp'
//     };
//   }
//
//   if (buf[0] === 0x42 && buf[1] === 0x4D) {
//     return {
//       ext: 'bmp',
//       mime: 'image/bmp'
//     };
//   }
//
//   return false;
// }
//
// function blobToURL(blob) {
//   return new Promise((resolve) => {
//     const reader = new global.FileReader();
//     reader.readAsDataURL(blob);
//     reader.onloadend = () => {
//       resolve(reader.result);
//     };
//   });
// }
//
// export async function imageToDataUri(uri) {
//   if (uri.startsWith('data:')) {
//     return uri;
//   }
//
//   const res = await RNFetchBlob.fetch('GET', uri);
//   const txt = res.text();
//   const buff = new Uint8Array(txt.length);
//
//   for (let i = 0; i < txt.length; i++) {
//     buff[i] = txt.charCodeAt(i);
//   }
//
//   const buffType = getTypeFromBuffer(buff);
//
//   if (! buffType) {
//     return null;
//   }
//
//   return `data:${buffType.mime};base64,${res.base64()}`;
// }
