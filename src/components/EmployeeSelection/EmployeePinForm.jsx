import { Formik } from "formik"
import * as Yup from "yup";
import { employeePinLogin } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../../context/EmployeeContext";

const EmployeePinForm = ({employeeSelected, setEmployee}) => { 
  
  const navigate = useNavigate()

  const onSubmit = async ({pin}, { setSubmitting, setErrors, resetForm }) =>{
    try {
      const result = await employeePinLogin(employeeSelected, pin)
        if(result[0] === employeeSelected){
          setEmployee(employeeSelected)
          navigate("/home")
        }else{
          alert("PIN INCORRECTO")
          return setErrors({pin: "Pin incorrecto"})
        }
        resetForm();
    } catch (error) {
        console.log(error)
    } finally {
        setSubmitting(false)
    }
}

  const validationSchema = Yup.object().shape({
    pin: Yup
          .number()
          .min(4, "Min. 4 characters")
          .required("*Pin no válido"),
  })

  return(
    <>
      <Formik 
        initialValues={{ pin: ""}}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >                   
        {({values, handleSubmit, handleChange, errors, touched, handleBlur, isSubmitting}) => (
          <form 
            onSubmit={handleSubmit} 
            className="bg-gray-100 grid grid-cols-1 grid-rows-3 place-items-center p-4 rounded-md"
          >
            <label htmlFor="pin" className="text-base font-semibold tracking-wider text-gray-800">
              PIN
            </label>
            <input 
              id="pin" 
              type="pin" 
              name="pin" 
              value={values.pin} 
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={4}
              className={`p-2 w-full block border text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600
                ${errors.pin 
                ? "bg-red-200 border-red-300 " 
                : "bg-gray-50 border-gray-300"}`}
              placeholder="****" 
              required
            />
              <div className='form-errors'>
                {errors.pin && touched.pin && errors.pin}
              </div>
              <button 
                type='submit'
                disabled={isSubmitting} 
                className="w-full text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 text-center">
                Acceder
              </button>
          </form>
          )}
      </Formik>
    </>
    )
   }

    {/* <form onSubmit={handleSubmit} className="bg-gray-100 grid grid-cols-1 grid-rows-3 w-40 h-40 place-items-center">
          <label htmlFor="pin">PIN</label>
          <input type="password" id="pin" name="pin" className="w-20" maxLength={4}/>
          <button type="submit" className="text-blue-600 bg-gray-200 hover:bg-white rounded-md border-2 border-gray-400 p-2">Aceptar</button>
        </form>                 */}

 export default EmployeePinForm