import { Helmet } from "react-helmet";
import { HomeView } from "@/sections/main/home/view";
import Hero from "./hero";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>SkillNexus</title>
      </Helmet>
      <HomeView />
    </>
  );
};

export default HomePage;
