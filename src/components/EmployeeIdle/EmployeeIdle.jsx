import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import Popup from "reactjs-popup";
import { useEmployeeContext } from "../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";

const EmployeeIdle = () => {
  const [remaining, setRemaining] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const { clearEmployeeContext } = useEmployeeContext();
  const navigate = useNavigate();

  const timeOut = 300_000;
  const promptBeforeIdle = 2_000;

  const onIdle = () => {
    clearEmployeeContext()
    navigate("/home");
  };

  const onActive = () => {
    setModalOpen(false)
  };

  const onPrompt = () => {
    setModalOpen(true)
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
      clearInterval(interval)
    };
  });

  const handleStillHere = () => {
    activate();
  };

  return (
    <>
      <Popup
        modal
        position="top center"
        nested
        open={modalOpen}
        onClose={() => (handleStillHere(), setModalOpen(false))}
        repositionOnResize
      >
        <div className="bg-white p-4 text-center">
          <h3 className="text-xl pb-2">Sigues ah&iacute;?</h3>
          <p className="text-xl">{remaining} segundos</p>
          <button onClick={() => handleStillHere()} className="mt-2 p-4 bg-green-600 hover:text-green-600 hover:bg-gray-200 rounded-md text-white">Sigo aqu&iacute;</button>
        </div>
      </Popup>
    </>
  );
};

export default EmployeeIdle;
