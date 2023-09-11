import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

import { firestore } from '../utils/firebase';
import useAuthStore from '../state/auth/authStore';
import theme from '../styles/variables';
import ThreeDotsIcon from '../assets/ThreeDotsIcon';
import CommentIcon from '../assets/CommentIcon';
import LikeIcon from '../assets/LikeIcon';

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

type Comment = {
  size: number;
  data: {
    commentId: string;
    content: string;
    timestamp: Timestamp;
    userId: string;
  }[];
};

type Like = {
  size: number;
  data: {
    userId: string;
    timestamp: Timestamp;
  }[];
};

const Post = ({ post }: PostProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [commentData, setCommentData] = useState<Comment>({
    size: 0,
    data: [],
  });
  const [likeData, setLikeData] = useState<Like>({
    size: 0,
    data: [],
  });

  const navigate = useNavigate();
  const { user } = useAuthStore();
  const tooltipRef = useRef<HTMLUListElement | null>(null);

  dayjs.extend(relativeTime);

  const getLikesAndComments = async () => {
    const postRef = doc(firestore, 'posts', post.id);
    const commentsRef = collection(postRef, 'comments');
    const likesRef = collection(postRef, 'likes');
    const commentsQuerySnapshot = await getDocs(commentsRef);
    const likesQuerySnapshot = await getDocs(likesRef);

    const commentsData: Comment['data'] = commentsQuerySnapshot.docs.map(
      (doc) => {
        const { commentId, content, timestamp, userId } = doc.data();
        return { commentId, content, timestamp, userId };
      }
    );

    const likesData: Like['data'] = likesQuerySnapshot.docs.map((doc) => {
      const { userId, timestamp } = doc.data();
      return { userId, timestamp };
    });

    if (commentsQuerySnapshot.size > 0) {
      setCommentData({
        size: commentsQuerySnapshot.size,
        data: [...commentsData],
      });
    }

    if (likesQuerySnapshot.size > 0) {
      setLikeData({
        size: commentsQuerySnapshot.size,
        data: [...likesData],
      });
    }
  };

  console.log(likeData);

  const handleDeleteOwnPost = async (postId: string) => {
    try {
      await deleteDoc(doc(firestore, 'posts', postId));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLikesAndComments();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsTooltipOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isModalOpen]);

  return (
    <>
      <div className='relative'>
        <div className='post gap-y-3 p-4 border-b-2 hover:bg-slate-100 transition relative'>
          <div className='avatar rounded-full w-12 h-12 bg-slate-500'></div>
          <div className='header flex justify-between items-center'>
            <span
              onClick={() => {
                post.author.id === user?.uid
                  ? navigate('/profile')
                  : navigate(`/profile/${post.author.id}`);
              }}
              className='cursor-pointer font-semibold hover:text-slate-400'
            >
              {post.author.email}
            </span>
            <div className='text-black text-sm flex space-x-2 items-center'>
              <span>{dayjs().to(dayjs(post.createdAt))}</span>
              <div className='relative w-6 h-6 rounded-full bg-transparent hover:bg-slate-200 transition cursor-pointer flex justify-center items-center'>
                <span
                  onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
                    event.stopPropagation();
                    setIsTooltipOpen(true);
                  }}
                >
                  <ThreeDotsIcon className='stroke-black w-4 h-4' />
                </span>
              </div>
            </div>
          </div>
          <div className='content'>
            <p>{post.content}</p>
          </div>
          <div className='footer flex space-x-6 text-lg font-semibold'>
            <div className='flex items-center space-x-1'>
              <CommentIcon
                className='h-5 w-5 cursor-pointer'
                stroke={theme.colors.common.black}
              />
              <span>{commentData.size}</span>
            </div>

            <div className='flex items-center'>
              <LikeIcon
                className='h-6 w-6 cursor-pointer'
                stroke={theme.colors.common.black}
              />
              <span>{likeData.size}</span>
            </div>
          </div>
        </div>

        {isTooltipOpen && (
          <ul
            ref={tooltipRef}
            className='bg-slate-100 absolute top-6 right-0 translate-x-28 overflow-hidden rounded flex flex-col space-y-1'
          >
            {post.author.id === user?.uid && (
              <li
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className='cursor-pointer w-24 px-4 py-2 transition hover:bg-slate-200'
              >
                Delete
              </li>
            )}
            <li className='cursor-pointer w-24 px-4 py-2 transition hover:bg-slate-200'>
              Share
            </li>
          </ul>
        )}
      </div>
      {isModalOpen && (
        <div className='fixed z-10 top-[50%] left-[50%] rounded bg-slate-200 px-10 py-8 text-center translate-x-[-50%] translate-y-[-50%] flex justify-center items-center flex-col space-y-6'>
          <p className='font-bold'>Are you sure to delete your post?</p>
          <div className='flex justify-center gap-5'>
            <Button
              variant='outlined'
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color='error'
              variant='contained'
              onClick={() => {
                if (post.author.id === user?.uid) {
                  handleDeleteOwnPost(post.id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
