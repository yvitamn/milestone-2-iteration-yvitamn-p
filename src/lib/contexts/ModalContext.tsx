// import { createContext, useState, useContext, ReactNode } from 'react';

// interface ModalContextType {
//   isCartModalOpen: boolean;
//   setIsCartModalOpen: (isOpen: boolean) => void;
// }

// export const ModalContext = createContext<ModalContextType>({
//   isCartModalOpen: false,
//   setIsCartModalOpen: () => {}, // Use underscore to indicate unused parameter
// });

// interface ModalProviderProps {
//   children: ReactNode;
// }

// export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
//   const [isCartModalOpen, setIsCartModalOpen] = useState(false);

//   return (
//     <ModalContext.Provider value={{ isCartModalOpen, setIsCartModalOpen }}>
//       {children}
//     </ModalContext.Provider>
//   );
// };


// export const useModal = () => {
//   const context = useContext(ModalContext);
//   if (!context) {
//     throw new Error('useModal must be used within a ModalProvider');
//   }
//   return context;
// };