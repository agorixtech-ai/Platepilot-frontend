/**
 * Sales contact details, in one place because the nav, the demo page and the
 * footer all render them.
 *
 * ⚠️ PLACEHOLDER — replace with the real UAE sales line before launch.
 * Gulf F&B buyers call; a dead number is worse than no number.
 */
export const SALES_PHONE = "+971 50 606 3372";

/** tel: hrefs must be digits + leading `+` only — no spaces, no punctuation. */
export const SALES_PHONE_HREF = `tel:${SALES_PHONE.replace(/[^\d+]/g, "")}`;

export const SALES_EMAIL = "sales@platepilotsystems.com";
