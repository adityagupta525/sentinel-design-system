// Icon primitives — SVG path data reused verbatim from the imported Figma source.
import landingPaths from "@/imports/LandingScreen/svg-mqzzdumakx";
import convPaths from "@/imports/ConversationScreen/svg-yqcscdbneh";

type P = { className?: string; stroke?: string };

export function IconPlus({ stroke = "#251F1B" }: P) {
  return (
    <div className="overflow-clip relative size-[20px]">
      <div className="absolute inset-[16.67%]">
        <div className="absolute inset-[-4.16%]">
          <svg className="block size-full" fill="none" height="17.33" preserveAspectRatio="none" viewBox="0 0 17.33 17.33" width="17.33">
            <path d={landingPaths.p11352280} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function IconMenu({ stroke = "#251F1B" }: P) {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 18 18" width="18">
        <path d={landingPaths.p33a06404} stroke={stroke} strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function IconChevronRight({ stroke = "#B69377" }: P) {
  return (
    <div className="relative shrink-0 size-[15px]">
      <svg className="absolute block inset-0 size-full" fill="none" height="15" preserveAspectRatio="none" viewBox="0 0 15 15" width="15">
        <path d={landingPaths.p5646280} stroke={stroke} strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function IconAttach({ stroke = "#605954" }: P) {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute inset-[13.3%_18.75%_17.84%_19.93%]">
        <div className="absolute inset-[-5.37%_-6.02%]">
          <svg className="block size-full" fill="none" height="13.7241" preserveAspectRatio="none" viewBox="0 0 12.3683 13.7241" width="12.3683">
            <path d={landingPaths.p1ab4a180} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function IconArrow({ stroke = "white" }: P) {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute inset-[20.83%_16.67%]">
        <div className="absolute inset-[-6.33%_-5.54%]">
          <svg className="block size-full" fill="none" height="11.83" preserveAspectRatio="none" viewBox="0 0 13.33 11.83" width="13.33">
            <path d={convPaths.pf929b80} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function IconSparkle({ stroke = "#715035" }: P) {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute inset-[12.5%_18.75%_27.08%_18.75%]">
        <div className="absolute inset-[-6.11%_-5.91%]">
          <svg className="block size-full" fill="none" height="12.205" preserveAspectRatio="none" viewBox="0 0 12.58 12.205" width="12.58">
            <path d={convPaths.p17126a80} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" />
          </svg>
        </div>
      </div>
    </div>
  );
}
