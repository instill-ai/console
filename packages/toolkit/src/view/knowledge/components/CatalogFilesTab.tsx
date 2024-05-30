import { Button, Icons, Separator, Tag, Textarea } from "@instill-ai/design-system";
import * as React from "react";
import { TextArea } from "../../../lib/use-instill-form/components/smart-hint/TextArea";

export const CatalogFilesTab = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                    Catalog
                </p>
                <div className="space-x-4">
                    <Button variant="secondaryGrey" size="lg">
                        Publish
                    </Button>
                    <Button variant="secondaryGrey" size="lg">
                        Update Knowledge Base
                    </Button>
                    <Button variant="primary" size="lg">
                        Export Data
                    </Button>
                </div>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <div className="w-full flex flex-col gap-2">
                <div className="flex justify-start">
                    <div className="px-3 py-2 bg-semantic-bg-primary rounded border border-semantic-bg-line flex items-center gap-2">
                        <Icons.Plus className="w-4 h-4 stroke-semantic-fg-secondary" />
                        <div className="text-semantic-fg-primary product-body-text-3-semibold">add file</div>
                    </div>
                </div>
                <div className="bg-semantic-bg-primary  rounded border border-semantic-bg-line flex">
                    <div className="flex-grow flex">
                        <div className="flex-grow flex flex-col">
                            <div className="p-3 bg-semantic-bg-base-bg border-b border-semantic-bg-line flex items-center gap-3 h-12">
                                <div className="flex items-center gap-1">
                                    <div className=" text-semantic-fg-primary product-body-text-3-medium">File name</div>
                                </div>
                            </div>
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">file-a.pdf</div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">file-b.txt</div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">file-c.jpg</div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">file-d.png</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="p-3 bg-semantic-bg-base-bg border-b border-semantic-bg-line flex items-center gap-3 h-12">
                                <div className="flex items-center gap-1">
                                    <div className="text-semantic-fg-primary product-body-text-3-medium">File type</div>
                                </div>
                            </div>
                            <div className="px-3 flex items-center h-16">
                                <Tag size="sm" variant={"lightNeutral"}>pdf</Tag>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <Tag size="sm" variant={"lightNeutral"}>txt</Tag>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <Tag size="sm" variant={"lightNeutral"}>jpg</Tag>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <Tag size="sm" variant={"lightNeutral"}>png</Tag>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="p-3 bg-semantic-bg-base-bg border-b border-semantic-bg-line flex items-center gap-3 h-12">
                                <div className="flex items-center gap-1">
                                    <div className="text-semantic-fg-primary product-body-text-3-medium">Processed status</div>
                                </div>
                            </div>
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">
                                    <span>28,8k Words,</span><br />
                                    <span>3 images</span>
                                </div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">21.5k Words</div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">1 Image</div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">2 Images</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="p-3 bg-semantic-bg-base-bg border-b border-semantic-bg-line flex items-center gap-3 h-12">
                                <div className="flex items-center gap-1">
                                    <div className="text-semantic-fg-primary product-body-text-3-medium">Create time</div>
                                </div>
                            </div>
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">Today 4:31pm</div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">Today 4:31pm</div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">Today 4:31pm</div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div className="px-3 flex items-center h-16">
                                <div className="text-semantic-bg-secondary-alt-primary product-body-text-3-regular">Today 4:31pm</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[375px] border-l border-semantic-bg-line flex flex-col gap-6 pb-8">
                        <div className="pl-3 py-2 bg-semantic-bg-base-bg rounded-tr border-l border-b border-semantic-bg-line flex justify-start">
                            <div className=" product-body-text-1-semibold text-semantic-fg-primary">Preview</div>
                        </div>
                        <div className="px-8 flex flex-col gap-3">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col">
                                    <div className="w-[311px] pb-2.5 flex items-center">
                                        <div className="flex items-start gap-1">
                                            <div className=" product-body-text-3-semibold ">File name</div>
                                        </div>
                                    </div>
                                    <Textarea
                                        // {...field}
                                        // id={field.name}
                                        placeholder="Preview"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end items-start gap-3">
                                <Button variant="tertiaryDanger" size="lg" className="capitalize">
                                    delete
                                </Button>
                                <Button variant="secondaryGrey" size="lg" className="capitalize">
                                    download
                                    <Icons.DownloadCloud01 className="w-4 h-4 stroke-semantic-fg-primary ml-2" />

                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};