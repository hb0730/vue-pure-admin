import { Base64 } from "js-base64";
export function encode(value: string): string {
  return Base64.encode(value);
}
export function decode(value: string): string {
  return Base64.decode(value);
}
