import AlertTriangleIcon from "../../../assets/icons/AlertTriangleIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import CheckIcon from "../../../assets/icons/CheckIcon";
import EmptyCheckIcon from "../../../assets/icons/EmptyCheckIcon";
import { EyeOffIcon, EyeOpenIcon } from "../../../assets/icons/EyeIcon";
import { updateFile } from "../../../config/firebase";
import { useEmployeeContext } from "../../../context/EmployeeContext";
import { notifySuccess } from "../../../utils/toastify";

const FilesListTable = ({
  filteredFiles,
  showVisibleFiles,
  handleListAllFiles,
  handleDeliveryFile,
  handleUpdateCompleted,
  handleDeleteFile,
}) => {
  const { employee } = useEmployeeContext();

  return (
    <>
      {filteredFiles?.length > 0 ? (
        <div className="flex flex-col items-center justify-center">
          <div
            className="grid grid-cols-2 grid-rows-2
              bg-slate-400 text-white border-2 rounded-lg mt-2 w-full h-8 overflow-hidden"
          >
            <div className="font-semibold ml-2">Albar&aacute;n</div>
            <div className="grid grid-cols-4">
              <div className="font-semibold ml-2">Inc</div>
              <div className="font-semibold ml-2">Act</div>
              <div className="font-semibold ml-2">Vis</div>
              <div className="font-semibold ml-2">Elim</div>
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
                    item.incidents,
                    item.visible
                  )
                }
              >
                <div id={item} className="font-semibold flex justify-start pl-1 pt-1">
                  {item.number}
                  <p className="ml-2 font-medium text-gray-600">
                    {typeof item.createdDate === "string"
                      ? item.createdDate
                      : new Date(item.createdDate.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-44 py-2.5 px-1 flex text-start text-blue-700">
                  {item.description}
                </div>
              </button>
              <div className="grid grid-rows-1 grid-cols-4 pt-4 ml-2">
                <div className="w-8">{item.incidents ? <AlertTriangleIcon /> : ""}</div>
                <div className="w-5">
                  {item.completed ? (
                    <button
                      disabled={!employee.admin}
                      className="disabled:cursor-not-allowed"
                      onClick={() => {
                        handleUpdateCompleted(item.number, item.completed);
                      }}
                    >
                      <CheckIcon size={24} />
                    </button>
                  ) : (
                    <button
                      disabled={!employee.admin}
                      className="disabled:cursor-not-allowed"
                      onClick={() => {
                        handleUpdateCompleted(item.number, item.completed);
                      }}
                    >
                      <EmptyCheckIcon size={20} />
                    </button>
                  )}
                </div>
                {employee.admin ? (
                  <div className="w-5">
                    <button
                      onClick={() => (
                        updateFile(item.number, item.incidents, item.completed, !item.visible),
                        handleListAllFiles(showVisibleFiles)
                      )}
                    >
                      {item.visible ? <EyeOpenIcon size={24} /> : <EyeOffIcon />}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {employee.admin ? (
                  <div className="w-5">
                    <button
                      type="button"
                      onClick={() => {
                        const confirmation = window.confirm("¿Deseas eliminar este albarán?");
                        if (!confirmation) {
                          return;
                        }
                        handleDeleteFile(item.number);
                        notifySuccess({
                          message: "Albarán eliminado con éxito",
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
        <div className="flex items-center text-center place-content-center pt-2 pb-2 text-gray-500 bg-white rounded-lg border-2 shadow">No hay albaranes disponibles</div>
      )}
    </>
  );
};

export default FilesListTable;
