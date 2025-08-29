export async function readFileToBinary(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        const dataUrl = String(event.target.result);
        // Inject filename metadata into data URL: data:<mime>;filename=<name>;base64,<data>
        // If it already contains ";base64,", insert the filename parameter right before it.
        const base64Marker = ";base64,";
        const idx = dataUrl.indexOf(base64Marker);
        if (idx > -1) {
          const header = dataUrl.slice(0, idx);
          const payload = dataUrl.slice(idx);
          const safeFileName = encodeURIComponent(file.name);
          const headerWithFilename = header.includes(";filename=")
            ? header
            : `${header};filename=${safeFileName}`;
          resolve(`${headerWithFilename}${payload}`);
          return;
        }
        resolve(dataUrl);
      }
    };

    reader.onerror = (event) => {
      reject(event);
    };

    reader.readAsDataURL(file);
  });
}
