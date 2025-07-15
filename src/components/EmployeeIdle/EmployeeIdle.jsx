import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useEmployeeContext } from "../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import "../../utils/popup-window.css";

function EmployeeIdle() {
  const [remaining, setRemaining] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const { clearEmployeeContext } = useEmployeeContext();
  const navigate = useNavigate();

  const timeOut = 300000;
  const promptBeforeIdle = 10000;

  const onIdle = () => {
    clearEmployeeContext();
    navigate("/home");
  };

  const onActive = () => {
    setModalOpen(false);
  };

  const onPrompt = () => {
    setModalOpen(true);
  };

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout: timeOut,
    promptBeforeIdle,
    throttle: 500,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });

  const handleStillHere = () => {
    activate();
  };

  return (
    <>
      <div
        className={
          modalOpen
            ? "popup-window bg-white p-4 text-center w-60 h-60 justify-around items-center flex flex-col"
            : "hidden"
        }
      >
        <h3 className="text-xl pb-2 font-semibold text-red-600">¿Sigues ah&iacute;?</h3>
        <p className="text-xl">{remaining} segundos restantes</p>
        <button
          onClick={() => (handleStillHere(), setModalOpen(false))}
          className="mt-4 p-4 bg-green-600 hover:text-green-600 hover:bg-gray-200 rounded-md text-white font-semibold"
        >
          Sigo aqu&iacute;
        </button>
      </div>
    </>
  );
}

export default EmployeeIdle;
