export function generateNextMetaBase({ defaultBase }: { defaultBase: string }) {
  return new URL(process.env.NEXT_PUBLIC_CONSOLE_BASE_URL ?? defaultBase);
}
