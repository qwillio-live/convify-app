import * as z from "zod";
import enMessages from "../../messages/en.json";
import ptMessages from "../../messages/pt.json";

// Function to determine which messages to use based on the language code from URL
const getMessagesForLanguageFromUrl = (url) => {
  const languageCode = extractLanguageCodeFromUrl(url);
  switch (languageCode) {
    case 'pt':
      return ptMessages;
    default:
      return enMessages;
  }
};

// Function to extract language code from URL path
const extractLanguageCodeFromUrl = (url) => {
  // Example implementation assuming language code is right after the base URL
  const segments = url.split('/');
  if (segments.length > 1) {
    const languageCode = segments[1]; // Assuming language code is directly after base URL
    return languageCode.toLowerCase(); // Ensure case insensitivity
  }
  return 'en'; // Default to English if no specific language detected
};

// Example usage of the language-based messages
export const userSignInSchema = z.object({
  // email: z.string().email(),
  // password: z.string().min(8),
  email: z
    .string()
    .nonempty({ message: getMessagesForLanguageFromUrl(window.location.pathname).Login.Invalidemail })
    .email({ message: getMessagesForLanguageFromUrl(window.location.pathname).Login.Invalidemail }),
  password: z
    .string()
    .nonempty({ message: getMessagesForLanguageFromUrl(window.location.pathname).Login.Stringmustcontainatleast8character })
    .min(8, {
      message: getMessagesForLanguageFromUrl(window.location.pathname).Login.Stringmustcontainatleast8character
    }),
});

export const userSignUpSchema = z.object({
  email: z
    .string()
    .nonempty({ message: getMessagesForLanguageFromUrl(window.location.pathname).SignUp.Emailisrequired })
    .email({ message: getMessagesForLanguageFromUrl(window.location.pathname).SignUp.Invalidemailaddress }),
  password: z
    .string()
    .nonempty({ message: getMessagesForLanguageFromUrl(window.location.pathname).SignUp.Passwordisrequired })
    .min(8, {
      message: getMessagesForLanguageFromUrl(window.location.pathname).SignUp.Passwordmustbeatleast8characterslong
    }),
  termsAccepted: z
    .boolean()
    .refine(
      (val) => val === true,
      { message: getMessagesForLanguageFromUrl(window.location.pathname).SignUp.termsAcceptanceError }
    ),
});
