import CostModelRender from "./render";
import { Metadata } from "next";
import { generateNextMetaBase } from "@instill-ai/toolkit/server";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Instill Core | Model Cost Dashboard",
        metadataBase: generateNextMetaBase({
            defaultBase: "http://localhost:3000",
        }),
        openGraph: {
            images: ["/instill-open-graph.png"],
        },
    };
}

export default function CostModelPage() {
    return <CostModelRender />;
}