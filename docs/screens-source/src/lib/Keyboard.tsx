import landingPaths from "@/imports/LandingScreen/svg-mqzzdumakx";

// Reproduction of the source iOS-style keyboard, reused for the Home / Keyboard state.

function Key({ char, w = 32 }: { char: string; w?: number }) {
  return (
    <div
      className="flex h-[42px] flex-col items-center justify-center rounded-[8px] bg-[#fefcfa] ring-1 ring-line drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)]"
      style={{ width: w }}
    >
      <p className="font-['Urbanist:Medium',sans-serif] text-[16px] text-ink">{char}</p>
    </div>
  );
}

function SpecialKey({ children, size = 42 }: { children: React.ReactNode; size?: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[8px] bg-[#ebd9cc] ring-1 ring-[#d9c5b3] drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)]"
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}

export function Suggestions() {
  const cells = [
    { t: "I", strong: false },
    { t: "The", strong: true },
    { t: "I'm", strong: false },
  ];
  return (
    <div className="flex h-[44px] w-full items-center justify-between border-b border-line bg-canvas">
      {cells.map((c, i) => (
        <div key={c.t} className="flex flex-1 items-center justify-center">
          {i > 0 && <div className="mr-auto h-[20px] w-px bg-[#d9cfc3]" />}
          <p
            className={`text-[15px] ${c.strong ? "font-['Urbanist:SemiBold',sans-serif] text-ink" : "font-['Urbanist:Regular',sans-serif] text-muted"}`}
          >
            {c.t}
          </p>
          {i < cells.length - 1 && <div className="ml-auto h-[20px] w-px bg-[#d9cfc3]" />}
        </div>
      ))}
    </div>
  );
}

export function Keyboard() {
  return (
    <div className="w-full border-t border-line bg-[#ede9e4]">
      <Suggestions />
      <div className="flex flex-col gap-[8px] bg-[#e2ddd8] pb-[4px] pt-[8px]">
        <div className="flex items-center justify-between px-[4px]">
          {"QWERTYUIOP".split("").map((c) => (
            <Key key={c} char={c} />
          ))}
        </div>
        <div className="flex items-center justify-between px-[24px]">
          {"ASDFGHJKL".split("").map((c) => (
            <Key key={c} char={c} />
          ))}
        </div>
        <div className="flex items-center justify-between px-[4px]">
          <SpecialKey>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 10L8 6L4 10" stroke="#715035" strokeLinecap="round" strokeWidth="1.75" /></svg>
          </SpecialKey>
          {"ZXCVBNM".split("").map((c) => (
            <Key key={c} char={c} />
          ))}
          <SpecialKey>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d={landingPaths.p13f32b70} stroke="#715035" strokeLinecap="round" strokeWidth="1.75" /></svg>
          </SpecialKey>
        </div>
        <div className="flex items-center justify-center gap-[4px] px-[4px]">
          <div className="flex h-[44px] w-[42px] items-center justify-center rounded-[8px] bg-[#ebd9cc] ring-1 ring-[#d9c5b3] drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)]">
            <p className="font-['Urbanist:Medium',sans-serif] text-[13px] text-bronze-deep">123</p>
          </div>
          <div className="flex h-[44px] w-[42px] items-center justify-center rounded-[8px] bg-[#ebd9cc] ring-1 ring-[#d9c5b3] drop-shadow-[0px_1px_1px_rgba(37,31,27,0.08)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><g clipPath="url(#kc)"><path d={landingPaths.p22024600} stroke="#715035" strokeLinecap="round" strokeWidth="1.75" /></g><defs><clipPath id="kc"><rect fill="white" height="20" width="20" /></clipPath></defs></svg>
          </div>
          <div className="flex h-[44px] w-[171px] items-center justify-center rounded-[8px] bg-white ring-1 ring-line drop-shadow-[0px_1px_1px_rgba(37,31,27,0.05)]">
            <p className="font-['Urbanist:Regular',sans-serif] text-[15px] text-muted">space</p>
          </div>
          <div className="flex h-[44px] w-[86px] items-center justify-center rounded-[8px] bg-bronze ring-1 ring-bronze-edge drop-shadow-[0px_1px_1px_rgba(37,31,27,0.1)]">
            <p className="font-['Urbanist:SemiBold',sans-serif] text-[14px] text-ink">return</p>
          </div>
        </div>
      </div>
    </div>
  );
}
