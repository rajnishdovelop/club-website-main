/**
 * Parses text with embedded links and returns React elements
 * 
 * USAGE FORMAT: [link text](url)
 * 
 * Examples:
 * - "Check out [our website](https://example.com) for more info"
 * - "Read the [research paper](https://doi.org/xxx) and [documentation](https://docs.example.com)"
 * 
 * @param {string} text - The text containing links in [text](url) format
 * @param {string} className - Additional classes for the text wrapper
 * @returns {JSX.Element[]} Array of text and link elements
 */

// Validate URL to prevent XSS attacks (only allow http/https)
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function parseLinks(text) {
  if (!text) return null;
  
  // Regex to match [link text](url) pattern
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;
  let keyIndex = 0;
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${keyIndex++}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }
    
    // Add the link (only if URL is valid)
    const linkText = match[1];
    const linkUrl = match[2];
    
    if (isValidUrl(linkUrl)) {
      parts.push(
        <a
          key={`link-${keyIndex++}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-sky-400/50 hover:decoration-sky-300 transition-colors"
        >
          {linkText}
        </a>
      );
    } else {
      // Invalid URL - render as plain text
      parts.push(
        <span key={`text-${keyIndex++}`}>
          {linkText}
        </span>
      );
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text after last link
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${keyIndex++}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }
  
  // If no links found, return the original text
  if (parts.length === 0) {
    return text;
  }
  
  return parts;
}

export default parseLinks;
