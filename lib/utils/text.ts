export const capitalize = (text: string) =>
  text[0].toUpperCase() + text.substr(1, text.length);
export const weightDescription = (weight: number) =>
  weight === 400 ? 'Regular' : weight === 500 ? 'Medium' : 'Bold';
export const isValidUrl = (text: string) => {
  try {
    const url = new URL(text);
    return url.protocol === "blob:" || url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;  
  }
}