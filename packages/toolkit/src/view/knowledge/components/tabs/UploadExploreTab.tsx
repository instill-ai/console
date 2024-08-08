"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Form,
  Icons,
  Input,
  Separator,
  Nullable
} from "@instill-ai/design-system";

import { InstillStore, useAuthenticatedUserSubscription, useInstillStore, useShallow } from "../../../../lib";
import {
  useListKnowledgeBaseFiles,
  useProcessKnowledgeBaseFiles,
  useUploadKnowledgeBaseFile,
} from "../../../../lib/react-query-service/knowledge";
import { KnowledgeBase } from "../../../../lib/react-query-service/knowledge/types";
import {
  FILE_ERROR_TIMEOUT,
  MAX_FILE_NAME_LENGTH,
} from "../lib/static";
import {
  DuplicateFileNotification,
  FileSizeNotification,
  FileTooLongNotification,
  IncorrectFormatFileNotification,
  InsufficientStorageBanner,
  InsufficientStorageNotification,
} from "../notifications";
import { getFileType, getPlanMaxFileSize, getPlanStorageLimit } from "../lib/functions";
import Link from "next/link";

// Type guard for File object
const isFile = (value: unknown): value is File => {
  return typeof window !== "undefined" && value instanceof File;
};

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
  knowledgeBase: KnowledgeBase;
  onProcessFile: () => void;
  onTabChange: (tab: string) => void;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  selectedNamespace: store.navigationNamespaceAnchor,
});

export const UploadExploreTab = ({
  knowledgeBase,
  onProcessFile,
  onTabChange,
}: UploadExploreTabProps) => {
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

  const [showFileTooLargeMessage, setShowFileTooLargeMessage] = React.useState(false);
  const [showUnsupportedFileMessage, setShowUnsupportedFileMessage] = React.useState(false);
  const [showDuplicateFileMessage, setShowDuplicateFileMessage] = React.useState(false);
  const [showFileTooLongMessage, setShowFileTooLongMessage] = React.useState(false);
  const [showInsufficientStorageMessage, setShowInsufficientStorageMessage] = React.useState(false);
  const [incorrectFileName, setIncorrectFileName] = React.useState<string>("");
  const [duplicateFileName, setDuplicateFileName] = React.useState<string>("");
  const [tooLongFileName, setTooLongFileName] = React.useState<string>("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [processingProgress, setProcessingProgress] = React.useState(0);
  const [processingFileIndex, setProcessingFileIndex] = React.useState<Nullable<number>>(null);

  const fileTooLargeTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);
  const unsupportedFileTypeTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);
  const duplicateFileTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);
  const insufficientStorageTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);

  const uploadKnowledgeBaseFile = useUploadKnowledgeBaseFile();
  const processKnowledgeBaseFiles = useProcessKnowledgeBaseFiles();
  const { accessToken, selectedNamespace, enabledQuery } = useInstillStore(
    useShallow(selector),
  );
  const sub = useAuthenticatedUserSubscription({
    enabled: enabledQuery,
    accessToken,
  });

  const { data: existingFiles } = useListKnowledgeBaseFiles({
    namespaceId: selectedNamespace,
    knowledgeBaseId: knowledgeBase.catalogId,
    accessToken,
    enabled: Boolean(selectedNamespace),
  });

  const planMaxFileSize = getPlanMaxFileSize(sub.data?.plan || "PLAN_FREEMIUM");
  const planStorageLimit = getPlanStorageLimit(sub.data?.plan || "PLAN_FREEMIUM");

  // Mock data for used storage space NEED TO BE REPLACED WITH ACTUAL API CALL WHEN AVAILABLE
  const usedStorageSpace = 10 * 1024 * 1024; // 10MB for example
  const remainingStorageSpace = planStorageLimit - usedStorageSpace;
  const [showStorageWarning, setshowStorageWarning] = React.useState((remainingStorageSpace / planStorageLimit) * 100 <= 5);
  // const [showStorageWarning, setshowStorageWarning] = React.useState(true);

  const handleFileUpload = async (file: File) => {
    if (file.size > planMaxFileSize) {
      setIncorrectFileName(file.name);
      setShowFileTooLargeMessage(true);
      fileTooLargeTimeoutRef.current = setTimeout(() => {
        setShowFileTooLargeMessage(false);
      }, FILE_ERROR_TIMEOUT);
      return;
    }

    if (file.size > remainingStorageSpace) {
      setIncorrectFileName(file.name);
      setShowInsufficientStorageMessage(true);
      insufficientStorageTimeoutRef.current = setTimeout(() => {
        setShowInsufficientStorageMessage(false);
      }, FILE_ERROR_TIMEOUT);
      return;
    }

    const fileType = getFileType(file);
    if (fileType === "FILE_TYPE_UNSPECIFIED") {
      setIncorrectFileName(file.name);
      setShowUnsupportedFileMessage(true);
      unsupportedFileTypeTimeoutRef.current = setTimeout(() => {
        setShowUnsupportedFileMessage(false);
      }, FILE_ERROR_TIMEOUT);
      return;
    }

    if (file.name.length > MAX_FILE_NAME_LENGTH) {
      setTooLongFileName(file.name);
      setShowFileTooLongMessage(true);
      return;
    }

    const currentFiles = form.getValues("files");

    const isDuplicate = existingFiles?.files?.some(
      (existingFile) => existingFile.name === file.name,
    );

    if (isDuplicate) {
      setDuplicateFileName(file.name);
      setShowDuplicateFileMessage(true);
      duplicateFileTimeoutRef.current = setTimeout(() => {
        setShowDuplicateFileMessage(false);
      }, FILE_ERROR_TIMEOUT);
      return;
    }

    form.setValue("files", [...currentFiles, file]);
  };

  const handleRemoveFile = (index: number) => {
    const currentFiles = form.getValues("files");
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("files", updatedFiles);
  };

  const handleProcessFiles = async () => {
    setIsProcessing(true);
    const files = form.getValues("files");
    if (files.length === 0) {
      setIsProcessing(false);
      return;
    }

    const processedFiles = new Set<string>();

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!isFile(file) || processedFiles.has(file.name)) continue;

        setProcessingFileIndex(i);
        setProcessingProgress(((i + 1) / files.length) * 100);

        const reader = new FileReader();
        const content = await new Promise<string>((resolve) => {
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(btoa(event.target.result as string));
            } else {
              resolve("");
            }
          };
          reader.readAsBinaryString(file);
        });

        try {
          const uploadedFile = await uploadKnowledgeBaseFile.mutateAsync({
            ownerId: selectedNamespace,
            knowledgeBaseId: knowledgeBase.catalogId,
            payload: {
              name: file.name,
              type: getFileType(file),
              content,
            },
            accessToken,
          });

          await processKnowledgeBaseFiles.mutateAsync({
            fileUids: [uploadedFile.fileUid],
            accessToken,
          });

          processedFiles.add(file.name);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error processing file ${file.name}:`, error.message);
            // If the file already exists, we'll just skip it. May need to handle other errors in the future
            if (error as Error) {
              console.log(`File ${file.name} already exists, skipping.`);
              processedFiles.add(file.name);
            } else {
              throw error;
            }
          } else {
            console.error(
              `Unexpected error processing file ${file.name}:`,
              error,
            );
            throw error;
          }
        }
      }

      form.setValue(
        "files",
        form
          .getValues("files")
          .filter((file) => isFile(file) && !processedFiles.has(file.name)),
      );

      setProcessingProgress(100);
      onProcessFile();
      onTabChange("files");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error processing files:", error.message);
      } else {
        console.error("Unexpected error processing files:", error);
      }
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
      setProcessingFileIndex(null);
    }
  };

  return (
    <div className="mb-32 flex flex-col">
      {showStorageWarning && (
        <InsufficientStorageBanner
          selectedNamespace={selectedNamespace}
          setshowStorageWarning={setshowStorageWarning}
        />
      )}
      <div className="flex flex-col items-start justify-start gap-1 mb-2">
        <p className="text-semantic-fg-primary product-headings-heading-3">
          {knowledgeBase.name}
        </p>
        <p className="product-body-text-3-regular flex flex-col gap-1">
          <span className="text-semantic-fg-secondary">Remaining storage space: {(remainingStorageSpace / (1024 * 1024)).toFixed(2)} MB</span>
          <Link href={`/${selectedNamespace}/subscribe`} className="hover:underline text-semantic-accent-default cursor-pointer product-body-text-4-regular">Upgrade your plan for more storage space</Link>
        </p>
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
                  <div
                    className={`flex w-full cursor-pointer flex-col items-center justify-center rounded bg-semantic-accent-bg text-semantic-fg-secondary product-body-text-4-regular ${isDragging
                      ? "border-semantic-accent-default"
                      : "border-semantic-bg-line"
                      } [border-dash-gap:6px] [border-dash:6px] [border-style:dashed] [border-width:2px]`}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsDragging(false);
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const files = Array.from(e.dataTransfer.files);
                      for (const file of files) {
                        await handleFileUpload(file);
                      }
                    }}
                  >
                    <Form.Label
                      htmlFor="upload-file-field"
                      className="flex cursor-pointer flex-col items-center justify-center"
                    >
                      <div className="flex flex-col items-center justify-center text-semantic-fg-primary product-body-text-4-regular pb-2">
                        <Icons.Upload01 className="mb-4 mt-10 h-8 w-8 stroke-semantic-fg-secondary" />
                        <div className="w-full text-center">
                          <span>Drag-and-drop file, or </span>
                          <label
                            htmlFor="upload-file-field"
                            className="cursor-pointer text-semantic-accent-default"
                          >
                            browse computer
                          </label>
                          <div className="">Support TXT, MARKDOWN, PDF, DOCX, DOC, PPTX, PPT, HTML</div>
                          <div className="">Max {planMaxFileSize / (1024 * 1024)}MB each</div>
                        </div>
                      </div>
                    </Form.Label>
                    <Input.Root className="hidden">
                      <Input.Core
                        id="upload-file-field"
                        type="file"
                        accept=".txt,.md,.pdf,.docx,.doc,.pptx,.ppt,.html"
                        multiple
                        value={""}
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          for (const file of files) {
                            await handleFileUpload(file);
                          }
                        }}
                      />
                    </Input.Root>
                  </div>
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
            <Icons.LayersTwo01 className="h-4 w-4 animate-spin stroke-semantic-fg-secondary" />
          ) : (
            <Icons.X
              className={`h-4 w-4 ${isProcessing ? "cursor-not-allowed opacity-50" : "cursor-pointer"} stroke-semantic-fg-secondary`}
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
      {showInsufficientStorageMessage && (
        <InsufficientStorageNotification
          handleCloseInsufficientStorageMessage={() =>
            setShowInsufficientStorageMessage(false)
          }
          fileName={incorrectFileName}
        />
      )}
      <div className="flex flex-col items-end">
        {isProcessing && (
          <div className="mb-4 w-full">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-full bg-semantic-accent-default rounded-full"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            <p className="text-right mt-1 text-sm text-gray-600">
              Processing: {Math.round(processingProgress)}%
            </p>
          </div>
        )}
        <Button
          variant="primary"
          size="lg"
          disabled={form.watch("files").length === 0 || isProcessing}
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