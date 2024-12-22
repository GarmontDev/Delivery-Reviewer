import "./FilesMenu.css";
import {
  listAllFiles,
  logout,
  updateIncidents,
} from "../../../config/firebase.js";
import secureLocalStorage from "react-secure-storage";
import { slide as Menu } from "react-burger-menu";
import { useState } from "react";
import MenuIcon from "../../../assets/icons/MenuIcon.jsx";
import XClearIcon from "../../../assets/icons/XClearIcon.jsx";

const FilesMenu = ({ employee, showVisibleFiles }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  function refreshFilesState() {
    listAllFiles(showVisibleFiles).then((res) => {
      if (res) {
        res.forEach((element) => {
          updateIncidents(element.number);
        });
      }
      setMenuOpen(false);
      alert("Files updated");
    });
  }

  function handleLogout() {
    secureLocalStorage.removeItem("employee");
    logout();
  }

  return (
    <>
      <Menu
        isOpen={menuOpen}
        customBurgerIcon={<MenuIcon size={30} />}
        customCrossIcon={<XClearIcon stroke="white" />}
        right
        className="asbolute top-4 right-10 bg-slate-800 rounded-tl-lg pt-2 pl-2"
        itemClassName="text-white tracking-wider ml-4 mt-4"
        crossButtonClassName="mr-6 mt-6 bg-red-400 rounded-sm"
        burgerButtonClassName="w-10 h-10"
        burgerBarClassName="w-10 h-10"
      >
        {employee.admin ? (
          <button
            id="update-incidents-button"
            className="menu-item"
            onClick={() => refreshFilesState()}
          >
            Actualizar incidencias
          </button>
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
        <button
          id="close-session-button"
          onClick={() => {
            if (window.confirm("Seguro que deseas cerrar sesión?"))
              handleLogout();
          }}
          className="menu-item bg-red-500 pl-2 pr-2 rounded-md mt-14"
        >
          Cerrar sesi&oacute;n
        </button>
      </Menu>
    </>
  );
};

export default FilesMenu;
