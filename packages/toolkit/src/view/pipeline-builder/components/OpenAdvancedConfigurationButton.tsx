import { useInstillStore } from "../../../lib";

export const OpenAdvancedConfigurationButton = (
  props: { id: string } & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { id, ...passThrough } = props;

  const update = useInstillStore(
    (store) => store.updateCurrentAdvancedConfigurationNodeID
  );

  return (
    <button
      {...passThrough}
      type="button"
      className="text-semantic-accent-default underline product-body-text-4-semibold"
      onClick={() => {
        update((prev) => {
          if (prev === id) {
            return null;
          }

          return id;
        });
      }}
    >
      Advanced configuration
    </button>
  );
};
