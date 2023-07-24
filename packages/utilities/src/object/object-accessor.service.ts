export class ObjectAccessorUtilService {
  static fillEmptyProperties<T>(obj: Partial<T>, properties: T): any {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj))
      return obj;

    for (const key of Object.keys(properties)) {
      if (!obj.hasOwnProperty(key)) {
        obj[key] = properties[key];
      } else if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        typeof properties[key] === "object" &&
        properties[key] !== null
      ) {
        this.fillEmptyProperties(obj[key], properties[key]);
      }
    }

    return obj;
  }
}
