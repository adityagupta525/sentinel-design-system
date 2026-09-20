# AttachmentTurn

What the paperclip produces. Caption on the advisor's side, the file under it, and — when the viewer
picked the file themselves — a note saying the specimen does not read it.

The rule this component exists to hold: **a picked file never gets a summary.** A designed specimen
has a designed output; somebody's own PDF has none, and printing "18 holdings" over it would be a
figure nothing produced. Pass `summary` and `stages` for the specimen's file; `pendingStages` is what
a picked one shows instead.

Pair it with `useAttachment`-style state on the screen: `file`, `onAttach`, `clear`.
