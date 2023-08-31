import InputPost from '../components/InputPost';
import PostList from '../components/PostList';

const Home = () => {
  return (
    <main className='h-full'>
      <InputPost />
      <PostList />
    </main>
  );
};

export default Home;
