import { e2eConfig } from "./playwright.config";

// Build without NEXT_PUBLIC_URL_APP (the production of today): see playwright.config.ts.
export default e2eConfig("sin-marketplace");
