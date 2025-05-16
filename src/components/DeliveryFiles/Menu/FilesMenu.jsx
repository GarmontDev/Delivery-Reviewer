import "./FilesMenu.css";
import { listAllFiles, logout, updateIncidents, updateUser } from "../../../config/firebase.js";
import secureLocalStorage from "react-secure-storage";
import { slide as Menu } from "react-burger-menu";
import { useState } from "react";
import MenuIcon from "../../../assets/icons/MenuIcon.jsx";
import XClearIcon from "../../../assets/icons/XClearIcon.jsx";
import { useEmployeeContext } from "../../../context/EmployeeContext.jsx";

const FilesMenu = () => {
  const { employee, setEmployee } = useEmployeeContext();
  const [soundEffectsState, setSoundEffectsState] = useState(employee.soundEffects);

  function refreshFilesState() {
    listAllFiles(true).then((res) => {
      if (res) {
        res.forEach((element) => {
          updateIncidents(element.number);
        });
      }
      alert("Files updated");
    });
  }

  function handleLogout() {
    secureLocalStorage.removeItem("employee");
    logout();
  }

  function handleSoundEffectsSwitch() {
    updateUser(employee.userID, !soundEffectsState);
    setSoundEffectsState(!soundEffectsState);
    setEmployee({ ...employee, soundEffects: !soundEffectsState });
  }

  return (
    <>
      <Menu
        customBurgerIcon={<MenuIcon size={30} />}
        customCrossIcon={<XClearIcon stroke="white" />}
        right
        className="absolute top-0 right-0 bg-slate-800 rounded-tl-lg pt-6"
        itemClassName="text-white tracking-wider mb-2 pl-2 pr-2 pb-1 w-4/6 rounded-md"
        crossButtonClassName="absolute top-0 right-0 mr-6 mt-4 bg-red-400 rounded-sm"
        burgerButtonClassName="w-10 h-10"
        burgerBarClassName="w-10 h-10"
      >
        {employee.admin ? (
          <div className="menu-item">
            <button id="update-incidents-button" onClick={() => refreshFilesState()}>
              Actualizar incidencias
            </button>
          </div>
        ) : (
          ""
        )}
        {employee.admin ? (
          <a id="create-new-file" className="menu-item" href="/createfile">
            Subir albarán
          </a>
        ) : (
          ""
        )}

        {employee ? (
          <div className="ml-4 flex">
            Efectos sonido:
            <div className="relative inline-flex w-11 h-5 ml-2">
              <input
                defaultChecked={soundEffectsState}
                onChange={() => handleSoundEffectsSwitch()}
                id="switch-component"
                type="checkbox"
                className="absolute top-1 left-0 peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-green-400 cursor-pointer transition-colors duration-300"
              />
              <label
                htmlFor="switch-component"
                className="absolute -top-3 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-400 cursor-pointer"
              />
            </div>
          </div>
        ) : (
          ""
        )}
        <hr className="h-0.5 mx-auto my-6 bg-gray-100 border-none rounded-sm " />

        <button
          id="close-session-button"
          onClick={() => {
            if (window.confirm("Seguro que deseas cerrar sesión?")) handleLogout();
          }}
          className="bg-red-500 text-white hover:bg-white hover:text-red-500 pl-2 pr-2 pb-1.5 pt-1 rounded-md m-auto mt-4"
        >
          Cerrar sesi&oacute;n
        </button>
      </Menu>
    </>
  );
};

export default FilesMenu;
