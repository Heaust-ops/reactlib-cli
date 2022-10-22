/**
 * Converts an image to a specific mimetype
 *
 * @param image An image blob or url
 * @param mimetype the mimetype you want to convert the image to
 * @returns Promise to a blob of the converted image
 */
export const convertImageToMimetype = (
  image: Blob | string,
  mimetype: string = "image/png"
): Promise<Blob> => {
  const imageUrl =
    typeof image === "string" ? image : URL.createObjectURL(image);
  const imgElement = new Image();
  imgElement.src = imageUrl;
  imgElement.onerror = () => {
    console.error(
      `Image format isn't supported while converting to ${mimetype}`
    );
  };

  return new Promise((resolve, _) => {
    imgElement.onload = function (this: void) {
      const canvas = document.createElement("canvas");
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error(
          `Can't get Canvas Context while converting to ${mimetype}`
        );
        URL.revokeObjectURL(imageUrl);
        return;
      }
      ctx.drawImage(imgElement, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          console.error(
            `blob conversion failed while converting to ${mimetype}`
          );
        }
      }, mimetype);
      imgElement.remove();
      URL.revokeObjectURL(imageUrl);
    };
  });
};
