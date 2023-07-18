export const ConvertBase64 = async (file: File) => new Promise<string>((resolve, reject) => {
  const fileReader = new FileReader();
    
  fileReader.readAsDataURL(file);
    
  fileReader.onload = () => {
    resolve(fileReader.result as string);
  };
    
  fileReader.onerror = (error) => {
    reject(error);
  };
});