import { UpstageResponse } from '../types';

const API_KEY = "up_6okPKY0u66NFhTwpJsn9LFEla2ZNf";

export async function processDocument(file: File): Promise<UpstageResponse> {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("output_formats", JSON.stringify(["html", "text"]));
  formData.append("base64_encoding", JSON.stringify(["table"]));
  formData.append("ocr", "auto");
  formData.append("coordinates", "true");
  formData.append("model", "document-parse");

  try {
    const response = await fetch("https://api.upstage.ai/v1/document-digitization", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data !== 'object' || !data.content || !Array.isArray(data.elements)) {
      console.error('Invalid API Response:', data);
      throw new Error('Invalid response format from API');
    }

    return data as UpstageResponse;
  } catch (error) {
    console.error("Error processing document:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
}