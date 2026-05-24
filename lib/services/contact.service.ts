import type { ContactFormData } from "@/types";

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  id?: string;
}

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactSubmissionResponse> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Submission failed");
  }

  return result;
}
