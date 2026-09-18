import svgPaths from "./svg-yqcscdbneh";
import imgConversationScreen from "./30f7cfce9690d36cf3d41efd14e946b9b28032da.png";

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

function Bubble() {
  return (
    <div className="bg-[#f9eee6] relative rounded-bl-[20px] rounded-br-[6px] rounded-tl-[20px] rounded-tr-[20px] shrink-0" data-name="Bubble">
      <div className="content-stretch flex flex-col items-start overflow-clip px-[12px] py-[10px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[19px] relative shrink-0 text-[#251f1b] text-[14px] whitespace-nowrap">How is Sunita’s portfolio doing?</p>
      </div>
      <div aria-hidden className="absolute border border-[#ebd4c3] border-solid inset-0 pointer-events-none rounded-bl-[20px] rounded-br-[6px] rounded-tl-[20px] rounded-tr-[20px]" />
    </div>
  );
}

function Speaker() {
  return (
    <div className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0" data-name="Speaker">
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="icon · sparkle">
        <div className="absolute inset-[12.5%_18.75%_27.08%_18.75%]" data-name="Vector">
          <div className="absolute inset-[-6.11%_-5.91%]">
            <svg className="block size-full" fill="none" height="12.205" preserveAspectRatio="none" viewBox="0 0 12.58 12.205" width="12.58">
              <path d={svgPaths.p17126a80} id="Vector" stroke="#715035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
            </svg>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Urbanist:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[#605954] text-[12px] whitespace-nowrap">Sentinel</p>
    </div>
  );
}

function Prompt() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="Prompt">
      <div className="content-stretch flex items-center justify-between overflow-clip relative rounded-[inherit] size-full">
        <div className="h-[26px] relative shrink-0 w-[319px]" data-name="SleeveRow">
          <div className="flex flex-row items-center size-full">
            <div className="[word-break:break-word] content-stretch flex font-['Urbanist:Medium',sans-serif] font-medium gap-[8px] items-center leading-[20px] relative size-full text-[#251f1b] text-[14px]">
              <p className="flex-[1_0_0] min-w-px relative">Equity</p>
              <p className="relative shrink-0 text-right whitespace-nowrap">71%</p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#e7e7e7] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Prompt1() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="Prompt">
      <div className="content-stretch flex items-center justify-between overflow-clip relative rounded-[inherit] size-full">
        <div className="h-[26px] relative shrink-0 w-[319px]" data-name="SleeveRow">
          <div className="flex flex-row items-center size-full">
            <div className="[word-break:break-word] content-stretch flex font-['Urbanist:Medium',sans-serif] font-medium gap-[8px] items-center leading-[20px] relative size-full text-[#251f1b] text-[14px]">
              <p className="flex-[1_0_0] min-w-px relative">Debt</p>
              <p className="relative shrink-0 text-right whitespace-nowrap">24%</p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#e7e7e7] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Prompt2() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Prompt">
      <div className="h-[26px] relative shrink-0 w-full" data-name="SleeveRow">
        <div className="flex flex-row items-center size-full">
          <div className="[word-break:break-word] content-stretch flex font-['Urbanist:Medium',sans-serif] font-medium gap-[8px] items-center leading-[20px] relative size-full text-[#251f1b] text-[14px]">
            <p className="flex-[1_0_0] min-w-px relative">Cash</p>
            <p className="relative shrink-0 text-right whitespace-nowrap">5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllocationBarGenerated() {
  return (
    <div className="bg-[#edebe7] h-[6px] overflow-clip relative rounded-[20px] shrink-0 w-full" data-name="AllocationBar · generated">
      <div className="absolute bg-[#b69377] h-[6px] left-0 top-0 w-[217px]" data-name="Equity · 71%" />
      <div className="absolute bg-[#d9bb9e] h-[6px] left-[217px] top-0 w-[68px]" data-name="Debt · 24%" />
      <div className="absolute bg-[#ebd4c3] h-[6px] left-[285px] top-0 w-[34px]" data-name="Cash · 5%" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Prompt2 />
      <AllocationBarGenerated />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[143px] items-start px-[12px] relative rounded-[16px] shrink-0 w-[343px]">
      <Prompt />
      <Prompt1 />
      <Frame5 />
    </div>
  );
}

function Bubble1() {
  return (
    <div className="bg-[#f9eee6] relative rounded-bl-[20px] rounded-br-[6px] rounded-tl-[20px] rounded-tr-[20px] shrink-0" data-name="Bubble">
      <div className="content-stretch flex flex-col items-start overflow-clip px-[12px] py-[10px] relative rounded-[inherit] size-full">
        <p className="[word-break:break-word] font-['Urbanist:SemiBold',sans-serif] font-semibold leading-[19px] relative shrink-0 text-[#251f1b] text-[14px] whitespace-nowrap">Which two funds carry the drift?</p>
      </div>
      <div aria-hidden className="absolute border border-[#ebd4c3] border-solid inset-0 pointer-events-none rounded-bl-[20px] rounded-br-[6px] rounded-tl-[20px] rounded-tr-[20px]" />
    </div>
  );
}

function Speaker1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0" data-name="Speaker">
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="icon · sparkle">
        <div className="absolute inset-[12.5%_18.75%_27.08%_18.75%]" data-name="Vector">
          <div className="absolute inset-[-6.11%_-5.91%]">
            <svg className="block size-full" fill="none" height="12.205" preserveAspectRatio="none" viewBox="0 0 12.58 12.205" width="12.58">
              <path d={svgPaths.p17126a80} id="Vector" stroke="#715035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
            </svg>
          </div>
        </div>
      </div>
      <p className="[word-break:break-word] font-['Urbanist:Bold',sans-serif] font-bold leading-[16px] relative shrink-0 text-[#605954] text-[12px] whitespace-nowrap">Sentinel</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[458px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[32px] pt-[16px] px-[16px] relative size-full">
        <div className="relative shrink-0 w-[343px]" data-name="ThreadTurn · partner">
          <div className="flex flex-col items-end size-full">
            <div className="content-stretch flex flex-col items-end relative size-full">
              <Bubble />
            </div>
          </div>
        </div>
        <div className="relative shrink-0 w-[343px]" data-name="ThreadTurn · Sentinel">
          <div className="content-stretch flex flex-col gap-[10px] items-start relative size-full">
            <Speaker />
            <p className="[word-break:break-word] font-['Urbanist:Medium',sans-serif] font-medium leading-[20px] min-w-full relative shrink-0 text-[#3d3630] text-[14px] w-[min-content]">Book is 71 % equity against a 60 % target. Two funds carry the drift.</p>
          </div>
        </div>
        <Frame4 />
        <div className="relative shrink-0 w-[343px]" data-name="ThreadTurn · partner">
          <div className="flex flex-col items-end size-full">
            <div className="content-stretch flex flex-col items-end relative size-full">
              <Bubble1 />
            </div>
          </div>
        </div>
        <div className="relative shrink-0 w-[343px]" data-name="ThreadTurn · Sentinel">
          <div className="content-stretch flex flex-col gap-[10px] items-start relative size-full">
            <Speaker1 />
            <p className="[word-break:break-word] font-['Urbanist:Regular',sans-serif] font-normal leading-[20px] min-w-full relative shrink-0 text-[#3d3630] text-[14px] w-[min-content]">HDFC Flexi Cap is 34 % of the book and Axis Bluechip 19%. Both sit above the 15 % single-fund ceiling in her mandate.</p>
          </div>
        </div>
      </div>
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
    <div className="content-stretch flex flex-col h-[126px] items-start overflow-clip px-[16px] relative shrink-0 w-full" data-name="Ask holder">
      <AskBar />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col h-[286px] items-start justify-end relative shrink-0 w-full">
      <AskHolder />
    </div>
  );
}

export default function ConversationScreen() {
  return (
    <div className="bg-size-[3px_3px,auto_auto] bg-top-left content-stretch flex flex-col items-start overflow-clip pb-[12px] relative rounded-[24px] size-full" style={{ backgroundImage: `url("${imgConversationScreen}"), linear-gradient(90deg, rgb(246, 244, 241) 0%, rgb(246, 244, 241) 100%)` }} data-name="conversation screen">
      <div className="absolute left-[-93px] size-[320px] top-[-105px]" data-name="aura bronze">
        <svg className="absolute block inset-0 size-full" fill="none" height="320" preserveAspectRatio="none" viewBox="0 0 320 320" width="320">
          <circle cx="160" cy="160" fill="url(#paint0_radial_0_36)" id="aura bronze" r="160" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(160 160) scale(160)" gradientUnits="userSpaceOnUse" id="paint0_radial_0_36" r="1">
              <stop stopColor="#B69377" stopOpacity="0.26" />
              <stop offset="0.66" stopColor="#B69377" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bg-size-[3px_3px] bg-top-left inset-[0_-2571px_0_2571px]" style={{ backgroundImage: `url("${imgConversationScreen}")` }} data-name="dot texture" />
      <div className="absolute left-[2243px] size-[320px] top-0" data-name="aura bronze">
        <svg className="absolute block inset-0 size-full" fill="none" height="320" preserveAspectRatio="none" viewBox="0 0 320 320" width="320">
          <circle cx="160" cy="160" fill="url(#paint0_radial_0_39)" id="aura bronze" r="160" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(160 160) scale(160)" gradientUnits="userSpaceOnUse" id="paint0_radial_0_39" r="1">
              <stop stopColor="#B69377" stopOpacity="0.26" />
              <stop offset="0.66" stopColor="#B69377" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute left-[1915px] size-[320px] top-0" data-name="aura graphite">
        <svg className="absolute block inset-0 size-full" fill="none" height="320" preserveAspectRatio="none" viewBox="0 0 320 320" width="320">
          <circle cx="160" cy="160" fill="url(#paint0_radial_0_31)" id="aura graphite" r="160" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(160 160) scale(160)" gradientUnits="userSpaceOnUse" id="paint0_radial_0_31" r="1">
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
    </div>
  );
}