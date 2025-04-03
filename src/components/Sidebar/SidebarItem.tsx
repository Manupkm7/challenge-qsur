import { useRecoilValue } from 'recoil';
import { isSidebarOpenAtom } from '../../atoms';
import { JSX } from 'react';
import { Link } from 'react-router-dom';

const SidebarItem = ({
  name,
  route,
  icon,
  onClick,
  testId,
  className,
  dark,
}: {
  name?: string;
  route: string;
  icon?: JSX.Element;
  className?: string;
  onClick?: () => void;
  testId?: string;
  dark?: boolean;
}) => {
  const isSidebarOpen = useRecoilValue(isSidebarOpenAtom);
  const isActive = location.pathname === route;

  return (
    <>
      <Link to={route} onClick={onClick} className="w-full">
        <div
          className={`flex w-full py-[12px] px-[12px] cursor-pointer select-none gap-[10px] transition-all rounded-lg hover:text-[#0074B5] items-center ${
            isSidebarOpen ? 'justify-start' : 'justify-center'
          } ${isActive ? 'text-[#0074B5]' : 'text-[#004468]'} ${dark ? 'text-white' : ''} ${className}`}
          data-testid={testId}
        >
          <div>{icon}</div>
          {isSidebarOpen && <p className="text-lg font-medium">{name}</p>}
        </div>
      </Link>
    </>
  );
};

export default SidebarItem;
