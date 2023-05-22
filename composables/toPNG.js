import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';

export default async function(el, scale = 1) {
  // From an open issue on the library
  // Solves issues with -webkit-background-clip
  const { serializeToString } = XMLSerializer.prototype;
  const clearTextBackgroundClip = (element) => {
    if (element.style?.webkitBackgroundClip === "text") {
      element.style.setProperty("-webkit-background-clip", "unset");
      element.style.setProperty("--background-clip-replace", "text");
    }
    element.childNodes.forEach((child) => {
      clearTextBackgroundClip(child);
    });
  };
  XMLSerializer.prototype.serializeToString = function (node) {
    clearTextBackgroundClip(node);
    return serializeToString
      .call(this, node)
      .replaceAll("--background-clip-replace", "-webkit-background-clip")
  };

  let urlForImage = await htmlToImage.toPng(el, { pixelRatio: scale })
                            .then(function (dataUrl) {
                              return dataUrl;
                            })
                            .catch(function (error) {
                              console.error('oops, something went wrong!', error);
                            });

  return urlForImage;
}