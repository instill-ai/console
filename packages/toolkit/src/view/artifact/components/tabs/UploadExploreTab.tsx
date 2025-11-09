"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateFileRequest,
  KnowledgeBase,
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
} from "@instill-ai/design-system";

import type { KnowledgeBaseTabs } from "../../types";
import {
  InstillStore,
  sendAmplitudeData,
  toastInstillError,
  useCreateNamespaceFile,
  useInstillStore,
  useListNamespaceFiles,
  useShallow,
  useUserNamespaces,
} from "../../../../lib";
import { useAmplitudeCtx } from "../../../../lib/amplitude";
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
} from "../notifications";

const UploadExploreFormSchema = z.object({
  files: z.array(z.instanceof(File)),
});

type UploadExploreFormData = z.infer<typeof UploadExploreFormSchema>;

type UploadExploreTabProps = {
  knowledgeBase: KnowledgeBase;
  onProcessFile: () => void;
  onTabChange: (tab: KnowledgeBaseTabs) => void;
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
  knowledgeBase,
  onProcessFile,
  onTabChange,
  setHasUnsavedChanges,
  remainingStorageSpace,
  updateRemainingSpace,
  subscription,
  isLocalEnvironment,
}: UploadExploreTabProps) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { uploadFile, uploadProgress, setUploadProgress } =
    useUploadWithProgress();

  const form = useForm<UploadExploreFormData>({
    resolver: zodResolver(UploadExploreFormSchema),
    defaultValues: {
      files: [],
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
  const [processingPhase, setProcessingPhase] = React.useState<
    "uploading" | "processing" | null
  >(null);
  const [processingFileIndex, setProcessingFileIndex] =
    React.useState<Nullable<number>>(null);

  const fileTooLargeTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);
  const unsupportedFileTypeTimeoutRef =
    React.useRef<Nullable<NodeJS.Timeout>>(null);
  const duplicateFileTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);
  //const insufficientStorageTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);

  const createFile = useCreateNamespaceFile();

  const { accessToken, navigationNamespaceAnchor } = useInstillStore(
    useShallow(selector),
  );

  const userNamespaces = useUserNamespaces();

  const namespaceFiles = useListNamespaceFiles({
    namespaceId: navigationNamespaceAnchor,
    knowledgeBaseId: knowledgeBase.id,
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

  const handleFileUpload = async (file: File) => {
    const validationResult = validateFile(
      file,
      planMaxFileSize,
      remainingStorageSpace,
      namespaceFiles.data || [],
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
    setIsProcessing(true);
    setProcessingPhase("uploading");
    const files = form.getValues("files");

    if (
      files.length === 0 ||
      !userNamespaces.isSuccess ||
      !navigationNamespaceAnchor
    ) {
      setIsProcessing(false);
      setProcessingPhase(null);
      return;
    }

    const processedFiles = new Set<string>();
    const uploadedFileUids: string[] = [];

    try {
      const targetNamespace = userNamespaces.data.find(
        (namespace) => namespace.id === navigationNamespaceAnchor,
      );

      if (!targetNamespace) {
        throw new Error("Selected namespace not found");
      }

      // Phase 1: Upload all files in parallel
      const uploadPromises = files.map(async (file, index) => {
        if (!isFile(file) || processedFiles.has(file.name)) {
          return null;
        }

        setProcessingFileIndex(index);

        try {
          await uploadFile(file, (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          });

          const content = await readFileAsBase64(file);

          const payload: CreateFileRequest = {
            namespaceId: navigationNamespaceAnchor ?? "",
            knowledgeBaseId: knowledgeBase.id,
            file: {
              filename: file.name,
              type: getFileType(file),
              content,
            },
          };

          const uploadedFile = await createFile.mutateAsync({
            payload,
            accessToken,
          });

          processedFiles.add(file.name);
          return uploadedFile.uid;
        } catch (error) {
          toastInstillError({
            title: `Error uploading file ${file.name}`,
            error,
          });
          return null;
        }
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);

      // Filter out failed uploads (null values)
      uploadedFileUids.push(...results.filter((uid) => uid !== null));

      // Files are automatically processed after upload
      setProcessingPhase("processing");

      form.setValue(
        "files",
        form
          .getValues("files")
          .filter((file) => isFile(file) && !processedFiles.has(file.name)),
      );
      onProcessFile();
      setHasUnsavedChanges(false);
      onTabChange("files");

      if (amplitudeIsInit) {
        sendAmplitudeData("process_knowledge_base_files", {
          page_url: window.location.href,
        });
      }
    } catch (error) {
      toastInstillError({
        title: "Error processing files",
        error,
      });
    } finally {
      setIsProcessing(false);
      setProcessingPhase(null);
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
          {knowledgeBase.id}
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
          disabled={form.watch("files").length === 0 || isProcessing}
          onClick={handleProcessFiles}
        >
          {isProcessing ? (
            <>
              <Icons.LayersTwo01 className="mr-2 h-4 w-4 animate-spin" />
              {processingPhase === "uploading"
                ? "Uploading Files..."
                : processingPhase === "processing"
                  ? "Processing Files..."
                  : "Processing..."}
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
