/**
 * Utility functions for sharing TODOs via URL
 */

/**
 * Encode a TODO object to a URL-safe string
 */
export function encodeTodo(todo) {
  try {
    // Create a minimal version of the todo to keep URL short
    const minimal = {
      t: todo.title,
      d: todo.description || '',
      p: todo.priority,
      c: todo.categories || [],
    };

    const json = JSON.stringify(minimal);
    const encoded = btoa(encodeURIComponent(json));
    return encoded;
  } catch (error) {
    console.error('Error encoding todo:', error);
    return null;
  }
}

/**
 * Decode a URL-safe string back to a TODO object
 */
export function decodeTodo(encoded) {
  try {
    const json = decodeURIComponent(atob(encoded));
    const minimal = JSON.parse(json);

    // Reconstruct full todo with new ID and timestamp
    return {
      id: Date.now().toString(),
      title: minimal.t,
      description: minimal.d,
      priority: minimal.p,
      categories: minimal.c,
      completed: false,
      createdAt: Date.now(),
      reminder: null,
    };
  } catch (error) {
    console.error('Error decoding todo:', error);
    return null;
  }
}

/**
 * Generate a shareable URL for a TODO
 */
export function generateShareUrl(todo) {
  const encoded = encodeTodo(todo);
  if (!encoded) return null;

  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?share=${encoded}`;
}

/**
 * Parse URL parameters to extract shared TODO
 */
export function getSharedTodoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const shareParam = params.get('share');

  if (!shareParam) return null;

  return decodeTodo(shareParam);
}

/**
 * Remove share parameter from URL (clean up after import)
 */
export function clearShareParamFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('share');
  window.history.replaceState({}, '', url.toString());
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}

/**
 * Share via Web Share API (if available)
 */
export async function shareViaWebShare(todo) {
  const url = generateShareUrl(todo);
  if (!url) return false;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Attività: ${todo.title}`,
        text: todo.description || 'Condivido questa attività con te',
        url: url,
      });
      return true;
    } catch (error) {
      // User cancelled or error occurred
      console.error('Share failed:', error);
      return false;
    }
  }

  return false;
}
