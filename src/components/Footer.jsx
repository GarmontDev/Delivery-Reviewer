const Footer = () => { 
  return(
    <>
      <div className="relative">
        <footer className="bg-white rounded-lg shadow m-4 absolute top-0 left-1/2">
          <div className="w-full p-4 md:flex mx-auto max-w-screen-xl md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2024 
              <a href="https://github.com/GarmontDev" className="hover:underline"> GarmontDev™</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
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
      </div>
    </>
  )
 }
 export default Footer