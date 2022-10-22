 import jwt_decode from "jwt-decode";
 
 /**
 * Checks the format validity of a JWT token
 *
 * @param token The token to check
 * @returns If the token is valid or not, true/false
 *
 * Note: this is for checking if a given string is
 * a JWT by format ONLY, this doesn't verify the
 * signature
 */
export const isJWT = (token: string) => {
  let isToken = true;

  try {
    jwt_decode(token, { header: true });
  } catch {
    isToken = false;
  }

  return isToken;
};

