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
    type: "SECTION" | "IMAGE" | "PARAGRAPH" | "CODE";
    content: string;
    url: string;
    position: number;
  }

  export interface FormData {
    userId: number;
    title: string;
    isPublished: boolean;
  }