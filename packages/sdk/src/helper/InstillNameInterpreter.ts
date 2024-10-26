const generalGetter = (name: string) => {
  const frag = name.split("/");

  if (!frag[1] || !frag[3]) {
    throw new Error("Invalid name");
  }

  return {
    namespaceId: frag[1],
    resourceId: frag[3],
  };
};

export const InstillNameInterpreter = {
  model: generalGetter,
  pipeline: generalGetter,
  artifact: generalGetter,
};
