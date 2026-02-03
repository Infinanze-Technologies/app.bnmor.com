import dayjs from  "dayjs";
import localizedFormat  from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)


const formatDate = (date) => {
    try {
        if(date != null){
            return dayjs(date).format('DD-MM-YYYY')
        }

        return ''
        
    } catch (error) {
        console.log(error)
    }
}

const formatTime = (time) => {
    try {

        if(time != null){

            return dayjs(time).format('h:mm A')
        }

        return ''
        
    } catch (error) {
        console.log(error)
    }
}





const formatDateHuman = (date) => {
    try {
        if(date != null){

            return dayjs(date).format('LL')
        }

        return ''
        
    } catch (error) {
        console.log(error)
    }
}

const formatDay = (date) => {
    try {
        if(date != null){
            return dayjs(date).format('DD')
        }

        return ''
        
    } catch (error) {
        console.log(error)
    }
}

const formatRawDate = (date) => {
    try {
        if(date != null){
            return dayjs(date).format('YYYY-MM-DD')
        }

        return ''
        
    } catch (error) {
        console.log(error)
    }
}


export {formatDate, formatTime, formatDateHuman, formatDay, formatRawDate}