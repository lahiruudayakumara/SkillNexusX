import { Helmet } from "react-helmet";
import { CommentsView } from "@/sections/main/comments/view";

const CommentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Post Details: SkillNexus</title>
      </Helmet>
      <CommentsView />
    </>
  );
};

export default CommentsPage;
