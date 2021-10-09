import JSEncrypt from "jsencrypt";
class RSA {
  private jsencrypt: JSEncrypt;
  constructor(publicKey?: string) {
    this.jsencrypt = new JSEncrypt();
    this.jsencrypt.setPublicKey(publicKey);
  }
  public setPublicKey(publicKey: string) {
    this.jsencrypt.setPublicKey(publicKey);
  }
  public encrypt(data?: string): string | boolean {
    return this.jsencrypt.encrypt(data);
  }
}

export const rsa = new RSA();
