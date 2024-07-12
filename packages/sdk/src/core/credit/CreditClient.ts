import { APIResource } from "../../main/resource";
import {
  GetRemainingInstillCreditRequest,
  GetRemainingInstillCreditResponse,
} from "./types";

export class CreditClient extends APIResource {
  async getRemainingInstillCredit({
    ownerName,
  }: GetRemainingInstillCreditRequest) {
    try {
      const data = await this._client.get<GetRemainingInstillCreditResponse>(
        `/${ownerName}/credit`,
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
