import React from 'react';

interface ThankYouModalProps {
  onClose: () => void;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        <h2 className="text-4xl font-bold mb-6 text-center">Thank You!</h2>
        <p className="text-xl mb-4">Your order has been successfully placed.</p>
        <p className="mb-6">We will process it shortly.</p>

        <button
          onClick={onClose}
          className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ThankYouModal;
