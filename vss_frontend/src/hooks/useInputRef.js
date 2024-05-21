import { useEffect } from 'react';
import { useCallback, useState, useRef } from 'react';
import { regexKeyMap, validateRegex } from '../lib/validation';

/**
 * @param {
 *  @init: 초기값
 *  @validRules: [
 *    'require',
 *    {
 *      rule: 'require',
 *      warning: '반드시 필요한 값 입니다'
 *    },
 *    { 커스텀 룰의 경우 custom 프로퍼티를 true로 설정한 이후 validate 함수를 구현해야 한다
 *      custom: true, 
 *      validate: (value) => {
 *        if (value > 5) return false;
 *        return true;
 *      },
 *      warningMessage: '값이 5보다 큽니다'
 *    }
 *    ...
 *  ],
 *  @convert: (value) => { onChange 함수 호출 시 마다 실행됨. 현재 인풋의 value를 입력 받고 변환된 값을 리턴
 *    return converted
 *  },
 * } option
 */
export default function useInputRef(option = {}) {
  const reference = useRef(null);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    if (reference && option.init) {
      reference.current.value = option.init
    }
  }, [reference, option])

  const get = useCallback(() => {
    return reference.current.value;
  }, [reference])

  const set = useCallback((newValue) => {
    reference.current.value = newValue;
  }, [reference])

  // 추후 중복 코드 리팩토링
  const validate = useCallback(() => {
    const value = reference.current.value
    let valid = true;

    option.validRules?.some(ruleItem => {
      /**
       * 룰이 string 타입이며
       * 시스템에 이미 정의되어 있는 경우 처리
       */
      if (typeof ruleItem === 'string') {
        if (ruleItem === 'require' && ['', null, undefined].includes(value)) {
          setWarningMessage('반드시 필요한 값 입니다');
          valid = false;
          return true; // break
        } else if (ruleItem === 'hangul' && !validateRegex(regexKeyMap.hangul, value)) {
          setWarningMessage('한글만 입력 가능합니다.');
          valid = false;
          return true; // break
        } else if (ruleItem === 'password' && !validateRegex(regexKeyMap.password, value)) {
          setWarningMessage('영문과 숫자, 특수 문자 조합 8~15 자리를 입력해주세요.');
          valid = false;
          return true; // break
        } else if (ruleItem === 'phone' && !validateRegex(regexKeyMap.phone, value)) {
          setWarningMessage('휴대폰 번호를 입력해주세요.');
          valid = false;
          return true; // break
        }
      }

      /**
       * 룰이 object 타입이며
       * 시스템에 이미 정의되어 있지만
       * 사용자 정의 메시지를 사용하고 싶을 경우 처리
       */
      if (ruleItem.rule === 'require') {
        if (['', null, undefined].includes(value)) {
          setWarningMessage(ruleItem.warning)
          valid = false;
          return true; // break
        }
      } else if (ruleItem.rule === 'hangul') {
        if (!validateRegex(regexKeyMap.hangul, value)) {
          setWarningMessage(ruleItem.warning)
          valid = false;
          return true; // break
        }
      } else if (ruleItem.rule === 'password') {
        if (!validateRegex(regexKeyMap.password, value)) {
          setWarningMessage(ruleItem.warning)
          valid = false;
          return true; // break
        }
      } else if (ruleItem.rule === 'phone') {
        if (!validateRegex(regexKeyMap.phone, value)) {
          setWarningMessage(ruleItem.warning)
          valid = false;
          return true; // break
        }
      }

      
        // TODO 룰이 커스텀인 경우 처리 (미구현)
      

      return false; // continue
    });

    if (valid) setWarningMessage('')
    return valid;
  }, [option]) 

  const onChange = useCallback((event) => {
    if (option.convert) {
      const converted = option.convert(event.currentTarget.value)
      event.currentTarget.value = converted;
    }
  }, [option])

  return {
    reference,
    onChange,
    warningMessage,
    setWarningMessage,
    validate,
    get,
    set
  }
}