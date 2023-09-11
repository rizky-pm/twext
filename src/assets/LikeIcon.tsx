type Props = {
  className: string;
  stroke?: string;
};

const LikeIcon = ({ className, stroke }: Props) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
      <g
        id='SVGRepo_tracerCarrier'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></g>
      <g id='SVGRepo_iconCarrier'>
        {' '}
        <g clipPath='url(#clip0_429_11246)'>
          {' '}
          <path
            d='M19.0711 13.1421L13.4142 18.799C12.6332 19.58 11.3668 19.58 10.5858 18.799L4.92893 13.1421C2.97631 11.1895 2.97631 8.02369 4.92893 6.07107C6.88155 4.11845 10.0474 4.11845 12 6.07107C13.9526 4.11845 17.1184 4.11845 19.0711 6.07107C21.0237 8.02369 21.0237 11.1895 19.0711 13.1421Z'
            stroke={stroke}
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          ></path>{' '}
        </g>{' '}
        <defs>
          {' '}
          <clipPath id='clip0_429_11246'>
            {' '}
            <rect width='24' height='24' fill='white'></rect>{' '}
          </clipPath>{' '}
        </defs>{' '}
      </g>
    </svg>
  );
};

export default LikeIcon;