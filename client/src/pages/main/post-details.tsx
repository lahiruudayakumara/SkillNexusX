import { Helmet } from "react-helmet";
import { PostDetailsView } from "@/sections/main/post/view";

const PostDetailsPage = () => {
  return (
    <>
      <Helmet>
        <title>Post Details: SkillNexus</title>
      </Helmet>
      <PostDetailsView />
    </>
  );
};

export default PostDetailsPage;
