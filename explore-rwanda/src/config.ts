/** Flip to false once real data comes from an API; hides the "sample data" labelling. */
export const MOCK_DATA = true;

export const LANGUAGES = ["en", "rw"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "en";

export const CURRENCY = "RWF";

/** Distance (km) under which a destination counts as "near" in conversational search. */
export const NEAR_KM = 130;
