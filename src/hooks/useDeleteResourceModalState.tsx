import { useState } from "react";

export const useDeleteResourceModalState = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return {
    modalIsOpen,
    setModalIsOpen,
  };
};
