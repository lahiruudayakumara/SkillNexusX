import { Helmet } from "react-helmet";
import { NewPostView } from "@/sections/main/new-post/view";

const NewPostPage = () => {
  return (
    <>
      <Helmet>
        <title>New Post: SkillNexus</title>
      </Helmet>
      <NewPostView />
    </>
  );
};

export default NewPostPage;
