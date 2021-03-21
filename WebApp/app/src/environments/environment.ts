// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const domaineName = 'http://localhost:8080/';
const repositoriesUrl = domaineName + 'repositories';
const searchVideoUrl = domaineName + 'searchVideo';
const searchAudioUrl = domaineName + 'searchAudio';
const searchImageUrl = domaineName + 'searchImage';
const searchPdfUrl = domaineName + 'searchPdf';

export const environment = {
  production: false,
  repositoriesUrl,
  domaineName,
  searchVideoUrl,
  searchAudioUrl,
  searchImageUrl,
  searchPdfUrl
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
