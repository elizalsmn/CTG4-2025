// frontend/src/components/back.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

/**
 * Back button component
 * - Fixed position near the top-left
 * - Always navigates to HomePage route: '/'
 * - No external CSS required
 *
 * Optional props:
 * - top, left: override position if needed (e.g., '16px')
 * - ariaLabel: accessibility label override
 */
const Back = ({
    to ='/HomePage',
    top = '16px',
    left = '16px',
    ariaLabel = 'Go back to Home',
}) => {
  const navigate = useNavigate();

  const containerStyle = {
    position: 'fixed',
    top,
    left,
    zIndex: 1000, // above page content
  };

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent'

  };

  const iconStyle = {
    width: '18px',
    height: '18px',
  };

const handleClick = () => {
    if (typeof to === 'number') {
      navigate(to); // e.g., -1 to go back
    } else {
      navigate(to); // string path like '/rewards'
    }
};

  return (
    <div style={containerStyle}>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={handleClick}
        style={buttonStyle}
      >
        <FaArrowLeft style={iconStyle} />
      </button>
    </div>
  );
};

export default Back;