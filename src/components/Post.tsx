import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import useAuthStore from '../state/auth/authStore';

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
  const navigate = useNavigate();
  const { user } = useAuthStore();

  dayjs.extend(relativeTime);

  return (
    <>
      <div className=' p-2 rounded-sm text-sm'>
        <div className='text-slate-500 font-bold flex justify-between'>
          <span
            onClick={() => {
              post.author.id === user?.uid
                ? navigate('/profile')
                : navigate(`/profile/${post.author.id}`);
            }}
            className='cursor-pointer'
          >
            {post.author.email}
          </span>
          <span>{dayjs().to(dayjs(post.createdAt))}</span>
        </div>
        <p>{post.content}</p>
      </div>

      <Divider />
    </>
  );
};

export default Post;
