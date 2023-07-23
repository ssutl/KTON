import { useEffect } from "react";

function useOutsideAlerter(
  ref: any,
  modalState: React.Dispatch<React.SetStateAction<any>>
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        modalState(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideAlerter;
