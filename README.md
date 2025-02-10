# POS with Storybook

이 프로젝트는 스토리북을 활용하여 컴포넌트 기반의 UI를 개발하는 프로젝트입니다. 각 컴포넌트는 독립적으로 개발 및 테스트할 수 있으며, 스토리북을 통해 UI를 시각적으로 확인하고 문서화할 수 있습니다.

## 프로젝트 구조

- `src/`: 주요 소스 코드가 위치한 디렉토리입니다.
  - `atom/`: Recoil을 사용한 상태 관리 파일들이 위치합니다.
  - `components/`: UI 컴포넌트들이 위치합니다. 각 컴포넌트는 자체적인 디렉토리를 가지며, 스토리북 스토리 파일이 포함되어 있습니다.
  - `images/`: 프로젝트에서 사용하는 이미지 파일들이 위치합니다.

- `storybook-static/`: 스토리북이 빌드된 정적 파일들이 위치합니다.

## 스토리북 활용

스토리북은 각 컴포넌트의 UI를 독립적으로 개발하고 테스트할 수 있는 환경을 제공합니다. 각 컴포넌트 디렉토리에는 `.stories.ts` 파일이 포함되어 있으며, 이는 스토리북에서 해당 컴포넌트를 어떻게 렌더링할지를 정의합니다.

### 주요 스토리북 파일

- `Button.stories.ts`: `Button` 컴포넌트의 다양한 상태를 정의합니다.
- `ButtonArea.stories.ts`: `ButtonArea` 컴포넌트의 다양한 상태를 정의합니다.
- `Calendar.stories.ts`: `Calendar` 컴포넌트의 다양한 상태를 정의합니다.
- `CheckButton.stories.ts`: `CheckButton` 컴포넌트의 다양한 상태를 정의합니다.
- `Checkbox.stories.ts`: `Checkbox` 컴포넌트의 다양한 상태를 정의합니다.
- `Memo.stories.ts`: `Memo` 컴포넌트의 다양한 상태를 정의합니다.
- `NumberKeypad.stories.ts`: `NumberKeypad` 컴포넌트의 다양한 상태를 정의합니다.
- `Pagable.stories.ts`: `Pagable` 컴포넌트의 다양한 상태를 정의합니다.

## 모듈 버전

`package.json` 파일을 통해 프로젝트에서 사용되는 주요 모듈의 버전은 다음과 같습니다:

### Dependencies

- `@testing-library/jest-dom`: ^5.17.0
- `@testing-library/react`: ^13.4.0
- `@testing-library/user-event`: ^13.5.0
- `@types/jest`: ^27.5.2
- `@types/node`: ^16.18.82
- `@types/react`: ^18.2.57
- `@types/react-dom`: ^18.2.19
- `axios`: ^1.6.7
- `dayjs`: ^1.11.10
- `hangul-js`: ^0.2.6
- `js-cookie`: ^3.0.5
- `react`: ^18.2.0
- `react-datepicker`: ^6.1.0
- `react-dom`: ^18.2.0
- `react-scripts`: 5.0.1
- `recoil`: ^0.7.7
- `storybook-addon-recoil-flow`: ^1.5.2
- `typescript`: ^4.9.5
- `web-vitals`: ^2.1.4

### DevDependencies

- `@storybook/addon-essentials`: ^7.6.17
- `@storybook/addon-interactions`: ^7.6.17
- `@storybook/addon-links`: ^7.6.17
- `@storybook/addon-onboarding`: ^1.0.11
- `@storybook/addon-styling-webpack`: ^0.0.6
- `@storybook/blocks`: ^7.6.17
- `@storybook/preset-create-react-app`: ^7.6.17
- `@storybook/react`: ^7.6.17
- `@storybook/react-webpack5`: ^7.6.17
- `@storybook/test`: ^7.6.17
- `@types/js-cookie`: ^3.0.6
- `@types/react-datepicker`: ^6.0.1
- `eslint-plugin-storybook`: ^0.8.0
- `prop-types`: ^15.8.1
- `storybook`: ^7.6.17
- `tailwindcss`: ^3.4.1
- `webpack`: ^5.90.3

## 시작하기

프로젝트를 시작하려면 다음 명령어를 사용하세요:

```bash
npm install
npm run storybook
```


이 명령어는 프로젝트의 모든 의존성을 설치하고 스토리북을 실행합니다. 스토리북은 기본적으로 `http://localhost:6006`에서 실행됩니다.