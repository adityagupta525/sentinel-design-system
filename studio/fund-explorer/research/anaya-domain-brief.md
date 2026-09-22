# Fund Explorer — Domain & Compliance Brief

**Author:** Anaya, Domain & Compliance Strategist, Fable Design Studio
**For:** the Fund Explorer redesign (three variations, multi-asset shelf)
**Date:** 22 Sep 2026
**Status:** research complete; items marked **[COMPLIANCE TO CONFIRM]** must be closed by Centricity compliance before hi-fi.

I am not a lawyer. Every rule below carries its primary source (SEBI, AMFI, APMI, IFSCA, RBI) and the circular number and date. Where I could only find a secondary account, or where the rule is contested, the entry says so explicitly. The sources were read at source — the March 2026 Master Circular for Mutual Funds (748 pages), the SEBI (Mutual Funds) Regulations 2026 as gazetted, the 26 Feb 2026 categorisation circular, the AMFI Master Circular for MFDs (14 Jan 2026), the IA Regulations as amended to 25 Nov 2025, the PMS and AIF master circulars, the IFSCA Fund Management Regulations 2025 and the OBPP circular — not from summaries.

---

## 0. What changed in 2025–26 that the team may not know

The regulatory ground moved under this product in the last nine months. Four changes decide the explorer's vocabulary and numbers:

1. **SEBI (Mutual Funds) Regulations, 2026** replaced the 1996 regulations. Notified 14 Jan 2026, in force **1 Apr 2026**. "Total Expense Ratio" is redefined: **TER = Base Expense Ratio (BER) + brokerage + transaction cost + statutory levies** (Reg 67). The caps the explorer shows are now **BER** caps, and they are lower. [SEBI (MF) Regs 2026, Reg 66(7), 66(9), 67 — sebi.gov.in/legal/regulations/jan-2026/…_99173.html]
2. **Master Circular for Mutual Funds, 20 Mar 2026** (HO/24/13/11(1)2026-IMD-POD-1/I/7602/2026), effective 1 Apr 2026, supersedes the 27 Jun 2024 master circular. Paragraph numbers in this brief are from the 2026 edition. [sebi.gov.in/legal/master-circulars/mar-2026/master-circular-for-mutual-funds_100491.html]
3. **Categorisation circular, 26 Feb 2026** (HO/24/13/15(2)2026-IMD-RAC4/I/5764/2026) supersedes the 2017 categorisation. The groups are now **Equity · Debt · Hybrid · Life Cycle Funds · Other** — Solution Oriented is discontinued; several debt categories are **renamed** (e.g. "Low Duration" → "Ultra Short to Short Term Fund"; "Dynamic Bond" → "Dynamic Term Fund"). The explorer's filter vocabulary must be this list, not the 2017 one. [sebi.gov.in/legal/circulars/feb-2026/…_99983.html]
4. **Riskometer colours are prescribed with hex codes** since 5 Dec 2024 (SEBI/HO/IMD/PoD1/CIR/P/2024/150, now Master Circular ¶6.16.1(d)). The design system cannot pick its own six colours.

Also live: **PaRRVA** (verified past-performance claims by RIAs/RAs) is fully operational from **4 May 2026**; SEBI has proposed a **Credit Risk-o-Meter for bonds** (consultation 13 Aug 2026, comments closed 3 Sep 2026) which would land on OBPP web/mobile screens 30 days after the circular issues.

---

## 1. What MUST be on a fund surface (India, 2026)

Scope note: SEBI's advertisement and product-labelling rules bind AMCs directly. They bind Centricity in two ways: (a) the **AMFI Code of Conduct for MFDs** requires distributors to follow SEBI's advertising/sales-literature rules and to make "performance disclosures" that "comply with the requirements specified by SEBI" (Code ¶B.2.a); (b) the **EOP minimum disclosures** (Master Circular Annexure 12A) are SEBI's own statement of what a scheme listing on a digital platform must carry. I treat the AMC rules as the floor for any screen that shows a scheme's performance.

### 1.1 The regulator's own "fund card" — EOP Annexure 12A

SEBI has written down the minimum a digital platform must show per scheme. It is the closest thing to a mandated fund-card spec and I recommend the explorer adopt it verbatim as the floor for MF cards and fund pages:

> 1. Name of the Mutual Fund; link to the Mutual Fund website. 2. Name of the scheme; **type and category** of the scheme. 3. Name of the Fund Manager. 4. Investment objective. 5. **Scheme performance along with source.** 6. Scheme details: **minimum investment, AUM, NAV, Exit Load, Expense Ratio.** 7. **Risk-o-Meter of the scheme and Potential Risk [Class] Matrix, wherever applicable.** 8. Other mandatory disclosures. 9. Any other details SEBI specifies.
> — Master Circular 20 Mar 2026, Annexure 12A (inserted by SEBI/HO/IMD/IMD-I-PoD1/P/CIR/2023/86, 13 Jul 2023)

The same chapter (¶19.10.4(a)(ii)) requires the screening tool to filter "based on the criteria selected by the investor including past performance, AUM, etc." and to "ensure that there is **no auto display of recommendation or ranking** of any of the schemes." Research or opinions used in filtering "shall be only by SEBI registered intermediaries … [and] should disclose the methodology." Formally this binds EOPs (direct-plan platforms); as a statement of SEBI's expectation of any MF screening UI it is the safest design floor. **[COMPLIANCE TO CONFIRM: whether Centricity's regular-plan explorer is held to ¶19.10.4 by analogy.]**

### 1.2 Riskometer

| Rule | Source |
|---|---|
| Six levels: **Low · Low to Moderate · Moderate · Moderately High · High · Very High**. | Master Circular ¶6.16.1(d); SEBI/HO/IMD/DF3/CIR/P/2020/197 (5 Oct 2020) |
| Prescribed colours (mandatory "for all digital and polychrome printed promotion materials/disclosures"): Low **Irish Green #08A04B** · Low to Moderate **Chartreuse #7FFF00** · Moderate **Neon Yellow #FFFF33** · Moderately High **Caramel #C68E17** · High **Dark Orange #FF8C00** · Very High **Red #F70D1A**. | ¶6.16.1(d)–(e); SEBI/HO/IMD/PoD1/CIR/P/2024/150 (5 Nov 2024), effective 5 Dec 2024 |
| Caption wording: **"The risk of the scheme/benchmark is [level of risk]"**. | ¶6.16.1(f) |
| Where it must appear: **wherever the performance of the scheme is disclosed**; and the **benchmark's riskometer too wherever performance vs benchmark is shown**. | ¶6.17.1(a)–(b); SEBI/HO/IMD/IMD-II DOF3/P/CIR/2021/621 (31 Aug 2021) |
| Also on: front page of SID/KIM/application form, common application form, and scheme advertisements "prominently visible". | ¶6.16.3, ¶6.17.2 |
| Evaluated monthly; disclosed with portfolio on AMC and AMFI sites within 10 days of month-end. Changes go to unitholders by Notice-cum-Addendum + email/SMS in the "existing → revised" two-column format. | ¶6.16.1(i)–(j) |
| A disclaimer that investors should consult their financial advisers if unsure about suitability. | ¶6.16.1(m) |
| Risk-value bands (for the data team): ≤1 Low; >1–2 Low to Moderate; >2–4 Moderate; >4–6 Moderately High; >6–8 High; >8 Very High. | 2020/197 circular; Annexure 10 |

**UI implication.** Every performance number on any MF surface — card, compare table, overlap view, chart — needs the scheme riskometer beside it; a benchmark line on a chart needs the benchmark's riskometer too. The riskometer is a **pictorial meter**, so a text chip alone does not satisfy ¶6.16.1(c). The "as on" month of the riskometer should be shown because it changes monthly.

### 1.3 Potential Risk Class (PRC) matrix — debt schemes

All debt schemes sit in one of 9 cells: interest-rate risk **Class I (MD ≤ 1y) / II (MD ≤ 3y) / III (any)** × credit risk **Class A (CRV ≥ 12) / B (CRV ≥ 10) / C (CRV < 10)**. The matrix is disclosed on the front page of the SID; cell changes go to unitholders by SMS + website link; a move to a higher-risk cell is a fundamental-attribute change. [Master Circular ¶6.18; SEBI/HO/IMD/IMD-II DOF3/P/CIR/2021/573, 7 Jun 2021, effective 1 Dec 2021]. Annexure 12A lists "Potential Risk Matrix, wherever applicable" as a minimum disclosure — so **a debt fund card carries both the riskometer and its PRC cell** (e.g. "A-I").

### 1.4 Scheme categorisation — the filter vocabulary (26 Feb 2026 circular)

Five groups. Names below are the regulator's, verbatim. **Scheme names must equal the category name** and the "type of scheme" line (third column of SEBI's tables) must appear **below the scheme name in offer documents, advertisements and marketing material** (¶2.6.5). Words that emphasise return may not appear in scheme names.

**A. Equity (13):** Multi Cap Fund · Large Cap Fund · Large & Mid Cap Fund · Mid Cap Fund · Small cap Fund · Flexi Cap Fund · Dividend Yield Fund · Value Fund · Contra Fund · Focused Fund (No. of Stocks) · Sectoral Fund · Thematic Fund · ELSS – Tax Saver Fund.
Notable 2026 rules: Dividend Yield / Value / Contra / Focused / ELSS now need **80%** equity (was 65%); an AMC may offer **both** Value and Contra if portfolio overlap ≤ 50%; sectoral/thematic schemes may overlap ≤ 50% with other equity schemes (3-year glide path); **AMCs must publish category-wise portfolio overlap monthly** (Master Circular ¶3.8.10).

**B. Debt (17):** Overnight Fund · Liquid Fund · Ultra Short Term Fund (MD 3–6m) · **Ultra Short to Short Term Fund** (MD 6–12m; replaces "Low Duration") · Money Market Fund · Short Term Fund (MD 1–3y) · Medium Term Fund (MD 3–4y) · Medium to Long Term Fund (MD 4–7y) · Long Term Fund (MD > 7y) · **Dynamic Term Fund** (replaces "Dynamic Bond") · Corporate Bond Fund (≥80% AA+ and above) · Credit Risk Fund (≥65% AA and below) · Banking and PSU Debt Fund · Gilt Fund · 10-year Constant Maturity Gilt Fund · Floating Interest Rates Fund · **Sectoral Fund** (new; Financial Services, Energy, Infrastructure, Housing, Real Estate).

**C. Hybrid (7):** Conservative Hybrid Fund · Balanced Hybrid Fund · Aggressive Hybrid Fund · Dynamic Asset Allocation Fund · Multi Asset Allocation · Arbitrage Fund · Equity Savings.

**D. Life Cycle Funds (1, new):** open-ended, pre-determined maturity (5–30 years), glide path from equity to debt; graded exit loads 3%/2%/1%. Replaces Retirement and Children's funds, which **stopped fresh subscriptions on 26 Feb 2026** (¶2.6.3.16).

**E. Other (2):** Index Funds/ETFs · FoFs (Overseas/Domestic).

Market-cap definitions (Master Circular ¶3.9): Large Cap = 1st–100th by full market cap; Mid Cap = 101st–250th; Small Cap = 251st onward; AMFI publishes the list half-yearly.

**UI implication.** The 2017 list (36 categories) that most data vendors still ship is **wrong** for 2026 in at least four names and one whole group. The filter must be driven by the AMFI/SEBI category code, with a display-name map maintained against the 26 Feb 2026 tables. Legacy "Children's Fund" / "Retirement Fund" holdings still exist in client books and must be labelled "closed to new investment".

### 1.5 Past-performance display rules (advertisement code, applied to any performance surface)

From Master Circular Chapter 14 (¶14.2, ex-CIR/IMD/DF/23/2017 of 15 Mar 2017) and ¶6.9.1:

| Rule | Para |
|---|---|
| Performance in **CAGR for at least 1, 3, 5 years and since inception**. AMFI-website disclosure adds **10 years**. | ¶14.2.1(a); ¶6.9.1(a) |
| **Point-to-point value of ₹10,000** invested, alongside the CAGR. | ¶14.2.1(b) |
| Figures computed from the **last day of the month-end preceding** the display date (i.e. month-end data, not live). | ¶14.2.1(c) |
| State whether it is the **Regular or Direct plan**, with a footnote that different plans have a different expense structure. | ¶14.2.1(d) |
| If the fund manager has not managed the scheme for the whole period shown, say so in a footnote. | ¶14.2.1(e) |
| **< 6 months old: no past performance.** 6–12 months: simple annualised growth for the past 6 months and since inception. | ¶14.2.2 |
| Overnight / Liquid / Money Market funds may show **simple annualised yields for 7, 15 and 30 days**. | ¶14.2.3 |
| Show the same returns for the **scheme benchmark and the additional benchmark** (equity: Sensex/Nifty; short debt & arbitrage: 1-yr T-Bill; other debt & conservative hybrid & equity savings: 10-yr G-Sec; other hybrids: Sensex/Nifty). | ¶14.2.4 |
| Returns vs benchmark must be against the **Total Return Index** (TRI). | ¶6.9.1(a); SEBI/HO/IMD/DF3/CIR/P/2018/04 (4 Jan 2018), effective 1 Feb 2018 |
| Benchmarks are **two-tier**: Tier 1 = category benchmark (published by AMFI), Tier 2 = optional style benchmark; all TRI. | ¶7.22; SEBI/HO/IMD/IMD-II DF3/P/CIR/2021/652 (27 Oct 2021) |
| Performance of the scheme requires performance of **all other schemes managed by the same fund manager** (top 3 / bottom 3 if more than six; a link is acceptable in internet media). | ¶14.2.5 / ex-13.3.6 |
| Since-inception is from the **date of allotment**. | ¶6.9.1(a) |
| Schemes < 1 year old are exempt from the AMFI performance disclosure except overnight/liquid/ultra-short/low-duration/money-market. | ¶6.9.1(a) proviso |

**Rolling returns.** No SEBI rule requires or forbids rolling returns. They are permitted additional information as long as the mandated point-to-point set is present and the display is not misleading (Fifth Schedule (a)–(c)). AMFI's illustration circular (BP 109) itself uses "mean of 10-year rolling returns" as a benchmark basis — so rolling is an accepted concept. **[COMPLIANCE TO CONFIRM: show rolling returns on the fund page as a secondary tab, never in place of the CAGR table.]**

**Information Ratio.** Equity schemes must disclose IR daily alongside performance on AMC websites; AMFI publishes it machine-readable. IR = (portfolio return − Tier 1 benchmark return) / SD of excess return, on daily returns. [¶6.10; SEBI/HO/IMD/IMD-PoD-2/P/CIR/2025/6, 17 Jan 2025]. This is the **only risk-adjusted metric SEBI has standardised**; Sharpe/Sortino/alpha/beta are industry conventions with no regulatory definition — label their computation basis when shown.

### 1.6 Standard warning and past-performance disclaimer

- Standard warning, exactly fourteen words, no addition or deletion: **"Mutual Fund investments are subject to market risks, read all scheme related documents carefully."** [SEBI (MF) Regs 2026, Fifth Schedule (i); vernacular versions required for vernacular ads (j)]
- Past-performance disclaimer wording used by AMFI in its own guideline: **"past performance may or may not be sustained in future and is not a guarantee of any future returns"**. [AMFI Best Practices Guidelines Circular 135/BP/109/2023-24, 1 Nov 2023, ¶7]. SEBI has not fixed the exact words for this one; AMFI's is the industry standard and the safe choice.
- **No future returns may be shown, even as illustration**, on scheme-related material (BP 109 ¶8). Goal/SIP calculators on non-scheme material may use 2%–13% and must not be tied to any scheme (¶9). Disclaimer font must be "commensurate with the other sections" (¶10) — no fine print.

### 1.7 Direct vs Regular plan disclosure

- Every scheme has a Direct plan with lower expenses and a separate NAV. [Master Circular ¶3.4; CIR/IMD/DF/21/2012, 13 Sep 2012, effective 1 Jan 2013]
- Expenses, half-yearly returns and yields must be disclosed **separately for Direct and Regular**, and "for all other regulatory disclosures where expenses, expense ratio, returns and/or yield … are required to be disclosed, separate disclosures shall be made for both". [SEBI/HO/IMD/PoD1/CIR/P/2024/150, ¶3–5, effective 5 Dec 2024]
- Performance displays must say which plan they are (¶14.2.1(d)).
- **MFDs cannot deal in Direct Plans.** On any MFD digital platform it must be "categorically disclosed that the scheme the investor is subscribing to is of Regular Plan which involves payment of commission to MFD", with a **prominent hyperlink to the MFD's commission rates** for competing schemes and a **prominent link to SID/SAI/KIM** on the same page. [AMFI Code of Conduct for MFDs ¶B.4.f, citing SEBI letter SEBI/IMD1/DoF-1/SK/2021/25517/1 of 6 Sep 2021]
- Gross commission paid to the distributor and the scheme's average TER appear in the investor's half-yearly CAS. [SEBI circular on Consolidated Account Statement, Sep 2016 — circular number to verify]

**UI implication.** The explorer, when an MFD is acting, shows **Regular-plan** numbers by default with an explicit "Regular Plan · includes distributor commission" label, the commission link and the document link **on the fund page**, not buried in a footer.

### 1.8 Expense ratio — BER caps by AUM slab (SEBI (MF) Regs 2026, Reg 66(7))

Open-ended active schemes, as % of daily net assets:

| Slab | Equity-oriented | Other than equity |
|---|---|---|
| First ₹500 cr | 2.10% | 1.85% |
| Next ₹250 cr | 1.90% | 1.65% |
| Next ₹1,250 cr | 1.60% | 1.40% |
| Next ₹3,000 cr | 1.50% | 1.25% |
| Next ₹5,000 cr | 1.40% | 1.15% |
| Next ₹40,000 cr | −0.05% per ₹5,000 cr or part | −0.05% per ₹5,000 cr or part |
| Balance | 0.95% | 0.70% |

Index funds / ETFs **0.90%**; FoF into liquid/index/ETF **0.90%**; FoF ≥65% equity-oriented **2.10%**; other FoF **1.85%**; close-ended equity **1.00%**, other **0.80%**. Brokerage over BER capped at **0.06%** (cash) / **0.02%** (derivatives) of trade value (Reg 66(9)); exchange/regulatory transaction costs and statutory levies (GST etc.) are outside BER (Reg 66(10), 67). Effective 1 Apr 2026.

Display rules: AMCs disclose **TER daily, scheme-wise and date-wise**, on AMC and AMFI sites in a downloadable format (Master Circular ¶11.2.2, Format 7E); any **BER change is notified to investors ≥ 3 working days ahead** (¶11.4.1). Direct-plan fees may not exceed Regular under any head (¶11.3.5).

**UI implication.** Show "Expense ratio (TER)" with its **as-on date** and the plan; if the explorer also shows "BER", label both and never mix. The number a client sees in their CAS is the TER, so the explorer's headline expense figure should be TER.

### 1.9 Exit load

No entry load; exit load, if any, is **credited to the scheme**, not the AMC; no exit load on Regular↔Direct switches within a scheme; Repurchase Price = NAV × (1 − exit load). [Master Circular ¶11.7.1–11.7.3, ¶9.2.1]. Exit load structure is a fundamental scheme detail in SID/KIM and is an Annexure 12A minimum disclosure. Life Cycle Funds carry graded 3%/2%/1% loads (26 Feb 2026 circular, Annexure B).

### 1.10 SID / KIM / SAI access

- **Application forms must be accompanied by the KIM**, printed at ≥ 7-point, updated within two months of each half-year end. [Master Circular ¶1.5; Reg 26]
- **SID and SAI must be "readily available on the website of the mutual fund"**; trustees confirm this to SEBI half-yearly. [¶1.6]
- Simplified SID format in force since 1 Jun 2024 (SEBI/HO/IMD/IMD-RAC-2/P/CIR/2023/000175, 1 Nov 2023). AMFI Code ¶B.4.a/¶B.4.l: MFDs must provide SID/SAI/KIM/addenda/factsheets/portfolio disclosures and "urge their investors to go through SAI/SID/KIM before deciding".
- The digital-platform rule above (Code ¶B.4.f) requires the **SID/SAI/KIM link prominently on the scheme page**.

### 1.11 Small/mid-cap stress-test and liquidity disclosures

Since 15 Mar 2024 AMCs publish, on the 15th of every month, stress-test results for mid- and small-cap schemes — days to liquidate 25% and 50% of the portfolio, plus concentration, valuation (P/E, P/B) and volatility metrics — on their sites and on AMFI's (amfiindia.com/riskparameter). This was directed by SEBI and operationalised by an **AMFI letter of 28 Feb 2024**; I did not locate a SEBI circular number — the SEBI direction was by letter. A tightened 2026 framework (standardised template, impact cost of top holdings, third-party verification, effective 1 Apr 2026) is reported by secondary sources; **I could not find the primary circular on sebi.gov.in** — **[COMPLIANCE TO CONFIRM the 2026 stress-test circular reference]**. AMFI's monthly disclosure format ("Format for disclosure of Stress Test & Liquidity Analysis") is live and is the data source to bind to.

### 1.12 Portfolio overlap disclosure (new, 2026)

AMCs must publish **category-wise portfolio overlap levels monthly** on their websites; SEBI prescribes the methodology (sum of min(w_iA, w_iB) over common ISINs). [Master Circular ¶3.8.10; 26 Feb 2026 circular Annexure A]. This is the regulator's definition of "overlap" — the OverlapView should compute and label overlap **exactly this way** ("Portfolio overlap (SEBI method), as on <month-end>").

### 1.13 NAV and rounding

NAV to **four decimals** for index funds and all debt-oriented schemes; **two decimals** (or more if the AMC chooses) for other schemes. [Master Circular ¶9.1; MFD/CIR/11/16159/2002, 22 Aug 2002]. Display the NAV exactly as the AMC declares it — do not re-round.

### 1.14 What applies to a distributor's app vs an RIA's

| Surface rule | MFD (Centricity as AMFI ARN holder) | RIA |
|---|---|---|
| Riskometer, PRC, category line, standard warning, plan label, TER/exit load, SID/KIM link | Yes — AMFI Code ¶B.2.a/¶B.4 and SEBI performance rules | Yes — IA Reg 18(6) "adequate disclosure … particularly performance track record"; Reg 18(7) "draw the client's attention to the warnings, disclaimers" |
| Regular-plan + commission disclosure and commission-rate link | **Mandatory** (Code ¶B.4.f) | Not applicable — RIA cannot receive commission (Reg 15(2)); an RIA's screen shows **Direct plan** |
| Risk profile before showing suitability language | Suitability information to be sought (Code ¶B.2.d); "appropriateness" for advisory-tagged transactions (Master Circular Ch. 16) | **Mandatory before advice** — Reg 16 and 17, records under Reg 19 |
| Third-party research/ratings | Only from SEBI-registered intermediaries with source + methodology (Master Circular ¶19.10.4 by analogy) | Same; an RIA's own view is advice and must be recorded |
| Past-performance claims about the adviser's own picks | Not permitted to imply returns (Code ¶B.4.g) | Only via **PaRRVA-verified** data, with SEBI's prescribed disclaimers |

---

## 2. What is FORBIDDEN or constrained

### 2.1 The word "recommend" for an MFD

- **Regulation 4(d), IA Regulations 2013**: an MFD registered with AMFI is exempt from IA registration only when "providing any investment advice to its clients **incidental to its primary activity**". Advice that is the primary offer — a curated recommendation feed — falls outside the exemption.
- **Regulation 3(3)**: MFDs may not use "Adviser / Advisor / Financial Adviser / Investment Adviser / Wealth Adviser / Wealth Manager / Consultant" or similar in their name unless SEBI-registered as IA. AMFI Code ¶B.5.g extends this: the MFD "should clearly specify to the client that he/she is acting as a MFD" and must display the tagline **"AMFI-registered Mutual Fund Distributor"** with the ARN, ≥12-pt in print, in **all** communication including website and mobile app.
- Master Circular Chapter 16 (ex-CIR/IMD/DF/13/2011, 22 Aug 2011): distributor relationships are **either "Advisory"** — subject to "appropriateness", i.e. "selling only that product categorization that is identified as best suited for investors within a defined upper ceiling of risk appetite. No exception shall be made" — **or "Execution Only"**, where, if the distributor believes the product is unsuitable, a written unsuitability communication must be acknowledged by the investor before execution. There is "no third categorization". The old SEBI Code of Conduct for intermediaries (SEBI/IMD/CIR No. 8/174648/2009, 27 Aug 2009, ¶3) even says distributors should "recommend schemes appropriate for the investor's risk profile and needs" — so the **verb is not banned**; what is constrained is (a) making advice the primary service, (b) recommending without an appropriateness basis, and (c) recommending with a financial-incentive basis (AMFI Code ¶B.1.c: "financial incentive should not form the basis for recommending any particular scheme").

**Copy ruling for the explorer (MFD mode).** Prefer **"Funds that match your filters"**, "Shortlist", "Compare", "Share with client". Avoid "Recommended for you", "Top picks", "Best funds", "Our picks" as **automatic** labels on a list — that reads as ranking/recommendation (Fifth Schedule (b): ads "shall not contain … any ranking based on any criteria"; ¶19.10.4: "no auto display of recommendation or ranking"). Where an advisor **chooses** to recommend a scheme to a specific client, the UI may call it "Suggested for <client>" only after the appropriateness record exists (risk category on file, category within ceiling). **[COMPLIANCE TO CONFIRM the exact verb set.]**

### 2.2 Guaranteed / assured / indicative language

- AMFI Code ¶B.4.g: MFDs "shall (i) not provide any indicative portfolio or indicative yield or indicative return for any particular scheme or transaction and (ii) abstain from indicating or assuring returns". ¶B.4.h: explain "that MF investments are not guaranteed or assured return products and that the principal amount may be exposed to risk of loss".
- Master Circular ¶13.6/14 (ex-IMD/CIR No.14/151044/09, 19 Jan 2009): "Mutual Funds, AMCs **and distributors** shall not offer any indicative portfolio and indicative yield."
- Fifth Schedule (b): no statements "based on assumption/projections"; (d) no exaggerated slogans.
- PMS Advertisement Code (Annexure 2A ¶1.7): "shall not contain any promise or guarantee of assured/fixed return".
- Hence banned words on every asset class: **guaranteed, assured, fixed return, safe, risk-free, sure, target return (as a promise)**, and any projected value tied to a specific scheme. "Expected IRR" for an AIF is a PPM term the manager discloses; the explorer may quote it **only as "Target IRR as per PPM"**, never as our number.

### 2.3 Rankings and third-party ratings

- **Advertisements** (AMC): "shall not contain any testimonials or **any ranking based on any criteria**" and **no celebrities**. [SEBI (MF) Regs 2026, Fifth Schedule (b), (e)] — this is stricter than the 2017 code.
- **Platforms** (EOP rule, ¶19.10.4): filtering by investor-chosen criteria is fine; **auto-displayed recommendation or ranking is not**; research/opinion inputs must come from **SEBI-registered intermediaries**, cite the **source**, and **disclose the methodology**.
- Ranking mutual fund schemes is treated by SEBI as a **research report**; CRISIL's MF ranking is run under a Research Analyst registration (INH000007854). [SEBI RA Regulations 2014; CRISIL MF Ranking page]. Value Research, Morningstar and CRISIL publish methodologies (valueresearchonline.com/fund-rating-methodology; morningstar.in/help/methodology.aspx; CRISIL_Mutual_Fund_Ranking_Methodology.pdf).
- **Can an MFD show a third-party rating?** Not prohibited by any rule I found, **provided** it is not in an "advertisement", is shown as sourced third-party research with a methodology link, is not converted into an auto-ranked list, and comparisons are "with similar and comparable schemes … along with complete facts" (AMFI Code ¶B.4.m). **[COMPLIANCE TO CONFIRM; and confirm each rating provider's RA registration before displaying.]**

### 2.4 Proprietary "Fund Score" — does it need a methodology disclosure?

Yes, on three grounds: (i) it is a ranking → research report → SEBI-registered research entity + methodology disclosure (RA Regs; ¶19.10.4); (ii) Fifth Schedule (b) bars rankings in advertisements outright, so a score can live only on the logged-in research surface, not in marketing; (iii) if the score drives a recommendation to a client, an RIA must have a "documented process for selecting investments" (Reg 17(b)) and a "rationale … duly signed and dated" (Reg 19(f)). **Published methodologies exist from VR, Morningstar and CRISIL; ET Money describes its Fund Report Card as rating "Consistency of Returns and Downside Protection, adjusted for category" but I did not find a full methodology page; I found no Groww, Kuvera or Paytm Money proprietary score methodology — they surface VR/Morningstar ratings.** Centricity would need to publish one, and decide **which registered entity** (its RIA/RA registration) owns it. **[COMPLIANCE TO CONFIRM.]**

### 2.5 RIA: risk profiling and suitability before advice

- **Reg 16** — obtain age, investment objectives and horizon, income, existing assets, risk appetite/tolerance, liabilities; have a process for capacity to absorb loss; questionnaires "fair, clear and not misleading", not leading, no double negatives; **communicate the risk profile to the client**; update periodically.
- **Reg 17** — all advice appropriate to the risk profile; documented selection process; reasonable basis that the recommendation meets objectives, the client can bear the risk, and has the knowledge to understand it; extra assessment for "complex financial product".
- **Reg 18** — disclose holdings in the products advised (18(4)), conflicts (18(5)), key features "particularly, performance track record" (18(6)), draw attention to warnings/disclaimers (18(7)), and **the extent of use of AI tools in providing advice** (18(9), new). Sentinel is an AI assistant — **this disclosure is a required screen element in RIA mode**.
- **Reg 19** — keep risk profile, suitability assessment, advice given, and "rationale for arriving at investment advice, duly signed and dated".
- **Reg 15(2)** — no consideration from anyone other than the client for the products advised. **Reg 22** — client-level segregation: "the same client cannot be offered both advisory and distribution services within the group". Fee caps (Second Amendment 2024, effective 16 Dec 2024 + SEBI IA guidelines): fixed ≤ ₹1,51,000 p.a. per family or ≤ 2.5% of AUA p.a.
- [SEBI (Investment Advisers) Regulations 2013, amended to 25 Nov 2025 — sebi.gov.in/legal/regulations/nov-2025/…_98246.html]

### 2.6 Finfluencer and performance-claim restrictions (2024–26)

- **SEBI (Intermediaries) Regulations, amendment of 29 Aug 2024**: regulated entities may not associate, directly or indirectly, with any person who "provides advice or recommendation … or makes any claim of returns or performance" without SEBI registration/permission; investor education associations allowed only if no recommendation or return claim. Follow-up circular 22 Oct 2024 on "specified digital platforms".
- **PaRRVA** (SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/51, 4 Apr 2025; operationalisation circular Apr 2026; **full operations 4 May 2026**; CARE Ratings recognised as the agency): IAs, RAs and algo providers may reference their **own** past performance only if PaRRVA-verified and shown with SEBI's prescribed disclaimers.
- Implication: any "our model portfolio returned X%" or "clients who followed us made Y%" claim on an RIA surface must be PaRRVA-verified; on an MFD surface it may not appear at all.

### 2.7 Returns without the disclaimer

The standard warning is required on advertisements (Fifth Schedule (i)); the riskometer wherever performance is shown (¶6.17.1); the "regular/direct plan + different expense structure" footnote on performance (¶14.2.1(d)); AMFI's past-performance disclaimer on illustrations (BP 109 ¶7). The AMFI Code makes MFD performance disclosures subject to the SEBI rules (¶B.2.a). So: **no return figure anywhere on the explorer without (a) the riskometer, (b) the plan label, (c) the as-on date, and (d) the past-performance disclaimer within the same viewport.**

### 2.8 AMFI Code clauses that touch a shortlist shown to a client

| Clause | Requirement on the shortlist |
|---|---|
| ¶B.1.b | Disclose conflicts; disclose when a scheme is of a group/affiliate AMC |
| ¶B.1.c | Financial incentive must not be the basis of the shortlist — do not sort by commission |
| ¶B.2.d | Seek financial status, experience, objectives to assess suitability |
| ¶B.4.a | Provide full and updated information incl. SID/SAI/KIM/factsheets; don't withhold that a scheme may be inappropriate |
| ¶B.4.b | Highlight risk factors of **each** scheme |
| ¶B.4.c | Disclose commissions "for the different competing schemes … from amongst which the scheme is being recommended" |
| ¶B.4.d | Disclose the list of AMCs the MFD is affiliated with, that information is limited to distributed products, and that **alternatives exist** |
| ¶B.4.k | Use AMC-supplied marketing material; no own material or AMC logos without written approval |
| ¶B.4.m | Comparisons only with similar, comparable schemes, with complete facts |
| ¶B.5.g | "AMFI-registered Mutual Fund Distributor" + ARN in all communication |
| ¶5.2 | Valid **ARN + EUIN** on every Regular-plan transaction; execution-only declaration when no EUIN |

Source: AMFI Master Circular for MFDs, AMFI/MFD-CIR/32/2025-26, 14 Jan 2026, Chapter 7 (Code of Conduct as revised by CIR/ARN-22a/2022-23, 7 Apr 2022).

---

## 3. Per-asset discovery facets

Legend: **Reg.** regulator · **Min.** minimum ticket · **Screen** the numbers an advisor actually filters and sorts on · **Risk label** what the instrument carries by rule · **Compare / Overlap** what those words mean for this class.

### 3.1 Mutual funds (incl. SIF)
- **Reg.** SEBI (MF Regs 2026); AMFI for distributors. **Min.** scheme-defined (typically ₹100–₹5,000); **SIF ₹10 lakh per PAN across an AMC's strategies**, accredited investors exempt [SEBI circular 27 Feb 2025; Master Circular Ch. 21]. Distributing SIF needs separate AMFI SIF registration (AMFI Master Circular Ch. 3).
- **Screen:** category (2026 list) · AUM · TER (regular/direct) · NAV · 1/3/5/10Y & SI CAGR vs Tier-1 TRI benchmark · ₹10,000 growth · Information Ratio (equity) · rolling returns (optional) · riskometer level · PRC cell (debt) · exit load · fund age · fund-manager tenure · portfolio overlap (SEBI method) · stress-test days-to-liquidate (mid/small cap) · Macaulay duration / YTM / credit quality (debt) · SIP availability.
- **Risk label:** Riskometer (6 levels, prescribed colours) + PRC matrix for debt. Only asset class with a regulator-designed risk pictogram.
- **Compare:** point-to-point CAGR vs same Tier-1 benchmark, same as-on date, same plan; **Overlap:** SEBI's ISIN-level ∑min(w) — monthly portfolio data, T+10 days.

### 3.2 Bonds / NCDs / SDIs
- **Reg.** SEBI (NCS Regulations; OBPP framework SEBI/HO/DDHS/DDHS-RACPOD1/P/CIR/2022/154, 14 Nov 2022; SEBI/HO/DDHS/POD1/P/CIR/2023/194, 28 Dec 2023). OBPPs must be stock brokers in the debt segment; permitted products are **listed** debt securities, G-secs/T-bills/SGBs, listed municipal debt, listed SDIs and products regulated by SEBI/RBI/IRDAI/PFRDA. **Unlisted NCDs cannot be offered on an OBPP.** **[COMPLIANCE TO CONFIRM Centricity's OBPP status / which entity's platform sells bonds.]**
- **Min.** Face value for privately placed debt reduced to **₹10,000** (SEBI circular 3 Jul 2024); **SDI public issues: ₹1 crore minimum ticket and demat only** (SEBI SDI Regulations amendment, 5 May 2025) — private SDIs not subject to that minimum.
- **Screen (SEBI's own minimum list, OBPP Annex B):** issuer & ISIN · listed **secured / unsecured** · seniority · mode & date of issue · **outstanding rating, rating date, agency, rating rationale PDF** · face value, clean price, dirty price · coupon type/rate/frequency · maturity/tenor · debenture trustee · **current yield and YTM with calculation** · offer document PDF. Plus, in practice: put/call, min lot, interest payment dates, accrued interest, liquidity (exchange volume).
- **Risk label:** **credit rating** (agency scale, AAA→D); no riskometer today. **Proposed**: mandatory **Credit Risk-o-Meter**, six colour bands by rating (AAA Irish Green · AA Chartreuse · A Neon Yellow · BBB Caramel · BB Dark Orange · B-and-below Red), lowest rating governs, **unsecured in bold red**, to appear on OBPP web and mobile and in ads. [SEBI consultation paper 13 Aug 2026; applicable 30 days after the final circular]. Design for it now.
- **Standard warning (OBPP Annex C ¶10):** "Investments in debt securities/ municipal debt securities/ securitised debt instruments are subject to risks including delay and/ or default in payment. Read all the offer related documents carefully" — no words added or removed; no celebrities.
- **Compare:** YTM vs tenor vs rating, same settlement date; **Overlap** has no meaning — the useful construct is a **ladder** (maturities by year) and **issuer/group concentration**.

### 3.3 PMS
- **Reg.** SEBI (Portfolio Managers) Regulations 2020; APMI. **Min. ₹50 lakh** first lump-sum (Master Circular ¶2.5.1.1); accredited investors may negotiate exit loads bilaterally (¶6.1.5). **Distributors must be APMI-registered from 1 Jan 2025** (SEBI/HO/IMD/IMD-PoD-1/P/CIR/2024/32, 2 May 2024).
- **Screen:** Investment Approach (IA) name and **APMI Strategy tag** · AUM (IA and firm) · manager · fee structure (fixed / performance / hurdle; **no upfront fees**; operating expenses ≤ 0.50% p.a.; performance fee on **high-water mark**, charged no more often than quarterly) · exit load (**max 3% yr-1, 2% yr-2, 1% yr-3, nil after** — Feb 13 2020 circular) · **TWRR of the IA vs trailing return of the APMI benchmark** for 1/3/5Y & SI · relative performance vs benchmark **and vs other PMs in the same Strategy** (mandatory in marketing, ¶5.6.4) · portfolio disclosure (monthly report to SEBI/APMI within 7 working days; APMI publishes) · quarterly client report within 10 days of quarter-end.
- **Risk label:** none prescribed. Disclosure Document lists risks per IA (¶4.6.2.7).
- **Forbidden in performance display (¶5.6.3):** model-portfolio returns; cherry-picked investors; any classification other than the APMI Strategy. Mandatory disclaimer in all marketing: **"performance related information provided therein is not verified by SEBI"** (¶4.5.3.6). Investor-level reporting shows **XIRR** with min/max/median XIRR across investors plus the fixed disclaimer on timing and composition differences (¶5.6.2).
- **Compare:** TWRR vs benchmark within one Strategy, same as-on month; **Overlap:** possible only from monthly holdings with a lag; label the data date.

### 3.4 AIF (Cat I / II / III)
- **Reg.** SEBI (AIF) Regulations 2012; Master Circular SEBI/HO/AFD-1/AFD-1-PoD/P/CIR/2024/39 (7 May 2024). **Min. ₹1 crore** (₹25 lakh for employees/directors of the manager); **accredited investors exempt**; "AI-only" schemes with lighter rules from Nov–Dec 2025 (Third Amendment 18 Nov 2025; circular 8 Dec 2025). Accredited investor (individual/HUF/family trust): income ≥ ₹2 cr, **or** net worth ≥ ₹7.5 cr with ≥ ₹3.75 cr financial, **or** income ≥ ₹1 cr + net worth ≥ ₹5 cr with ≥ ₹2.5 cr financial [SEBI/HO/IMD/IMD-I/DF9/P/CIR/2021/620, 26 Aug 2021].
- **Screen:** category & sub-category · open/close-ended · tenure (from First Close; extension ≤ 2 years with 2/3 investor consent, ¶11.3) · **minimum commitment** · drawdown schedule (Cat III open-ended: no drawdown, invest any time, ¶5.4) · management fee / carry / hurdle / catch-up (PPM terms) · **target IRR as stated in the PPM** (never our number) · vintage · **benchmark report** · leverage (Cat III ≤ 2× NAV, ¶5.2.3) · NAV frequency & valuation basis · investor reporting cadence (quarterly within 60 days for Cat III).
- **Risk label:** none prescribed; PPM "Risk Factors" section (SEBI template).
- **Performance rule (¶16.3.6–16.3.7):** where past performance is mentioned in the PPM or **any marketing material**, the **Benchmarking Agency's performance-vs-benchmark report** for that scheme must accompany it; schemes ≥ 1 year from First Close must report to the agency (CRISIL is one). So an AIF card showing IRR must carry the benchmark-report reference.
- **Compare:** vintage-matched IRR/DPI/TVPI vs the agency benchmark; **Overlap:** not computable — portfolios are disclosed to investors, not publicly. Say so on screen.

### 3.5 GIFT City / IFSC
- **Reg.** **IFSCA** (Fund Management Regulations 2025, notified 19 Feb 2025, amended to 30 Jul 2025); **RBI** governs the resident investor's route (LRS). Not SEBI.
- **Eligibility:** Resident individuals may remit under LRS to IFSCs "for all permissible purposes" [RBI A.P. (DIR Series) Circular No. 15, 10 Jul 2024]; LRS cap USD 250,000 per FY; TCS applies on remittances above the threshold (rate/threshold change with Finance Acts — **verify current**). IFSC PMS may serve "an individual resident in India who is eligible under FEMA … to the extent allowed under LRS" [Reg 73(2)(d)]. NRIs/OCIs invest freely in USD.
- **Product types and minimums:** **Restricted scheme** — private placement to accredited investors or investors putting in **≥ USD 150,000**, ≤ 1,000 investors [Reg 2(ee), 32]; **Retail scheme** — open to all, close-ended retail schemes with >15% unlisted need **USD 10,000** minimum [Reg 47(2)]; **PMS ≥ USD 75,000**, accredited exempt [Reg 77(1)]; Investment Trusts (REIT/InvIT) ≥ USD 150,000 privately placed.
- **Screen:** currency (USD; sometimes GBP/EUR) · scheme type (retail / restricted / venture capital / ETF) · FME name and registration · underlying (global equity, India-access, fixed income) · min investment · fees · **LRS consumption** for residents · tax residency of the investor.
- **Risk label:** none prescribed; offer document / PPM risk factors. FMEs must "report performance uniformly" in disclosures, ads, client reports and website [Reg 80(4)].
- **Tax:** for residents, gains taxed under Indian law as normal; for NRIs, income from transfer of units of specified IFSC funds is exempt under **s.10(4D)** Income-tax Act — **tax copy must be reviewed by a CA/compliance; do not state rates in UI without a source and date.**
- **Compare:** only within currency and scheme type; **Overlap:** not applicable (mostly FoF/feeder).

### 3.6 Unlisted equity (pre-IPO)
- **Reg.** No product regulator for secondary unlisted trades. SEBI has warned three times (Aug 2016; 9 Dec 2024; **PR 32/2026, 17 Jun 2026**) that unauthorised electronic platforms for unlisted securities violate SCRA 1956 / SEBI Act, and that investors there have **no SEBI/exchange protection, grievance redressal or ODR**. Companies Act 2013 s.42 restricts private placement (≤ 200 persons/FY; **no public advertisement**). Post-IPO, pre-issue non-promoter capital is **locked in for 6 months** from allotment (ICDR Reg 17; relaxation proposed Nov 2025).
- **Screen:** last traded / indicative price and **how it was discovered** (dealer quote, last private deal, valuation report) · lot size · sector · latest financials · expected liquidity event (DRHP filed? SEBI observation?) · lock-in on listing · settlement (off-market depository transfer) · LTCG holding period (24 months — **verify**).
- **Risk label:** none. The explorer must carry its own plain-language liquidity and no-recourse warning, and must not let an MFD present this as advice.
- **Compare / Overlap:** compare on valuation multiples only with a stated source; overlap not meaningful.

### 3.7 Listed equity
- **Reg.** SEBI (Stock Brokers), (Research Analysts) 2014, (Investment Advisers) 2013. A stock **recommendation** is a research report or investment advice — **an MFD cannot give one**; Centricity's RIA/RA registration must own that surface, and any performance claim about past calls is PaRRVA-only.
- **Screen:** market-cap bucket (AMFI list) · price · P/E, P/B, dividend yield · 52-week range · 1/3/5Y price & TRI return · promoter holding/pledge · analyst coverage (sourced).
- **Risk label:** none prescribed for the stock; exchanges flag GSM/ESM/ASM surveillance status — surface it.
- **Compare:** peer set within sector; **Overlap:** the MF overlap view can show which schemes hold the stock.

### 3.8 The three biggest cross-asset facet differences
1. **Risk pictogram exists for MF only.** Bonds have a rating (and a proposed credit riskometer); PMS/AIF/GIFT/unlisted have prose risk factors. A single "risk chip" component across assets is therefore **not honest** — the explorer needs a per-class risk element.
2. **Performance basis differs by law:** MF = point-to-point CAGR vs TRI (month-end); PMS = TWRR vs APMI benchmark with peer-relative ranking, XIRR for the investor; AIF = IRR with an agency benchmark report; bonds = YTM (not a return); unlisted = no regulated basis. "Returns" cannot be one column in a cross-asset table.
3. **Overlap is computable only for MF (monthly, SEBI method) and, with lag and gaps, PMS.** For bonds the concept becomes a maturity ladder and issuer concentration; for AIF/GIFT/unlisted it is unavailable and the UI must say so rather than show zero.

---

## 4. The advisor personas the regulation implies

### 4.1 MFD (AMFI ARN + EUIN; commission-earning)
- **Can:** show the distributed shelf and its factual data (Annexure 12A set); filter on client-chosen criteria; shortlist; compare like with like; explain risk factors; transact in **Regular plans** with ARN+EUIN; give **incidental** advice with an appropriateness record; show third-party research with source + methodology (subject to §2.3).
- **Cannot:** call itself adviser; sort/label by commission; auto-rank or auto-recommend; deal in Direct plans; indicate yields/returns or project values for a scheme; use own marketing material or AMC logos without approval; make comparisons with dissimilar schemes; recommend stocks or run a fee-based advisory relationship for the same client as distribution (Reg 22).
- **CTA copy:** "Show funds matching these filters" · "Add to shortlist" · "Compare (same category)" · "Share factsheet & SID" · "Invest — Regular Plan" (with the commission disclosure line and link) · for advisory-tagged flows: "Mark as suggested for <client> (appropriateness on file)".

### 4.2 RIA (SEBI-registered; fee-only)
- **Can:** advise, recommend, rank for a client — **after** Reg 16 profiling and with a Reg 17 suitability basis; show its own verified track record via PaRRVA; show Direct plans.
- **Must:** communicate the risk profile to the client (16(e)); record rationale, signed and dated (19(f)); disclose holdings/conflicts (18(4)–(5)); disclose **extent of AI use** (18(9)); draw attention to warnings/disclaimers (18(7)); stay within fee caps; not receive commission (15(2)).
- **CTA copy:** "Build advice for <client>" (disabled until risk profile is current) · "Record rationale" · "Suitability check: <profile> vs <riskometer/PRC>" · "Send advice note" · "Advice generated with AI assistance — reviewed by <adviser>" (18(9)).

### 4.3 Centricity as a corporate MFD + PMS/AIF distributor + RIA (the hybrid)
- Group-level segregation is the rule (IA Reg 22(3)): **a client is either advisory or distribution within the group, never both.** The explorer therefore needs a **hard mode switch per client**, not per session: MFD mode (Regular plan, commission disclosure, "match your filters" copy, no auto-ranking) or RIA mode (Direct plan, suitability trail, advice copy, AI disclosure). The advisor's own registration (ARN/EUIN vs RIA) and the client's engagement type both gate the mode.
- Selling PMS/AIF requires **APMI-registered** distributors (PMS) and the AIF benchmark-report rule when performance is shown; the same person may hold both ARN and APMI registration.
- Group-AMC schemes (if any) need a conflict disclosure on the card (AMFI Code ¶B.1.b, ¶B.4.e).

---

## 5. Indian number, date and label formats the explorer must use

| Element | Rule / convention | Source |
|---|---|---|
| Currency grouping | Lakh/crore grouping: **₹1,23,45,678**; ₹ before the number, no space. SEBI's own circulars write "₹50,00,000", "Rs. 10,000/-", "Rs.500 crores". In tables use digits; in prose "₹50 lakh", "₹1 crore". | PMS Master Circular ¶6.1.3.6; MF Regs Reg 66(7). Convention, not a rule — but the regulator's. |
| NAV | Exactly as declared: 4 decimals for index funds and all debt-oriented schemes; 2 (or more, if the AMC does) for others. Never re-round. | Master Circular ¶9.1 |
| Returns / CAGR | No prescribed precision. AMC/AMFI disclosures use **two decimals**; use two on the fund page so numbers reconcile with factsheets and CAS; one decimal is acceptable in compact cards only if the two-decimal figure is one tap away. Label CAGR as "CAGR" and absolute (<1Y) as "absolute" or "simple annualised" per ¶14.2.2–14.2.3. | Convention; ¶14.2 |
| XIRR | Labelled "XIRR"; PMS investor statements must show XIRR with min/median/max across investors. | PMS Master Circular ¶5.6.2 |
| As-on | Performance "as on" the **last day of the previous month** (¶14.2.1(c)); NAV, TER and riskometer each carry their own as-on date; always name the **source** (Annexure 12A item 5: "performance along with source"). Format: "as on 31 Aug 2026 · Source: AMFI". | ¶14.2.1(c); Annexure 12A |
| Dates | **DD Mon YYYY** (e.g. 26 Feb 2026), IST. SEBI writes "February 26, 2026"; the short form is a product convention — keep it consistent and unambiguous. | Convention |
| Benchmark naming | Always the TRI variant and the tier: "**NIFTY 500 TRI (Tier 1)**", "BSE 500 TRI". AMFI's FoF benchmark list uses exactly "NIFTY 500 TRI or S&P BSE 500 TRI". | Master Circular Annexure 1C(ii); ¶7.22 |
| Riskometer caption | "The risk of the scheme is Moderately High" — level words in the regulator's casing. | ¶6.16.1(f) |
| Scheme name | Exactly the SID name; category line beneath in the regulator's "type of scheme" wording. | 26 Feb 2026 circular ¶2.6.5 |
| Standard warning | 14 words, verbatim (§1.6); vernacular version in vernacular UI. | Fifth Schedule (i)–(j) |
| Disclaimer size | "Commensurate with the other sections" — no grey fine print; Sentinel's 14-pt-minimum compliance copy rule stands. | AMFI BP 109 ¶10 |
| Distributor identity | "AMFI-registered Mutual Fund Distributor · ARN-XXXXX" visible in app; EUIN of the acting person on transactions. | AMFI Code ¶B.5.g; ¶5.2 |

---

## 6. UI REQUIREMENTS FROM REGULATION — the build table

| # | Element on screen | Rule (plain) | Source | Asset classes | MFD vs RIA |
|---|---|---|---|---|---|
| 1 | **Riskometer pictogram + caption**, with as-on month | Six levels, prescribed hex colours; shown wherever performance is shown; benchmark's too when compared | Master Circular ¶6.16–6.17; 2024/150; 2020/197 | MF, SIF | Both |
| 2 | **PRC cell** (e.g. "A-I") | All debt schemes classified; disclose with riskometer | ¶6.18; 2021/573 | MF debt | Both |
| 3 | **Category line** under scheme name, 2026 vocabulary | Scheme name = category; "type of scheme" text beneath in all material | 26 Feb 2026 circular ¶2.6.5; ¶3.8 | MF | Both |
| 4 | **Performance table**: 1/3/5/10Y + SI CAGR, ₹10,000 growth, vs Tier-1 TRI benchmark + additional benchmark, month-end as-on, source | Mandated set; no perf < 6 months; simple annualised 6–12m; 7/15/30-day for liquid | ¶14.2; ¶6.9.1; 2018/04; 2021/652 | MF | Both |
| 5 | **Plan label + footnote** ("Regular Plan · different plans have different expense structures") | Say which plan; direct and regular disclosed separately | ¶14.2.1(d); 2024/150 | MF | MFD shows Regular; RIA shows Direct |
| 6 | **Commission disclosure line + link to commission rates + link to SID/SAI/KIM** on the scheme page | MFD platforms must state Regular Plan involves commission; links prominent | AMFI Code ¶B.4.f; SEBI letter 6 Sep 2021 | MF | **MFD only** |
| 7 | **Standard warning** (14 words) in legible type | Verbatim, no edits; vernacular in vernacular UI | Fifth Schedule (i)–(j) | MF (bond version for debt securities, OBPP Annex C) | Both |
| 8 | **Past-performance disclaimer** in same viewport as any return | AMFI wording; no future returns even as illustration | AMFI BP 109 ¶7–8 | All | Both |
| 9 | **Expense ratio (TER) with as-on date**; BER cap context optional | TER = BER + brokerage + txn cost + levies; daily disclosure | MF Regs Reg 66–67; ¶11.2 | MF | Both |
| 10 | **Exit load** schedule | Credited to scheme; repurchase = NAV × (1 − load) | ¶11.7; ¶9.2 | MF (3/2/1 caps for PMS) | Both |
| 11 | **Minimum investment, AUM, NAV (declared precision), fund manager, objective** | EOP minimum disclosures | Annexure 12A; ¶9.1 | MF | Both |
| 12 | **Information Ratio** (equity) with formula link | Daily disclosure alongside performance | ¶6.10; 2025/6 | MF equity | Both |
| 13 | **Stress-test days-to-liquidate 25%/50%** (mid/small cap) | Monthly AMFI disclosure | AMFI letter 28 Feb 2024; amfiindia.com/riskparameter | MF mid/small cap | Both |
| 14 | **Portfolio overlap %**, SEBI method, as-on month | Monthly category-wise overlap; ISIN ∑min(w) | ¶3.8.10; Annexure 1A | MF; PMS (lagged) | Both |
| 15 | **No auto-ranking / no auto-recommendation label** on lists; filters are client-chosen | Ads may carry no ranking; platforms no auto-display of ranking | Fifth Schedule (b); ¶19.10.4 | All | MFD: hard rule. RIA: ranking allowed only as recorded advice for a profiled client |
| 16 | **Third-party rating chip** with source + methodology link | Only SEBI-registered research, with methodology; comparable schemes only | ¶19.10.4; AMFI Code ¶B.4.m; RA Regs | MF | Both, subject to compliance confirmation |
| 17 | **Proprietary Fund Score** — gated to research surface, methodology page, owning registered entity named | Ranking = research report | RA Regs; Fifth Schedule (b); IA Reg 17(b), 19(f) | MF (extendable) | Not on MFD marketing; RIA as documented advice |
| 18 | **Risk-profile status gate** before any "suitable/advice" wording | Reg 16 profiling, Reg 17 suitability; appropriateness for advisory-tagged MFD flows | IA Regs 16–17; Master Circular Ch. 16 | All | RIA: mandatory; MFD: appropriateness record |
| 19 | **Rationale field, signed & dated**, stored with the advice | Records of rationale | IA Reg 19(f) | All | RIA |
| 20 | **AI-use disclosure** on advice output | Disclose extent of AI tools used | IA Reg 18(9) | All | RIA (recommended for MFD too) |
| 21 | **Distributor identity strip**: "AMFI-registered Mutual Fund Distributor · ARN" ; EUIN on transaction | Tagline in all communication incl. app | AMFI Code ¶B.5.g; ¶5.2 | MF | MFD |
| 22 | **Conflict/affiliation notice** (group AMC, limited shelf, alternatives exist) | Disclose affiliations and that alternatives exist | AMFI Code ¶B.1.b, ¶B.4.d–e | MF | MFD |
| 23 | **Bond card**: issuer, ISIN, secured/unsecured, seniority, rating + agency + date + rationale PDF, FV, clean/dirty price, coupon, maturity, trustee, current yield & YTM w/ calc, offer doc | OBPP minimum disclosures | OBPP 2022/154 Annex B | Bonds/NCD/SDI | Both |
| 24 | **Credit Risk-o-Meter** slot (six colours by rating; unsecured in bold red) | Proposed; 30 days after final circular | SEBI consultation 13 Aug 2026 | Bonds/NCD/SDI/MLD | Both — design now, ship when final |
| 25 | **PMS card**: IA + Strategy tag, TWRR vs APMI benchmark, relative rank in Strategy, fee/HWM/hurdle, exit-load schedule, "not verified by SEBI" disclaimer | Mandatory content and disclaimer; no model/cherry-picked returns | PMS Master Circular ¶4.5.3.6, ¶5.6 | PMS | Both (APMI-registered distributor) |
| 26 | **AIF card**: category, min commitment, tenure, drawdown, fee terms, **target IRR "as per PPM"**, benchmark-report reference | Performance only with agency benchmark report | AIF Master Circular ¶16.3.6–7 | AIF | Both; accredited-investor gate |
| 27 | **Eligibility gates**: PMS ₹50L · AIF ₹1Cr · SIF ₹10L · GIFT restricted USD 150k / PMS USD 75k · accredited exemption | Minimums | PMS ¶2.5; AIF Reg 10(c); SIF circular; IFSCA Regs 32, 47, 77 | PMS/AIF/SIF/GIFT | Both |
| 28 | **GIFT card**: currency, scheme type, FME registration, LRS consumption, jurisdiction, tax note (CA-reviewed) | IFSCA regime; RBI LRS | IFSCA FM Regs 2025; RBI A.P. (DIR) 15/2024 | GIFT | Both |
| 29 | **Unlisted card**: price-discovery method, lot, lock-in, "no SEBI/exchange recourse" warning, no advice CTA | SEBI cautions; s.42 | SEBI PR 32/2026; Companies Act s.42 | Unlisted | No MFD advice CTA |
| 30 | **Own-track-record claims** only if PaRRVA-verified | Verified performance | SEBI 2025/51; Apr 2026 operationalisation | All (RIA/RA) | RIA only |
| 31 | **Mode switch per client** (Advisory ↔ Distribution), never both | Group-level client segregation | IA Reg 22 | All | Hybrid Centricity |

---

## 7. Open items — who confirms

| # | Item | Owner |
|---|---|---|
| O1 | Whether ¶19.10.4 (no auto-ranking; registered research only) applies to Centricity's regular-plan explorer by analogy, and the exact approved verb set for MFD CTAs | Centricity compliance |
| O2 | Which registered entity (RIA/RA) owns a proprietary Fund Score and where it may be shown | Compliance + product |
| O3 | RA registration status of each third-party rating provider before display | Compliance |
| O4 | Primary circular reference for the 2026 small/mid-cap stress-test revision (only secondary sources found) | Compliance |
| O5 | Centricity's OBPP status; whether unlisted NCDs are on the shelf and under which entity | Compliance |
| O6 | Current TCS rate/threshold on LRS remittances and tax lines for GIFT products | CA / compliance |
| O7 | Rolling-returns placement (secondary tab) and one-decimal CAGR on compact cards | Compliance |
| O8 | Exact CAS commission-disclosure circular number (Sep 2016) | Compliance (cosmetic) |

---

## 8. Sources (primary unless marked)

- SEBI (Mutual Funds) Regulations, 2026 — gazette PDF via sebi.gov.in/legal/regulations/jan-2026/…_99173.html (Reg 26, 28, 66, 67; Fifth Schedule)
- Master Circular for Mutual Funds, HO/24/13/11(1)2026-IMD-POD-1/I/7602/2026, 20 Mar 2026 — sebi.gov.in/legal/master-circulars/mar-2026/…_100491.html (¶1.5, 1.6, 3.4, 3.8.10, 3.9, 6.9, 6.10, 6.16, 6.17, 6.18, 7.22, 9.1, 9.2, 11.2, 11.4, 11.7, 14.2, Ch. 16, 19.10.4, Annexure 1A, 1C, 12A)
- Categorization and Rationalization of Mutual Fund Schemes, HO/24/13/15(2)2026-IMD-RAC4/I/5764/2026, 26 Feb 2026 — sebi.gov.in/legal/circulars/feb-2026/…_99983.html
- SEBI/HO/IMD/PoD1/CIR/P/2024/150, 5 Nov 2024 (direct/regular disclosures; riskometer colours)
- SEBI/HO/IMD/DF3/CIR/P/2020/197, 5 Oct 2020 (riskometer methodology)
- SEBI/HO/IMD/IMD-II DOF3/P/CIR/2021/573, 7 Jun 2021 (PRC matrix)
- SEBI/HO/IMD/DF3/CIR/P/2018/04, 4 Jan 2018 (TRI); SEBI/HO/IMD/IMD-II DF3/P/CIR/2021/652, 27 Oct 2021 (two-tier benchmarks)
- SEBI/HO/IMD/IMD-PoD-2/P/CIR/2025/6, 17 Jan 2025 (Information Ratio)
- SEBI/HO/IMD/IMD-RAC-2/P/CIR/2023/000175, 1 Nov 2023 (simplified SID)
- CIR/IMD/DF/21/2012, 13 Sep 2012 (Direct Plan); Cir/IMD/DF/13/2011, 22 Aug 2011 (advisory vs execution-only); CIR/IMD/DF/23/2017, 15 Mar 2017 (performance advertising)
- MFD/CIR/11/16159/2002, 22 Aug 2002 (NAV rounding)
- SEBI/IMD/CIR No. 8/174648/2009, 27 Aug 2009 (Code of Conduct for Intermediaries)
- AMFI Master Circular for Mutual Fund Distributors, AMFI/MFD-CIR/32/2025-26, 14 Jan 2026 (Ch. 5, 7)
- AMFI Best Practices Guidelines Circular 135/BP/109/2023-24, 1 Nov 2023 (illustrations, disclaimer)
- AMFI Stress Test & Liquidity Analysis — amfiindia.com/riskparameter; AMFI letter 28 Feb 2024 (secondary reports)
- SEBI (Investment Advisers) Regulations, 2013, amended to 25 Nov 2025 — sebi.gov.in/legal/regulations/nov-2025/…_98246.html (Reg 3(3), 4(d), 15, 15A, 16, 17, 18, 19, 22)
- SEBI (Intermediaries) Regulations amendment, 29 Aug 2024; circular 22 Oct 2024 (secondary summaries)
- SEBI/HO/MIRSD/MIRSD-PoD/P/CIR/2025/51, 4 Apr 2025; Operationalisation of PaRRVA, Apr 2026 — sebi.gov.in/legal/circulars/apr-2026/…_101185.html
- Master Circular for Portfolio Managers, 7 Jun 2024 (APMI copy) (¶2.5, 4.5, 4.6A, 5.6, 6.1, Annexure 2A, 2B); SEBI/HO/IMD/IMD-PoD-1/P/CIR/2024/32, 2 May 2024 (APMI distributor registration); SEBI/HO/IMD/DF1/CIR/P/2020/26, 13 Feb 2020 (fees, exit load)
- Master Circular for AIFs, SEBI/HO/AFD-1/AFD-1-PoD/P/CIR/2024/39, 7 May 2024 (Ch. 5, 11, 12, 16); SEBI/HO/IMD/DF6/CIR/P/2020/24, 5 Feb 2020 (benchmarking); SEBI/HO/IMD/IMD-I/DF9/P/CIR/2021/620, 26 Aug 2021 (accredited investors); AIF Third Amendment 18 Nov 2025 + circular 8 Dec 2025 (secondary)
- SEBI SIF framework circular, 27 Feb 2025; monitoring circular Jul 2025 — sebi.gov.in/legal/circulars/jul-2025/…_95676.html
- SEBI/HO/DDHS/DDHS-RACPOD1/P/CIR/2022/154, 14 Nov 2022 (OBPP; Annex B, C); SEBI/HO/DDHS/POD1/P/CIR/2023/194, 28 Dec 2023; SEBI circular 3 Jul 2024 (₹10,000 face value); SEBI SDI Regulations amendment 5 May 2025 (secondary)
- SEBI consultation paper on Credit Risk-o-Meter, 13 Aug 2026 — sebi.gov.in/reports-and-statistics/reports/aug-2026/…_103613.html
- SEBI PR 32/2026, 17 Jun 2026; SEBI caution 9 Dec 2024 (unlisted platforms) (secondary reports of the PR)
- IFSCA (Fund Management) Regulations, 2025, amended to 30 Jul 2025 — ifsca.gov.in (Reg 2(ee), 2(ff), 32, 47, 73, 77, 80)
- RBI A.P. (DIR Series) Circular No. 15, 10 Jul 2024 (LRS to IFSC)
- Methodologies: valueresearchonline.com/fund-rating-methodology; morningstar.in/help/methodology.aspx; CRISIL Mutual Fund Ranking Methodology PDF; ET Money app listing (Fund Report Card description only)
