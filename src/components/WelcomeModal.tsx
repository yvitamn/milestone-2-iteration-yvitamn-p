import React, { useEffect, useState } from 'react';

interface WelcomeModalProps {
  onClose: () => void; 
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set the modal to disappear after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Change this value to control how long the modal stays visible

    return () => clearTimeout(timer);
  }, []);

  return (
    isVisible && (
      <div className="modal fade-out">
        <div className="modal-content">
          <h2>Welcome to our website!</h2>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default WelcomeModal;
