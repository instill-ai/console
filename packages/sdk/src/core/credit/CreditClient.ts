import type {
  GetNamespaceRemainingInstillCreditRequest,
  GetNamespaceRemainingInstillCreditResponse,
} from "./types";
import { APIResource } from "../../main/resource";

export class CreditClient extends APIResource {
  async getNamespaceRemainingInstillCredit({
    namespaceId,
  }: GetNamespaceRemainingInstillCreditRequest) {
    try {
      const data =
        await this._client.get<GetNamespaceRemainingInstillCreditResponse>(
          `/namespaces/${namespaceId}/credit`,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
