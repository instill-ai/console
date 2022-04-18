import { EyeOffIcon } from "@instill-ai/design-system";
import { FC } from "react";

interface Props {}

const Home: FC<Props> = () => {
  return (
    <div className="text-instillYellow">
      <h1>hi! docker</h1>
      <EyeOffIcon width="w-6" height="h-6" position="m-auto" />
    </div>
  );
};

export default Home;
