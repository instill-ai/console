export const addVariableCodeTemplate = `variable:
  key:              # Unique identifier for the variable.
    instill-format:  # Format type, e.g., image, string, array:string.
    title:          # Title of this input field.
    description:    # Introduction of what should be input.
`;

export const addVariableCodeHint = `# Variables are inputs that can manually trigger the pipeline and be used in different parts of the pipeline

variable:
  key:              # Unique identifier for the variable.
    instill-format:  # Format type, e.g., image, string, array:string.
    title:          # Title of this input field.
    description:    # Introduction of what should be input.
`;

export const addOutputCodeTemplate = `output:
  key:      # Unique identifier for the output.
    title:  # Title of this output field.
    value:  # Can be a value or use \${} to reference data.
`;

export const addOutputCodeHint = `# Output is the result produced by components, and you can name these output titles to easily distinguish between them.

output:
  key:      # Unique identifier for the output.
    title:  # Title of this output field.
    value:  # Can be a value or use \${} to reference data.
`;
