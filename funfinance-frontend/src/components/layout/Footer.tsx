import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <div className="container text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} FunFinance - Контроль сімейного бюджету на хобі та розваги</p>
      </div>
    </footer>
  );
};

export default Footer;