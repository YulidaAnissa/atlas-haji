import { IconProps } from '../types';

function Icon({ fill = '#E01A00' , ...props }: IconProps) {
  return (
    <svg fill="none" height="13" viewBox="0 0 13 13" width="13"  xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0.541016 11.6462H12.4577L6.49935 1.35449L0.541016 11.6462ZM7.04102 10.0212H5.95768V8.93783H7.04102V10.0212ZM7.04102 7.85449H5.95768V5.68783H7.04102V7.85449Z" fill={fill}/>
    </svg>
  );
}

export default Icon;