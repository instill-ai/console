export const OpenAdvancedConfigurationButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      {...props}
      type="button"
      className="text-semantic-accent-default !underline product-body-text-4-semibold hover:text-semantic-accent-hover"
    >
      More
    </button>
  );
};
