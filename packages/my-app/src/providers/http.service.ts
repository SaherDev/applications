import { DataSyncService, HTTPService } from '@application/utilities';

import { AUTH_REFRESH_URL } from '@/config';

export const httpService = new HTTPService();

httpService.initialize(AUTH_REFRESH_URL, () => {
  alert('navigate to login');
});

// const dataSyncService = new DataSyncService<{
//   config: string;
// }>(
//   ['', 'POST', , false],
//   (...args) => httpService.fetch(...args),
//   1000 * 5,
//   3,
//   false,
//   (val) => console.log(val),
//   (val) => console.log(val)
// );

// dataSyncService.sync();
