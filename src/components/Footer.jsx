const Footer = () => { 
  return(
    <>
      <footer className="bg-white rounded-lg shadow relative inset-x-0 bottom-0">
        <div className="w-full p-4 md:flex mx-auto max-w-screen-xl items-center justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025 
            <a href="https://github.com/GarmontDev" className="hover:underline"> GarmontDev™</a>. All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center ml-2 mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                  <a href="#" className="hover:underline me-4 md:me-6">Pol&iacute;tica de privacidad</a>
              </li>
              <li>
                  <a href="#" className="hover:underline me-4 md:me-6">Licencia</a>
              </li>
              <li>
                  <a href="mailto:garmontdev@gmail.com" className="hover:underline">Contactar</a>
              </li>
          </ul>
        </div>
      </footer>
    </>
  )
 }
 export default Footer