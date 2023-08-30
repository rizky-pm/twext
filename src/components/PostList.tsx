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

type FollowersId = string[] | [];

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [followersId, setFollowersId] = useState<FollowersId>([]);

  const { user } = useAuthStore();

  const getFollowersId = async () => {
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
        setFollowersId((prevState) => [...prevState, followerId]);
      });
    }
  };

  const getPostList = () => {
    if (followersId.length) {
      const q = query(
        collection(firestore, 'posts'),
        where('author.id', 'in', followersId)
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
    getFollowersId();
  }, [user]);

  useEffect(() => {
    getPostList();
  }, [followersId]);

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
