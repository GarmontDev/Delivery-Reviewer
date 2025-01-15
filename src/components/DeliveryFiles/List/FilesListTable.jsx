import AlertTriangleIcon from "../../../assets/icons/AlertTriangleIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import CheckIcon from "../../../assets/icons/CheckIcon";
import EmptyCheckIcon from "../../../assets/icons/EmptyCheckIcon";
import { EyeOffIcon, EyeOpenIcon } from "../../../assets/icons/EyeIcon";
import { updateFile } from "../../../config/firebase";
import Swal from "sweetalert2";

const FilesListTable = ({
  employee,
  filteredFiles,
  showVisibleFiles,
  handleListAllFiles,
  handleDeliveryFile,
  handleUpdateCompleted,
  handleDeleteFile,
}) => {
  return (
    <>
      {filteredFiles?.length > 0 ? (
        <div className="delivery-files-items-container">
          <div
            className="grid grid-cols-2 grid-rows-2
              bg-slate-400 text-white border-2 rounded-lg mt-2 w-full h-8 overflow-hidden"
          >
            <div className="font-semibold ml-2">
              Albar&aacute;n
            </div>
            <div className="grid grid-cols-4">
              <div className="font-semibold ml-2">
                Inc
              </div>
              <div className="font-semibold ml-2">
                Act
              </div>
              <div className="font-semibold ml-2">
                Vis
              </div>
              <div className="font-semibold ml-2">
                Elim
              </div>
            </div>
          </div>
          {filteredFiles?.map((item, index) => (
            <div
              className="grid grid-cols-2 grid-rows-2
              bg-white hover:bg-slate-100 border-2 rounded-lg m-2 w-full h-14 text-gray-900 overflow-hidden"
              key={item + "-" + index}
            >
              <button
                className="grid grid-rows-2 grid-cols-1 ml-2 hover:text-blue-600"
                onClick={() =>
                  handleDeliveryFile(
                    item.number,
                    item.createdDate,
                    item.completed,
                    item.incidents
                  )
                }
              >
                <div
                  id={item}
                  className="font-semibold flex justify-start pl-1 pt-1"
                >
                  {item.number}
                  <p className="ml-2 font-medium text-gray-600">
                    {typeof item.createdDate === "string"
                      ? item.createdDate
                      : new Date(
                          item.createdDate.seconds * 1000
                        ).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-44 py-2.5 px-1 flex text-start text-blue-700">
                  {item.description}
                </div>
              </button>
              <div className="grid grid-rows-1 grid-cols-4 pt-4 ml-2">
                <div className="w-8">
                  {item.incidents ? <AlertTriangleIcon /> : ""}
                </div>
                <div className="w-5">
                  {item.completed ? (
                    <button
                      disabled={!employee.admin}
                      className="disabled:cursor-not-allowed"
                      onClick={() => {
                        handleUpdateCompleted(item.number, item.completed);
                      }}
                    >
                      <CheckIcon size={25} />
                    </button>
                  ) : (
                    <button
                      disabled={!employee.admin}
                      className="disabled:cursor-not-allowed"
                      onClick={() => {
                        handleUpdateCompleted(item.number, item.completed);
                      }}
                    >
                      <EmptyCheckIcon size={21} />
                    </button>
                  )}
                </div>
                {employee.admin ? (
                  <div className="w-5">
                    {item.visible ? (
                      <button
                        onClick={() => (
                          updateFile(
                            item.number,
                            item.incidents,
                            item.completed,
                            false
                          ),
                          handleListAllFiles(showVisibleFiles)
                        )}
                      >
                        <EyeOpenIcon />
                      </button>
                    ) : (
                      <button
                        onClick={() => (
                          updateFile(
                            item.number,
                            item.incidents,
                            item.completed,
                            true
                          ),
                          handleListAllFiles(showVisibleFiles)
                        )}
                      >
                        <EyeOffIcon />
                      </button>
                    )}
                  </div>
                ) : (
                  ""
                )}
                {employee.admin ? (
                  <div className="w-5">
                    <button
                      type="button"
                      onClick={() => {
                        Swal.fire({
                          title: "¿Deseas eliminar este albar&aacute;n?",
                          text: "Este proceso NO es reversible",
                          icon: "warning",
                          position: "top",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Sí, adelante",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleDeleteFile(item.number);
                            Swal.fire({
                              title: "¡Albarán eliminado con éxito!",
                              icon: "success",
                              position: "top",
                              confirmButtonColor: "#3085d6",
                              confirmButtonText: "Aceptar",
                            });
                          }
                        });
                      }}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-files-available">No hay albaranes disponibles</div>
      )}
    </>
  );
};

export default FilesListTable;
