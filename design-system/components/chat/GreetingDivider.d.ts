export interface GreetingDividerProps { children: React.ReactNode; }
/** The Home greeting, between two dashed hairlines. The line WRAPS rather than truncating: at 375 a
 *  fifteen-character name already runs past the 343 content box, and this product's clients are named
 *  Ramasubramanian and Lakshminarayanan. Cutting a client's name in half is the one thing a tool built
 *  to treat clients as people may not do. A name that fits is unaffected, and nothing else changes.
 *
 *  The hairlines are flex and yield first: they are 47pt beside "Ashish", 12pt beside "Vishwanathan"
 *  and gone beyond that. Measured, and accepted — the greeting is the content, the rules are not. */
export function GreetingDivider(props: GreetingDividerProps): JSX.Element;
