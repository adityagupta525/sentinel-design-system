import React from 'react';
/* THE CLIENT, AS A PERSON RATHER THAN AS A LETTER.

   Eight bronze discs each carrying one capital is a list the eye cannot hold: in the drawer, in the
   client picker and on Home, every row read as the same object with a different letter in it. The
   owner asked for faces that vary by age and gender, they were drawn for the fund explorer on
   23 Sep 2026, and on the same day he asked why the drawer and every other client list still had
   letters. This is that answer, and it is in the system rather than on a screen because the rule says
   so: anything built on a screen that belongs in the system goes into the system.

   WHAT THEY ARE. Eight flat mid-century illustrations in this product's own palette — a young man, an
   older woman with grey hair, a woman in a dupatta, a man in a turban, someone in glasses. NO FACIAL
   FEATURES beyond an accessory, deliberately, so that none of them is a portrait of anybody and no
   client can be read as having been drawn from life. They vary by age and by gender because an
   advisor's book does, and because that is the only thing a face is doing here: making one row
   distinguishable from the next at a glance.

   WHY THE BYTES ARE IN THE FILE. This system ships no image directory, and the two builds that
   publish it — the artifact and the single-file app — each break a relative path in their own way:
   the artifact serves its page at a URL with no trailing slash, so `./art/…` resolves one directory
   too high, and the app is one HTML document with nothing beside it. Sixteen kilobytes of base64 is
   the price of a component that cannot lose its art to a URL it does not control. Eight files, 32 KB
   on disk.

   THE FACE IS A FUNCTION OF THE NAME and nothing else, so the same client is the same person on every
   screen — the drawer, the picker, the chip in the composer, a holder in the explorer. A hash rather
   than an index, because the book has no avatar field and inventing one would be data this product
   does not have. It is presentation, not a record: two clients can share a face, and neither of them
   is claimed to look like it. */
const FACES = {
  'm-young': 'data:image/webp;base64,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',
  'f-old': 'data:image/webp;base64,UklGRkwEAABXRUJQVlA4IEAEAADQGgCdASqgAKAAPm00lUekIyIhqLQp+IANiWdtyDW9EfDCgeH4bZo3W5ar1WjQ/CkRqp/sAuUksUD1EgobDFF2X6pQ152huwuRrzadU/kopQL9111kYarHA30vW1PDbQNK3UQaaxWtURJV2YJgW+TuSIOacVL1NJk5KAdOw3LaUzjwxnydEo74gsCvy6/8DR9c4Yp6KEGvFRP5WopbFLyaT9SRu0MIouyj30zEOp2kS7q0x3jX3Zc7flBtjT4GuKUfR0uUQ5ncDu8S+IeoVkebtZYbUizGti/4KnlxQPtAAP76G1/oSE8vms9cJ+qqe30c52Q5QUmHFHYMvEQUTa/Zxh3/th6C5ItcY0Z9CaTOpV5b3q5ba+pA2hYFxP7v8vHnP5g7vDhkagqEXwUc2xS+73H7MXuYhwnqh2fxFv+G1IpffCy4fzViyyCTfQAnNEa1AYHi75+P4VGxagI4yWKefayOZPDNrINpwlbh6diZMHO2KqHwVwwxrMjscD8orWlK9Dp/q0XQeoXIJwYERNSscA5158S+gwjZ26qwz0K5JRmx85HzMBlUxIHMAeu761Aq7JMk/oST3Frt9MrBHkUil+4RNsU/dKRHr6WvS5JVcPeBFDUHcIbMe8nkLJWPDIBKKn1eBaLXaPO4HkjdpNtsFpkj0/gL/aWXXYNRKcP4jVhDfjvzLZ1DkHbbashJnkOM7xATxlJxRenoucXBHZRVyI2hAzNCWH3ZDUTBMuzZ687vdqaPcQ8EPtbJj5RytHvznWtnj7NeqQqLjDSrip434W1H3DZb1hVyxCF7fQGiM0rr+c4prmm0EU4Jhe2eENhUHZx9ZJjtxuajhKEMwgh4oJUNDIfOXxmt9dzD6wMwX8ScQ7SeKc7lbbEddF5B2bVZFld22Z2zCPv4BSw44fYNiKsEt44yjvN3lG2JLQAlBCfEAJ8qeUdd+TCQQCJNjHNHREFqzNG81WbafLOZsgHiLcOoT2l4puPETT2E+xYkeI6ckG/tMeAmGQBD8zpUNAY0ePenBuh2hnONEyv4rZuLKj12UeqsML2F3VLQrrXHK6R7nJEqp4HFLGC7WuveMPF1NlC7fTSjBeZOskod+lK09o1dAsH2TAMoDwqSMlRDyReC4jxHXMIaouqGqFcDCDYA8Dj0YY65yAFYTwLwbB/7jE8beb1ebSgzdJnltEmQJjq91yfDmybH9j1srJ17g4iCHOHMXZv2oD92q/zxO1kfS6mrM0A4aF13E0XeznQglGHKTIAOZqJlXL9gba6d9rKAJ5q12UOuZ9bPPce/BJFB1hr6sgTCyjg7uoIWcFhSxoO/sB2RWBWqRymtY7+JYLUTZltsqEpTZesvFNRm+wqQbpgBSFJ4Y+bKJiU/kByJyek7b9BW+HxHx3U2BaA5Cw/5v3BJOkrkKatu4AeZMSzFtf5WXyg9CTwWN4mY1VgAAA==',
  'f-mid': 'data:image/webp;base64,UklGRkoGAABXRUJQVlA4ID4GAADQHgCdASqgAKAAPm02mEekIyKjqVWIyIANiWdtv19xiHFFBTsy7ll+MZkHDPpc24926RwuvTrm5c2nUxj+kJobTCfwHGrp6DGJLHlTPrkPu4TlGZQcEAbWneMLwIt8YPqXmCnGKs8HIYd62Up962dC1m1uWoeo2M+f/lvvxGDJ7ro3I4sUTPSkz2CsQxtRwaz1itjP4gwl8BV5pw4CZw19PoVpJkpcaQZhTXVScELcuJAWEqW4VJTnBQF1orLcheRewg44MvL2k+16cxfUFvOfpRprD+oWMcB3GxbJBlApCfw7sK8FXQVZlpgWIcZNPkzkkuo+uwqfVbYqUXULIMAA/v4ux3u+7+WP7BY6jtf6j5Y1HJFd7eVaSKtRxG8q7G68LIK7/d0510zDHHxCTCllkyqav2XoSfE6YahX+8O+wImQUPdRuObjZMMgbP0tPtYdf7JjjU4mDJGV3jj4WV2HV1VQbC2Dl7lIWutK2XwCqrK1/KZo2UGWThutkaGK5VoPVFQ4j8bw4IFAbQkzsKatZa/qYzMuaDc6zyBQhX/T7zYUakm3aNWA1r9mgZKl+AETVkBztlI1qr4wMQnRp+auqXh6IZjH7HmY2kMu40DIEuHEmwVRQpN5s8xl5tT7Jae/XN3FPF9vRl+WOKaajqXDSQ5V1gzEa0NJ9dsi6bP2UPwS5YLFA12OaZAOMbuHtbdclxxt7BfZYd7mqZbOwQlMcAYLKQFcDoBNuAwDj5xMeUP+Nz1cJRCq9XXeH3NJIt4qXVgkw6DfUVRIX0aJN+lTQmV2EAqqU1Tyz0XdJ7Fy/VMGdYJAgr/XEuethDoOXgqcD04UoPBqluB2ZwJJiye8v95JrcJu+oshfFv5KhPbarnaQTK4kmzFRJ0BnvFrNEKZiX2xoJ6+DdLrP1aZQQC0XWtU63eD9ZQ2AYIq2qiBRya0c9qx+/9vdCRfrUgNF4OHSPGCIU7oTR2+jHnfYC8O7enW8Iebxtshg+0WB/WowPzvhFhEEnJU4yQDyaSXYBGPxAEHKo/fcamEue9HTHYvJKA53p1pODdoxfo1X4FcYNZE9lqtHSH/BO40hGoM1JtlI7O7pfSOSYvFccfy74uKv3bVu+oJe/1Y+iuULO3S+ZeVgMAfDbZuvNW2PmPvu9DncFM8y5iNmEUvDolaVHogA99lXqmvAFPSBqJ/lP3qspC2nDMraWcH2CDm8HvXdGz7Etd4pLrwtJVZL/WS8Ct2BZUL9AHuWZiL492I30k1BbwpSerGMUnfANaV6bXVL/DbGPVaJLK+kN/WNHcOeuWt16Lo544O397kpvyShlBcScA3AlrHifpxy7dF0WCcwWiIoAoFyd2R2nfVZHdKXapPJqUneaqtBGfwKH0uA1zJ7ctgPO5NUW2ZC4QOZa6yLaWxI+cTbYumGhbq1ofWUZsDVyenVXf43fj5wtz78/tRjbyuKn5zMaT6DrexO7U2qBHPeNt6+t2/We9Wq4EpRBjNUX0EXhnxItHo0Rontuvzp9jpawJxp8SuW7A3slFNtjdzU9hU3e+CzmD+Yb+02EefYGcxdu1NKy7U7NsJ3K42ZokehBQut0FlCQaOAxxiBUiIfIM+M5wke/0z6PP/ZXJoxjAGqRiSaP5V82G0bnia+l/n84QOkJrSJMAYBKimN61Qle6MkHrWJoNuvtPBqUQwrdgmRCyHdwAdIXcGV99uWlXor+dVvHxGZflNO+lU+365j/q5YGAr6kKSCDYSq+WL6xTIP6guTWgYSud9H146zgjR5YIDeM1ypCoXxoG3j3TxEXrlQ+9ron/hfqa/ZZ+cDxzjfwpM7E6BLUEeXZuFYaCoT8a2wdzxY+cZkVeOeIv7chrNtyl/cPWTHjSp+1XN2a/U5FtbaI1wS4GJU3iUIvftVNUy8hdTtcYIUpzkAitE+Co0k1ehrUqCt4vhcaEcWb7pI7n72q0+x+MDFmWZMS077pt6Hx4AS6M7gJbJ1FvB+xdrmW/7icO/YjU3zK18KHG0ygt1U1ck3eaUHV+axEO4/Ed2WW/SCnsJ8hIvADsfb0dln8iFAkaBSt4Z+S2U6LeljBpiKWwHzmtM1X7C4wjcxrLVAEHuXp87KNx5zxXSSOUZHpV0R2vmtqAAAA==',
  'm-mid': 'data:image/webp;base64,UklGRpIEAABXRUJQVlA4IIYEAABwGQCdASqgAKAAPm00kUckIyIjK5cYwIANiWduDjA7gdl/OpK82tvmVgHvnT4jNq5TWozY79w8XzFTqGnBBr1bM2OkLK4SFi2ANgqHz12IaoLUhqZj2i9aV8ZALyhG90jwFdyLC5UVSTfNaZ2tSKNL4qBNPApdqov4KL8FEAgHsw2ZT7M48Y5IRt39HAINIHOjtfpnuUDF2Z30a/YM4XJKNIzBKb8vN6f7nyJdNo1G0318L1ERdhezYMKsvueeORW9hllTjljcwZ4Xd41QZIophdboAAD++htf1c5Ji85Cf6p5puE5tVEsOPAKFIU1UaIlJGZPq/jtteCZmwtxOrHCsiPDN6svLFeFK6FHJsrHCBbB+awS0a2wC+tfJf18UKheGQgbzMdA2+1q6K5dgi9LkhkIy1StN4bnwMZsvuK9TuCj4VnbFYqMes6Zmev1VM0Lkf4XiwNfcP30pPQnzAbXoToL9CVHfLrgPWs402R+EnxdiEVxgCcP6Lp0qA1Rvc4G1mXzbo2/zCbZFnSHofmhQyWq3g3WlpWbTkvci10p+xFkTk7fVp3yAD+EzKOH5uBclqkC0R5Y8hn6uPsrLVgoW0Wc9BkGueNYh7AxaqETe+c/h5jNBPdavf/teTfeeDhmSEIyNQ+2JLY7cPjhdsYp4kM5Z/nSwePoNbqgMFjALo2vf+E19JZ+Qdx8CoGTPOVt1t0CakTV6Xb+XC5tFK29RMF1dPfFIqFjL0WU2tPjCajfaB+UPrJSkWgZuEc0l8iq0H02CAcX587zGeuwAvoBZcXNodaDWvXmgHRxO/c7vS23v2xubRvx3Xt29WRbAZ3VhlM2sG2/LocCbNsrGVQFRYIlAQ9XAGs0Bs0+mgYUMXLnWejuBl61/kYm8G7NVGBhJRXn46eHAXYuTk3pJ9Iaj71cF3I4wqzMCGDgZqj+XSh2Xc7yaLYaRLAn6+KpkrdP4ZOcAIn7s+Gu4MtTonHYf3n/b7X2qNc6w9TlAs7Gl0eREOuMfuw0jNf9Eaoo9CremdI1Q+dOI72oSCE0nRs5MigOHZVbn42BTcuuGgW3M7/iq6XX6zUPNu2QtpzV8FIsMthUuO3n6PFyLDzIz6WbyJMGqN8meXXxR6OVGpj/aU5ORFhJsbHi6mm8qAdJrn5N0jjQtpFrzIElKukJb2jGOmhLo1WZfTCKVEfhE8fgFIWbTmC/OeAa4qv3kR0sAJOACEAAEqMAXCCLKiT2jUq5/xvcz4eNSylUvwrBAZzcgRDjN/Qk/ZrbbT4IksinyIUZxyWG8Awr5gQnIeB4NHh/U3vLlV1BPQOXX4v4VsMLd1E3TBptwbe9dxEPS2+mm1BkrQsWsUBOfBj9y8paCwvpiyNYcS95PNZpkJ8HDQVUOzbVTU30XyNMBOt7pY9+56mnn8RCZlm97ytCCTG9YYob4oJfVB2Fusrt5NGdy81Ltg+9IuhsXWNZ0iJtBSKKa5TAy4rbBxsqrrflp1RObq5wbfRqMY9r30PEh8dA6vHgt5jDY2gI6HiT7oiFOCXRbUU9REhBwAA=',
  'm-turban': 'data:image/webp;base64,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',
  'f-young': 'data:image/webp;base64,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',
  'm-glasses': 'data:image/webp;base64,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',
  'm-old': 'data:image/webp;base64,UklGRmgFAABXRUJQVlA4IFwFAAAwHQCdASqgAKAAPm00lkekIyIjqBepsIANiWVuDLlN3ZD1eVafbZXcz6ACAAZEPFdMvK9Lst591PwAzBjdsuU9sEK7SD2X+1ZrZdR/rPjeie86Vc36oDEReHjvmxSdhkOOFe27jUxHZTn7q4nhd/DiSG5moh4/otnAQYT7LO8whYx3Ps0Y4rQ5b/fSYyRUH2tQ2r+pbij+eiDZg88U7q9jZyiZlymGT51WWH/rcVYk5Lc1ils1voWbGQM9YXhZjMoiR8rN7a2KXRGjc6mAuE/q2dW0YM0nfZxMa6a+rrIJAroY2xRXQXzuFSb/8707Xas7MAD+/fzMDAv9enNhyBcp54kRJdyvnbYoOeXsAx2bdAKTJ70t7e+7uV6+Czwx0ky+9APnSaK5AYHr2ar1Inpc5+XPMlggYzqs2YaSY1QoQoshjZM/HmhXvZANpCdBxBL5jy9qGkVIRBFH038DZNg7tbybPMZjPQ/mBtyPaQ8qwxM4DNCyacxTQS8JgQbhrrUrTZPuDARgL4xbYHiS8sVEkQa+44W3xM2fFN2U28+ED3ZYxGRuBy6WYNpXpHxkt9FY7gCDKsN74YpcO1LIFrR6M5xhISCsytgcVmkZ8xSe3VU8gqlwieJvSOoVJJrthC1SNrth43MSqj4H/V4ztUokMGoa4k3C6WGNFW9Xai1xQ5WB84ERAANg53fVEAj2AII1b1kJzAVeppflLqej2Vsll9eL4U6myXNywdUAOoOb5uaDf2Aq9Pr96IF4yTMyDmzKEkz1SNPnFg48w4vlpp65dDwwyf9GE8wYriHzPboLTyZ/OA3f1lXy0L5m6gkRnhjV3nCddlni3cHD6WkbmydDIm8Yw/yVCSRvQE2tEr8WCLJHlNiH1dhdjFvtrH0zuG57xq9HGKIXEBb3WStxWgNQxVkUisqCjKMt743iShbwuCxl+SwSFgQs3ba3qxfUiD8FImpJoxb+4v17BxGHeAqNL2QAhU8vKYvOmfhV323BEULhtgdessXkoGuxcdF48WNXRVIxAporiglbEDwPTZ+83fN5q26YJcuadF5OsXgV5F+Ox6NjxRgXmnk/DY1rS0O4hRun9RBXGFQHdJGk243xJ+lKhAQ6ibQrEZD83nK93FPd3/42/XBKwnO4g2cCUgkv59CQtmQlLiqpoxaVgt2OVkfnOOPx/Q8BYb7WPDiAfcFZin63e3BWUgdSutNk0LV6u2wFXxR0Oc+0AIazBwKuLKM3Xd42lHiGNuzIqUcf9fNi270fjw5it+TB3/NtUtylK6kkka6OTnI/3GqK3Kmw4r+WNDuWps9KBOzYaSf13V0IkDl/gBeVrDHaVmPAtSNnnn6NWr7AwX3T4H3WcwXHp87m+d6w1h0B6VATFQXgPrr744F3saXA5o2AGBloR4gBCLEauEBLOEY5OqPMpdMDvOZS6Yxx1EZJ3YdqGfQjB7/babFFu7Yx2UebXPFwiT3X6wBzs+Q8Z+uMgiNl/oxqoHdbtx4Bb9Lip05GBlf5ttO9a6+XqQnB8pztfCbs2Etl0BUDhekmSYpD8gniJEAu62ebB9NBEUIoPQz9eoXbJ+2MurzBfq02jh7zlih6bn7cxYyrLj8cfIbfvEBwAX+YG5sHs7+bgMmXle8mJoZ5aQJFEet2VGkfSv/s1nc/aEuLTEWBIj6qZqDMhGGFwplDYtKCPcIIPOf9ESDbymG9ynsiy1fbf6h4pr0/sH0JJrPGHrg7EUCXY+E93QowXbYb4J77VCJNBKTgpUly5N5fVEbeX4yk60mKoZBjmuEgCEugoiSRRAjBFx/tDaSCHfl4R/34z75jIi8KXOAA',
};
/** The eight, by key — exported so a specimen can show the set itself rather than eight hashed names. */
export const CLIENT_FACES = FACES;

/* GENDER COMES FROM THE NAME, AGE FROM THE HASH — and why the first version did neither is worth
   keeping (23 Sep 2026). A plain hash over all eight put a bearded face on Meera Nair, which is worse
   than the letter it replaced: a letter is never wrong about a person, and a wrong face is.

   The book has `age` and no gender field, and inventing one would be data this product does not have.
   A NAME, though, is not data about a person — it is the string already on the screen. An honorific
   settles it outright; otherwise the given name is looked up in two short lists weighted Indian,
   because this book is. Anything unrecognised — a surname, an initial, "R. Sharma" — falls back to the
   hash across all eight, which is the honest answer to "I do not know", and it is stable rather than
   random, so that client is the same person on every screen either way.

   Age is left to the hash inside the chosen set, because nothing in a name carries it. The component
   does NOT take the book's `age`: `ListRow` has a title and nothing else, and a face that needed a
   second field would be a face most rows could not have. */
const FEMALE_FACES = ['f-young', 'f-mid', 'f-old'];
const MALE_FACES = ['m-young', 'm-mid', 'm-old', 'm-turban', 'm-glasses'];
const ALL_FACES = ['m-young', 'f-old', 'f-mid', 'm-mid', 'm-turban', 'f-young', 'm-glasses', 'm-old'];
const FEMALE = new Set(['meera', 'sunita', 'kavita', 'priya', 'lakshmi', 'anita', 'radha', 'sneha', 'divya',
  'pooja', 'neha', 'rekha', 'asha', 'geeta', 'shanti', 'usha', 'nisha', 'ritu', 'swati', 'vandana', 'deepa',
  'seema', 'sarita', 'aarti', 'shalini', 'nandini', 'ananya', 'ishita', 'riya', 'tanvi', 'aditi', 'sushma',
  'madhuri', 'jaya', 'veena', 'padma', 'sudha', 'indira', 'kamala', 'savita', 'manju', 'rani', 'preeti',
  'archana', 'bhavna', 'chitra', 'gayatri', 'hema', 'jyoti', 'latha', 'malini', 'namita', 'sangeeta',
  'shobha', 'sujata', 'vidya', 'anjali', 'shruti', 'megha', 'pallavi', 'smita', 'trupti']);
const MALE = new Set(['amit', 'rahul', 'vikram', 'anil', 'rohan', 'arjun', 'rajesh', 'sanjay', 'ravi',
  'suresh', 'ramesh', 'mahesh', 'naveen', 'deepak', 'manoj', 'ashish', 'aditya', 'karan', 'nikhil',
  'pranav', 'varun', 'gaurav', 'harsh', 'kunal', 'mohit', 'nitin', 'prateek', 'rohit', 'sachin',
  'siddharth', 'tarun', 'vishal', 'yash', 'abhishek', 'akash', 'ankit', 'arun', 'ajay', 'bharat',
  'chetan', 'dinesh', 'gopal', 'hemant', 'jatin', 'krishna', 'lalit', 'mukesh', 'pankaj', 'rakesh',
  'sameer', 'tushar', 'uday', 'vijay', 'vinod', 'girish', 'satish', 'prakash', 'sunil']);

const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 997;
  return h;
};

/* AGE, WHEN THE CALLER HAS IT. Nothing in a name carries an age, so the hash decides by default and
   a 38-year-old can come out grey. The book DOES have `age` on every client, and the two surfaces
   built from the book — the picker and the drawer — pass it. Bands rather than a curve: under 35,
   35 to 55, over 55, which is as fine a distinction as three drawings can carry. A caller without an
   age changes nothing, which is every other caller including `ListRow`. */
const band = (age) => (age < 35 ? 'young' : age <= 55 ? 'mid' : 'old');

/** The face key for a name: gender picks the set, then the age if there is one, else the hash. */
export function clientFaceKey(name, age) {
  const raw = String(name || '').trim();
  if (!raw) return null;
  const low = raw.toLowerCase();
  const byTitle = /^(mrs|ms|miss|smt)\b/.test(low) ? FEMALE_FACES
    : /^(mr|shri|sri|dr)\b/.test(low) ? MALE_FACES : null;
  /* The given name is the first word that IS a word — "Mr. Amit Aggrawal" gives `amit`; "R. Sharma"
     gives `sharma`, a surname in neither list, so it falls through to the hash. */
  const given = low.replace(/^(mr|mrs|ms|miss|smt|shri|sri|dr)\.?\s+/, '').split(/[^a-z]+/).filter((w) => w.length > 1)[0] || '';
  const pool = byTitle || (FEMALE.has(given) ? FEMALE_FACES : MALE.has(given) ? MALE_FACES : ALL_FACES);
  if (Number.isFinite(age) && age > 0) {
    /* `m-turban` and `m-glasses` carry no age of their own, so an age-led pick uses the three that do
       and only inside a set gender chose. Unknown gender keeps the hash: guessing a man's age band
       and drawing a woman would be two wrong answers instead of one. */
    if (pool !== ALL_FACES) {
      const want = `${pool === FEMALE_FACES ? 'f' : 'm'}-${band(age)}`;
      if (pool.indexOf(want) !== -1) return want;
    }
  }
  return pool[hash(raw) % pool.length];
}

/** The face for a name, as a data URI. `null` when there is no name to derive one from. */
export function clientFaceFor(name, age) {
  const key = clientFaceKey(name, age);
  return key ? FACES[key] : null;
}

export function ClientAvatar({ name, age, size = 32, initial }) {
  const src = clientFaceFor(name, age);
  /* The disc is the same disc `ListRow` and `ClientChip` already draw: `--surface-avatar`, fully
     round, and clipped, because a square illustration in a round hole is only round if the hole
     cuts it. A name that hashes to nothing keeps the letter, so a row is never an empty circle. */
  return (
    <span style={{ display: 'flex', width: size, height: size, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--surface-avatar)' }}>
      {src
        ? <img src={src} alt="" width={size} height={size} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 'var(--weight-bold)', fontSize: size >= 28 ? 'var(--text-12)' : 'var(--text-10)', color: 'var(--color-bronze-deep)' }}>{initial || (String(name || '?').trim().charAt(0).toUpperCase() || '?')}</span>}
    </span>
  );
}
