declare module "ru-bank" {
  export interface BankInfo {
    name: string;
    alias: string;
    color?: string;
  }

  export const bankInfo: BankInfo;
}
