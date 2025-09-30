// ErrorMessage Component
// ErrorMessage = Error + Retry

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center max-w-md">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">發生錯誤</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            重試
          </button>
        )}
      </div>
    </div>
  );
}