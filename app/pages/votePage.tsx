import React, { useState } from 'react';

export default function VotePage() {
    const [linkCopied, setLinkCopied] = useState(false);

    const handleCopyLink = () => {
        const linkToCopy = "https://example.com/vote"; // Replace with your actual link
        navigator.clipboard.writeText(linkToCopy)
            .then(() => {
                setLinkCopied(true);
                // Hide the message after a few seconds
                setTimeout(() => {
                    setLinkCopied(false);
                }, 2000); // Message will disappear after 2 seconds
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <div>
            {/* ... existing code ... */}

            <button onClick={handleCopyLink} className="copy-link-button">
                Copy Link
            </button>

            {linkCopied && (
                <div className="link-copied-message">
                    Link copied!
                </div>
            )}

            {/* ... existing code ... */}
        </div>
    );
} 