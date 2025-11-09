export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  message,
  onRetry,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-lg bg-red-50 p-6 text-center ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="text-4xl" aria-hidden="true">
        ⚠️
      </div>
      <div>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          エラーが発生しました
        </h2>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="もう一度試す"
        >
          もう一度試す
        </button>
      )}
    </div>
  );
}
