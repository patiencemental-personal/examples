const regexMap = {
  email: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
  hangul: /^[가-힣]+$/,
  // password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/, // 영문자 + 숫자 8~12 자리
  password: /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=]).*$/, // 문자 + 숫자 + 특수문자 조합 8~15자리
  phone: /^\d{3}-\d{3,4}-\d{4}$/,
}

const regexKeyMap = {
  email: 'email',
  hangul: 'hangul',
  password: 'password',
  phone: 'phone',
}

const validateRegex = (regexKey, src) => {
  return regexMap[regexKey].test(src);
}

export {
  validateRegex, regexKeyMap
};
