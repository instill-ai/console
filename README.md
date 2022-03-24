Visual Data Preparation (VDP) console

# Structure

This repo leverage yarn workspace to enable monorepo. Local web UI is built with Next.js lie in app folder.

```
.
├── app (nextjs, i18n, ssr, e2e playwright)
└── packages (placeholder - will add instill related function in the future)
```

### Folder overview

<details>
<summary>Detailed folder structure</summary>
.
├── app (nextjs, i18n, ssr, e2e playwright)
│   ├── src (main folders)
│   │   ├── components (unit components folder, will be replaced with instill-ai/design-system in the future)
│   │   └── pages (web Ui pages)
│   └── public (local app UI related assets)
└── packages (placeholder - will add instill related function in the future)
</details>
