import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Changelog {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string | null;
  title: string;
  published: boolean;
}

const fetchChangelogs = async () => {
  const response = await axios.get(
    "https://productlane.com/api/v1/changelogs/52f06d0d-2381-411e-a8c5-7b375e3a0114"
  );
  return response.data;
};

export const useChangelogs = () => {
  return useQuery({
    queryKey: ["changelogs"],
    queryFn: async () => {
      const data = await fetchChangelogs();
      const filteredAndSortedChangelogs = data
        .filter((changelog: Changelog) => changelog.published)
        .sort(
          (a: Changelog, b: Changelog) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return filteredAndSortedChangelogs.slice(0, 3);
    },
    retry: 3,
  });
};
