import { useEffect } from "react";

function useOutsideAlerter(
  modalRef: any,
  buttonRef: any,
  modalState: React.Dispatch<React.SetStateAction<any>>
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
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
