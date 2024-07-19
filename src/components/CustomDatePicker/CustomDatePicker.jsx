import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar'

const CustomDatePicker = ({datePicked, setDatePicked, setCalendarOpen, isRange}) => { 
  
  return(
    <>
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
    </>
  )
 }

 export default CustomDatePicker