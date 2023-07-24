import { AUTH_REFRESH_URL } from '@/config';
import { HTTPService } from '@application/utilities';

export const httpService = new HTTPService();

httpService.initialize(AUTH_REFRESH_URL, () => {
  alert('navigate to login');
});
