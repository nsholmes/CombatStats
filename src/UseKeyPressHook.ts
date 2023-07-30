import { useEffect, useState } from "react";

function useKeyPress() {
  const [keyPressed, setKeyPressed] = useState();

  const keyPressedHandler = () => { }

  useEffect(() => {
    window.addEventListener('keypress', keyPressedHandler)
  }, [])
}