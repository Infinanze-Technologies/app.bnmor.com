import React from 'react'
import FullCalendar from "@fullcalendar/react";
// The import order DOES MATTER here. If you change it, you'll get an error!
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
function Canlendar() {

 
  return (
    <FullCalendar
    innerRef={calendarRef}
    plugins={[timeGridPlugin, interactionPlugin]}
    editable
    selectable
  />
  )
}

export default Canlendar