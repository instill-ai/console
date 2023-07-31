import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { useDeleteApiToken, type Nullable } from "@instill-ai/toolkit";

export type DeleteResourceModalProps = {
  tokenNameToDelete: string;
  onSuccess: () => void;
};

export const DeleteResourceModal = (
  props: DeleteResourceModalProps
) => {
  const { tokenNameToDelete, onSuccess } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);

  const deleteApiToken = useDeleteApiToken();
  const handleDeleteApiToken = () => {
    // if (!accessToken.isSuccess) return;
    setIsLoading(true);
    deleteApiToken.mutate(
      {
        tokenName: tokenNameToDelete,
        accessToken: null,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          onSuccess();
        },
        onError: () => {
          setError("Something went wrong, please try again later.");
        },
      }
    );
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto mb-6 flex h-12 w-12 rounded-full bg-[#F0F5FF]">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="m-auto"
        >
          <path
            d="M15 9H15.01M15 15C18.3137 15 21 12.3137 21 9C21 5.68629 18.3137 3 15 3C11.6863 3 9 5.68629 9 9C9 9.27368 9.01832 9.54308 9.05381 9.80704C9.11218 10.2412 9.14136 10.4583 9.12172 10.5956C9.10125 10.7387 9.0752 10.8157 9.00469 10.9419C8.937 11.063 8.81771 11.1823 8.57913 11.4209L3.46863 16.5314C3.29568 16.7043 3.2092 16.7908 3.14736 16.8917C3.09253 16.9812 3.05213 17.0787 3.02763 17.1808C3 17.2959 3 17.4182 3 17.6627V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H6.33726C6.58185 21 6.70414 21 6.81923 20.9724C6.92127 20.9479 7.01881 20.9075 7.10828 20.8526C7.2092 20.7908 7.29568 20.7043 7.46863 20.5314L12.5791 15.4209C12.8177 15.1823 12.937 15.063 13.0581 14.9953C13.1843 14.9248 13.2613 14.8987 13.4044 14.8783C13.5417 14.8586 13.7588 14.8878 14.193 14.9462C14.4569 14.9817 14.7263 15 15 15Z"
            stroke="#316FED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="mb-6 flex flex-col">
        <h2 className="mb-1 text-center font-sans text-2xl font-bold leading-9 -tracking-[1%] text-[#1D2433]">
          Delete API token
        </h2>
        <p className="mb-6 text-center font-sans text-base font-normal leading-6 text-[#1D2433] text-opacity-80">
          Are you sure you want to delete this API token?
        </p>
        <p className="mb-6 text-center font-sans text-base font-semibold leading-6 text-[#1D2433] ">
          {tokenNameToDelete?.split("/")[1]}
        </p>
        {error ? (
          <p className="text-center font-sans text-base font-normal leading-6 text-[#E02E3D]">
            {error}
          </p>
        ) : null}
      </div>
      <div className="flex flex-row gap-x-2">
        <Dialog.Close asChild>
          <button className="stroke flex-1 rounded border border-[#E1E6EF] px-4 py-3 hover:border-[#23272F] hover:bg-[#F1F3F9]">
            <span className="font-sans text-base font-semibold tracking-[2%] text-[#1D2433]">
              Cancel
            </span>
          </button>
        </Dialog.Close>
        <button
          onClick={handleDeleteApiToken}
          className="flex-1 rounded bg-[#E02E3D] px-4 py-3 hover:bg-[#BB2532]"
        >
          <span className="flex font-sans text-base font-semibold tracking-[2%] text-white">
            {isLoading ? (
              <svg
                className="m-auto h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <p className="m-auto">Delete Token</p>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
