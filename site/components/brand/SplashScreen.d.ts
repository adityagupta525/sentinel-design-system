export interface SplashScreenProps {
  /** The work this screen covers — fonts, the book, a restored thread. It leaves when this settles,
   *  resolved or rejected alike; a splash is not where a failure is reported. Pass something that is
   *  genuinely pending: `document.fonts.ready` is honest, `new Promise(r => setTimeout(r, 2000))` is
   *  the tax this component exists to refuse. */
  until: Promise<unknown>;
  /** Called once the exit has finished and the screen has unmounted itself. */
  onDone?: () => void;
  /** The mascot's width. 168 fills a 375pt phone the way the splash was designed; do not go small
   *  here — small is the signature's job. */
  mascotSize?: number;
  /** Accessible status text. The screen is role="status" so a screen reader hears that something is
   *  starting rather than meeting silence. */
  label?: string;
}
/** Covers real work with the mascot arriving as dots and resolving into itself, and leaves when the
 *  work does. The floor is DotField's settle (--dur-enter + --dur-bar), the crossfade to the solid
 *  Mascot (--dur-enter) and the exit (--dur-screen), because the eyes cannot half-open; the hold is
 *  only what `until` adds. Positioned absolute, so it fills whatever frame it is mounted in — the
 *  phone stage in app.html, a PhoneFrame on a spec page. */
export function SplashScreen(props: SplashScreenProps): JSX.Element | null;
