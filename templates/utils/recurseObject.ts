 /**
 * This recursively traverses through the any object entirely,
 * and peforms any given modification based on the key and its
 * value, no matter where in the object,
 *
 * example use cases,
 *  - nullifying every certain key
 *  - wrapping every 'options' key as 'create: { options }'
 *
 * Since this is an especially generalised use case,
 * that works for any and all objects,
 * it can't be helped using 'any' here
 *
 * @param obj Any object
 * @param modifier A modifier to apply that depends on the the contents
 * of any key anywhere in the object and its value
 */
export const recurseObject = (
  obj: any,
  modifier: (key: string, value: any, obj: any) => unknown
) => {
  if (typeof obj !== "object") return;

  for (const i in obj) {
    const isValueArray = obj[i] instanceof Array;
    if (!isValueArray) {
      recurseObject(obj[i], modifier);
    } else {
      obj[i].forEach((el: any) => {
        recurseObject(el, modifier);
      });
    }
    modifier(i, obj[i], obj);
  }
};
