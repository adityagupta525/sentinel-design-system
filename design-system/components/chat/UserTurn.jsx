import React from 'react';
import { UserBubble } from './UserBubble.jsx';
import { MessageActions } from './MessageActions.jsx';
/* V13 · THE USER'S HALF OF A TURN — the bubble, and the row of actions under it.
   Promoted out of `screens/journey-b/thread.jsx` on 20 Sep 2026, where it had been the same twelve
   lines used by every journey in the product. Nothing in it is journey-specific and nothing in it
   reads the book; it is the pairing of `UserBubble` and `MessageActions` plus the edit state that
   pairing needs, and that state is exactly what a caller kept re-inventing.

   THE EDIT IS THE POINT. Rule: the last prompt is editable wherever editing it is valid. So the
   component owns `editing` and hands back the edited text on save — a caller that re-sends it is
   re-running the turn, which is what `costNote` warns about before they do. `onCancel` restores the
   original: a cancelled edit discards nothing, because nothing had changed yet.

   `busy` withdraws the actions while the answer is still arriving. Editing a question Sentinel is
   halfway through answering would leave the answer below it belonging to a sentence that no longer
   exists. */
export function UserTurn({ text, editable = true, busy = false, costNote, onSave, onCancel, actions = true }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(text);
  React.useEffect(() => { if (!editing) setDraft(text); }, [text, editing]);
  const cancel = () => { setDraft(text); setEditing(false); onCancel && onCancel(); };
  const save = () => { setEditing(false); onSave && onSave(draft); };
  return (
    <React.Fragment>
      <UserBubble text={editing ? draft : text} editing={editing} onChange={setDraft}
        onCancel={cancel} onSave={save} costNote={costNote} />
      {actions && editable && !busy && !editing && (
        <MessageActions role="user" onAction={(a) => a === 'edit' && setEditing(true)} />
      )}
    </React.Fragment>
  );
}
