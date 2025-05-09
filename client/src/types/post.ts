export interface PostCreateDTO {
  userId: number;
  title: string;
  contentBlocks: {
    type: string;
    content: string | null;
    url: string | null;
    videoDuration: number | null;
    position: number;
  }[];
  isPublished: boolean;
}

export interface ContentBlock {
    type: "SECTION" | "IMAGE" | "VIDEO" | "PARAGRAPH" | "CODE";
    content: string;
    url: string;
    position: number;
  }

  export interface FormData {
    userId: number;
    title: string;
    isPublished: boolean;
  }

  export interface FeedContentBlock {
    id: number;
    type: string;
    content: string | null;
    url: string | null;
    videoDuration: string | null;
    position: number;
  };
  
  export interface FeedPost  {
    id: number;
    userId: number;
    title: string;
    fullName: string;
    username: string;
    contentBlocks: FeedContentBlock[];
    createdAt: string;
    isPublished: boolean;
    liked: boolean,
    likeCount: number,
    followedByUser: boolean,
  };

  export interface FeedState {
    posts: FeedPost[];
    loading: boolean;
    error: string | null;
  }