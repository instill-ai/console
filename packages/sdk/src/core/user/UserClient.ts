import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  GetAuthenticatedResponse,
  GetUserRequest,
  GetUserResponse,
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
    props: ListUsersRequest & { enablePagination: undefined },
  ): Promise<User[]>;
  async listUsers(
    props: ListUsersRequest & { enablePagination?: boolean },
  ): Promise<ListUsersResponse | User[]>;
  async listUsers(props: ListUsersRequest & { enablePagination?: boolean }) {
    const { pageSize, pageToken, enablePagination } = props;
    const users: User[] = [];
    try {
      const queryString = getQueryString({
        baseURL: "/users",
        pageSize,
        pageToken,
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
            pageToken: data.nextPageToken,
            enablePagination: false,
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
      const data = await this._client.get<GetUserResponse>(`/${userName}`);
      return Promise.resolve(data.user);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
