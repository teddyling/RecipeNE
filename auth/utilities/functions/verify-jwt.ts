import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

const verifyJWT = (token: string, secret: string) => {
  return new Promise<JwtPayload | VerifyErrors>((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
};

export { verifyJWT };
