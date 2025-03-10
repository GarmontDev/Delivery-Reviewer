import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar'

const CustomDatePicker = ({datePicked, setDatePicked, setCalendarOpen, isRange}) => { 
  
  return(
    <>
      <div className='relative'>
        <Calendar
          selectRange={isRange}
          className="rounded-lg text-blue-700 bg-gray-100"
          returnValue='start'
          format='dd-MM-yy'
          locale='es-ES'
          onInvalidChange={() => alert("Invalid change")}
          value={datePicked} 
          onChange={(value) => (setDatePicked(value), setCalendarOpen(false))} 
        />
        <button className='h-87 w-full bg-red-800 hover:bg-red-600 text-white font-bold absolute -top-5 left-0 text-center rounded-t-md text-lg'
        onClick={() => setCalendarOpen(false)}>
          Cerrar calendario
        </button>
      </div>
    </>
  )
 }

 export default CustomDatePicker