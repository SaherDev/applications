import { ClassConstructor, plainToClass } from 'class-transformer';

import { validateOrReject } from 'class-validator';

export class ClassService {
  static async transformAndValidate<K, T>(
    cls: ClassConstructor<K>,
    plain: any,
    convertFunction: (dtoObject: K) => T
  ): Promise<T | T[]> {
    if (Array.isArray(plain)) {
      const results: T[] = [];
      for (let item of plain) {
        const transformedItem = await this.transformOne(
          cls,
          item,
          convertFunction
        );
        results.push(transformedItem);
      }
      return results;
    } else {
      return this.transformOne(cls, plain, convertFunction);
    }
  }

  private static async transformOne<K, T>(
    cls: ClassConstructor<K>,
    plain: any,
    convertFunction: (dtoObject: K) => T
  ) {
    const classInstance = plainToClass(cls, plain);
    try {
      await validateOrReject(classInstance as any);
      return convertFunction(classInstance);
    } catch (errors) {
      throw errors;
    }
  }
}
