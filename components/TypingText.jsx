import { useEffect, useState } from "react";

export default function TypingText() {
  const text = "Manage your recharges and bill payments with SamyPay's advanced automation tools";

  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let typingInterval;

    if (index < text.length) {
      typingInterval = setTimeout(() => {
        setDisplay((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50);
    } else {
      // pause then reset
      setTimeout(() => {
        setDisplay("");
        setIndex(0);
      }, 1200);
    }

    return () => clearTimeout(typingInterval);
  }, [index]);

  return <div className="welcome-text">{display}</div>;
}
