export const CatalogTabsDictionary = {
    catalogs: "My Catalogs",
    upload: "Upload Documents",
    files: "Files",
    chunks: "Chunks",
    api: "API",
    retrieve: "Retrieve Chunk",
    ask_question: "Ask Question",
    get_catalog: "Get Catalog",
};

export type CatalogTabNames = keyof typeof CatalogTabsDictionary;

export const getCatalogTabTitle = (
    tabName: CatalogTabNames = "catalogs",
) => {
    return CatalogTabsDictionary[tabName] || CatalogTabsDictionary.catalogs;
};
