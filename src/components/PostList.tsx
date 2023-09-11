import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  where,
  getDocs,
} from 'firebase/firestore';
import dayjs from 'dayjs';

import useAuthStore from '../state/auth/authStore';
import Post from './Post';
import { firestore } from '../utils/firebase';

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
    displayName: string;
  };
};

type UserIDs = string[] | [];

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userIDs, setUserIDs] = useState<UserIDs>([]);

  const { user } = useAuthStore();

  const getUserIDs = async () => {
    if (user) {
      const followersRef = collection(
        firestore,
        'userDetail',
        user?.uid,
        'followers'
      );

      const followersSnapshot = await getDocs(followersRef);

      followersSnapshot.forEach((followerDoc) => {
        const followerId = followerDoc.id;
        setUserIDs((prevState) => [...prevState, followerId]);
      });

      setUserIDs((prevState) => [...prevState, user.uid]);
    }
  };

  const getPostList = () => {
    if (userIDs.length) {
      const q = query(
        collection(firestore, 'posts'),
        where('author.id', 'in', userIDs)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tempPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const { author, content, createdAt } = data;

          const postData: Post = {
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
    }
  };

  useEffect(() => {
    getUserIDs();
  }, [user]);

  useEffect(() => {
    getPostList();
  }, [userIDs]);

  return (
    <section className=''>
      <div className='flex flex-col space-y-2'>
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </section>
  );
};

export default PostList;
