import { Divider } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

type PostType = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
    displayName: string;
  };
};

type PostProps = {
  post: PostType;
};

const Post = ({ post }: PostProps) => {
  dayjs.extend(relativeTime);

  return (
    <>
      <div className=' p-2 rounded-sm text-sm'>
        <div className='text-slate-500 font-bold flex justify-between'>
          <span className=''>{post.author.email}</span>
          <span>{dayjs().to(dayjs(post.createdAt))}</span>
        </div>
        <p>{post.content}</p>
      </div>

      <Divider />
    </>
  );
};

export default Post;
