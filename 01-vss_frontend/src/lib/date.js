
/**
 * date object의 시간을 세팅해주는 함수
 * @param {date object} date 시간을 세팅할 date 객체
 * @param {object} option hours, minutes, seconds를 프로퍼티로 가지는 오브젝트
 */
const setTime = (date, option) => {
  if (!date) throw new Error("setTime function must have need date object");
  if (!option) throw new Error("setTime function must have need option");
  
  const { hours, minutes, seconds } = option;
  date.setHours(hours || 0)
  date.setMinutes(minutes || 0)
  date.setSeconds(seconds || 0)
}

/**
 * @see https://graykang.tistory.com/14
 */
const toKrISOString = (date) => {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
}

/**
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @param {Date} current 
 * @returns current가 startDate ~ endDate 사이인지 검증
 */
const isDateTimeRange = (startDate, endDate, current = new Date()) => {
  const currentTimestamp = current.getTime();
  return startDate.getTime() <= currentTimestamp && endDate.getTime() >= currentTimestamp;
}

export {
  setTime,
  toKrISOString,
  isDateTimeRange
}