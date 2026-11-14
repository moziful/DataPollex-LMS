/**
 * Convert various YouTube URL formats (watch, youtu.be, embed, shorts, playlist) into an embeddable URL.
 * Preserves playlist parameters when present.
 * Falls back to returning the original URL if not recognized as YouTube.
 */
export function formatVideoEmbedUrl(url) {
  if (!url || typeof url !== 'string') return '';

  const cleanUrl = url.trim();

  // 1. YouTube video with or without playlist
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = cleanUrl.match(regExp);

  if (match && match[1]) {
    const listMatch = cleanUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    const listParam = listMatch ? `&list=${listMatch[1]}` : '';
    return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1&enablejsapi=1${listParam}`;
  }

  // 2. YouTube playlist-only URL (videoseries)
  const playlistOnlyMatch = cleanUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (playlistOnlyMatch && playlistOnlyMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistOnlyMatch[1]}&rel=0&modestbranding=1&enablejsapi=1`;
  }

  // Already an embed or other platform
  return cleanUrl;
}

/**
 * Format currency in Bangladeshi Taka (BDT) or Free
 */
export function formatPrice(price) {
  const numericPrice = Number(price);
  if (isNaN(numericPrice) || numericPrice === 0) {
    return 'FREE';
  }
  return `${numericPrice.toLocaleString()} BDT`;
}
