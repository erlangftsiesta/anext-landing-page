import { MENU_ITEMS } from "@/data/menu";
import { Header } from "../header/header";
import { PrimaryButton } from "../../common/primary-button";
import { TransparentButton } from "../../common/transparent-button";

export interface HeroIslandProps {
  variant?: "full" | "menu";
  floating?: boolean;
  heading?: string;
  subheading?: string;
  actions?: React.ReactNode;
}

export function HeroIsland({
  variant = "full",
  floating = true,
  heading = "Grow Your Ideas Into Something Real and Reliable",
  subheading = "We build systems that grow with you. From infrastructure to applications, we support you every step of the way.",
  actions = (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-md sm:max-w-none mx-auto">
      <PrimaryButton
        href="/teams"
        className="w-full sm:w-auto text-center justify-center min-h-[52px] sm:min-h-[56px] px-8 py-4 rounded-[20px] text-base font-semibold shadow-lg"
      >
        Talk to our Engineers
      </PrimaryButton>
      <TransparentButton
        href="/projects"
        className="w-full sm:w-auto text-center justify-center min-h-[52px] sm:min-h-[56px] px-8 py-4 rounded-[20px] text-base font-semibold"
      >
        Explore Things We Did
      </TransparentButton>
    </div>
  ),
}: HeroIslandProps = {}) {
  return (
    <Header
      menuItems={MENU_ITEMS}
      variant={variant}
      floating={floating}
      heading={heading}
      subheading={subheading}
      actions={actions}
    />
  );
}

export default HeroIsland;
