import { OverviewView } from "@/sections/profile/overview/view";
import { Helmet } from "react-helmet";

const ProfilePage = () => {
  return (
    <>
      <Helmet>
        <title>Profile : SkillNexus</title>
      </Helmet>
      <OverviewView />
    </>
  );
};

export default ProfilePage;
