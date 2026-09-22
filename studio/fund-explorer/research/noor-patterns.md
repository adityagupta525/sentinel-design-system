# Fund Explorer — existing patterns for V1, V2 and V3

**Noor · 22 Sep 2026.** Patterns, not pictures: this session had web search and fetch, no browser and
no Mobbin. Every product claim below carries a URL. Where the source did not say the thing I needed,
the cell says so; the "needs the main session's browser" list at the end carries the exact query to
close each gap. The images the owner already has — `../refs/board-retail.png` (24 retail screens),
`../refs/one-digital-explore.webp` (Centricity's own), `../refs/current-journey-c.png` (what ships
today) — are cited as `board #n` and stand in for the screens I could not pull.

**Legend.** ✔ primary source (the company's own page, NN/g, Baymard) · ◐ secondary (trade press, a
teardown) · ✗ could not verify — flagged, not claimed.

**The frame.** Sentinel is advisor-facing, one accent, light, no images. Nothing here transfers as a
surface; what transfers is a *mechanic* — how typing and chips stay in sync, when a list first
appears, how a phone shows two funds. The current explorer (`board current-journey-c`) is a sentence
→ three chips → a table in the thread. Stakeholders called it thin. The products below show what
"not thin" looks like without abandoning the sentence.

---

## A · Chat and browse coexisting — V2's mechanic

The question for each: **does typing create chips, do chips edit the query, is the browse surface a
sheet / a panel / the page, how much screen does the input keep, how does "back" work.**

| Product · screen | Pattern | How it works | What transfers to an advisor explorer | Source |
| --- | --- | --- | --- | --- |
| **KAYAK · Ask AI / AI Mode** (Oct 2025) | Chat beside a live, classic results page | "Flight, hotel and rental car results update live alongside the conversation." The results page is the normal one; the chat refines it. Desktop + mobile web. Mobile layout not described in any source I could reach. ✔ mechanic · ✗ mobile layout | **The closest existing V2.** The list is the product's real list, not a chat artifact; the sentence is a second way to drive it. Sentinel's version: the fund list is a real screen, "Ask Sentinel" refines it in place. | [kayak.com/news/ask-ai](https://www.kayak.com/news/ask-ai/) · [TechCrunch](https://techcrunch.com/2025/10/16/kayak-launches-an-ai-mode-for-travel-questions-search-and-bookings/) |
| **Amazon · Rufus** (mobile app) | **Bottom sheet rising over results** — the inversion of V2 | Type or speak in the search bar and "a Rufus chat dialog box will appear at the bottom of their screen"; "swipe down to send the chat dialog box back to the bottom" to return to the traditional results. Entry also from the nav-bar icon, product pages, and category browse. ✔ | The exact sheet grammar V2 needs, inverted: Amazon puts *chat* in the sheet over *browse*. Sentinel puts *browse* in the sheet over *chat*, with the composer staying below. Steal: swipe-down is "back"; the sheet peeks, never replaces. | [aboutamazon.com](https://www.aboutamazon.com/news/retail/amazon-rufus) · [how to use](https://www.aboutamazon.com/news/retail/how-to-use-amazon-rufus) |
| **Redfin · Conversational search** (Nov 2025) | Sentence → filters adjust → clarifying question → list | Entered from the search bar on home, map and listing pages. "Filters automatically adjust as users interact." When nothing matches, the assistant says so and the user relaxes a criterion in words ("relax on the number of bedrooms"). Users viewed ~2× as many listings as filter users. ✔ | The **zero-result recovery** Journey C already does ("drop one and I will widen") — but Redfin keeps the *map/list* on screen while it asks. Also: the assistant may ask a clarifying question before it lists. | [redfin.com/news](https://www.redfin.com/news/redfin-debuts-conversational-search/) · [GeekWire](https://www.geekwire.com/2025/redfin-launches-chatbot-providing-conversations-with-home-shoppers-moxiworks-releases-new-platform/) |
| **Zillow · Natural-language search** (iOS first, 2024) | Typed sentence replaces the filter stack | "Skip the filters" — type "$400K homes near me with three bedrooms" into the same search bar; commute time, schools and affordability parsed. Saved search notifies later. Whether parsed criteria surface as visible chips: not stated. ✔ mechanic · ✗ chips | The **one search bar, two grammars** rule: same field takes a fund name or a sentence. Sentinel should show what it parsed as chips (Journey C does) — Zillow's silence on this is the gap to beat. | [zillow.mediaroom.com](https://zillow.mediaroom.com/2024-09-04-Zillows-AI-powered-home-search-gets-smarter-with-new-natural-language-features) |
| **Airbnb · "What" box** (test, Nov 2025 → 2026) | A fifth field beside Where · When · Who | Chesky: "a 'What' box with a text natural language input similar to ChatGPT or Gemini" added to the structured search; responses "won't be structured data". AI titles and highlights on results; follow-ups about a listing. Live for a small share of users. ◐ | Structured fields **and** a sentence in one search head. For Sentinel: category / bucket / shelf as fixed pickers, plus "What are you looking for?" as the fifth. | [Skift](https://skift.com/2025/11/06/airbnb-is-testing-a-what-box-for-natural-language-search/) · [TechCrunch](https://techcrunch.com/2026/02/13/airbnb-plans-to-bake-in-ai-features-for-search-discovery-and-support/) |
| **Google · AI Mode shopping** (Sep 2025) | Typed refinements instead of filters; results panel re-renders | "Barrel jeans that aren't too baggy" → follow up "I want more ankle length". Google's own copy: no need to "sift through filters". A side panel of shoppable results updates per turn (trade press; Google's post describes the results, not the panel). ✔ mechanic · ◐ panel | The **refine-by-sentence** verb set: "only in black", "show cheaper ones". Journey C has nine verbs; Google's are the same shape. Anti-lesson: Google hides the filter state — an advisor must *see* it. | [blog.google](https://blog.google/products-and-platforms/products/search/search-ai-updates-september-2025/) · [Shopify](https://www.shopify.com/blog/google-ai-shopping) |
| **Perplexity · answer + sources** | Answer column with a parallel sources region | Desktop: 280px sources sidebar, collapses under 900px; mobile: "Sources (12)" expander above the answer; numbered chips in the text match the sidebar entries. ◐ (teardown) | **The footnote pattern for funds**: an answer sentence ("3 flexi-cap funds on your shelf under 0.7% TER") with the list as its parallel region, numbered, one tap to open. Mobile collapse to a count is the right economy at 375. | [aydesign.ai teardown](https://www.aydesign.ai/blog/ai-citation-source-ui-patterns-2026) · [AI UX Playground](https://aiuxplayground.com/teardowns/perplexity/citations/) |
| **Perplexity · Shop like a Pro** | Product cards inside the answer | Cards with price, seller, pros/cons, short description; "View more" opens a side panel with features, consolidated review and sources. ◐ (hub blog 403'd; trade press) | A **card-in-the-thread that opens to a panel**, i.e. Journey C's `ResultCard` → a fund page as a sheet, without leaving the thread. | [websitebuilderexpert](https://www.websitebuilderexpert.com/news/perplexity-shopping-assistant/) · [TechWiser](https://techwiser.com/perplexity-adds-new-shopping-features-buy-with-pro-and-snap-to-shop/) |
| **Booking.com · AI Trip Planner + AI filter box** | Chat with inline property cards; **plus** a typed filter inside the normal filter sheet | Travellers "go back and forth between their chat and the Booking.com app interface"; tap a card to book. Separately, "the AI filter tool is located in the property filter section of the results page" — a text box among the checkboxes. ✔ | Two doors to the same list: a chat and a **typed filter living inside the filter sheet**. The second is cheap and honest — a sentence field at the top of the filter sheet that becomes chips. | [news.booking.com](https://news.booking.com/bookingcom-launches-new-ai-trip-planner-to-enhance-travel-planning-experience/) · [Skift](https://skift.com/2024/10/30/booking-coms-ai-trip-planner-got-a-big-update-heres-how-it-works/) |
| **Spotify · Prompted Playlists** (beta, Dec 2025) | Prompt → list → *Refine* / *Edit prompt* | Library → Create → Prompted Playlist; describe; generate. Afterwards two doors: "Refine" (adjust tracks) and "Edit prompt" (regenerate). Each track carries a one-line "why". Whether the list stays visible while refining: not stated. ✔ | **Two refine doors, named differently**: edit the *sentence* vs edit the *list*. And the per-row "why it's here" — the fund score's reason in one line. | [support.spotify.com](https://support.spotify.com/us/article/prompted-playlists/) · [TechCrunch](https://techcrunch.com/2025/12/10/spotify-tests-more-personalized-ai-powered-prompted-playlists/) |
| **Spotify · search chips** | Chip rail directly under the search field | After a query: Top · Artists · Songs · Playlists · Albums · Podcasts & Shows · Episodes · Profiles, "below the search bar". Pivot intent after typing, before scrolling. ✔ | The **type-then-pivot** rail: sentence first, then one-tap re-scoping (Equity · Debt · Hybrid · On shelf) without retyping. | [RouteNote](https://routenote.com/blog/spotify-adds-filters-to-search-results-on-the-mobile-app/) |
| **ChatGPT Canvas · Claude Artifacts** | Chat + a persistent side surface | One document lives beside the thread and updates in place; header actions Edit · Copy · Download · Expand. Desktop-first; on a phone the artifact is a full-screen layer over the chat. ✔ | **One persistent object, edited in place** rather than re-sent per turn. Sentinel's shortlist should be *one* artifact that mutates, not a new table each turn (Journey C re-sends). | [openai.com/canvas](https://openai.com/index/introducing-canvas/) · [BGR](https://www.bgr.com/tech/chatgpt-got-a-great-design-change-now-that-canvas-rolled-out-to-everyone/) |
| **Arc · Command Bar** | One fuzzy field for tabs, history, commands, spaces | Cmd+T "searches your open tabs, bookmarks, history, and settings — or opens a URL, runs a command, or switches to a Space". ◐ | The **one field, many object types** idea: fund names, categories, clients, verbs, all in one input, typed results grouped by kind. | [Blake Crosley](https://blakecrosley.com/guides/design/arc) · [dev.to review](https://dev.to/pickuma/arc-browser-review-18-months-with-a-browser-that-thinks-differently-26o1) |
| **Raycast · Linear ⌘K** | List filters as you type; input keeps focus; Backspace pops a level | Combobox where "the input keeps DOM focus the whole time while an adjacent listbox shows filtered options"; nested pages on a stack, "pop the stack on Backspace when the input is empty". ◐ | **Backspace as back** and **the input never loses focus** — the two rules that make typed refinement feel like browsing. | [Destiner](https://destiner.io/blog/post/designing-a-command-palette/) · [Raycast List API](https://developers.raycast.com/api-reference/user-interface/list) |
| **Notion AI · database** | Sentence → view/filter, or a text answer | Notion AI "can create databases, add properties and set up views and filters based on plain language" but a one-off question returns "a text summary", not a live filtered view. ✔ | The **honest limit**: a sentence that becomes a *saved view* is the win; a sentence that becomes prose is Journey C's current ceiling. | [notion.com/help](https://www.notion.com/help/guides/everything-you-can-do-with-notion-ai) · [Zapier](https://zapier.com/blog/how-to-use-notion-ai/) |
| **Klarna · AI assistant** | Chat → product cards with live price | Describe in words, get "visual product results with current prices and availability"; comparison in chat. Now also inside ChatGPT. ◐ | Cards carry the *deciding* numbers, not all numbers. | [Klarna press](https://www.klarna.com/international/press/shopping-made-smarter-klarna-adds-more-ai-features-to-its-assistant-powered-by-openai/) · [PYMNTS](https://www.pymnts.com/artificial-intelligence-2/2024/klarnas-ai-assistant-now-offers-chat-based-shopping-experience/) |
| **Expedia · Romie** | Assistant that learns and hands off to the shopping UI | "Summarize your group chat" → preferences carried into the search; lives in iMessage/WhatsApp and the app. ◐ | The **memory-to-filter hand-off**: a client's constraints remembered, applied as chips next time. | [Expedia newsroom](https://www.expedia.com/newsroom/spring-product-release-2024) · [Medium/EG Tech](https://medium.com/expedia-group-tech/traveling-just-got-a-whole-lot-smarter-with-romie-dfb9b21c07c5) |
| **Google Flights · Explore** | Map + filters in a **pull-down panel** | "In map view, your filters tuck away into a pull-down panel — look for the arrow at the top of the screen to drag it open." Filters: stops, price, duration, interests. ◐ | A **top drawer for filters, bottom for the list** — the opposite edge from the composer, so the two never fight for the thumb. | [Thrifty Traveler](https://thriftytraveler.com/guides/google-flights/explore/) · [Going](https://www.going.com/guides/google-flights-explore) |
| **Google Maps · three-detent sheet** | Peek · half · full over a live canvas | "Three visible states: a peek height showing a summary, a mid height for details, and a full height"; "the map behind the sheet remains fully interactive with no scrim"; drag down from the top of the scroll collapses. ◐ (engineering write-ups) | **The sheet grammar for V2**: peek = count + top 3; half = the list; full = list + filter rail. Non-modal, no scrim, thread still readable behind. | [doveletter.dev](https://doveletter.dev/articles/flexible-bottomsheet-google-maps) · [ThreePhasesBottomSheet](https://github.com/AndroidDeveloperLB/ThreePhasesBottomSheet) |
| **Kuvera / Zerodha Coin / Groww / INDmoney · MCP** (2025–26) | The chat moved *out* of the app | Groww MCP, Kite MCP and INDmoney MCP let Claude/ChatGPT run "real-time mutual fund filters, manager profiling, risk metrics" against live account data. In-app chat discovery: none I could verify. ✔ | Indian retail is not building chat-in-app; it is exporting data to chat. Sentinel's chat-*with*-browse inside one phone is uncontested locally. | [groww.in/updates/groww-mcp](https://groww.in/updates/groww-mcp) · [Zerodha Kite MCP](https://zerodha.com/z-connect/featured/connect-your-zerodha-account-to-ai-assistants-with-kite-mcp) · [INDmoney MCP](https://www.indmoney.com/mcp) |
| **Blinkit / Zepto · search** | Brand chips above generic-search results; filter/sort as a separate step | Blinkit "shows four brand options to choose on top for each generic search"; Zepto's flow is home → search → filter & sort (case study behind a 403; summary only). ◐ | Speed pattern: the **first four pivots as chips** the moment results land. Not a model for depth. | [Medium case study](https://medium.com/design-bootcamp/ux-case-study-redesigning-search-sort-filter-flow-into-a-singular-functionality-for-a3b24bd2deb4) (403 on fetch) |
| **Jupiter · in-app assistant** | Support chat, resumable | "Type or speak your question, and pick up past conversations right where they left off." No money-discovery chat verified. ◐ | Resumable threads — an advisor returns to *yesterday's* shortlist. | [App Store listing](https://apps.apple.com/in/app/jupiter-upi-credit-cards/id1507748747) |
| **CRED · Kuvera by CRED** | — | Nothing on chat-led discovery verifiable; reviews say the redesign made search harder. ✗ | Nothing to steal; a caution. | [Play Store](https://play.google.com/store/apps/details?id=com.gooogle.android.kuvera.app&hl=en_IN) |

**The bottom-sheet-over-a-conversation, exactly.** I could verify no product that raises a *browse*
sheet over a *chat thread* with the composer still at the bottom. Rufus is the mirror (chat sheet
over browse). Google Maps is the sheet grammar (three detents, non-modal, canvas alive behind). Kayak
is the coexistence (chat + real results page) without the sheet. V2 is the union of those three, and
it has no incumbent — which is a reason to build it and a reason to test it hard.

**What "back" means, across the set.** Rufus: swipe the sheet down. Raycast: Backspace on empty input
pops a level. Canvas: the document persists; the thread scrolls. Redfin: say "broader" and the list
widens in place. None of them re-sends the list as a new message — the single behaviour Journey C
should stop doing.

---

## B · Guided discovery and stepped funnels — V1's mechanic

For each: **steps · what each asks · when the list appears · escape to free search · how the chosen
path is shown afterwards.**

| Product · flow | Steps | What each step asks | List appears | Escape hatch | Path shown as | Source |
| --- | --- | --- | --- | --- | --- | --- |
| **Wealthfront · onboarding** ✔ | 5 | Experience level → pick a goal from a short list → link a bank → Path tool (retirement age, savings, housing) → risk → portfolio | After the goal + risk, as **one recommended portfolio**, not a list | None in the funnel; adjust after | Later copy is rewritten from the chosen goal ("personalizing the copy based on a user's financial goals") | [Appcues GoodUX](https://goodux.appcues.com/blog/wealthfront-personalized-ux-copy) · [NerdWallet](https://www.nerdwallet.com/investing/reviews/wealthfront-2026) |
| **Betterment · goals** ✔ | 3–4 | Goal type (Safety net · Major purchase · Education · Retirement · Retirement income · General investing) → horizon → age/income → allocation | A stock/bond mix per goal | Skip to "General investing" | The goal is the object; everything hangs under it | [Betterment methodology](https://www.betterment.com/resources/recommended-allocation-methodology) · [SmartAsset](https://smartasset.com/financial-advisor/betterment-review) |
| **Nike · Running Shoe Finder** ✔ | 8 | Surface (road/track/trail) → terrain detail → everyday vs race → training vs race-day → feel → motivation … | At the end, **up to three shoes**, with compare and reviews | Not in-quiz | Results page; change-answer path not described | [nike.com/running-shoe-finder](https://www.nike.com/running-shoe-finder) · [SoleSavy](https://news.solesavy.com/nike-introduces-their-running-shoe-finder/) |
| **Sephora · Skincare quiz** ◐ | ~6 | Skin type → concerns → climate → routine preferences → age | A **5-step routine**, each step a filtered carousel | Free browse always in nav | "The result page is a shopping experience, not a content page" | [Formsort teardown](https://fineflows.formsort.com/flow/sephora-skincare-routine-quiz) · [Sephora guides](https://www.sephora.com/beauty/skincare-guides) |
| **Warby Parker · Frames quiz** ✔ | ~5 | Face shape → width → colour → style/lifestyle | "Narrows down strong contenders" — a shortlist, then Home Try-On of 5 | Full catalogue in nav | Results page keyed to answers | [warbyparker.com/quiz/frames](https://www.warbyparker.com/quiz/frames) · [How to choose](https://www.warbyparker.com/learn/how-to-choose-glasses) |
| **Zerodha Coin · Explore + filter** ✔ | 2 (+ filter) | Explore: Collections tiles · Popular funds (board #07) → Category (Debt/Equity/Hybrid) → Subcategory (Large/Mid/ELSS/Small) | "All mutual funds — 1,731 funds" with a 3Y column (board #06); filter panel with **8 facets**: AMC · Category · Subcategory · Plan · AUM · Min investment · Expense ratio · CAGR; "View 1,731 funds" as the apply button (board #05) | Search by name/ISIN anywhere | Chips on the list head (Sort by · Index only · Flexi Cap · Sectoral — board #06) | [Coin support: filtered search](https://support.zerodha.com/category/mutual-funds/understanding-mutual-funds/getting-started-with-coin/articles/basic-filtered-search) · [coin.zerodha.com/mf/invest](https://coin.zerodha.com/mf/invest) |
| **Kuvera · Explore** ✔ | 2 | Category grid (Equity/Debt/Gold/Index — board #01) · Trending (High return · Tax saving · NFO · Large/Mid/Small) → list | Per category, sortable | Search bar | Category header | [kuvera.in/mutual-funds/all](https://kuvera.in/mutual-funds/all) · board #01 |
| **smallcase · Discover** ✔ | 1 + filters | Collections ("Last month's most invested", "Ideal for new investors", "Dividend growth") **or** filter by min investment · volatility · strategy · returns; sort by popularity · min amount · recently rebalanced · returns | Immediately, as portfolio cards with a min-amount and CAGR | Always the list | Collection name as page title | [smallcase.com/learn](https://www.smallcase.com/learn/how-to-invest-in-smallcase/) · [Kotak Neo x smallcase](https://www.kotakneo.com/smallcase/) |
| **Robinhood · Collections** (2017 →) ✔ | 1 | Sector ("Gas and Oil", "Entertainment") or curated ("2017 IPOs", "Female CEOs") | Immediately, "interactive and easily sortable by various factors to allow for side-by-side comparisons" | Search | Collection title; related lists on asset pages | [Robinhood newsroom](https://robinhood.com/newsroom/robinhood-now-on-web/) · [Related lists](https://robinhood.com/us/en/support/articles/watchlist-and-cards/) |
| **Public.com · Themes** ◐ | 1 | 25+ themes ("Tech Giants", "Women in Charge", "Clean and Green") | Tap a theme → stocks and ETFs | Search | Starred themes appear on the portfolio page | [Public blog on Medium](https://medium.com/the-public-blog/a-new-way-to-discover-stocks-etfs-on-public-45295f39407) |
| **Apple Music · Browse** ✔ | 2–3 | Browse by Genre → featured playlist/album; or Moods & Activities → playlist | At the leaf | Search tab | Section header + chevron | [Apple Support](https://support.apple.com/en-gu/guide/iphone/iph2c41e6189/ios) |
| **Spotify · Browse / Liked filters** ✔ | 2 | Genres & Moods → playlists; Liked Songs filtered by up to 15 personalised genre/mood chips | At the leaf; Liked filters instantly | Search | Chip row above the list | [Spotify newsroom](https://newsroom.spotify.com/2021-02-25/how-to-sort-your-favorite-songs-with-spotifys-new-genre-and-mood-filters/) |
| **Netflix · rows** ◐ | 0 | No question — personalised rows, ">80% of content viewed arrives through recommendations, not search" | Immediately | Search | Row titles are the reasons ("Because you watched…") | [Gibson Biddle](https://gibsonbiddle.medium.com/a-brief-history-of-netflix-personalization-1f2debf010a1) · [Netflix Help](https://help.netflix.com/en/node/100639) |
| **IKEA · Kreativ / shop by room** ✔ | 1–2 | Room type → 50+ 3D showrooms → products in context | Products inside the room scene | Search / categories | The room is the path | [IKEA newsroom](https://www.ikea.com/us/en/newsroom/corporate-news/ikea-launches-new-ai-powered-digital-experience-empowering-customers-to-create-lifelike-room-designs-pub58c94890/) |
| **Notion · Template gallery** ✔ | 1–3 | 250+ categories, nested sub-categories, creator profiles | At each level | Search by keyword/team/creator | Breadcrumb of categories | [notion.com/templates/category](https://www.notion.com/templates/category) |
| **Figma · Community** ✔ | 1 | Type filter (Files · Plugins · Widgets · Apps · Creators) **with a count next to each** | Immediately | Search | Type chip + count | [Figma Learn](https://help.figma.com/hc/en-us/articles/360038510693-Guide-to-the-Figma-Community) |
| **Centricity One Digital · Explore** (owner's own) | 3 | All Products · Mutual Funds · Bonds · GIFT City → "Choose your exposure" (Equity 612 · Debt 448 · Hybrid 216 · Index 463) → Large / Flexi / Index / Tax chips | "All Mutual Funds, 1,739, sorted by recommended" | Search | Segment + chip | `../refs/one-digital-explore.webp` |
| **Tinder-style triage** ✗ | n | One card at a time, swipe to keep/pass | Kept pile | — | Kept pile | No verified finance example; pattern notes only ([Medium](https://medium.com/design-bootcamp/why-tinders-swipe-interaction-was-a-ux-masterstroke-e583d5eddfd1)) |

**What the funnels agree on.** (1) Two to four levels before a list, never more, and the retail
brokers do it in **two** (asset class → category) with the list carrying a count. (2) The list, when
it comes, has a **count and one sort column** in its head — "1,731 funds · 3Y returns" (Coin),
"1,656 Funds · 3Y Returns" (Angel One, board #09), "1,739 sorted by recommended" (One Digital). (3)
Search is never inside the funnel; it is a sibling, one tap away at every level. (4) The path is
shown as **chips on the list head**, not a breadcrumb (Coin, Groww, One Digital) — breadcrumbs are
Notion's, on a wider screen. (5) The quiz products (Nike, Warby, Sephora) end in a *shortlist of
three to five*, not a list of hundreds — the quiz is a pre-filter. Wealthfront ends in **one**.

**For V1, read as a rule:** asset → product → category is the broker two-step plus One Digital's
first segment. The fourth level ("funds") is where the count, the sort, the filter sheet and the
search live. Score and tutorial belong on the list head, not as a step.

---

## C · The fund page: one scroll, tabs, or accordions

Three patterns, with the evidence I could find for numbers-heavy content on a phone.

| Pattern | Who does it | The argument for | The argument against | Source |
| --- | --- | --- | --- | --- |
| **Tabs** — Overview · Holdings · Performance · Peer analysis, sticky under the title | Groww (board #10–15); Morningstar's design system ships a Tabs component | Four long, parallel sections; one row; each tab is a self-contained job. NN/g: tabs "suit a few long sections". | NN/g, *Tabs, Used Right*: when users "must repeatedly switch between tabs to compare or reference information… a tab-based design taxes users' short-term memory, increases cognitive load and interaction cost." A fund page *is* cross-reference (expense on Overview vs return on Performance). Avoid when "all content is equally important". | [NN/g Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/) · [NN/g Tabs vs Accordions](https://www.nngroup.com/videos/tabs-vs-accordions/) · [Morningstar DS](https://designsystem.morningstar.com/components/tabs/) |
| **One long scroll with a sticky section strip** (mini-IA at the top, current-section indicator) | One Digital's fund page (`one-digital-explore.webp`: chart → stats → distribution → holdings → what-if → returns & ranking → riskometer → accordions → Invest); INDmoney (board #16–17) | NN/g: "long pages work well with mini-IAs… that tell users what the page is about and implement direct access to the various sections"; "if the list of in-page links stays in place as users scroll, it should show users' current location". Everything is scannable; nothing hidden; cross-reference is a flick. | NN/g also: "in-page links push down content" on mobile; a 5,000px page needs a bottom-of-scroll "back to top". A sticky strip costs ~40pt permanently. | [NN/g In-page links](https://www.nngroup.com/articles/in-page-links-content-navigation/) · [NN/g Anchors OK?](https://www.nngroup.com/articles/in-page-links/) · [uxdesign.cc sticky in-page nav](https://uxdesign.cc/porting-long-scroll-content-to-a-small-screen-a-different-approach-to-sticky-in-page-navigation-ca94f15262fe) |
| **Progressive accordions** below a fixed top block | INDmoney (Expense · Fund management · Fund house · Pros & cons — board #17); Paytm Money (Other info · Managed by · Risk & rating · Holdings — board #18); One Digital's tail (About · Manager · Expense & exit load) | NN/g: accordions "fit many short ones" and "reduce page length by doubling as both section headings and content container controls" — preferable to in-page links on mobile *for prose*. | NN/g: accordions "diminish content visibility and increase interaction cost" — wrong for the numbers the advisor came for. Baymard (checkout study): inline accordions/tabs break predictability — "which fields will be submitted". Not directly a read-page finding, but the same "what is hidden?" doubt. | [NN/g In-page links](https://www.nngroup.com/articles/in-page-links-content-navigation/) · [Baymard accordion & tab pitfalls](https://baymard.com/blog/accordion-and-tab-design) |

**The read, for a numbers page at 375pt.** The evidence favours a **hybrid** and the owner's own app
already has its shape: a fixed top block (name · category chips · the one headline number · the
chart), then **one scroll with a sticky section strip** for every section that holds *numbers*
(stats, holdings, returns & ranking, riskometer, held-by-your-clients), and **accordions only for
prose** (About, Manager, Expense & exit load text). Tabs lose because a fund page is a
cross-reference task, and NN/g's rule is explicit about that. If tabs stay (Groww's four are the
Indian convention advisors know), keep one row of four and duplicate the two deciding numbers into
every tab's head so switching is not remembering.

---

## D · Compare on a phone

| Pattern | Who | What it looks like | Where it breaks | Source |
| --- | --- | --- | --- | --- |
| **Side-by-side columns** | Angel One (board #20–22: two columns, row labels left, sections Basics · Min investment · Fund size · Ratings · Holdings · Sectors); INDmoney compare (2–4 funds, six sections, ₹10,000 growth chart); Value Research (up to 5, web) | Row-header column locked, fund columns beside | NN/g: "on smaller screens, limit side-by-side comparisons to 2 items"; "the leftmost column… should be locked in place"; "it must be apparent that there is more data beyond the horizontal fold" (arrows beat dots). At 375pt with 3 funds, each column is under 100pt; numbers with ₹ and % wrap. **Groww disabled compare on the app entirely** — web only, up to 3. | [NN/g Comparison tables](https://www.nngroup.com/articles/comparison-tables/) · [NN/g Mobile tables](https://www.nngroup.com/articles/mobile-tables/) · [Groww blog](https://groww.in/blog/groww-feature-update-now-compare-mutual-fund-schemes-easily) · [INDmoney compare](https://www.indmoney.com/mutual-funds/compare) · [Value Research](https://www.valueresearchonline.com/stories/51638/how-to-compare-mutual-funds-using-value-research-fund-compare-tool/) |
| **Stacked cards** (one fund per card, same field order) | Apple's iPhone compare on mobile — "reproduced using the conventional vertical scrolling format" instead of the desktop horizontal columns | Each card repeats the field labels | NN/g: converting to lists/tabs is "less effective for decision-making since users must remember attributes across products". Fine for 2, useless for 4. | [siteIQ on apple.com](https://siteiq.net/17316/apple-com-takes-on-the-horizontal-scroll) · [apple.com/iphone/compare](https://www.apple.com/iphone/compare/) |
| **Difference-only / verdict-first** | Best Buy "Highlight Differences" toggle (via NN/g); INDmoney opens every compare with **Pros and Cons** ("larger AUM within category", "beats FD returns for both 3Y and 5Y") — a verdict before the grid | A switch that hides identical rows; or a sentence per fund that says what differs | Needs the data to be comparable and complete; with Sentinel's five known fields most rows *are* different, so the toggle has little to hide. The verdict sentence is the transferable half. | [NN/g Comparison tables](https://www.nngroup.com/articles/comparison-tables/) · [INDmoney compare](https://www.indmoney.com/mutual-funds/compare) |
| **Dumbbell chart** (one row per metric, two dots joined) | Data-viz canon (Visa DS, Domo); Sentinel already has `Dumbbell` on the spec pages | Each metric is a row; the gap is the message | "Designed for exactly 2 data points… avoid when you have more than 2 groups"; "use clearly different colours or filled vs hollow dots" — with one accent, filled vs hollow is the way. Metrics on different scales need one row per unit, not one axis. | [Visa Product Design System](https://design.visa.com/data-visualization/charts/dumbbell-plot/) · [Domo](https://www.domo.com/learn/charts/dumbbell-plot-chart) · [Nightingale](https://medium.com/nightingale/the-dumbbell-plot-a-how-to-guide-5dafd1d67581) |

**The 3+ rule, from the evidence.** NN/g caps a comparison table at **5 items** and at **2 on a
phone**; beyond that "add other mechanisms such as filters to help users narrow down… to 5 or
fewer." So: **two funds side-by-side** (locked label column, ≥ 2 columns of numbers, arrow for
overflow); **three or more becomes a ranked list on one metric at a time** (a metric picker above,
the list re-sorts) — that is the list the explorer already has. The dumbbell is the two-fund
*chart*; the columns are the two-fund *table*; the verdict sentence goes above both.

---

## E · Filter UI at 375pt

| Pattern | Who | How applied filters show and clear | Counts | Source |
| --- | --- | --- | --- | --- |
| **Full-screen filter sheet, apply button carries the count** | Zerodha Coin (board #05: Sort by · Categories · Risk · Ratings · Fund house, "Index funds only" toggle, **"View 1,731 funds"** button; "Clear all" top right); Angel One (board #09: Popular · Asset class · Fund house · Category as a chip panel) | Chips on the list head after apply (Coin board #06) | Live on the button — Baymard: "Always include a prominent 'Show X Results' button that dynamically updates as selections are made." | [Baymard filter UI](https://baymard.com/learn/ecommerce-filter-ui) · Coin support (above) |
| **Inline chip rail** above the list | Spotify (type chips under the search field); Groww ("filter chips… immediate visual feedback on active filters"); Angel One (All · Large Cap · Mid Cap · Flexi Cap — board #09); Blinkit (four brand chips atop a generic search) | Tap to toggle; selected state is the only state | Count in the list head ("1,656 Funds") | [RouteNote](https://routenote.com/blog/spotify-adds-filters-to-search-results-on-the-mobile-app/) · [Groww SIP case study](https://medium.com/@mestriabhishek/invest-with-ease-revamping-growws-mutual-fund-sip-flow-efb3acd3bbe) |
| **"Add a filter" picker** (choose a field, then a value) | Notion database filters; Linear; Journey C's `add` verb is this in words | Each filter is a removable chip; edit by tapping the chip | Count updates per add | [Notion views & filters](https://www.notion.com/help/views-filters-and-sorts) |
| **Typed** (the sentence becomes the filter) | Zillow, Airbnb What box, Google AI Mode, Redfin, Booking's AI filter box *inside* the filter sheet, Journey C | Zillow/Google: invisible (the anti-pattern); Journey C: three removable chips (right) | Redfin says "no matches" and asks to relax one; Journey C says "0 funds match — drop one" | Section A |

**Rules the evidence gives.** NN/g: on mobile prefer **batch** filtering — "even with the new tray
design pattern… page loads are often slow on the go" — so a sheet with an apply button, not live
re-rendering behind a half-open sheet. Baymard: **20% of sites fail to keep applied filters
visible**; surface them "as removable chips in the main results view" and keep the filter trigger
sticky. Counts beside options ("Equity (612)", as One Digital does) is "one of the single
highest-impact improvements you can make to a filter UI". Material 3: input chips **require** a
trailing remove icon; label ≤ 20 characters; secondary action needs a 48dp target — which at
Sentinel's 11.5px type means the chip row, not the ×, is the tap.

---

## Patterns worth stealing — one product each

1. **The list is real and the sentence drives it** — *KAYAK Ask AI.* Results page stays the product's
   results page; chat refines it live. V2's spine.
2. **Swipe-down is back; the sheet peeks, never replaces** — *Amazon Rufus* (mirrored) + *Google Maps'*
   three detents. The V2 sheet: peek (count + 3), half (list), full (list + rail); no scrim; thread
   readable behind; composer always below.
3. **Two refine doors, named differently** — *Spotify Prompted Playlists*: "Edit prompt" (change the
   sentence) vs "Refine" (change the list). Sentinel: edit the chips vs edit the shortlist.
4. **Zero results relaxes in words, in place** — *Redfin*. Keep the list surface up, say what failed,
   offer the one chip to drop. Journey C has the copy; it lacks the surface.
5. **Two levels then a counted list, with the path as chips on the list head** — *Zerodha Coin*
   (Explore → category → "1,731 funds", chips above). V1's funnel depth and its breadcrumb.
6. **Verdict before the grid** — *INDmoney compare* opens with Pros and Cons per fund. One sentence
   per fund that names what differs, then the two-column table, then the dumbbell.
7. **Counts beside every option and on the apply button** — *One Digital* ("Equity 612 funds") and
   *Coin* ("View 1,731 funds"). Baymard calls option counts the highest-impact filter fix.
8. **A typed field inside the filter sheet** — *Booking.com's AI filter box.* The cheapest V1/V2
   bridge: the top row of the filter sheet is "Describe it", and what it parses lands as checked
   options below — visibly.

## Anti-patterns

1. **Filters you cannot see** — *Google AI Mode*, *Zillow*: the sentence sets state the user never
   sees. An advisor must be able to read the applied filters aloud to a client. Chips, always.
2. **Re-sending the list every turn** — Journey C today. Canvas/Artifacts show the alternative: one
   object, mutated in place. Threads of stale tables are why "2–3 funds, bas" lands.
3. **Tabs for cross-reference content** — *Groww's* four tabs force the advisor to remember expense
   while reading returns; NN/g's rule against it is explicit.
4. **Three-plus columns at 375pt** — Groww turned compare off on the app rather than ship it; NN/g
   caps a phone at two. Do not draw four columns of ₹ and %.
5. **Chat as a text answer to a filter question** — *Notion AI* returns prose, not a view. If the
   sentence cannot become a saved, editable view, it is a demo.
6. **The quiz that ends in one answer** — *Wealthfront's* one portfolio is right for a robo and wrong
   for an MFD, whose "recommend" is regulated. End a guided path in a counted, sortable list, never
   in "the fund".

---

## Needs the main session's browser

These are the screens I could not pull as images. Each is one intent; run as written (Mobbin deep,
iOS), or the Pinterest/Dribbble search where named. `queries.json` beside this file carries the same
list in the skill's re-runnable format.

| # | Where | Query | Why |
| --- | --- | --- | --- |
| 1 | Mobbin flows | Amazon Rufus — open Rufus from search bar, ask, swipe chat sheet down to results | The exact sheet-over-list gesture and its detents |
| 2 | Mobbin screens | Google Maps search results bottom sheet at peek, half and full over the map | Three-detent grammar, header treatment at each stop |
| 3 | Mobbin flows | Redfin app conversational home search — describe, no matches, relax a criterion | Where the conversation sits relative to the map and list |
| 4 | Mobbin screens | Zillow search results after a natural-language query — how parsed filters appear above the list | Whether typing produces visible chips |
| 5 | Mobbin flows | Spotify Prompted Playlist — create, generate, tap Refine, tap Edit prompt | Whether the list stays on screen while refining |
| 6 | Mobbin screens | Perplexity iOS answer with Sources expander collapsed and expanded | The mobile collapse of a parallel region |
| 7 | Mobbin screens | Perplexity shopping product cards inside an answer with View more panel | Card-in-thread → panel anatomy |
| 8 | Mobbin flows | Booking.com filter sheet with the AI filter text box, type a request, see options check themselves | The typed field inside the filter sheet |
| 9 | Mobbin screens | Airbnb filter sheet with the "Show N places" button updating as filters change | The live-count apply button, exact copy |
| 10 | Mobbin screens | Zerodha Coin fund page — Overview with sticky header, scroll to returns and holdings | One-scroll fund page vs Groww's tabs, for section C |
| 11 | Mobbin screens | INDmoney compare mutual funds — Pros and Cons block above the side-by-side table | Verdict-before-grid on a phone |
| 12 | Mobbin flows | Nike Running Shoe Finder — eight questions to three results, then back to change an answer | How a quiz lets you revise a step |
| 13 | Mobbin screens | Kayak mobile web AI Mode — chat panel beside or over live results | The V2 spine on a phone; no source described it |
| 14 | Pinterest | "sticky section navigation mobile fund detail page" · "dumbbell chart two series mobile" | Aesthetic seeds for the scroll strip and the two-fund chart |
| 15 | Dribbble (last 12 months) | "mutual fund compare mobile" · "filter bottom sheet apply button count" | Aesthetic signal only — not usability evidence |

**Also unverified and worth a look in the product itself:** Zepto's search → filter → sort sheet
(the Medium case study returned 403); Kuvera by CRED's current Explore (reviews say it changed);
whether Groww's filter chips persist on scroll; Value Research's compare (five funds) on the phone.

---

## Sources consulted, by section

**A.** [KAYAK Ask AI](https://www.kayak.com/news/ask-ai/) · [TechCrunch Kayak](https://techcrunch.com/2025/10/16/kayak-launches-an-ai-mode-for-travel-questions-search-and-bookings/) · [Amazon Rufus](https://www.aboutamazon.com/news/retail/amazon-rufus) · [How to use Rufus](https://www.aboutamazon.com/news/retail/how-to-use-amazon-rufus) · [Redfin conversational search](https://www.redfin.com/news/redfin-debuts-conversational-search/) · [Zillow NL search](https://zillow.mediaroom.com/2024-09-04-Zillows-AI-powered-home-search-gets-smarter-with-new-natural-language-features) · [Skift Airbnb What box](https://skift.com/2025/11/06/airbnb-is-testing-a-what-box-for-natural-language-search/) · [Google AI Mode Sept 2025](https://blog.google/products-and-platforms/products/search/search-ai-updates-september-2025/) · [Perplexity citations teardown](https://aiuxplayground.com/teardowns/perplexity/citations/) · [Booking AI Trip Planner](https://news.booking.com/bookingcom-launches-new-ai-trip-planner-to-enhance-travel-planning-experience/) · [Skift Booking update](https://skift.com/2024/10/30/booking-coms-ai-trip-planner-got-a-big-update-heres-how-it-works/) · [Spotify Prompted Playlists](https://support.spotify.com/us/article/prompted-playlists/) · [RouteNote Spotify chips](https://routenote.com/blog/spotify-adds-filters-to-search-results-on-the-mobile-app/) · [OpenAI Canvas](https://openai.com/index/introducing-canvas/) · [Destiner command palette](https://destiner.io/blog/post/designing-a-command-palette/) · [Notion AI](https://www.notion.com/help/guides/everything-you-can-do-with-notion-ai) · [Klarna](https://www.klarna.com/international/press/shopping-made-smarter-klarna-adds-more-ai-features-to-its-assistant-powered-by-openai/) · [Expedia Romie](https://www.expedia.com/newsroom/spring-product-release-2024) · [Google Flights Explore](https://thriftytraveler.com/guides/google-flights/explore/) · [Maps sheet](https://doveletter.dev/articles/flexible-bottomsheet-google-maps) · [Groww MCP](https://groww.in/updates/groww-mcp) · [Kite MCP](https://zerodha.com/z-connect/featured/connect-your-zerodha-account-to-ai-assistants-with-kite-mcp) · [INDmoney MCP](https://www.indmoney.com/mcp)

**B.** [Wealthfront onboarding](https://goodux.appcues.com/blog/wealthfront-personalized-ux-copy) · [Betterment allocation](https://www.betterment.com/resources/recommended-allocation-methodology) · [Nike shoe finder](https://news.solesavy.com/nike-introduces-their-running-shoe-finder/) · [Sephora quiz teardown](https://fineflows.formsort.com/flow/sephora-skincare-routine-quiz) · [Warby quiz](https://www.warbyparker.com/quiz/frames) · [Coin filtered search](https://support.zerodha.com/category/mutual-funds/understanding-mutual-funds/getting-started-with-coin/articles/basic-filtered-search) · [Kuvera all funds](https://kuvera.in/mutual-funds/all) · [smallcase how to invest](https://www.smallcase.com/learn/how-to-invest-in-smallcase/) · [Robinhood Collections](https://robinhood.com/newsroom/robinhood-now-on-web/) · [Public themes](https://medium.com/the-public-blog/a-new-way-to-discover-stocks-etfs-on-public-45295f39407) · [Apple Music browse](https://support.apple.com/en-gu/guide/iphone/iph2c41e6189/ios) · [Spotify genre/mood filters](https://newsroom.spotify.com/2021-02-25/how-to-sort-your-favorite-songs-with-spotifys-new-genre-and-mood-filters/) · [Netflix personalization](https://gibsonbiddle.medium.com/a-brief-history-of-netflix-personalization-1f2debf010a1) · [IKEA Kreativ](https://www.ikea.com/us/en/newsroom/corporate-news/ikea-launches-new-ai-powered-digital-experience-empowering-customers-to-create-lifelike-room-designs-pub58c94890/) · [Notion templates](https://www.notion.com/templates/category) · [Figma Community](https://help.figma.com/hc/en-us/articles/360038510693-Guide-to-the-Figma-Community)

**C.** [NN/g Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/) · [NN/g Tabs vs Accordions](https://www.nngroup.com/videos/tabs-vs-accordions/) · [NN/g In-page links](https://www.nngroup.com/articles/in-page-links-content-navigation/) · [NN/g Anchors OK?](https://www.nngroup.com/articles/in-page-links/) · [Baymard accordion/tab pitfalls](https://baymard.com/blog/accordion-and-tab-design) · [Morningstar DS Tabs](https://designsystem.morningstar.com/components/tabs/)

**D.** [NN/g Comparison tables](https://www.nngroup.com/articles/comparison-tables/) · [NN/g Mobile tables](https://www.nngroup.com/articles/mobile-tables/) · [Groww compare](https://groww.in/blog/groww-feature-update-now-compare-mutual-fund-schemes-easily) · [INDmoney compare](https://www.indmoney.com/mutual-funds/compare) · [Value Research compare](https://www.valueresearchonline.com/stories/51638/how-to-compare-mutual-funds-using-value-research-fund-compare-tool/) · [siteIQ Apple compare](https://siteiq.net/17316/apple-com-takes-on-the-horizontal-scroll) · [Visa DS dumbbell](https://design.visa.com/data-visualization/charts/dumbbell-plot/) · [Domo dumbbell](https://www.domo.com/learn/charts/dumbbell-plot-chart)

**E.** [Baymard filter UI](https://baymard.com/learn/ecommerce-filter-ui) · [Baymard product lists 2025](https://baymard.com/blog/current-state-product-list-and-filtering) · [NN/g batch vs interactive](https://www.nngroup.com/articles/applying-filters/) · [Material 3 chips](https://m3.material.io/components/chips/guidelines)
