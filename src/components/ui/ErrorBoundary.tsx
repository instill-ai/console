import { Nullable } from "@instill-ai/toolkit";
import { Component, ErrorInfo, ReactNode } from "react";

type ErrorBoundaryProps = {
  children?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Nullable<Error>;
  errorInfo: Nullable<ErrorInfo>;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error) {
    // This lifecycle is invoked after an error has been thrown by a descendant component.
    // It receives the error that was thrown as a parameter and should return a value to update state.
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
