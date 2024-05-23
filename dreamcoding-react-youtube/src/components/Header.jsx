import React from 'react';
import { AiFillYoutube, AiOutlineSearch } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Header = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const searchInputRef = React.useRef();
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/videos/${searchInputRef.current.value}`)
  }

  React.useEffect(() => {
    searchInputRef.current.value = keyword ? keyword : '';
  }, [keyword])

  return (
    <header className='w-full flex p-4 text-2xl border-b border-zinc-600 mb-4'>
      <Link
        className='flex items-center'
        to='/'
      >
        <AiFillYoutube className='text-4xl text-brand' />
        <h1 className='font-bold ml-2 text-3xl'>Youtube</h1>
      </Link>
      <form
        className='w-full flex justify-center'
        onSubmit={handleSubmit}
      >
        <input
          className='w-7/12 p-2 outline-none bg-black text-gray-50'
          ref={searchInputRef}
          type='text'
          placeholder='Search...'
        />
        <button className='bg-zinc-600 px-4'>
          <AiOutlineSearch />
        </button>
      </form>
    </header>
  );
};

export default Header;