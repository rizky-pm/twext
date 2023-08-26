import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';

import Post from './Post';
import { firestore } from '../utils/firebase';
import dayjs from 'dayjs';

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

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(firestore, 'posts'));
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

    return () => {
      unsubscribe();
    };
  }, []);

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
