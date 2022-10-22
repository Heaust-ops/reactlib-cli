/**
 * Parses and return the queries of a url, or returns
 * the value of a certain query (if exists, null otherwise)
 * 
 * @param url The URL to extract queries from
 * @param query (optional) a specific url query
 * @returns The URL queries parsed into an object,
 * or the value of (if exists, null otherwise) the specific query
 * if passed in the second argument
 */
export const getURLQueries = (url: string, query?: string) => {
  const queries = url.split("?");
  if (!queries[1]) return {};
  const parsedQueries = queries[1]
    .split("&")
    .map((query) => {
      const keyval = query.split("=");
      return {
        [keyval[0]]: keyval[1],
      };
    })
    .reduce((a, b) => ({ ...a, ...b }));

  if (!query) return parsedQueries;
  return parsedQueries[query] ?? null;
}; 
