import React from 'react';
import { UserBubble } from './UserBubble.jsx';
import { FileUpload } from '../forms/FileUpload.jsx';
import { ParseNote } from './ParseNote.jsx';
/* V13 · A FILE THE ADVISOR ATTACHED, AS A TURN. Promoted out of `screens/journey-b/thread.jsx` on
   20 Sep 2026, where every screen in the product used the same ten lines.

   THE CAPTION IS A USER BUBBLE because attaching a file is something the advisor SAID. It sits on
   their side, it scrolls with their other turns, and the file sits under it.

   THE HONEST PART, and the reason this is a component rather than a call to FileUpload. A designed
   specimen has a designed output — stages that completed, "14 pages · 18 holdings". A file the VIEWER
   picks has none: nothing here parses a PDF. Printing a holdings count over somebody's own file would
   be a fabricated figure, which is the one thing this product never does. So a picked file shows its
   real name and size, its stages sit pending, and `ParseNote` says plainly that the specimen does not
   read it. The control is real and the claim is not made. `pending` carries that split, and a caller
   that forgets it gets the honest half by default. */
export function AttachmentTurn({ file, caption = 'Here is the statement.', stages, pendingStages, summary, note, onRemove }) {
  if (!file) return null;
  const picked = !!file.picked;
  return (
    <React.Fragment>
      <UserBubble text={caption} />
      <FileUpload file={file} state={picked ? 'parsing' : 'done'}
        stages={picked ? pendingStages || stages : stages}
        summary={picked ? undefined : summary}
        onRemove={onRemove} />
      {picked && <ParseNote text={note || 'This specimen does not read the file you picked — in the product these stages fill in and name what was found.'} />}
    </React.Fragment>
  );
}
