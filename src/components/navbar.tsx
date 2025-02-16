import Link from 'next/link';
import React from 'react';

interface Route {
  name: string,
  link: string
}

interface NavBarProps {
  routes: Route[]
}
export default function NavBar({ routes }: NavBarProps): React.ReactElement {

  const links = routes.map(({ name, link }: Route, i: number): React.ReactElement =>
    <Link className="text-center py-1 hover:text-gray-400 hover:bg-gray-800" key={i} href={link} >{name}</Link>
  );

  return (
    <nav className='fixed flex flex-col h-full w-40 top-0 left-0 py-10 shadow-lg bg-gray-800 text-white'>
      {links}
    </nav>
  );
}
