// UploadExploreTab.tsx
import { Separator } from "@instill-ai/design-system";
import * as React from "react";

export const UploadExploreTab = () => {
    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                    Upload & Explore
                </p>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <div className="w-[1160px] h-[150px] relative bg-blue-50 rounded border border-slate-300">
                <div className="w-8 h-8 left-[564px] top-[40.17px] absolute" />
                <div className="w-[1024px] left-[68px] top-[91px] absolute text-center">
                    <span className="text-gray-800 text-xs font-normal font-['IBM Plex Sans'] leading-none">
                        Drag-and-drop file, or{" "}
                    </span>
                    <span className="text-blue-600 text-xs font-normal font-['IBM Plex Sans'] leading-none">
                        browse computer
                    </span>
                </div>
                <div className="left-[537px] top-[125.83px] absolute text-center text-gray-800 text-xs font-normal font-['IBM Plex Sans'] leading-none">
                    Max 15MB each
                </div>
                <div className="w-[1078px] h-[16.38px] left-[41px] top-[108.23px] absolute text-center text-gray-800 text-xs font-normal font-['IBM Plex Sans'] leading-none">
                    Support TXT, MARKDOWN, PDF, PNG, JPG (DOCX, DOC, PPTX, PPT, HTML, XML, RTF).
                    <br />
                    <br />
                </div>
            </div>
        </div>
    );
};