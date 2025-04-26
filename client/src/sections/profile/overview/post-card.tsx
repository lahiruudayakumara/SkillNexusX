import { memo, FC } from 'react';
import { EyeIcon } from 'lucide-react';
import { BookmarkIcon, DotsVerticalIcon, IconButton } from './icon';
import ReactMarkdown from 'react-markdown';

type ContentBlock = {
  id: number;
  type: string;
  content: string | null;
  url: string | null;
  videoDuration: string | null;
  position: number;
};

interface Post {
  id: number;
  userId: number;
  title: string;
  contentBlocks: ContentBlock[];
  createdAt: string;
  isPublished: boolean;
}

const PostCard: FC<Post> = memo(({ id, userId, title, contentBlocks, createdAt, isPublished }) => {
  
  const imageBlock = contentBlocks.find(block => block.type === 'IMAGE' && block.url);

  const paragraphBlock = contentBlocks.find(block => block.type === 'PARAGRAPH' && block.content);

  // Extract and limit description to first 3 lines
  const description = paragraphBlock?.content
    ? paragraphBlock.content.split('\n').slice(0, 3).join('\n')
    : '';

  return (
    <article className="mb-12 flex gap-4">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-2">{new Date(createdAt).toLocaleDateString()}</p>
        {description && (
          <div className="text-gray-600 mb-4 line-clamp-3" style={{ whiteSpace: 'pre-line' }}>
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        )}
        <div className="flex items-center text-gray-500 text-sm">
          <span>{new Date(createdAt).toLocaleDateString()}</span>
          <span className="mx-2">·</span>
          <span className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            Views
          </span>
          <div className="ml-auto flex gap-2">
            <IconButton aria-label="Bookmark">
              <BookmarkIcon className="h-5 w-5" />
            </IconButton>
            <IconButton aria-label="More options">
              <DotsVerticalIcon className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </div>
      {imageBlock && imageBlock.url && (
        <img
          src={imageBlock.url}
          alt={`${title} thumbnail`}
          className="w-24 h-24 object-cover rounded flex-shrink-0"
        />
      )}
    </article>
  );
});

export default PostCard;