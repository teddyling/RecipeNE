import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scyptAsync = promisify(scrypt);

export class RefreshToken {
  static async toHash(token: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scyptAsync(token, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedToken: string, suppliedToken: string) {
    const [hashedToken, salt] = storedToken.split(".");
    const buf = (await scyptAsync(suppliedToken, salt, 64)) as Buffer;
    return buf.toString("hex") === hashedToken;
  }
}
