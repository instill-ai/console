"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Catalog,
  CreateNamespaceCatalogFileRequest,
  OrganizationSubscription,
  UserSubscription,
} from "instill-sdk";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  cn,
  Form,
  Icons,
  Nullable,
  Separator,
  toast,
} from "@instill-ai/design-system";

import {
  InstillStore,
  onTriggerInvalidateCredits,
  sendAmplitudeData,
  toastInstillError,
  useCreateNamespaceCatalogFile,
  useGetNamespaceRemainingInstillCredit,
  useInstillStore,
  useListNamespaceCatalogFiles,
  useProcessCatalogFiles,
  useQueryClient,
  useShallow,
  useUserNamespaces,
} from "../../../../lib";
import { useAmplitudeCtx } from "../../../../lib/amplitude";
import { env } from "../../../../server";
import { DragAndDropUpload } from "../DragAndDropUpload";
import { FILE_ERROR_TIMEOUT } from "../lib/constant";
import {
  getFileType,
  getPlanMaxFileSize,
  //getPlanStorageLimit,
  isFile,
  readFileAsBase64,
  //shouldShowStorageWarning,
  validateFile,
} from "../lib/helpers";
import { useUploadWithProgress } from "../lib/uploadFileWithProgress";
import {
  DuplicateFileNotification,
  FileSizeNotification,
  FileTooLongNotification,
  IncorrectFormatFileNotification,
  //InsufficientStorageBanner,
  //InsufficientStorageNotification,
  //UpgradePlanLink,
} from "../notifications";

const UploadExploreFormSchema = z.object({
  files: z.array(
    z.unknown().refine((value): value is File => isFile(value), {
      message: "Invalid file type",
    }),
  ),
  convertTransformFiles: z
    .string()
    .min(1, { message: "Convert/Transform files is required" }),
  convertMethod: z.string().min(1, { message: "Convert method is required" }),
  splitTextFiles: z
    .string()
    .min(1, { message: "Split text files is required" }),
  splitMethod: z.string().min(1, { message: "Split method is required" }),
  maxTokenSize: z.number().min(1, { message: "Max token size is required" }),
  tokenizerModel: z.string().min(1, { message: "Tokenizer model is required" }),
  embedChunksFiles: z
    .string()
    .min(1, { message: "Embed chunks files is required" }),
  embeddingModel: z.string().min(1, { message: "Embedding model is required" }),
});

type UploadExploreFormData = z.infer<typeof UploadExploreFormSchema>;

type UploadExploreTabProps = {
  catalog: Catalog;
  onProcessFile: () => void;
  onTabChange: (tab: string) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  remainingStorageSpace: number;
  updateRemainingSpace: (fileSize: number, isAdding: boolean) => void;
  subscription: Nullable<UserSubscription | OrganizationSubscription>;
  namespaceType: Nullable<"user" | "organization">;
  isLocalEnvironment: boolean;
  selectedNamespace: Nullable<string>;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
});

export const UploadExploreTab = ({
  catalog,
  onProcessFile,
  onTabChange,
  setHasUnsavedChanges,
  remainingStorageSpace,
  updateRemainingSpace,
  subscription,
  //namespaceType,
  isLocalEnvironment,
  //selectedNamespace,
}: UploadExploreTabProps) => {
  const queryClient = useQueryClient();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { uploadFile, uploadProgress, setUploadProgress } =
    useUploadWithProgress();

  const form = useForm<UploadExploreFormData>({
    resolver: zodResolver(UploadExploreFormSchema),
    defaultValues: {
      files: [],
      convertTransformFiles: "",
      convertMethod: "",
      splitTextFiles: "",
      splitMethod: "",
      maxTokenSize: 256,
      tokenizerModel: "",
      embedChunksFiles: "",
      embeddingModel: "",
    },
  });

  const [showFileTooLargeMessage, setShowFileTooLargeMessage] =
    React.useState(false);
  const [showUnsupportedFileMessage, setShowUnsupportedFileMessage] =
    React.useState(false);
  const [showDuplicateFileMessage, setShowDuplicateFileMessage] =
    React.useState(false);
  const [showFileTooLongMessage, setShowFileTooLongMessage] =
    React.useState(false);
  // const [showInsufficientStorageMessage, setShowInsufficientStorageMessage] =
  //   React.useState(false);
  const [incorrectFileName, setIncorrectFileName] = React.useState<string>("");
  const [duplicateFileName, setDuplicateFileName] = React.useState<string>("");
  const [tooLongFileName, setTooLongFileName] = React.useState<string>("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingFileIndex, setProcessingFileIndex] =
    React.useState<Nullable<number>>(null);

  const fileTooLargeTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);
  const unsupportedFileTypeTimeoutRef =
    React.useRef<Nullable<NodeJS.Timeout>>(null);
  const duplicateFileTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);
  //const insufficientStorageTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);

  const createNamespaceCatalogFile = useCreateNamespaceCatalogFile();
  const processCatalogFiles = useProcessCatalogFiles();

  const { accessToken, navigationNamespaceAnchor, enabledQuery } =
    useInstillStore(useShallow(selector));

  const userNamespaces = useUserNamespaces();

  const namespaceCatalogFiles = useListNamespaceCatalogFiles({
    namespaceId: navigationNamespaceAnchor,
    catalogId: catalog.catalogId,
    accessToken,
    enabled: Boolean(navigationNamespaceAnchor),
  });

  const plan = subscription?.plan || "PLAN_FREE";
  const planMaxFileSize = getPlanMaxFileSize(plan);
  //const planStorageLimit = getPlanStorageLimit(plan);
  //const isEnterprisePlan = subscription?.plan === "PLAN_ENTERPRISE";

  // const [showStorageWarning, setShowStorageWarning] = React.useState(
  //   shouldShowStorageWarning(remainingStorageSpace, planStorageLimit),
  // );

  const remainingCredit = useGetNamespaceRemainingInstillCredit({
    namespaceId: navigationNamespaceAnchor,
    accessToken,
    enabled:
      enabledQuery &&
      Boolean(navigationNamespaceAnchor) &&
      env("NEXT_PUBLIC_APP_ENV") === "CLOUD",
  });

  const handleFileUpload = async (file: File) => {
    const validationResult = validateFile(
      file,
      planMaxFileSize,
      remainingStorageSpace,
      namespaceCatalogFiles.data || [],
      isLocalEnvironment,
    );

    if (
      !validationResult.isValid &&
      validationResult.error !== "INSUFFICIENT_STORAGE"
    ) {
      switch (validationResult.error) {
        case "FILE_TOO_LARGE":
          setIncorrectFileName(file.name);
          setShowFileTooLargeMessage(true);
          fileTooLargeTimeoutRef.current = setTimeout(() => {
            setShowFileTooLargeMessage(false);
          }, FILE_ERROR_TIMEOUT);
          break;
        // case "INSUFFICIENT_STORAGE":
        //   setIncorrectFileName(file.name);
        //   setShowInsufficientStorageMessage(true);
        //   insufficientStorageTimeoutRef.current = setTimeout(() => {
        //     setShowInsufficientStorageMessage(false);
        //   }, FILE_ERROR_TIMEOUT);
        //   break;
        case "UNSUPPORTED_FILE_TYPE":
          setIncorrectFileName(file.name);
          setShowUnsupportedFileMessage(true);
          unsupportedFileTypeTimeoutRef.current = setTimeout(() => {
            setShowUnsupportedFileMessage(false);
          }, FILE_ERROR_TIMEOUT);
          break;
        case "FILE_NAME_TOO_LONG":
          setTooLongFileName(file.name);
          setShowFileTooLongMessage(true);
          break;
        case "DUPLICATE_FILE":
          setDuplicateFileName(file.name);
          setShowDuplicateFileMessage(true);
          duplicateFileTimeoutRef.current = setTimeout(() => {
            setShowDuplicateFileMessage(false);
          }, FILE_ERROR_TIMEOUT);
          break;
      }
      return;
    }

    const currentFiles = form.getValues("files");
    form.setValue("files", [...currentFiles, file]);
    setHasUnsavedChanges(true);
    updateRemainingSpace(file.size, true);
  };

  const handleRemoveFile = (index: number) => {
    const currentFiles = form.getValues("files");
    const removedFile = currentFiles[index] as File;
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("files", updatedFiles);
    updateRemainingSpace(removedFile.size, false);
    setHasUnsavedChanges(updatedFiles.length > 0);
  };

  const handleProcessFiles = async () => {
    if (
      !isLocalEnvironment &&
      remainingCredit.data &&
      remainingCredit.data.total < 10
    ) {
      toastInstillError({
        title: "Insufficient Credit Balance",
        error:
          "Your credit balance is too low to use this service. Please consider upgrading your plan to continue.",
        toast,
      });
      return;
    }

    setIsProcessing(true);
    const files = form.getValues("files");

    if (
      files.length === 0 ||
      !userNamespaces.isSuccess ||
      !navigationNamespaceAnchor
    ) {
      setIsProcessing(false);
      return;
    }

    const processedFiles = new Set<string>();

    try {
      const targetNamespace = userNamespaces.data.find(
        (namespace) => namespace.id === navigationNamespaceAnchor,
      );

      if (!targetNamespace) {
        throw new Error("Selected namespace not found");
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!isFile(file) || processedFiles.has(file.name)) continue;

        setProcessingFileIndex(i);

        try {
          await uploadFile(file, (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          });

          const content = await readFileAsBase64(file);

          const payload: CreateNamespaceCatalogFileRequest = {
            namespaceId: navigationNamespaceAnchor ?? null,
            catalogId: catalog.catalogId,
            name: file.name,
            type: getFileType(file),
            content,
          };

          const uploadedFile = await createNamespaceCatalogFile.mutateAsync({
            payload,
            accessToken,
          });

          await processCatalogFiles.mutateAsync({
            fileUids: [uploadedFile.fileUid],
            accessToken,
            requesterUid: targetNamespace.uid,
          });

          processedFiles.add(file.name);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          toastInstillError({
            title: `Error processing file ${file.name}`,
            error,
            toast,
          });
        }
      }

      form.setValue(
        "files",
        form
          .getValues("files")
          .filter((file) => isFile(file) && !processedFiles.has(file.name)),
      );
      onTriggerInvalidateCredits({
        namespaceId: targetNamespace?.id ?? null,
        namespaceIds: userNamespaces.data.map((namespace) => namespace.id),
        queryClient,
      });
      onProcessFile();
      setHasUnsavedChanges(false);
      onTabChange("files");

      if (amplitudeIsInit) {
        sendAmplitudeData("process_catalog_files", {
          page_url: window.location.href,
        });
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toastInstillError({
        title: "Error processing files",
        error,
        toast,
      });
    } finally {
      setIsProcessing(false);
      setProcessingFileIndex(null);
    }
  };

  // React.useEffect(() => {
  //   setShowStorageWarning(
  //     shouldShowStorageWarning(remainingStorageSpace, planStorageLimit),
  //   );
  // }, [remainingStorageSpace, planStorageLimit]);

  return (
    <div className="mb-32 flex flex-col">
      {/* {!isLocalEnvironment && showStorageWarning && !isEnterprisePlan ? (
        <InsufficientStorageBanner
          setshowStorageWarning={setShowStorageWarning}
          plan={subscription?.plan || "PLAN_FREE"}
          namespaceType={namespaceType}
          selectedNamespace={selectedNamespace}
        />
      ) : null} */}
      <div className="flex flex-col items-start justify-start gap-1 mb-2">
        <p className="text-semantic-fg-primary product-headings-heading-3">
          {catalog.name}
        </p>
        {/* <p className="product-body-text-3-regular flex flex-col gap-1">
          {!isLocalEnvironment && !isEnterprisePlan ? (
            <span className="text-semantic-fg-secondary">
              Remaining storage space:{" "}
              {(remainingStorageSpace / (1024 * 1024)).toFixed(2)} MB
            </span>
          ) : null}
          {!isLocalEnvironment && !isEnterprisePlan ? (
            <UpgradePlanLink
              plan={subscription?.plan || "PLAN_FREE"}
              namespaceType={namespaceType}
              selectedNamespace={selectedNamespace}
            />
          ) : null}
        </p> */}
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <Form.Root {...form}>
        <form className="mb-2 space-y-4">
          <Form.Field
            control={form.control}
            name="files"
            render={() => (
              <Form.Item className="w-full">
                <Form.Control>
                  <DragAndDropUpload
                    onFileUpload={handleFileUpload}
                    planMaxFileSize={planMaxFileSize}
                    isLocalEnvironment={isLocalEnvironment}
                  />
                </Form.Control>
                <Form.Message />
              </Form.Item>
            )}
          />
        </form>
      </Form.Root>
      {form.watch("files").map((file, index) => (
        <div
          key={index}
          className="mb-6 flex h-8 w-full items-center justify-between rounded border border-semantic-bg-line px-2 py-1.5"
        >
          <div className="flex items-center gap-2">
            <Icons.File05 className="h-5 w-5 stroke-semantic-fg-secondary" />
            <div className="product-body-text-3-regular truncate">
              {file.name}
            </div>
            <div className="flex-grow text-semantic-fg-disabled product-body-text-4-regular">
              {Math.round(file.size / 1024)} KB
            </div>
          </div>
          {isProcessing && processingFileIndex === index ? (
            <div className="w-24 h-2 bg-semantic-bg-base-bg rounded-full">
              <div
                className="h-full bg-semantic-accent-default rounded-full"
                style={{ width: `${uploadProgress?.[file.name] ?? 0}%` }}
              ></div>
            </div>
          ) : (
            <Icons.X
              className={cn("h-4 w-4 stroke-semantic-fg-secondary", {
                "cursor-not-allowed opacity-50": isProcessing,
                "cursor-pointer": !isProcessing,
              })}
              onClick={() => !isProcessing && handleRemoveFile(index)}
            />
          )}
        </div>
      ))}
      {showFileTooLargeMessage && (
        <FileSizeNotification
          handleCloseFileTooLargeMessage={() =>
            setShowFileTooLargeMessage(false)
          }
          fileName={incorrectFileName}
          planMaxFileSize={planMaxFileSize}
        />
      )}
      {showUnsupportedFileMessage && (
        <IncorrectFormatFileNotification
          handleCloseUnsupportedFileMessage={() =>
            setShowUnsupportedFileMessage(false)
          }
          fileName={incorrectFileName}
        />
      )}
      {showDuplicateFileMessage && (
        <DuplicateFileNotification
          deletedFileName={duplicateFileName}
          setShowDeleteMessage={setShowDuplicateFileMessage}
        />
      )}
      {showFileTooLongMessage && (
        <FileTooLongNotification
          handleCloseFileTooLongNotificationMessage={() =>
            setShowFileTooLongMessage(false)
          }
          fileName={tooLongFileName}
        />
      )}
      {/* {showInsufficientStorageMessage && (
        <InsufficientStorageNotification
          handleCloseInsufficientStorageMessage={() =>
            setShowInsufficientStorageMessage(false)
          }
          fileName={incorrectFileName}
          availableSpace={planStorageLimit}
        />
      )} */}
      <div className="flex flex-col items-end">
        <Button
          variant="primary"
          size="lg"
          disabled={
            form.watch("files").length === 0 ||
            isProcessing ||
            remainingCredit.isLoading
          }
          onClick={handleProcessFiles}
        >
          {isProcessing ? (
            <>
              <Icons.LayersTwo01 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Files"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UploadExploreTab;
