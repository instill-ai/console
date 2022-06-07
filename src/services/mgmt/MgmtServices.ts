import { listRepoFileContent } from "lib/github";
import { useMemo } from "react";
import { parse } from "yaml";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { SingleSelectOption } from "@instill-ai/design-system";
import {
  getUserQuery,
  updateLocalUserMutation,
  User,
} from "@/lib/instill/mgmt";
import { Nullable } from "@/types/general";

type MgmtDefinitionJson = {
  title: string;
  type: string;
  $id: string;
  $schema: string;
  additionalProperties: boolean;
  description: string;
  required: string[];
  properties: Record<string, any>;
};

export const useGetMgmtDefinition = () => {
  return useQuery(["mgmt", "encoded-definition"], async (): Promise<string> => {
    const data = await listRepoFileContent(
      "instill-ai",
      "mgmt-backend",
      "protocol/mgmt_protocol.yaml"
    );

    return data.content;
  });
};

export const useMgmtDefinition = () => {
  const { data } = useGetMgmtDefinition();

  const decodedDefinition = useMemo(() => {
    if (data) {
      const decode = window.atob(data);
      return parse(decode);
    }
  }, [data]);

  return { mgmtDefinition: decodedDefinition };
};

export const mockMgmtRoles: SingleSelectOption[] = [
  {
    label: "Manager (who make decisions)",
    value: "Manager",
  },
  {
    label:
      "AI Researcher (who devises ML algorithms, train and evaluate models)",
    value: "AI Researcher",
  },
  {
    label:
      "AI Engineer (who prepare dataset and make models delivered by AI Researchers production-ready)",
    value: "AI Engineer",
  },
  {
    label:
      "Data Engineer (who builds data pipeline for data analytics or applications)",
    value: "Data Engineer",
  },
  {
    label: "Data Scientist (who analyses data for distilling business value)",
    value: "Data Scientist",
  },
  {
    label:
      "Analytics Engineer (who possesses skills of both Data Scientist and Data Engineer)",
    value: "Analytics Engineer",
  },
  {
    label: "Hobbyist (I love Vision AI!)",
    value: "hobbyist",
  },
];

export const useUser = (userName: Nullable<string>) => {
  const queryClient = useQueryClient();
  return useQuery<User>(
    ["user", userName],
    async () => {
      if (!userName) {
        return Promise.reject(new Error("invalid user name"));
      }

      const user = await getUserQuery(userName);

      return Promise.resolve(user);
    },
    {
      enabled: !!userName,
      initialData: queryClient.getQueryData(["user", userName]),
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload: Partial<User>) => {
      const user = await updateLocalUserMutation(payload);
      return Promise.resolve(user);
    },
    {
      onSuccess: (newUser) => {
        queryClient.setQueryData<User>(["user", newUser.id], newUser);
      },
    }
  );
};
