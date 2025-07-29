import React from 'react';
import { Menu, X } from 'lucide-react';

export const MobileMenuToggle = ({ isOpen, onToggle }) => {
  return (
    <button
      className="mobile-menu-toggle"
      onClick={onToggle}
      aria-label="Toggle mobile menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};
