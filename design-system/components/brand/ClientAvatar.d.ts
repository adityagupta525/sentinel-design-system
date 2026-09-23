import * as React from 'react';

/**
 * The client, as a person rather than as a letter.
 *
 * Eight flat illustrations in this product's palette, varying by age and gender, with no facial
 * features beyond an accessory — so that none of them is a portrait of anybody. They exist because a
 * column of bronze discs each carrying one capital is a list the eye cannot hold, which is what the
 * drawer, the client picker and Home all were.
 *
 * THE FACE IS A FUNCTION OF THE NAME. The same client is the same person on every screen, and no
 * screen has to carry a mapping. The book has no avatar field, so this is presentation rather than a
 * record: two clients can share a face and neither is claimed to look like it.
 *
 * The eight images are data URIs inside the component, not files beside it. The system ships no image
 * directory, and both publishing builds break a relative path — the artifact serves its page at a URL
 * with no trailing slash, and the app is one HTML document with nothing next to it.
 */
export interface ClientAvatarProps {
  /** The client's name. Gender is read from an honorific or the given name; everything else hashes. */
  name?: string;
  /**
   * The client's age, when the caller has it. Nothing in a name carries one, so without this the face's
   * age band is hashed and a 38-year-old can come out grey. `book.jsx` records it on every client, and
   * the two surfaces built from the book — the picker and the drawer — pass it. Bands: under 35, 35–55,
   * over 55. Ignored when gender could not be determined, because guessing the band and drawing the
   * wrong gender would be two wrong answers rather than one.
   */
  age?: number;
  /** Disc diameter in points. 32 matches `ListRow`'s avatar leading, 20 matches `ClientChip`. */
  size?: number;
  /** Shown instead of the derived letter when there is no name — for a placeholder row. */
  initial?: React.ReactNode;
}

export function ClientAvatar(props: ClientAvatarProps): JSX.Element;

/**
 * The face for a name, as a data URI — for a caller that needs the image itself rather than the disc
 * (an `<img>` inside another component's own frame, which is what `ListRow` and `ClientChip` do).
 * `null` when there is no name to derive one from.
 */
export function clientFaceFor(name?: string, age?: number): string | null;

/** The chosen face's key — `'f-mid'`, `'m-turban'` — for a specimen, or a test that asserts a pairing. */
export function clientFaceKey(name?: string, age?: number): string | null;

/** All eight faces by key, as data URIs. For a specimen that shows the set rather than eight names. */
export const CLIENT_FACES: Record<string, string>;
