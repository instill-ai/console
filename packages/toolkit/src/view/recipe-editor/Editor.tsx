import CodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";

import { Nullable } from "../../lib";

export const Editor = ({ recipe }: { recipe: Nullable<string> }) => {
  return (
    <div>
      <CodeMirror value={recipe ?? ""} extensions={[langs.yaml()]} />
    </div>
  );
};
