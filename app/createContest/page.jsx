// Make sure to include these imports:
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect } from "react";
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);


const page = () => {
  
 useEffect(async () => {
const uploadResult = await fileManager.uploadFile(
 `/contestSpherelight.png`,
 {
   mimeType: "image/jpeg",
   displayName: "Jetpack drawing",
 },
);
// View the response.
console.log(
 `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
);

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent([
 "Tell me about this image.",
 {
   fileData: {
     fileUri: uploadResult.file.uri,
     mimeType: uploadResult.file.mimeType,
   },
 },
]);
console.log(result.response.text());},[]);
return(
   <div className="default">
       <p>{result.response.text()}</p>
   </div>
)}
export default page;