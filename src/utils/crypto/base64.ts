import { Base64 } from "js-base64";
export function encode(value: string): string {
  return Base64.encode(value);
}
