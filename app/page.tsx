import { Hero } from "@/components/sections/Hero";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { TrustBar } from "@/components/sections/TrustBar";
import { CoreCapabilities } from "@/components/sections/CoreCapabilities";
import { WhyLayrus } from "@/components/sections/WhyLayrus";
import { RecentProjects } from "@/components/sections/RecentProjects";
import { Platforms } from "@/components/sections/Platforms";
import { WhoWeBuildFor } from "@/components/sections/WhoWeBuildFor";
import { Compliance } from "@/components/sections/Compliance";
import { Insights } from "@/components/sections/Insights";
import { StartProject } from "@/components/sections/StartProject";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HeroCarousel />
      <TrustBar />
      <CoreCapabilities />
      <WhyLayrus />
      <RecentProjects />
      <Platforms />
      <WhoWeBuildFor />
      <Compliance />
      <Insights />
      <StartProject />
    </>
  );
}
