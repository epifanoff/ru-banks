import banks from "./shared";

export const banksBase = new Map([banks]);

export const getBankInfo = banksBase.get;

export default getBankInfo;
