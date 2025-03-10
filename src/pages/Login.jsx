import "./Login.css";
import React, { useEffect, useState } from "react";
import { auth, login } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext.jsx";
import { Formik } from "formik";
import * as Yup from "yup";
import DRlogo from "../assets/images/DR_Logo_Transp.webp"

const Login = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const [displayNameInput, setDisplayInput] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  const onSubmit = async (
    { email, password, name },
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      const credentialUser = await login({
        email,
        password,
        name,
        displayNameInput,
      });
      //resetForm();
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        return setErrors({ credentials: "Usuario y/o contraseña incorrecta" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email no válido").required("*Email necesario"),
    password: Yup.string()
      .trim()
      .min(6, "Min. 6 characters")
      .required("*Password no válida"),
    name: Yup.string().min(3, "Min. 3 characters"),
  });

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 h-screen w-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4">
              <div className="flex items-center place-content-center gap-x-2">
                <img src={DRlogo} className="size-16 -ml-8"/>
                <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-sky-600 mt-2">
                  Delivery-Reviewer
                </h1>
              </div>
              <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
              >
                {({
                  values,
                  handleSubmit,
                  handleChange,
                  errors,
                  touched,
                  handleBlur,
                  isSubmitting,
                }) => (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <div className="flex">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-900"
                        >
                          Email
                        </label>
                      </div>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`h-10 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 border
                          ${errors.email
                            ? "bg-red-200  border-red-300"
                            : "bg-gray-50 border border-gray-300"
                        }`}
                        placeholder="nombre@mail.com"
                        required
                      />
                      <div className="form-errors">
                        {errors.email && touched.email && errors.email}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className={`h-10 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 border
                          ${errors.email
                            ? "bg-red-200  border-red-300"
                            : "bg-gray-50 border border-gray-300"
                        }`}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                      />
                      <div className="form-errors">
                        {errors.password && touched.password && errors.password}
                      </div>
                    </div>
                    {displayNameInput ? (
                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Nombre
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Nombre"
                          className={`${
                            errors.name
                              ? "bg-red-200 border border-red-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                              : "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                          }`}
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />
                        <div className="form-errors">
                          {errors.name && touched.name && errors.name}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="form-errors">{errors.credentials}</div>
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
