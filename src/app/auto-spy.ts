type SpyOf<T> = T &
  {
    // changes
    [k in keyof T]: T[k] extends (...args: any[]) => infer R
      ? jest.Mock<R>
      : T[k];
  };

/**
 * permet de mock facilement les services.
 * utilisation :
 * const service = autoSpy(Service);
 * renvoi un jest.fn() pour chaques function du service https://jestjs.io/docs/en/mock-functions
 * ensuite on pourra faire service.get.mockReturnValue('test') pour changer les retours (par défault undefined).
 * il est également possible de mock les retours l'initialisation via :
 * const service = autoSpy(Service, {
 *   get: 'test',
 *   get2: (val:string)=> val
 * });
 *
 *
 **/
export function autoSpy<T extends Object>(
  obj: new (...args: any[]) => T,
  returnValues?: Partial<T>
): SpyOf<T> {
  returnValues = returnValues || {};
  const res: SpyOf<T> = {} as any;

  const keys = Object.getOwnPropertyNames(obj.prototype);
  keys.forEach((key) => {
    if (returnValues.hasOwnProperty(key)) {
      const valueToReturn = returnValues[key];
      if (typeof valueToReturn === 'function') {
        res[key] = jest.fn(valueToReturn);
      } else {
        res[key] = jest.fn(() => valueToReturn);
      }
    } else {
      res[key] = jest.fn();
    }
  });

  return res;
}
