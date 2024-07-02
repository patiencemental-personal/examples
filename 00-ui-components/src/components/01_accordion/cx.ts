import classNames from 'classnames/bind'
import style from './index.module.scss'

// `cx`는 `classNames` 유틸리티를 `index.module.scss`에 정의된 스타일에 바인딩하여 생성된 함수입니다.
// 이 함수를 사용하면 SCSS 모듈에서 정의된 클래스 이름을 안전하게 JavaScript 코드에서 사용할 수 있습니다.
// `bind` 함수는 각 클래스 이름에 고유한 해시 값을 추가하여, 생성된 최종 클래스 이름이 겹치지 않도록 합니다.
const cx = classNames.bind(style) // 이렇게 바인딩된 `cx` 함수는 SCSS 모듈의 클래스 이름을 안전하게 참조할 수 있게 해줍니다.

export default cx
