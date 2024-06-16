import { Icons, Separator, Tabs, Button, Select, Input, Textarea, Form, Collapsible, ScrollArea } from "@instill-ai/design-system";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { useUploadKnowledgeBaseFile } from "../../../lib/react-query-service/knowledge";
import { InstillStore, useAuthenticatedUser, useInstillStore, useShallow } from "../../../lib";

const MetadataFormSchema = z.object({
    file: z.instanceof(File),
    convertTransformFiles: z.string().min(1, { message: "Convert/Transform files is required" }),
    convertMethod: z.string().min(1, { message: "Convert method is required" }),
    splitTextFiles: z.string().min(1, { message: "Split text files is required" }),
    splitMethod: z.string().min(1, { message: "Split method is required" }),
    maxTokenSize: z.number().min(1, { message: "Max token size is required" }),
    tokenizerModel: z.string().min(1, { message: "Tokenizer model is required" }),
    embedChunksFiles: z.string().min(1, { message: "Embed chunks files is required" }),
    embeddingModel: z.string().min(1, { message: "Embedding model is required" }),
});

type MetadataFormData = z.infer<typeof MetadataFormSchema>;

const MetadataPreview = () => {
    const form = useForm<MetadataFormData>({
        resolver: zodResolver(MetadataFormSchema),
        defaultValues: {
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
    const onSubmit: SubmitHandler<MetadataFormData> = async (data) => {
        console.log(data);
    };



    return (
        <div className="flex w-full items-center justify-start  ">
            <ScrollArea.Root className="flex flex-col w-1/2">
                <div className="product-body-text-1-semibold bg-semantic-bg-base-bg py-2 pl-3 rounded mb-8">Preview</div>
                <div className="flex flex-col gap-3 px-8">
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-px flex-grow bg-semantic-bg-line" />
                        <div className="product-body-text-3-medium whitespace-nowrap">Convert Results</div>
                        <div className="h-px flex-grow bg-semantic-bg-line" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="product-button-button-2 pb-2.5">File name 1</h3>
                        <Textarea placeholder="Text preview" rows={3} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="product-button-button-2 pb-2.5">File name 1</h3>
                        <Textarea placeholder="Text preview" rows={3} />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-px flex-grow bg-semantic-bg-line" />
                        <div className="product-body-text-3-medium whitespace-nowrap">Split Text Results</div>
                        <div className="h-px flex-grow bg-semantic-bg-line" />
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col">
                            <h3 className="product-button-button-2 pb-2.5">File name 1</h3>
                            <Textarea placeholder="Text preview" rows={3} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="product-button-button-2 pb-2.5">File name 2</h3>
                            <Textarea placeholder="Text preview" rows={3} />
                        </div>
                    </div>
                </div>
            </ScrollArea.Root>
        </div>
    );
};

export default MetadataPreview;
