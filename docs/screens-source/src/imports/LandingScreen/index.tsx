import svgPaths from "./svg-mqzzdumakx";
import imgLandingScreen from "./30f7cfce9690d36cf3d41efd14e946b9b28032da.png";

function IconPlus({ className }: { className?: string }) {
  return (
    <div className={className || "overflow-clip relative size-[24px]"} data-name="icon/plus">
      <div className="absolute inset-[16.67%]" data-name="Vector">
        <div className="absolute inset-[-4.16%]">
          <svg className="block size-full" fill="none" height="17.33" preserveAspectRatio="none" viewBox="0 0 17.33 17.33" width="17.33">
            <path d={svgPaths.p11352280} id="Vector" stroke="#251F1B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function StatusSpacer() {
  return <div className="h-[24px] relative shrink-0 w-full" data-name="status spacer" />;
}

function Menu1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="menu">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="menu">
          <path d={svgPaths.p33a06404} id="Vector" stroke="#251F1B" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Menu() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 size-[40px]" data-name="Menu">
      <Menu1 />
    </div>
  );
}

function YourBook() {
  return (
    <div className="bg-white relative rounded-[999px] shrink-0" data-name="Your book">
      <div className="content-stretch flex items-center overflow-clip px-[16px] py-[12px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Urbanist:SemiBold',sans-serif] font-semibold leading-none relative shrink-0 text-[#251f1b] text-[14px] text-center whitespace-nowrap">Sentinel</p>
      </div>
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[999px] shadow-[0px_1px_2px_0px_rgba(37,31,27,0.05)]" />
    </div>
  );
}

function NewThread() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[44px]" data-name="New thread">
      <IconPlus className="overflow-clip relative shrink-0 size-[20px]" />
    </div>
  );
}

function TopBar() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Top bar">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] relative size-full">
          <Menu />
          <YourBook />
          <NewThread />
        </div>
      </div>
    </div>
  );
}

function SectionYourMorningSorted() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center overflow-clip px-[16px] py-[8px] relative shrink-0 w-full" data-name="Section / Your morning, sorted">
      <div className="flex-[1_0_0] h-0 min-w-px relative" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 46.5 1" width="46.5">
            <line id="Line" stroke="#D9CFC3" strokeDasharray="4 5" x2="46.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Darker_Grotesque:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#715035] text-[27px] text-center whitespace-nowrap">Good afternoon, Ashish</p>
      <div className="flex-[1_0_0] h-0 min-w-px relative" data-name="Line">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 46.5 1" width="46.5">
            <line id="Line" stroke="#D9CFC3" strokeDasharray="4 5" x2="46.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <SectionYourMorningSorted />
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g id="chevron-right">
          <path d={svgPaths.p5646280} id="Vector" stroke="#B69377" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Prompt() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="Prompt">
      <div className="content-stretch flex items-center justify-between overflow-clip relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[#251f1b] text-[12px] whitespace-nowrap">Show me Diwali offer from HDFC AMC</p>
        <ChevronRight />
      </div>
      <div aria-hidden className="absolute border-[#e7e7e7] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ChevronRight1() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g id="chevron-right">
          <path d={svgPaths.p5646280} id="Vector" stroke="#B69377" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Prompt1() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="Prompt">
      <div className="content-stretch flex items-center justify-between overflow-clip relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[#251f1b] text-[12px] whitespace-nowrap">Build a proposal for Mr. Amit Aggrawal</p>
        <ChevronRight1 />
      </div>
      <div aria-hidden className="absolute border-[#e7e7e7] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ChevronRight2() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="chevron-right">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <g id="chevron-right">
          <path d={svgPaths.p5646280} id="Vector" stroke="#B69377" strokeLinecap="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Prompt2() {
  return (
    <div className="content-stretch flex h-[42px] items-center justify-between overflow-clip relative shrink-0 w-full" data-name="Prompt">
      <p className="[word-break:break-word] font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[18px] relative shrink-0 text-[#251f1b] text-[12px] whitespace-nowrap">{`Why did Sharma's portfolio drift this quarter?`}</p>
      <ChevronRight2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[126px] items-start px-[12px] relative rounded-[16px] shrink-0 w-full">
      <Prompt />
      <Prompt1 />
      <Prompt2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[261px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start px-[16px] py-[32px] relative size-full">
        <Frame5 />
      </div>
    </div>
  );
}

function Chip() {
  return (
    <div className="bg-[#fbf6f1] h-[36px] relative rounded-[999px] shrink-0" data-name="Chip 1">
      <div className="content-stretch flex items-center overflow-clip px-[12px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Urbanist:Bold',sans-serif] font-bold leading-[18px] relative shrink-0 text-[#715035] text-[12px] whitespace-nowrap">Review a portfolio</p>
      </div>
      <div aria-hidden className="absolute border border-[#ebd4c3] border-solid inset-0 pointer-events-none rounded-[999px]" />
    </div>
  );
}

function Chip1() {
  return (
    <div className="bg-[#fbf6f1] h-[36px] relative rounded-[999px] shrink-0" data-name="Chip 2">
      <div className="content-stretch flex items-center overflow-clip px-[12px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Urbanist:Bold',sans-serif] font-bold leading-[18px] relative shrink-0 text-[#715035] text-[12px] whitespace-nowrap">Proposal</p>
      </div>
      <div aria-hidden className="absolute border border-[#ebd4c3] border-solid inset-0 pointer-events-none rounded-[999px]" />
    </div>
  );
}

function Chip2() {
  return (
    <div className="bg-[#fbf6f1] h-[36px] relative rounded-[999px] shrink-0" data-name="Chip 3">
      <div className="content-stretch flex items-center overflow-clip px-[12px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Urbanist:Bold',sans-serif] font-bold leading-[18px] relative shrink-0 text-[#715035] text-[12px] whitespace-nowrap">Fund explorer</p>
      </div>
      <div aria-hidden className="absolute border border-[#ebd4c3] border-solid inset-0 pointer-events-none rounded-[999px]" />
    </div>
  );
}

function Chips() {
  return (
    <div className="content-start flex flex-wrap gap-[13px_8px] items-start justify-center overflow-clip px-[16px] py-[8px] relative shrink-0 w-[375px]" data-name="Chips">
      <Chip />
      <Chip1 />
      <Chip2 />
    </div>
  );
}

function IconButton() {
  return (
    <div className="bg-white relative rounded-[22px] shrink-0 size-[42px]" data-name="Icon button">
      <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="overflow-clip relative shrink-0 size-[18px]" data-name="icon · attach">
          <div className="absolute inset-[13.3%_18.75%_17.84%_19.93%]" data-name="Vector">
            <div className="absolute inset-[-5.37%_-6.02%]">
              <svg className="block size-full" fill="none" height="13.7241" preserveAspectRatio="none" viewBox="0 0 12.3683 13.7241" width="12.3683">
                <path d={svgPaths.p1ab4a180} id="Vector" stroke="#605954" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[22px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative shrink-0" data-name="Frame">
      <IconButton />
    </div>
  );
}

function Send() {
  return (
    <div className="bg-gradient-to-b content-stretch flex from-[#3b3531] items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[42px] to-[#111] via-[#1a1614] via-[48%]" data-name="Send">
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="icon · arrow-right">
        <div className="absolute inset-[20.83%_16.67%]" data-name="Vector">
          <div className="absolute inset-[-6.33%_-5.54%]">
            <svg className="block size-full" fill="none" height="11.83" preserveAspectRatio="none" viewBox="0 0 13.33 11.83" width="13.33">
              <path d={svgPaths.pf929b80} id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Frame">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between pr-[2px] relative size-full">
          <Frame1 />
          <Send />
        </div>
      </div>
    </div>
  );
}

function AskBar() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0 w-full" data-name="Ask bar">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start p-[12px] relative size-full">
          <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#605954] text-[14px] whitespace-nowrap">Ask Sentinel about a client, a fund, or a plan</p>
          <Frame />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_16px_30px_-18px_rgba(37,31,27,0.24),0px_2px_4px_0px_rgba(37,31,27,0.05)]" />
    </div>
  );
}

function AskHolder() {
  return (
    <div className="content-stretch flex flex-col h-[112px] items-start overflow-clip px-[16px] relative shrink-0 w-full" data-name="Ask holder">
      <AskBar />
    </div>
  );
}

function SuggestionCell() {
  return (
    <div className="content-stretch flex flex-col h-[44px] items-center justify-center overflow-clip relative shrink-0 w-[116px]" data-name="Suggestion cell">
      <p className="[word-break:break-word] font-['Urbanist:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#605954] text-[15px] whitespace-nowrap">I</p>
    </div>
  );
}

function SuggestionCell1() {
  return (
    <div className="content-stretch flex flex-col h-[44px] items-center justify-center overflow-clip relative shrink-0 w-[116px]" data-name="Suggestion cell">
      <p className="[word-break:break-word] font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#251f1b] text-[15px] whitespace-nowrap">The</p>
    </div>
  );
}

function SuggestionCell2() {
  return (
    <div className="content-stretch flex flex-col h-[44px] items-center justify-center overflow-clip relative shrink-0 w-[116px]" data-name="Suggestion cell">
      <p className="[word-break:break-word] font-['Urbanist:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#605954] text-[15px] whitespace-nowrap">{`I'm`}</p>
    </div>
  );
}

function Suggestions() {
  return (
    <div className="bg-[#f6f4f1] h-[44px] relative shrink-0 w-full" data-name="Suggestions">
      <div className="content-stretch flex items-center justify-between overflow-clip relative rounded-[inherit] size-full">
        <SuggestionCell />
        <div className="flex h-[20px] items-center justify-center relative shrink-0 w-0">
          <div className="-rotate-90 flex-none">
            <div className="h-0 relative w-[20px]" data-name="Divider">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 20 1" width="20">
                  <line id="Divider" stroke="#D9CFC3" x2="20" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <SuggestionCell1 />
        <div className="flex h-[20px] items-center justify-center relative shrink-0 w-0">
          <div className="-rotate-90 flex-none">
            <div className="h-0 relative w-[20px]" data-name="Divider">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 20 1" width="20">
                  <line id="Divider" stroke="#D9CFC3" x2="20" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <SuggestionCell2 />
      </div>
      <div aria-hidden className="absolute border-[#e1deda] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function KeyQ() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-Q">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">Q</p>
    </div>
  );
}

function KeyW() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-W">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">W</p>
    </div>
  );
}

function KeyE() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-E">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">E</p>
    </div>
  );
}

function KeyR() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-R">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">R</p>
    </div>
  );
}

function KeyT() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-T">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">T</p>
    </div>
  );
}

function KeyY() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-Y">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">Y</p>
    </div>
  );
}

function KeyU() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-U">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">U</p>
    </div>
  );
}

function KeyI() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-I">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">I</p>
    </div>
  );
}

function KeyO() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-O">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">O</p>
    </div>
  );
}

function KeyP() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-P">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">P</p>
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex items-center justify-between px-[4px] relative shrink-0 w-full" data-name="Row 1">
      <KeyQ />
      <KeyW />
      <KeyE />
      <KeyR />
      <KeyT />
      <KeyY />
      <KeyU />
      <KeyI />
      <KeyO />
      <KeyP />
    </div>
  );
}

function KeyA() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-A">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">A</p>
    </div>
  );
}

function KeyS() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-S">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">S</p>
    </div>
  );
}

function KeyD() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-D">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">D</p>
    </div>
  );
}

function KeyF() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-F">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">F</p>
    </div>
  );
}

function KeyG() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-G">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">G</p>
    </div>
  );
}

function KeyH() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-H">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">H</p>
    </div>
  );
}

function KeyJ() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-J">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">J</p>
    </div>
  );
}

function KeyK() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-K">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">K</p>
    </div>
  );
}

function KeyL() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-L">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">L</p>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex items-center justify-between px-[24px] relative shrink-0 w-full" data-name="Row 2">
      <KeyA />
      <KeyS />
      <KeyD />
      <KeyF />
      <KeyG />
      <KeyH />
      <KeyJ />
      <KeyK />
      <KeyL />
    </div>
  );
}

function ChevronUp() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-up">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="chevron-up">
          <path d="M12 10L8 6L4 10" id="Vector" stroke="#715035" strokeLinecap="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function KeyShift() {
  return (
    <div className="bg-[#ebd9cc] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[42px]" data-name="Key-Shift">
      <div aria-hidden className="absolute border border-[#d9c5b3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ChevronUp />
    </div>
  );
}

function KeyZ() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-Z">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">Z</p>
    </div>
  );
}

function KeyX() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-X">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">X</p>
    </div>
  );
}

function KeyC() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-C">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">C</p>
    </div>
  );
}

function KeyV() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-V">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">V</p>
    </div>
  );
}

function KeyB() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-B">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">B</p>
    </div>
  );
}

function KeyN() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-N">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">N</p>
    </div>
  );
}

function KeyM() {
  return (
    <div className="bg-[#fefcfa] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[42px] items-center justify-center relative rounded-[8px] shrink-0 w-[32px]" data-name="Key-M">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#251f1b] text-[16px] whitespace-nowrap">M</p>
    </div>
  );
}

function Delete() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="delete">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <g id="delete">
          <path d={svgPaths.p13f32b70} id="Vector" stroke="#715035" strokeLinecap="round" strokeWidth="1.75" />
        </g>
      </svg>
    </div>
  );
}

function KeyDelete() {
  return (
    <div className="bg-[#ebd9cc] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col items-center justify-center relative rounded-[8px] shrink-0 size-[42px]" data-name="Key-Delete">
      <div aria-hidden className="absolute border border-[#d9c5b3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Delete />
    </div>
  );
}

function Row2() {
  return (
    <div className="content-stretch flex items-center justify-between px-[4px] relative shrink-0 w-full" data-name="Row 3">
      <KeyShift />
      <KeyZ />
      <KeyX />
      <KeyC />
      <KeyV />
      <KeyB />
      <KeyN />
      <KeyM />
      <KeyDelete />
    </div>
  );
}

function Key() {
  return (
    <div className="bg-[#ebd9cc] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[44px] items-center justify-center relative rounded-[8px] shrink-0 w-[42px]" data-name="Key-123">
      <div aria-hidden className="absolute border border-[#d9c5b3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#715035] text-[13px] whitespace-nowrap">123</p>
    </div>
  );
}

function Smile() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="smile">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g clipPath="url(#clip0_0_24)" id="smile">
          <path d={svgPaths.p22024600} id="Vector" stroke="#715035" strokeLinecap="round" strokeWidth="1.75" />
        </g>
        <defs>
          <clipPath id="clip0_0_24">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function KeyEmoji() {
  return (
    <div className="bg-[#ebd9cc] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)] flex flex-col h-[44px] items-center justify-center relative rounded-[8px] shrink-0 w-[42px]" data-name="Key-Emoji">
      <div aria-hidden className="absolute border border-[#d9c5b3] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Smile />
    </div>
  );
}

function KeySpace() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.05)] flex flex-col h-[44px] items-center justify-center relative rounded-[8px] shrink-0 w-[171px]" data-name="Key-Space">
      <div aria-hidden className="absolute border border-[#e1deda] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#605954] text-[15px] whitespace-nowrap">space</p>
    </div>
  );
}

function KeyReturn() {
  return (
    <div className="bg-[#b69377] content-stretch drop-shadow-[0px_1px_1px_rgba(37,31,27,0.1)] flex flex-col h-[44px] items-center justify-center relative rounded-[8px] shrink-0 w-[86px]" data-name="Key-Return">
      <div aria-hidden className="absolute border border-[#a07d5f] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="[word-break:break-word] font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#251f1b] text-[14px] whitespace-nowrap">return</p>
    </div>
  );
}

function Row3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center px-[4px] relative shrink-0 w-full" data-name="Row 4">
      <Key />
      <KeyEmoji />
      <KeySpace />
      <KeyReturn />
    </div>
  );
}

function KeyArea() {
  return (
    <div className="bg-[#e2ddd8] content-stretch flex flex-col gap-[8px] items-start overflow-clip pb-[4px] pt-[8px] relative shrink-0 w-full" data-name="Key area">
      <Row />
      <Row1 />
      <Row2 />
      <Row3 />
    </div>
  );
}

function Indicator() {
  return <div className="bg-[#b69377] h-[4px] relative rounded-[2px] shrink-0 w-[120px]" data-name="Indicator" />;
}

function HomeIndicator() {
  return (
    <div className="bg-[#e2ddd8] content-stretch flex flex-col h-[20px] items-center justify-center overflow-clip relative shrink-0 w-full" data-name="Home indicator">
      <Indicator />
    </div>
  );
}

function Keyboard() {
  return (
    <div className="bg-[#ede9e4] relative shrink-0 w-[375px]" data-name="Keyboard">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Suggestions />
        <KeyArea />
        <HomeIndicator />
      </div>
      <div aria-hidden className="absolute border-[#e1deda] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col h-[382px] items-start justify-end relative shrink-0 w-full">
      <AskHolder />
      <Keyboard />
    </div>
  );
}

export default function LandingScreen() {
  return (
    <div className="bg-size-[3px_3px,auto_auto] bg-top-left content-stretch flex flex-col items-start overflow-clip pb-[12px] relative rounded-[24px] size-full" style={{ backgroundImage: `url("${imgLandingScreen}"), linear-gradient(90deg, rgb(246, 244, 241) 0%, rgb(246, 244, 241) 100%)` }} data-name="landing screen">
      <div className="absolute bg-size-[3px_3px] bg-top-left inset-[0_-2571px_0_2571px]" style={{ backgroundImage: `url("${imgLandingScreen}")` }} data-name="dot texture" />
      <div className="absolute left-[2243px] size-[320px] top-0" data-name="aura bronze">
        <svg className="absolute block inset-0 size-full" fill="none" height="320" preserveAspectRatio="none" viewBox="0 0 320 320" width="320">
          <circle cx="160" cy="160" fill="url(#paint0_radial_0_27)" id="aura bronze" r="160" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(160 160) scale(160)" gradientUnits="userSpaceOnUse" id="paint0_radial_0_27" r="1">
              <stop stopColor="#B69377" stopOpacity="0.26" />
              <stop offset="0.66" stopColor="#B69377" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[1915px] size-[320px] top-0" data-name="aura graphite">
        <svg className="absolute block inset-0 size-full" fill="none" height="320" preserveAspectRatio="none" viewBox="0 0 320 320" width="320">
          <circle cx="160" cy="160" fill="url(#paint0_radial_0_21)" id="aura graphite" r="160" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(160 160) scale(160)" gradientUnits="userSpaceOnUse" id="paint0_radial_0_21" r="1">
              <stop stopColor="#111111" stopOpacity="0.06" />
              <stop offset="0.66" stopColor="#111111" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <StatusSpacer />
      <TopBar />
      <Frame2 />
      <Frame3 />
      <Chips />
      <Frame4 />
      <div className="absolute left-[-93px] size-[320px] top-[-105px]" data-name="aura bronze">
        <svg className="absolute block inset-0 size-full" fill="none" height="320" preserveAspectRatio="none" viewBox="0 0 320 320" width="320">
          <circle cx="160" cy="160" fill="url(#paint0_radial_0_23)" id="aura bronze" r="160" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(160 160) scale(160)" gradientUnits="userSpaceOnUse" id="paint0_radial_0_23" r="1">
              <stop stopColor="#B69377" stopOpacity="0.26" />
              <stop offset="0.66" stopColor="#B69377" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}