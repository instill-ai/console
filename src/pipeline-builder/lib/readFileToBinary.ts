export async function readFileToBinary(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        resolve(event.target.result as string);
      }
    };

    reader.onerror = (event) => {
      reject(event);
    };

    reader.readAsDataURL(file);
  });
}
