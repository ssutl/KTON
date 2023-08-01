import { useEffect } from "react";

function useOutsideAlerter(
  modalRef: any,
  modalState: React.Dispatch<React.SetStateAction<any>>,
  buttonRef: any
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      // Check if the event target is the button or inside the modal
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        modalState(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, buttonRef]);
}

export default useOutsideAlerter;
