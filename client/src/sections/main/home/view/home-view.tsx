import PostCard from "./post-card";

const HomeView = () => {
  return (
    <div className="flex">
      <div className="w-2/3 space-y-8 py-8 divide-y-[1px] divide-slate-400">
        <PostCard
          username="John Doe"
          avatar="https://via.placeholder.com/50"
          content="Check out this awesome view!"
          mediaUrl="https://via.placeholder.com/600"
          mediaType="image"
        />
        <PostCard
          username="John Doe"
          avatar="https://via.placeholder.com/50"
          content="Check out this awesome view!"
          mediaUrl="https://via.placeholder.com/600"
          mediaType="image"
        />
        <PostCard
          username="John Doe"
          avatar="https://via.placeholder.com/50"
          content="Check out this awesome view!"
          mediaUrl="https://via.placeholder.com/600"
          mediaType="image"
        />
      </div>
      <div></div>
    </div>
  );
};

export default HomeView;
