import { getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  CreateNamespaceTableRequest,
  CreateNamespaceTableResponse,
  CreateNamespaceTableRowRequest,
  CreateNamespaceTableRowResponse,
  DeleteNamespaceTableRequest,
  DeleteNamespaceTableRowRequest,
  ExportNamespaceTableRequest,
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
    const { namespaceId, tableUid } = props;

    try {
      const data = await this._client.get<GetNamespaceTableResponse>(
        `/namespaces/${namespaceId}/tables/${tableUid}`,
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
    const { namespaceId, tableUid, ...payload } = props;

    try {
      const data = await this._client.patch<UpdateNamespaceTableResponse>(
        `/namespaces/${namespaceId}/tables/${tableUid}`,
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
    const { namespaceId, tableUid } = props;

    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/tables/${tableUid}`,
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getNamespaceTableColumnDefinitions(
    props: GetNamespaceTableColumnDefinitionsRequest,
  ) {
    const { namespaceId, tableUid } = props;

    try {
      const data =
        await this._client.get<GetNamespaceTableColumnDefinitionsResponse>(
          `/namespaces/${namespaceId}/tables/${tableUid}/column-definitions`,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespaceTableColumnDefinitions(
    props: UpdateNamespaceTableColumnDefinitionsRequest,
  ) {
    const { namespaceId, tableUid, columnDefinitions } = props;

    try {
      const data =
        await this._client.put<UpdateNamespaceTableColumnDefinitionsResponse>(
          `/namespaces/${namespaceId}/tables/${tableUid}/column-definitions`,
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
      tableUid,
      pageToken,
      pageSize,
      filter,
      sort,
      datetime,
    } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/tables/${tableUid}/rows`,
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
      tableUid,
      pageToken,
      pageSize,
      filter,
      sort,
      datetime,
    } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/tables/${tableUid}/rows`,
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
              tableUid,
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
    const { namespaceId, tableUid, ...rest } = props;

    try {
      const data = await this._client.post<CreateNamespaceTableRowResponse>(
        `/namespaces/${namespaceId}/tables/${tableUid}/rows`,
        {
          body: JSON.stringify(rest),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespaceTableRow(props: UpdateNamespaceTableRowRequest) {
    const { namespaceId, tableUid, rowUid, row } = props;

    try {
      const data = await this._client.patch<UpdateNamespaceTableRowResponse>(
        `/namespaces/${namespaceId}/tables/${tableUid}/rows/${rowUid}`,
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
    const { namespaceId, tableUid, rowUid } = props;

    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/tables/${tableUid}/rows/${rowUid}`,
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async moveNamespaceTableRow(props: MoveNamespaceTableRowRequest) {
    const { namespaceId, tableUid, rowUids, beforeRowUid } = props;

    try {
      await this._client.post(
        `/namespaces/${namespaceId}/tables/${tableUid}/move-rows`,
        {
          body: JSON.stringify({ rowUids, beforeRowUid }),
        },
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async exportNamespaceTable(props: ExportNamespaceTableRequest) {
    const { namespaceId, tableUid, format } = props;

    try {
      const data = await this._client.post<Response>(
        `/namespaces/${namespaceId}/tables/${tableUid}/export`,
        {
          body: JSON.stringify({ format }),
          isBlob: true,
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
