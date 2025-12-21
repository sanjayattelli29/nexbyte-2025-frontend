import { useState } from "react";

interface ReadMoreProps {
  text: string;
  maxLength?: number;
  className?: string; // Classes for the wrapper paragraph
}

const ReadMore = ({ text, maxLength = 200, className = "" }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safely handle potentially undefined or non-string text
  const safeText = text || "";

  if (safeText.length <= maxLength) {
    return <p className={className}>{safeText}</p>;
  }

  return (
    <p className={className}>
      {isExpanded ? safeText : `${safeText.slice(0, maxLength)}...`}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering parent clicks if any
          setIsExpanded(!isExpanded);
        }}
        className="ml-2 text-primary hover:underline font-medium text-sm inline-block cursor-pointer border-none bg-transparent p-0"
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Show Less" : "Read More"}
      </button>
    </p>
  );
};

export default ReadMore;
