import { Button, Icons, Separator } from "@instill-ai/design-system";
import * as React from "react";

export const CatalogFilesTab = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                    Catalog
                </p>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <div className="w-full flex flex-col gap-2">
                <div className="flex justify-start">
                    <div className="px-3 py-2 bg-white rounded border border-semantic-bg-line flex items-center gap-2">
                        <Icons.Plus className="w-4 h-4 stroke-semantic-fg-secondary" />
                        <div className="text-gray-800 product-body-text-3-semibold">add file</div>
                    </div>
                </div>
                <div className="bg-white rounded border border-semantic-bg-line flex">
                    <div className="flex-grow flex">
                        <div className="flex-grow flex flex-col">
                            <div className="p-3 bg-slate-50 border-b border-semantic-bg-line flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-zinc-700 tproduct-body-text-3-medium">File name</div>
                                </div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">file-a.pdf</div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">file-b.txt</div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">file-c.jpg</div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">file-d.png</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="p-3 bg-slate-50 border-b border-semantic-bg-line flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-zinc-700 product-body-text-3-medium ">File type</div>
                                </div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="px-2 py-0.5 bg-slate-100 rounded-[100px] flex items-center gap-1">
                                    <div className="text-gray-800/80 product-body-text-3-medium">pdf</div>
                                </div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="px-2 py-0.5 bg-slate-100 rounded-[100px] flex items-center gap-1">
                                    <div className="text-gray-800/80 product-body-text-3-medium">txt</div>
                                </div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="px-2 py-0.5 bg-slate-100 rounded-[100px] flex items-center gap-1">
                                    <div className="text-gray-800/80 product-body-text-3-medium">jpg</div>
                                </div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="px-2 py-0.5 bg-slate-100 rounded-[100px] flex items-center gap-1">
                                    <div className="text-gray-800/80 product-body-text-3-medium">png</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="p-3 bg-slate-50 border-b border-semantic-bg-line flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-zinc-700 tproduct-body-text-3-medium">Processed status</div>
                                </div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">28,8k Words, <br />3 images</div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">21.5k Words</div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">1 Image</div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">2 Images</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="p-3 bg-slate-50 border-b border-semantic-bg-line flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-zinc-700 tproduct-body-text-3-medium">Create time</div>
                                </div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">Today 4:31pm</div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">Today 4:31pm</div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular">Today 4:31pm</div>
                            </div>
                            <div className="px-3 py-4 border-b border-semantic-bg-line flex items-center">
                                <div className="text-zinc-700 product-body-text-3-regular ">Today 4:31pm</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-[375px] border-l border-semantic-bg-line flex flex-col gap-6 pb-8">
                        <div className="pl-3 py-2 bg-slate-50 rounded-tr border-l border-b border-semantic-bg-line flex justify-start">
                            <div className="text-gray-800 product-body-text-1-semibold">Preview</div>
                        </div>
                        <div className="px-8 flex flex-col gap-3">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col">
                                    <div className="w-[311px] pb-2.5 flex items-center">
                                        <div className="flex items-start gap-1">
                                            <div className="text-gray-800 product-body-text-3-semibold">File name</div>
                                        </div>
                                    </div>
                                    <div className="flex-grow px-2 py-2 bg-white rounded-lg border border-semantic-bg-line flex">
                                        <div className="flex-grow flex items-start">
                                            <div className="flex-grow text-gray-800/80  product-body-text-4-regular">Preview</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end items-start gap-3">
                                <Button variant="tertiaryDanger" size="lg">
                                    delete
                                </Button>
                                <Button variant="secondaryGrey" size="lg">
                                    download
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};