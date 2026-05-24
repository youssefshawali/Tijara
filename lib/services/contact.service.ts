import type { ContactFormData } from "@/types";

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  id?: string;
}

/**
 * Submit contact form data.
 * Currently logs to console; replace with API call when backend is ready.
 *
 * Future: POST /api/contact
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<ContactSubmissionResponse> {
  // Simulate network delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (process.env.NODE_ENV === "development") {
    console.log("[TIJARA Contact Form Submission]", data);
  }

  // Future backend integration:
  // return apiClient<ContactSubmissionResponse>('/api/contact', {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  // });

  return {
    success: true,
    message:
      "Thank you for reaching out. Our team will respond within one business day.",
  };
}
