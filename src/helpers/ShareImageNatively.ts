import { toJpeg } from "html-to-image";

const dataURLtoFile = (dataurl: any, filename: any) => {
  var arr = dataurl.split(","),
    mimeType = arr[0].match(/:(.*?);/)[1],
    decodedData = atob(arr[1]),
    lengthOfDecodedData = decodedData.length,
    u8array = new Uint8Array(lengthOfDecodedData);
  while (lengthOfDecodedData--) {
    u8array[lengthOfDecodedData] = decodedData.charCodeAt(lengthOfDecodedData);
  }
  return new File([u8array], filename, { type: mimeType });
};

const shareFile = (file: any, title: any, text: any) => {
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator
      .share({
        files: [file],
        title,
        text,
      })
      .then(() => console.log("Share was successful."))
      .catch((error) => console.log("Sharing failed", error));
  } else {
    console.log(`Your system doesn't support sharing files.`);
  }
};

const ShareImageNatively = (title: string) => {
  console.log("ShareImageNatively");
  toJpeg(document.getElementById("ss_image")!, { quality: 0.95 }).then(
    (dataUrl: string) => {
      const file = dataURLtoFile(dataUrl, title);
      shareFile(file, "Title", "https://co-aid.in");
    }
  );
};

export default ShareImageNatively;
