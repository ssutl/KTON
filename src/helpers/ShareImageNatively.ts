import { toJpeg } from "html-to-image";

const dataURLtoFile = (dataurl: any, filename: any) => {
  // Split the data URL to get the MIME type and decoded data
  var arr = dataurl.split(","),
    mimeType = arr[0].match(/:(.*?);/)[1],
    decodedData = atob(arr[1]),
    lengthOfDecodedData = decodedData.length,
    u8array = new Uint8Array(lengthOfDecodedData);

  // Convert the decoded data to Uint8Array
  while (lengthOfDecodedData--) {
    u8array[lengthOfDecodedData] = decodedData.charCodeAt(lengthOfDecodedData);
  }

  return new File([u8array], filename, { type: mimeType });
};

const shareFile = (file: any, title: any, text: any) => {
  // Check if the browser supports sharing files
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    // Share the file using the Web Share API
    navigator
      .share({
        files: [file],
        title,
        text,
      })
      .then(() => {})
      .catch((error) => {
        //Throw error
        throw new Error(error);
      });
  } else {
    alert(
      `Your system doesn't support sharing files, you can follow this link to enable it: https://winaero.com/chrome-to-get-web-share-api-support-on-desktop/`
    );
  }
};

const ShareImageNatively = (title: string) => {
  // Convert the HTML element with ID "ss_image" to a JPEG image
  toJpeg(document.getElementById("ss_image")!, { quality: 0.95 }).then(
    (dataUrl: string) => {
      const file = dataURLtoFile(dataUrl, title);
      // Share the image file using the Web Share API
      shareFile(file, title, "https://kton.xyz");
    }
  );
};

export default ShareImageNatively;
