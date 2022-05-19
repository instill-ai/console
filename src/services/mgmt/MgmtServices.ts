import { listRepoFileContent } from "lib/github";
import { useMemo } from "react";
import { parse } from "yaml";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { SingleSelectOption } from "@instill-ai/design-system";
import { getUserQuery, updateUserMutation, User } from "@/lib/instill/mgmt";

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

export const useUser = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery<User>(
    ["user", id],
    async () => {
      if (!id) {
        return Promise.reject(new Error("invalid user id"));
      }

      const rawUser = await getUserQuery(id);

      const user: User = {
        id: rawUser.id,
        email: rawUser.email,
        companyName: rawUser.company_name,
        role: rawUser.role,
        usageDataCollection: rawUser.usage_data_collection,
        newsletterSubscription: rawUser.newsletter_subscription,
        type: rawUser.type,
        createTime: rawUser.create_time,
        updateTime: rawUser.update_time,
      };

      return Promise.resolve(user);
    },
    {
      enabled: id ? true : false,
      initialData: queryClient.getQueryData(["user", id]),
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: Partial<User>) => {
      const rawUser = await updateUserMutation(data);
      const user: User = {
        id: rawUser.id,
        email: rawUser.email,
        companyName: rawUser.company_name,
        role: rawUser.role,
        usageDataCollection: rawUser.usage_data_collection,
        newsletterSubscription: rawUser.newsletter_subscription,
        type: rawUser.type,
        createTime: rawUser.create_time,
        updateTime: rawUser.update_time,
      };
      return Promise.resolve(user);
    },
    {
      onSuccess: (newUser) => {
        queryClient.setQueryData<User>(["user", newUser.id], newUser);
      },
    }
  );
};
