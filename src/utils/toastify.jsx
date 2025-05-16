import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastConfig = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Slide,
};

export const notifySuccess = ({ message }) => toast.success(message, toastConfig);

export const notifyError = ({ message }) => toast.error(message, toastConfig);