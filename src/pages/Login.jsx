import React, {useState} from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom'
import FaviconIcon from "../assets/icons/FaviconIcon.jsx"
import { useUserContext } from '../context/UserContext.jsx';
 
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState("")

  const {user} = useUserContext();

  useEffect(() => {
    if (user){
      navigate('/home');
    }
  }, [user])
  
      
  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      navigate("/home")
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if(errorCode === "auth/invalid-email"){
        setLoginError("*Invalid email or password")
      }
    });
  }
 
    return(
        <>
          <section className="bg-gray-50 dark:bg-gray-900 h-screen w-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-4">
                    <div className='flex items-center gap-x-2'>
                      <FaviconIcon size={32}/>
                      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Delivery-Reviewer
                      </h1>
                    </div>
                    <form className="space-y-4" action="#">
                      <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input 
                          type="email" 
                          name="email" 
                          id="email" 
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 " 
                          placeholder="nombre@mail.com" required=""
                          onChange={(e)=>setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <input 
                          type="password" 
                          name="password" 
                          id="password" 
                          placeholder="••••••••" 
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 " 
                          required=""
                          onChange={(e)=>setPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center h-5">
                        <input 
                          id="remember" 
                          type="checkbox" 
                          value="" 
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" 
                          required />

                        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                          Mantener sesi&oacute;n
                        </label>
                      </div>
                          {loginError? <div className='text-red-600 font-medium text-center'>{loginError}</div> : ""}
                      <button onClick={onLogin} className="w-full text-white font-semibold bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 text-center">
                        Acceder
                      </button>

                    </form>
                  </div>
              </div>
            </div>
          </section>
        </>
    )
}
 
export default Login