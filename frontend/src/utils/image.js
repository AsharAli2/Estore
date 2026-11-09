// Ask Cloudinary for a resized, auto-format/auto-quality version of an image.
// Non-Cloudinary URLs are returned unchanged.
export const optimizeImage = (url, width = 400) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (/\/upload\/[^/]*(f_auto|q_auto|w_\d+)/.test(url)) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
};
