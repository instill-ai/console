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
  Nullable,
  Separator,
} from "@instill-ai/design-system";

import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import {
  useListKnowledgeBaseFiles,
  useProcessKnowledgeBaseFiles,
  useUploadKnowledgeBaseFile,
} from "../../../../lib/react-query-service/knowledge";
import { KnowledgeBase } from "../../../../lib/react-query-service/knowledge/types";
import { FILE_ERROR_TIMEOUT, MAX_FILE_NAME_LENGTH } from "../lib/undoDeleteTime";
// import FilePreview from "./FilePreview";
import {
  DuplicateFileNotification,
  FileSizeNotification,
  FileTooLongNotification,
  IncorrectFormatFileNotification,
} from "../notifications";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const UploadExploreFormSchema = z.object({
  files: z.array(z.instanceof(File)),
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

  const [showFileTooLargeMessage, setShowFileTooLargeMessage] =
    React.useState(false);
  const [showUnsupportedFileMessage, setShowUnsupportedFileMessage] =
    React.useState(false);
  const [showDuplicateFileMessage, setShowDuplicateFileMessage] =
    React.useState(false);
  const [incorrectFileName, setIncorrectFileName] = React.useState<string>("");
  const [duplicateFileName, setDuplicateFileName] = React.useState<string>("");
  const [showFileTooLongMessage, setShowFileTooLongMessage] = React.useState(false);
  const [tooLongFileName, setTooLongFileName] = React.useState<string>("");
  const fileTooLargeTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);
  const unsupportedFileTypeTimeoutRef =
    React.useRef<Nullable<NodeJS.Timeout>>(null);
  const duplicateFileTimeoutRef = React.useRef<Nullable<NodeJS.Timeout>>(null);
  const uploadKnowledgeBaseFile = useUploadKnowledgeBaseFile();
  const processKnowledgeBaseFiles = useProcessKnowledgeBaseFiles();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const ownerID = me.isSuccess ? me.data.id : null;

  const { data: existingFiles } = useListKnowledgeBaseFiles({
    namespaceId: ownerID,
    knowledgeBaseId: knowledgeBase.catalogId,
    accessToken,
    enabled: Boolean(ownerID),
  });

  const getFileType = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "txt":
        return "FILE_TYPE_TEXT";
      case "md":
        return "FILE_TYPE_MARKDOWN";
      case "pdf":
        return "FILE_TYPE_PDF";
      default:
        return "FILE_TYPE_UNSPECIFIED";
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setIncorrectFileName(file.name);
      setShowFileTooLargeMessage(true);
      fileTooLargeTimeoutRef.current = setTimeout(() => {
        setShowFileTooLargeMessage(false);
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
    const isDuplicate = existingFiles?.some(
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

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const reader = new FileReader();
          return new Promise<{ fileUid: string }>((resolve, reject) => {
            reader.onload = async (event) => {
              const content = btoa(event.target?.result as string);
              try {
                const uploadedFile = await uploadKnowledgeBaseFile.mutateAsync({
                  ownerId: ownerID,
                  knowledgeBaseId: knowledgeBase.catalogId,
                  payload: {
                    name: file.name,
                    type: getFileType(file),
                    content,
                  },
                  accessToken,
                });
                resolve(uploadedFile);
              } catch (error) {
                reject(error);
              }
            };
            reader.readAsBinaryString(file);
          });
        }),
      );

      const fileUids = uploadedFiles.map((file) => file.fileUid);

      await processKnowledgeBaseFiles.mutateAsync({
        fileUids,
        accessToken,
      });

      onProcessFile();
      onTabChange("files");
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mb-32 flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-semantic-fg-primary product-headings-heading-2">
          {knowledgeBase.name}
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
                          <div className="">Support TXT, MARKDOWN, PDF</div>
                          <div className="">Max 15MB each</div>
                        </div>
                      </div>
                    </Form.Label>
                    <Input.Root className="hidden">
                      <Input.Core
                        id="upload-file-field"
                        type="file"
                        accept=".txt,.md,.pdf"
                        value={""}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
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
          <Icons.X
            className="h-4 w-4 cursor-pointer stroke-semantic-fg-secondary"
            onClick={() => handleRemoveFile(index)}
          />
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
          handleCloseFileTooLongNotificationMessage={() => setShowFileTooLongMessage(false)}
          fileName={tooLongFileName}
        />
      )}
      <div className="flex justify-end">
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
