import {
  Icons,
  Separator,
  Button,
  Input,
  Form,
} from "@instill-ai/design-system";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { useUploadKnowledgeBaseFile } from "../../../lib/react-query-service/knowledge";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../../lib";
// import FilePreview from "./FilePreview";
import IncorrectFormatFileNotification from "./Notifications/IncorrectFormatFileNotification";
import FileSizeNotification from "./Notifications/FileSizeNotification";
import { FILE_ERROR_TIMEOUT } from "./undoDeleteTime";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

const UploadExploreFormSchema = z.object({
  file: z.instanceof(File).nullable(),
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
};

export const UploadExploreTab = ({ knowledgeBase }: UploadExploreTabProps) => {
  const form = useForm<UploadExploreFormData>({
    resolver: zodResolver(UploadExploreFormSchema),
    defaultValues: {
      file: null,
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

  const selector = (store: InstillStore) => ({
    accessToken: store.accessToken,
    enabledQuery: store.enabledQuery,
  });

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const uploadKnowledgeBaseFile = useUploadKnowledgeBaseFile();

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

  const [showFileTooLargeMessage, setShowFileTooLargeMessage] =
    React.useState(false);
  const [showUnsupportedFileMessage, setShowUnsupportedFileMessage] =
    React.useState(false);
  const [lastValidFile, setLastValidFile] = React.useState<File | null>(null);
  const [incorrectFileName, setIncorrectFileName] = React.useState<string>("");
  const fileTooLargeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const unsupportedFileTypeTimeoutRef = React.useRef<NodeJS.Timeout | null>(
    null
  );

  const handleFileUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setIncorrectFileName(file.name);
      setShowFileTooLargeMessage(true);
      fileTooLargeTimeoutRef.current = setTimeout(() => {
        setShowFileTooLargeMessage(false);
        if (lastValidFile) {
          form.setValue("file", lastValidFile);
        }
      }, FILE_ERROR_TIMEOUT);
      return;
    }

    const fileType = getFileType(file);
    if (fileType === "FILE_TYPE_UNSPECIFIED") {
      setIncorrectFileName(file.name);
      setShowUnsupportedFileMessage(true);
      unsupportedFileTypeTimeoutRef.current = setTimeout(() => {
        setShowUnsupportedFileMessage(false);
        if (lastValidFile) {
          form.setValue("file", lastValidFile);
        }
      }, FILE_ERROR_TIMEOUT);
      return;
    }

    setLastValidFile(file);
    form.setValue("file", file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = btoa(event.target?.result as string);

      uploadKnowledgeBaseFile.mutate(
        {
          ownerId: ownerID,
          knowledgeBaseId: knowledgeBase.id,
          payload: {
            name: file.name,
            type: fileType,
            content,
          },
          accessToken,
        },
        {
          onSuccess: () => {
            console.log("File uploaded successfully!");
          },
          onError: (error) => {
            console.error("Error uploading file:", error);
          },
        }
      );
    };
    reader.readAsBinaryString(file);
  };

  const handleCloseFileTooLargeMessage = () => {
    setShowFileTooLargeMessage(false);
    if (lastValidFile) {
      form.setValue("file", lastValidFile);
    }
  };

  const handleCloseUnsupportedFileMessage = () => {
    setShowUnsupportedFileMessage(false);
    if (lastValidFile) {
      form.setValue("file", lastValidFile);
    }
  };

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const ownerID = me.isSuccess ? me.data.id : null;

  const [isDragging, setIsDragging] = React.useState(false);

  const handleRemoveFile = () => {
    form.setValue("file", null);
    setLastValidFile(null);
  };

  return (
    <div className="mb-32 flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
          {knowledgeBase.name}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <Form.Root {...form}>
        <form className="mb-2 space-y-4">
          <Form.Field
            control={form.control}
            name="file"
            render={({ field }) => (
              <Form.Item className="w-full">
                <Form.Control>
                  <div
                    className={`flex h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded border border-dashed ${
                      isDragging
                        ? "border-semantic-accent-default"
                        : "border-semantic-bg-line"
                    } bg-semantic-bg-base-bg text-semantic-fg-secondary product-body-text-4-regular`}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        -setIsDragging(false);
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        await handleFileUpload(file);
                      }
                    }}
                  >
                    <Form.Label
                      htmlFor="upload-file-field"
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Icons.Upload01 className="mb-4 h-8 w-8 stroke-semantic-fg-secondary p-1" />
                        <div className="w-full text-center">
                          <span>Drag-and-drop file, or </span>
                          <label
                            htmlFor="upload-file-field"
                            className="cursor-pointer text-semantic-accent-hover underline"
                          >
                            browse computer
                          </label>
                          <div>Support TXT, MARKDOWN, PDF</div>
                          <div>Max 15MB each</div>
                        </div>
                      </div>
                    </Form.Label>
                    <Input.Root className="hidden">
                      <Input.Core
                        {...field}
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
      {form.watch("file") || lastValidFile ? (
        <div className="mb-6 flex h-8 w-full items-center justify-between rounded border border-semantic-bg-line px-2 py-1.5">
          <div className="flex items-center gap-2">
            <Icons.File05 className="h-5 w-5 stroke-semantic-fg-secondary" />
            <div className="product-body-text-3-regular">
              {form.watch("file")?.name || lastValidFile?.name}
            </div>
            <div className="flex-grow text-semantic-fg-disabled product-body-text-4-regular">
              {Math.round(
                (form.watch("file")?.size || lastValidFile?.size || 0) / 1024
              )}
              KB
            </div>
          </div>
          <Icons.X
            className="h-4 w-4 cursor-pointer stroke-semantic-fg-secondary"
            onClick={handleRemoveFile}
          />
        </div>
      ) : null}
      {showFileTooLargeMessage ? (
        <FileSizeNotification
          handleCloseFileTooLargeMessage={handleCloseFileTooLargeMessage}
          fileName={incorrectFileName}
        />
      ) : null}
      {showUnsupportedFileMessage ? (
        <IncorrectFormatFileNotification
          handleCloseUnsupportedFileMessage={handleCloseUnsupportedFileMessage}
          fileName={incorrectFileName}
        />
      ) : null}
      {/* <div className="inline-flex flex-col items-start justify-start gap-1 ">
                <div className="text-semantic-fg-primary product-body-text-3-semibold">
                    Pipeline in use
                </div>
                <div className="inline-flex items-center justify-start gap-1">
                    <Icons.Pipeline className="w-4 h-4 stroke-semantic-accent-hover" />
                    <button
                        type="button"
                        className="hover:!underline text-semantic-accent-hover product-body-text-3-semibold"
                        onClick={() => {
                            router.push(`/${ownerID}`);
                        }}
                    >
                        xiaofei/name-your-pet
                    </button>
                </div>
            </div> */}
      {/* <FilePreview /> */}
      <div className="flex justify-end">
        <Button variant="primary" size="lg" disabled={!form.watch("file")}>
          Process File
        </Button>
      </div>
    </div>
  );
};
