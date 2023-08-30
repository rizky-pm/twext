import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  where,
  FieldPath,
} from 'firebase/firestore';
import dayjs from 'dayjs';

import { firestore } from '../utils/firebase';
import { PostType } from '../../type';

import Post from './Post';

type Props = {
  targetUserId: string;
};

const ProfilePostList = ({ targetUserId }: Props) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  console.log(targetUserId);

  const getOwnPost = () => {
    const q = query(
      collection(firestore, 'posts'),
      where(new FieldPath('author', 'id'), '==', targetUserId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempPosts: PostType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        const { author, content, createdAt } = data;

        const postData: PostType = {
          author,
          content,
          createdAt,
          id: doc.id,
        };

        tempPosts.push(postData);
      });

      tempPosts.sort((a, b) => {
        const dateA = dayjs(a.createdAt);
        const dateB = dayjs(b.createdAt);

        if (dateA.isBefore(dateB)) {
          return 1;
        } else if (dateA.isAfter(dateB)) {
          return -1;
        }

        return 0;
      });
      setPosts(tempPosts);
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (targetUserId) {
      const unsubscribe = getOwnPost();

      return () => {
        unsubscribe();
      };
    }
  }, [targetUserId]);

  return (
    <section className='p-4 border-2 rounded-md mt-2'>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  );
};

export default ProfilePostList;
