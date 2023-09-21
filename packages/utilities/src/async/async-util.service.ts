export class AsyncUtilService {
  static setIntervalImmediate(func: any, interval: number): number {
    func();
    return setInterval(func, interval);
  }
}
