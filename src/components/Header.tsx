import React from 'react';
import ConnectButton from './ConnectButton';
import LogoImg from '@/assets/logo.svg';

const Header = () => {
  return (
    <nav className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img src={LogoImg} alt="logo" className="h-8 w-8" />
            </div>
            <div className="font-bold text-lg ml-2">Investly</div>
          </div>

          <div className="ml-4 flex items-center md:ml-6">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
