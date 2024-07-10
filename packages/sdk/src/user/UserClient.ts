import { APIResource } from "../core/resource";
import { getQueryString } from "../helper";
import {
  GetAuthenticatedResponse,
  GetUserRequest,
  ListUsersRequest,
  ListUsersResponse,
  UpdateAuthenticatedUserRequest,
  UpdateAuthenticatedUserResponse,
  User,
} from "./types";

export class UserClient extends APIResource {
  async getAuthenticatedUser() {
    try {
      const data = await this._client.get<GetAuthenticatedResponse>("/user");
      return Promise.resolve(data.user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateAuthenticatedUser(props: UpdateAuthenticatedUserRequest) {
    try {
      const data = await this._client.patch<UpdateAuthenticatedUserResponse>(
        "/user",
        {
          body: JSON.stringify(props),
        },
      );

      return Promise.resolve(data.user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listUsers(
    props: ListUsersRequest & { enablePagination: true },
  ): Promise<ListUsersResponse>;
  async listUsers(
    props: ListUsersRequest & { enablePagination: false },
  ): Promise<User[]>;
  async listUsers(
    props: ListUsersRequest & { enablePagination: boolean },
  ): Promise<ListUsersResponse | User[]>;
  async listUsers(props: ListUsersRequest & { enablePagination: boolean }) {
    const { pageSize, nextPageToken, enablePagination } = props;
    const users: User[] = [];
    try {
      const queryString = getQueryString({
        baseURL: "/users",
        pageSize,
        nextPageToken,
      });

      const data = await this._client.get<ListUsersResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      users.push(...data.users);

      if (data.nextPageToken) {
        users.push(
          ...(await this.listUsers({
            pageSize,
            nextPageToken: data.nextPageToken,
            enablePagination,
          })),
        );
      }

      return Promise.resolve(users);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getUser({ userName }: GetUserRequest) {
    try {
      const data = this._client.get<User>(`/${userName}`);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
