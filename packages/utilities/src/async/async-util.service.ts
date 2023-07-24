export class AsyncUtilService {
  static setIntervalImmediate(func: any, interval: number): NodeJS.Timer {
    func();
    return setInterval(func, interval);
  }
}
