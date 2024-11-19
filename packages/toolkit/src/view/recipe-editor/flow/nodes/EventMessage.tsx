import { CodeBlock } from "../../../../components";

export const EventMessage = ({
  id,
  messageSnippet,
}: {
  id: string;
  messageSnippet: string;
}) => {
  return (
    <div className="flex flex-col gap-2 w-full py-2">
      <p className="product-body-text-1-semibold text-semantic-fg-primary">
        {id}
      </p>
      <p className=" product-body-text-3-medium text-semantic-fg-secondary">
        This is the fake message of this event.
      </p>
      <CodeBlock
        codeString={messageSnippet}
        wrapLongLines={true}
        language="bash"
        className="min-h-[288px]"
        customStyle={{
          borderRadius: "0.5rem",
          fontSize: "14px",
          backgroundColor: "white",
          width: "100%",
          maxWidth: "496px",
          padding: "48px 12px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      />
    </div>
  );
};
