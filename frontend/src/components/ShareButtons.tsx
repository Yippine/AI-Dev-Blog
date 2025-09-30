// ShareButtons Component Formula:
// ShareButtons = CopyLinkButton + (future: SocialShareButtons)
// CopyLinkButton = onClick -> navigator.clipboard.writeText(url) -> feedback

import React, { useState } from 'react';

interface ShareButtonsProps {
  articleId: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ articleId, title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/articles/${articleId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleCopyLink}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          copied
            ? 'bg-green-100 text-green-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {copied ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Copied!</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span className="font-semibold">Share</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ShareButtons;