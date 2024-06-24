export const NoVersionsPlaceholder = () => {
  return (
    <div className="inline-flex flex-col gap-y-4 rounded border border-semantic-bg-line bg-semantic-bg-base-bg p-6 text-semantic-fg-primary">
      <p className="text-sm font-semibold">{`You have created a model, let's try to push a version.`}</p>
      <p className="text-sm">
        Follow these guides to prepare and push a model version:
      </p>
      <ul>
        <li>
          <a
            className="text-semantic-accent-default underline"
            href="https://www.instill.tech/docs/model/create/prepare"
            rel="noopener noreferrer"
            target="_blank"
          >
            Prepare a model
          </a>
        </li>
        <li>
          <a
            className="text-semantic-accent-default underline"
            href="https://www.instill.tech/docs/model/create/build"
            rel="noopener noreferrer"
            target="_blank"
          >
            Build model image
          </a>
        </li>
        <li>
          <a
            className="text-semantic-accent-default underline"
            href="https://www.instill.tech/docs/model/create/push"
            rel="noopener noreferrer"
            target="_blank"
          >
            Push model image
          </a>
        </li>
      </ul>
      <p className="text-sm">
        Upon successful push, you can see the status under the <b>Versions</b>{" "}
        tab.
      </p>
    </div>
  );
};
