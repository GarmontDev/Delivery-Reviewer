import { Formik } from "formik";
import * as Yup from "yup";
import { employeePinLogin } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const EmployeePinForm = ({ employeeSelected, setEmployee, setEmployeePinModal }) => {
  const navigate = useNavigate();

  const onSubmit = async ({ pin }, { setSubmitting, setErrors, resetForm }) => {
    try {
      const result = await employeePinLogin(employeeSelected.name, pin);
      if (result[0].name === employeeSelected.name) {
        setEmployee(employeeSelected);
        secureLocalStorage.setItem("employee", JSON.stringify(employeeSelected));
        navigate("/home");
      } else {
        alert("PIN INCORRECTO");
        return setErrors({ pin: "Pin incorrecto" });
      }
      resetForm();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      setEmployeePinModal(false);
    }
  };

  const validationSchema = Yup.object().shape({
    pin: Yup.number().min(4, "Min. 4 characters").required("*Pin no válido"),
  });

  return (
    <>
      <Formik initialValues={{ pin: "" }} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ values, handleSubmit, handleChange, errors, touched, handleBlur, isSubmitting }) => (
          <form
            onSubmit={handleSubmit}
            className="bg-white w-72 h-60 flex flex-col gap-y-4 justify-around place-items-center p-4 rounded-md"
            autoComplete="false"
          >
            <div className="text-base flex items-center text-gray-800 gap-x-2">
              <label htmlFor="name" className="text-base text-gray-800">
                Usuario:
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={employeeSelected?.name}
                readOnly
                className="bg-gray-100 border border-gray-300 rounded-md p-2 max-w-40 text-center h-10"
              />
            </div>
            <div className="flex gap-x-2">
              <label htmlFor="pin" className="text-base text-gray-800">
                Password:
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                name="pin"
                value={values.pin}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={4}
                autoComplete="false"
                className={`p-2 mt-2 w-14 h-10 block border text-center text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600
                  ${errors.pin ? "bg-red-200 border-red-300 " : "bg-gray-50 border-gray-300"}`}
                placeholder="****"
                required
              />
            </div>
            <div className="form-errors">{errors.pin && "El PIN debe de ser un número."}</div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Acceder
            </button>
          </form>
        )}
      </Formik>
      <button onClick={() => setEmployeePinModal(false)} className="absolute top-1 right-3 text-xl px-2 font-semibold text-gray-500 hover:text-red-600">
        x
      </button>
    </>
  );
};

{
  /* <form onSubmit={handleSubmit} className="bg-gray-100 grid grid-cols-1 grid-rows-3 w-40 h-40 place-items-center">
          <label htmlFor="pin">PIN</label>
          <input type="password" id="pin" name="pin" className="w-20" maxLength={4}/>
          <button type="submit" className="text-blue-600 bg-gray-200 hover:bg-white rounded-md border-2 border-gray-400 p-2">Aceptar</button>
        </form>                 */
}

export default EmployeePinForm;
