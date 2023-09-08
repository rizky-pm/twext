import { useState } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

import { firestore } from '../utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

type FormValues = {
  search: string;
};

type SearchResultType = {
  displayName: string;
  emailAddress: string;
  uid: string;
};

const ExploreBar = () => {
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);

  const { register, formState, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      search: '',
    },
  });

  const { errors } = formState;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  console.log(pathname);

  const handleSearch = async (data: FormValues) => {
    console.log(data);

    const searchResultRef = collection(firestore, 'userDetail');
    const searchQuery = query(
      searchResultRef,
      where('emailAddress', '==', data.search)
    );
    const searchResultSnapshot = await getDocs(searchQuery);
    console.log(searchResultSnapshot);

    const tempResults: SearchResultType[] = [];

    searchResultSnapshot.forEach((doc) => {
      const data = doc.data();
      const res = {
        uid: doc.id,
        displayName: data.displayName,
        emailAddress: data.emailAddress,
      };

      tempResults.push(res);
    });

    setSearchResult(tempResults);
  };

  return (
    !pathname.includes('/profile') && (
      <section className='w-2/6 p-4'>
        <div className='border-l-2 pl-6 flex flex-col space-y-2'>
          <form
            className='flex flex-col space-y-2'
            onSubmit={handleSubmit(handleSearch)}
            noValidate
          >
            <TextField
              type='text'
              placeholder='Explore'
              fullWidth
              size='small'
              {...register('search')}
              error={!!errors.search}
              helperText={errors.search?.message}
            />
            <button
              className='px-2 py-1 font-semibold uppercase bg-primary text-white hover:bg-primary-light transition rounded tracking-wider'
              type='submit'
            >
              Search
            </button>
          </form>

          {searchResult.map((res) => (
            <div
              className='p-2 flex flex-col'
              key={res.uid}
              onClick={() => {
                navigate(`profile/${res.uid}`);
              }}
            >
              <span>{res.displayName}</span>
              <span>{res.emailAddress}</span>
            </div>
          ))}
        </div>
      </section>
    )
  );
};

export default ExploreBar;
