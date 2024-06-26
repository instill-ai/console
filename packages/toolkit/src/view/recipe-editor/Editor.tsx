import { langs } from "@uiw/codemirror-extensions-langs";
import CodeMirror from "@uiw/react-codemirror";

import { Nullable } from "../../lib";

export const Editor = ({ recipe }: { recipe: Nullable<string> }) => {
  return (
    <div className="w-full h-full">
      <CodeMirror value={recipe ?? ""} extensions={[langs.yaml()]} />
    </div>
  );
};
