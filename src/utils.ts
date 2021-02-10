import { decode } from "base-64";
import { MapFn, QueryShape, WatchMapFn } from "./types";

// errors are nested in data as it currently stands in the API
// this helper extracts all errors present
export const getErrorsFromData = <T extends { [key: string]: any }>(
  data: T
) => {
  try {
    const error = Object.keys(data).reduce((acc, key) => {
      return {
        ...acc,
        ...(data[key].errors &&
          !!data[key].errors.length && { userInputErrors: data[key].errors }),
      };
    }, {});

    return Object.keys(error).length ? error : null;
  } catch (e) {
    return null;
  }
};

export const isDataEmpty = <T extends { [key: string]: any }>(data: T) =>
  Object.keys(data).reduce((_, key) => !!data[key], true);

export function getMappedData<T extends QueryShape, TResult>(
  mapFn: MapFn<T, TResult> | WatchMapFn<T, TResult>,
  data: any
) {
  if (!data) {
    return null;
  }

  const mappedData = mapFn(data);
  const result =
    mappedData && !!Object.keys(mappedData).length ? mappedData : null;

  return result;
}

export const mergeEdges = (prevEdges: any[], newEdges: any[]) => [
  ...prevEdges,
  ...newEdges.filter(edge => !prevEdges.some(e => e.node.id === edge.node.id)),
];

export function filterNotEmptyArrayItems<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export function findValueInEnum<TEnum extends object>(
  needle: string,
  haystack: TEnum
): TEnum[keyof TEnum] {
  const match = Object.entries(haystack).find(([, value]) => value === needle);

  if (!match) {
    throw new Error(`Value ${needle} not found in enum`);
  }

  return (needle as unknown) as TEnum[keyof TEnum];
}
export const decoderOfRelayId = (graphqlId: string) => {
  const regexBase64 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  if (regexBase64.test(graphqlId)) {
    const rawId = decode(graphqlId);
    /* eslint-disable no-eval */
    const relayIdArray = eval(rawId);
    const resultId = relayIdArray[3];
    return parseInt(resultId, 10);
  }
  return null;
};
