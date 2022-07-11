import { useState } from "react";

const useDeleteResourceModalState = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return {
    modalIsOpen,
    setModalIsOpen,
  };
};

export default useDeleteResourceModalState;
