import { getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  CreateNamespaceTableRequest,
  CreateNamespaceTableResponse,
  CreateNamespaceTableRowRequest,
  CreateNamespaceTableRowResponse,
  DeleteNamespaceTableRequest,
  DeleteNamespaceTableRowRequest,
  GetNamespaceTableColumnDefinitionsRequest,
  GetNamespaceTableColumnDefinitionsResponse,
  GetNamespaceTableRequest,
  GetNamespaceTableResponse,
  ListNamespaceTableRowsRequest,
  ListNamespaceTableRowsResponse,
  ListNamespaceTablesRequest,
  ListNamespaceTablesResponse,
  ListPaginatedNamespaceTableRowsRequest,
  ListPaginatedNamespaceTableRowsResponse,
  ListPaginatedNamespaceTablesRequest,
  ListPaginatedNamespaceTablesResponse,
  MoveNamespaceTableRowRequest,
  Row,
  Table,
  UpdateNamespaceTableColumnDefinitionsRequest,
  UpdateNamespaceTableColumnDefinitionsResponse,
  UpdateNamespaceTableRequest,
  UpdateNamespaceTableResponse,
  UpdateNamespaceTableRowRequest,
  UpdateNamespaceTableRowResponse,
} from "./types";

export class TableClient extends APIResource {
  async createNamespaceTable(props: CreateNamespaceTableRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const data = await this._client.post<CreateNamespaceTableResponse>(
        `/namespaces/${namespaceId}/tables`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getNamespaceTable(props: GetNamespaceTableRequest) {
    const { namespaceId, tableUId } = props;

    try {
      const data = await this._client.get<GetNamespaceTableResponse>(
        `/namespaces/${namespaceId}/tables/${tableUId}`,
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPaginatedNamespaceTables(
    props: ListPaginatedNamespaceTablesRequest,
  ) {
    const { namespaceId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/tables`,
      pageToken,
      pageSize,
    });

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceTablesResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceTables(props: ListNamespaceTablesRequest) {
    const { namespaceId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/tables`,
      pageToken,
      pageSize,
    });

    const tables: Table[] = [];

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceTablesResponse>(
          queryString,
        );

      tables.push(...data.tables);

      if (data.nextPageToken) {
        tables.push(
          ...(
            await this.listNamespaceTables({
              namespaceId,
              pageSize,
              pageToken: data.nextPageToken,
            })
          ).tables,
        );
      }

      const response: ListNamespaceTablesResponse = {
        tables,
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespaceTable(props: UpdateNamespaceTableRequest) {
    const { namespaceId, tableUId, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateNamespaceTableResponse>(
        `/namespaces/${namespaceId}/tables/${tableUId}`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespaceTable(props: DeleteNamespaceTableRequest) {
    const { namespaceId, tableUId } = props;

    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/tables/${tableUId}`,
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getNamespaceTableColumnDefinitions(
    props: GetNamespaceTableColumnDefinitionsRequest,
  ) {
    const { namespaceId, tableUId } = props;

    try {
      const data =
        await this._client.get<GetNamespaceTableColumnDefinitionsResponse>(
          `/namespaces/${namespaceId}/tables/${tableUId}/column-definitions`,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespaceTableColumnDefinitions(
    props: UpdateNamespaceTableColumnDefinitionsRequest,
  ) {
    const { namespaceId, tableUId, columnDefinitions } = props;

    try {
      const data =
        await this._client.put<UpdateNamespaceTableColumnDefinitionsResponse>(
          `/namespaces/${namespaceId}/tables/${tableUId}/column-definitions`,
          {
            body: JSON.stringify(columnDefinitions),
          },
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPaginatedNamespaceTableRows(
    props: ListPaginatedNamespaceTableRowsRequest,
  ) {
    const {
      namespaceId,
      tableUId,
      pageToken,
      pageSize,
      filter,
      sort,
      datetime,
    } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/tables/${tableUId}/rows`,
      pageToken,
      pageSize,
      filter,
      sort,
      datetime,
    });

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceTableRowsResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceTableRows(props: ListNamespaceTableRowsRequest) {
    const {
      namespaceId,
      tableUId,
      pageToken,
      pageSize,
      filter,
      sort,
      datetime,
    } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/tables/${tableUId}/rows`,
      pageToken,
      pageSize,
      filter,
      sort,
      datetime,
    });

    const rows: Row[] = [];

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceTableRowsResponse>(
          queryString,
        );

      rows.push(...data.rows);

      if (data.nextPageToken) {
        rows.push(
          ...(
            await this.listNamespaceTableRows({
              namespaceId,
              tableUId,
              pageSize,
              pageToken: data.nextPageToken,
              filter,
              sort,
              datetime,
            })
          ).rows,
        );
      }

      const response: ListNamespaceTableRowsResponse = {
        rows,
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createNamespaceTableRow(props: CreateNamespaceTableRowRequest) {
    const { namespaceId, tableUId, row } = props;

    try {
      const data = await this._client.post<CreateNamespaceTableRowResponse>(
        `/namespaces/${namespaceId}/tables/${tableUId}/rows`,
        {
          body: JSON.stringify({ row }),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespaceTableRow(props: UpdateNamespaceTableRowRequest) {
    const { namespaceId, tableUId, rowUId, row } = props;

    try {
      const data = await this._client.patch<UpdateNamespaceTableRowResponse>(
        `/namespaces/${namespaceId}/tables/${tableUId}/rows/${rowUId}`,
        {
          body: JSON.stringify({ row }),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespaceTableRow(props: DeleteNamespaceTableRowRequest) {
    const { namespaceId, tableUId, rowUId } = props;

    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/tables/${tableUId}/rows/${rowUId}`,
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async moveNamespaceTableRow(props: MoveNamespaceTableRowRequest) {
    const { namespaceId, tableUId, rowUids, afterRowUId } = props;

    try {
      await this._client.post(
        `/namespaces/${namespaceId}/tables/${tableUId}/rows:move`,
        {
          body: JSON.stringify({ rowUids, afterRowUId }),
        },
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
