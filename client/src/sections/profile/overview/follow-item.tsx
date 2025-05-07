import { FC, memo } from "react";
import { DotsVerticalIcon, IconButton } from "./icon";

interface FollowItem {
  name: string;
  avatar: string;
}

const FollowItem: FC<FollowItem> = memo(({ name, avatar }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <img src={avatar} alt={name} className="w-6 h-6 rounded" />
      <span>{name}</span>
    </div>
    <IconButton aria-label="More options">
      <DotsVerticalIcon className="h-5 w-5 text-gray-500" />
    </IconButton>
  </div>
));

export default FollowItem;
