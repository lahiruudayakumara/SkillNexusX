import { Helmet } from "react-helmet";
import { HomeView } from "@/sections/main/home/view";

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
