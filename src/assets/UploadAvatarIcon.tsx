type Props = {
  className: string;
  fill?: string;
};

const UploadAvatarIcon = ({ className, fill }: Props) => {
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
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M12 18C14.7614 18 17 15.7614 17 13C17 10.2386 14.7614 8 12 8C9.23858 8 7 10.2386 7 13C7 15.7614 9.23858 18 12 18ZM12 16.0071C10.3392 16.0071 8.9929 14.6608 8.9929 13C8.9929 11.3392 10.3392 9.9929 12 9.9929C13.6608 9.9929 15.0071 11.3392 15.0071 13C15.0071 14.6608 13.6608 16.0071 12 16.0071Z'
          className={fill}
        ></path>{' '}
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M9.56155 2C8.18495 2 6.985 2.93689 6.65112 4.27239L6.21922 6H4C2.34315 6 1 7.34315 1 9V19C1 20.6569 2.34315 22 4 22H20C21.6569 22 23 20.6569 23 19V9C23 7.34315 21.6569 6 20 6H17.7808L17.3489 4.27239C17.015 2.93689 15.8151 2 14.4384 2H9.56155ZM8.59141 4.75746C8.7027 4.3123 9.10268 4 9.56155 4H14.4384C14.8973 4 15.2973 4.3123 15.4086 4.75746L15.8405 6.48507C16.0631 7.37541 16.863 8 17.7808 8H20C20.5523 8 21 8.44772 21 9V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V9C3 8.44772 3.44772 8 4 8H6.21922C7.13696 8 7.93692 7.37541 8.15951 6.48507L8.59141 4.75746Z'
          className={fill}
        ></path>{' '}
      </g>
    </svg>
  );
};

export default UploadAvatarIcon;
