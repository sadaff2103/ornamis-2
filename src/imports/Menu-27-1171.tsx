import imgImage7 from "figma:asset/54726e7fc7d6afc77636d762a41a64b549adfa15.png";
import imgRing21 from "figma:asset/f6df2dc13ec2df0bd10d2e3b0c478f7460c1ed28.png";
import imgImage8 from "figma:asset/6c66ad760f1920c6675520e43bd3fa10aefcfdc3.png";
import imgImage1 from "figma:asset/0abcf8a705d38ae14f1484251525bce6d450a846.png";

/**
 * @figmaAssetKey 4e202506fd2edda1fe5e9273e946f3f5bac0dfd8
 */
function Bracelets1({ className }: { className?: string }) {
  return (
    <div className={className} data-name="BRACELETS.1">
      <div className="absolute bottom-[2.8%] left-[0.17%] right-[2.75%] top-0" data-name="image 7">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[163.16%] left-0 max-w-none top-[-20.46%] w-full" src={imgImage7} />
        </div>
      </div>
      <div className="absolute bg-gradient-to-b bottom-0 from-[#f0cec4] left-0 opacity-[0.86] right-[2.93%] to-[#332518] top-0" />
      <p className="absolute bottom-[41.26%] font-['Cinzel_Decorative:Regular',_sans-serif] leading-[16px] left-[6.2%] not-italic right-0 text-[#eee6d9] text-[84px] top-[42.42%]">BRACELETS</p>
    </div>
  );
}

/**
 * @figmaAssetKey 483e817afb8e9b295fdfca9385a3b6fea9125059
 */
function Rings1({ className }: { className?: string }) {
  return (
    <div className={className} data-name="RINGS.1">
      <div className="absolute bottom-0 left-[0.52%] right-0 top-0" data-name="RING2 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[172.33%] left-[-2.56%] max-w-none top-[-55.68%] w-full" src={imgRing21} />
        </div>
      </div>
      <div className="absolute bg-gradient-to-b bottom-0 from-[#332518] left-0 opacity-70 right-[2.75%] to-[#f0cec4] top-0" />
      <div className="absolute font-['Cinzel_Decorative:Regular',_sans-serif] inset-[38.05%_30.64%_9.51%_22.38%] leading-[normal] not-italic text-[#eee6d9] text-[84px]">
        <p className="mb-0">RINGS</p>
        <p>&nbsp;</p>
      </div>
    </div>
  );
}

/**
 * @figmaAssetKey 9be137a6e63a5e945abb870241507b129dfa9be8
 */
function Necklace1({ className }: { className?: string }) {
  return (
    <div className={className} data-name="NECKLACE.1">
      <div className="absolute bottom-[0.49%] left-[0.18%] right-0 top-0" data-name="image 8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[239.92%] left-[-7.12%] max-w-none top-[-31.38%] w-[115.9%]" src={imgImage8} />
        </div>
      </div>
      <div className="absolute bg-gradient-to-b from-[#f0cec4] inset-0 opacity-[0.74] to-[#332518]" />
      <p className="absolute font-['Cinzel_Decorative:Regular',_sans-serif] inset-[34.24%_9.86%_37.93%_8.6%] leading-[normal] not-italic text-[#eee6d9] text-[84px]">NECKLACE </p>
    </div>
  );
}

export default function Menu() {
  return (
    <div className="relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] size-full" data-name="MENU">
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.004393658600747585)+(var(--transform-inner-height)*0.9999899864196777)))] items-center justify-center left-[calc(50%+10.651px)] top-0 translate-x-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.004467858467251062)+(var(--transform-inner-width)*0.9999903440475464)))]" style={{ "--transform-inner-width": "1286.6875", "--transform-inner-height": "527.0625" } as React.CSSProperties}>
        <div className="flex-none rotate-[0.252deg]">
          <div className="h-[527.085px] relative rounded-[30px] w-[1286.7px]" data-name="image 1">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[30px] size-full" src={imgImage1} />
          </div>
        </div>
      </div>
      <Necklace1 className="absolute h-[402.615px] left-[725px] top-[646.68px] w-[558px]" />
      <Rings1 className="absolute h-[427.406px] left-0 top-[633.68px] w-[581px]" />
      <Bracelets1 className="absolute h-[425.423px] left-[3px] top-[1139.68px] w-[581px]" />
    </div>
  );
}