import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  where,
  FieldPath,
} from 'firebase/firestore';
import { firestore } from '../utils/firebase';

import { getUserFromLocalStorage } from '../utils';

import { PostType } from '../../type';
import dayjs from 'dayjs';
import Post from './Post';

const ProfilePostList = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const getOwnPost = () => {
    const currentUser = getUserFromLocalStorage();

    const q = query(
      collection(firestore, 'posts'),
      where(new FieldPath('author', 'id'), '==', currentUser.uid)
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
    const unsubscribe = getOwnPost();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section className='p-4 border-2 rounded-md mt-2'>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  );
};

export default ProfilePostList;