import { FC, memo } from "react";
import { DotsVerticalIcon, IconButton } from "./icon";

interface FollowItem {
  name: string;
  avatar: string;
}

const FollowItem: FC<FollowItem> = memo(({ name, avatar }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <img src={"https://ntrepidcorp.com/wp-content/uploads/2016/06/team-1.jpg"} alt={name} className="w-6 h-6 rounded-full" />
      <span>{name}</span>
    </div>
    <IconButton aria-label="More options">
      <DotsVerticalIcon className="h-5 w-5 text-gray-500" />
    </IconButton>
  </div>
));

export default FollowItem;
