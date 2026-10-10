/* ---------- Named photos (one per real place) ---------- */
import bigogwe from "../asset/images/bigogwe.jpg";
import bigogwe2 from "../asset/images/bigogwe2.jpg";
import nyandungu1 from "../asset/images/nyandungu1.jpg";
import nyandungu2 from "../asset/images/nyandungu2.jpg";
import kivu from "../asset/images/kivu.jpg";
import kivu2 from "../asset/images/kivu2.jpg";
import nyungwe1 from "../asset/images/nyungwe1.jpg";
import nyungwe2 from "../asset/images/nyungwe2.jpg";
import nyungwe3 from "../asset/images/nyungwe3.webp";
import akagera1 from "../asset/images/akagera1.jpg";
import akagera2 from "../asset/images/akagera2.jpg";
import akagera3 from "../asset/images/akagera3.jpg";
import akagera4 from "../asset/images/akagera4.jpg";
import musanzecaves from "../asset/images/musanzecaves.jpg";
import rusumo1 from "../asset/images/rusumo1.jpg";
import rusumo2 from "../asset/images/rusumo2.jpg";
import bisokecrater1 from "../asset/images/bisokecrater1.jpg";
import bisokecrater2 from "../asset/images/bisokecrater2.jpg";

/* ---------- Numbered photos (used where they fit: hero + galleries) ---------- */
import one from "../asset/images/one.jpg";
import two from "../asset/images/two.jpg";
import three from "../asset/images/three.jpg";
import four from "../asset/images/four.jpg";
import five from "../asset/images/five.jpg";
import six from "../asset/images/six.jpg";
import seven from "../asset/images/seven.jpg";

/**
 * Central photo map — all photos stay in `src/asset/images/`.
 * Structure and copy are untouched; only the image source is wired in.
 * Each destination now has its own named photo (plus alternates for galleries).
 */
export const destinationPhotos: Record<string, string> = {
  "d-bigogwe": bigogwe,
  "d-nyandungu": nyandungu1,
  "d-kivu": kivu,
  "d-nyungwe": nyungwe1,
  "d-akagera": akagera1,
  "d-musanze": musanzecaves,
  "d-rusumo": rusumo2,
  "d-bisoke": bisokecrater1,
};

/**
 * Extra named + numbered shots for each place, used wherever a second image fits.
 * Numbered photos (one…seven) are placed alongside the named shots.
 */
export const destinationGallery: Record<string, string[]> = {
  "d-bigogwe": [bigogwe, bigogwe2, one],
  "d-nyandungu": [nyandungu1, nyandungu2, two],
  "d-kivu": [kivu, kivu2, three],
  "d-nyungwe": [nyungwe1, nyungwe2, nyungwe3, four],
  "d-akagera": [akagera1, akagera2, akagera3, akagera4, five],
  "d-musanze": [musanzecaves, six],
  "d-rusumo": [rusumo1, rusumo2, seven],
  "d-bisoke": [bisokecrater1, bisokecrater2],
};

/** Home hero background — a wide, scenic numbered shot. */
export const heroPhoto = one;
/** Secondary hero / fallback background. */
export const heroPhotoAlt = five;
/** Explore page background — a wide, scenic shot behind the filters and results. */
export const explorePhoto = two;
/** Destinations listing background. */
export const destinationsPhoto = three;
/** Trips listing background. */
export const tripsPhoto = four;
/** Organizers listing background. */
export const organizersPhoto = six;
/** About page background. */
export const aboutPhoto = seven;

export function photoForDestination(destinationId: string): string | undefined {
  return destinationPhotos[destinationId];
}

export function galleryForDestination(destinationId: string): string[] {
  return destinationGallery[destinationId] ?? (destinationPhotos[destinationId] ? [destinationPhotos[destinationId]] : []);
}

