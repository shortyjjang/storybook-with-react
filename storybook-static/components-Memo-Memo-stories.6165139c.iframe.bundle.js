(self.webpackChunkpos_with_storybook=self.webpackChunkpos_with_storybook||[]).push([[961],{"./src/components/Memo/Memo.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Example:()=>Example,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Memo_stories});var react=__webpack_require__("./node_modules/react/index.js"),Title=__webpack_require__("./src/components/Title/index.tsx"),TextCursor=__webpack_require__("./src/components/TextCursor/index.tsx"),ButtonArea=__webpack_require__("./src/components/ButtonArea/index.tsx"),hangul=__webpack_require__("./node_modules/hangul-js/hangul.js"),hangul_default=__webpack_require__.n(hangul),icon_remove=__webpack_require__("./src/images/icon_remove.png"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function Keyboard(_ref){let{setValue,className="",enterTxt="enter",onEnter,defaultValue="",defaultKeyboard="koNormal"}=_ref,[px,setPx]=(0,react.useState)(1);(0,react.useEffect)(()=>{setPx(window.innerWidth/960)},[]);let[originalText,setOriginalText]=(0,react.useState)(""),[keyboardType,setKeyboardType]=(0,react.useState)("koNormal"),[charList,setCharList]=(0,react.useState)([]);return(0,react.useEffect)(()=>(setOriginalText(defaultValue),setCharList(defaultValue.split("")),()=>{setOriginalText(""),setCharList([])}),[]),(0,react.useEffect)(()=>{setKeyboardType(defaultKeyboard)},[defaultKeyboard]),(0,jsx_runtime.jsx)("div",{className:"fixed bottom-0 left-0 w-full bg-[#f7f7f9] z-[1]",children:(0,jsx_runtime.jsx)("div",{className:"grid ".concat(className," bg-black bg-opacity-50"),style:{gridAutoRows:"1fr",gap:5*px+"px",padding:"".concat(10*px,"px 0")},children:(keyboardBtns[keyboardType]||[]).map((row,index)=>(0,jsx_runtime.jsx)("div",{className:"flex justify-center",style:{gap:5*px+"px"},children:row.map((btn,index)=>(0,jsx_runtime.jsx)("button",{onClick:e=>{e.stopPropagation();let chars=keyboardType.includes("ko")?charList:(originalText||"").split("");if("shift"===btn)setKeyboardType("koNormal"===keyboardType?"koShift":"koShift"===keyboardType?"koNormal":"enNormal"===keyboardType?"enShift":"enNormal");else if("한/영"===btn)setKeyboardType("enNormal"===keyboardType||"enShift"===keyboardType?"koNormal":"enNormal");else if("123"===btn||"#+="===btn)setKeyboardType("numberNormal"===keyboardType?"numberShift":"numberNormal");else if("backspace"===btn)chars=chars.slice(0,charList.length-1);else if("space"===btn)chars=[...chars," "];else if("enter"===btn){if(onEnter){onEnter(),setKeyboardType("koNormal"),setCharList([]);return}chars=[...chars,"\n"]}else chars=[...chars,btn];setCharList(chars),setOriginalText(keyboardType.includes("ko")?hangul_default().assemble(chars):chars.join("")),setValue(keyboardType.includes("ko")?hangul_default().assemble(chars):chars.join(""))},style:{fontSize:17.5*px+"px",height:57.5*px+"px",width:("shift"===btn||"backspace"===btn?89:"space"===btn?245:"enter"===btn?120:57.5)*px+"px"},className:"\n                    bg-[#3d3d3e] rounded-lg text-white\n                    ".concat("shift"===btn||"backspace"===btn?"":"space"===btn?"":"aspect-square"," "),children:"shift"===btn?(0,jsx_runtime.jsx)("span",{className:"block bg-no-repeat bg-center bg-contain mx-auto",style:{width:16.5*px+"px",height:20*px+"px",backgroundImage:"url(".concat("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAoCAYAAABw65OnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAX5JREFUeNrs1r1qAkEQB/BzsU8VEDRpTJkyGEh1CPoQIdgHfBcbIS+QFClMJRYKYuMbBCsDQpIqpLbL5T8wkmXZze3XWe3AsN7sx/xYTrhaURSZb4zHDxcYHpF3w+H91vccEQhYIa9p5OfjISRAk0vNEIiIAMhCITWXdwINWhjWyPN/lr0jb/COfES/CQasSgAUZ3wjragICdC2PLftAhEBgO+SZ2uIKAE0DIBX5ESpTbiugzS8ENh4imFhAHSRe6W+57oOsuDz7BG8YYm8VKbeqBHe/C/dPq53eZ0cdM7SBBGOgNwEUCC5C0Q4Aqz++7zOGiIkwAmGWSjAEjLjfn8ILsyRV8qGnQ9AA9kpU9RnfoAICdBRFn4ie74ABdLj8+ToHCB0E1MDIA/5RlAgW74RHWRKiBHypypACYT6jgQmX/BjwIVKAAYI9RtQf8GTTxhukf2qAAqkT/24b1aXJp+zIwV6bTBsgr8xY0ZCJERCJERCJERCJERCxIpfAQYABoO7RONj2s4AAAAASUVORK5CYII=",")")}}):"backspace"===btn?(0,jsx_runtime.jsx)("span",{className:"block bg-no-repeat bg-center bg-contain mx-auto",style:{width:28.5*px+"px",height:21.5*px+"px",transform:"translateX(-".concat(3*px,"px)"),backgroundImage:"url(".concat(icon_remove,")")}}):"한/영"===btn?(0,jsx_runtime.jsx)("span",{className:"block bg-no-repeat bg-center bg-contain mx-auto",style:{width:23.5*px+"px",height:23.5*px+"px",backgroundImage:"url(".concat("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAvCAYAAABzJ5OsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABrRJREFUeNrkWn1MlVUYf++NHPFhH5CQGrIok7aWFTk3l25lo9oSoQjKrfqHNpTSzVBK+9qUKVRTQdmiNddyo1Vg/lFjYc2Kxpz2sVZQjULKD+IjMiAyjH6P/g49O7zv5b0Xrst1tt/O+56P5/md857znOc89wZGR0edqUrV1TUxyGKB6cBMPg8Dx4CT8lxSUjwyVfoCkyEPsgnIcoFs4A5gho9uvwDvA41AAwYzcE7Jg/R1yNYB+UDcJCZvCHgTqMAgvokqeZCehawSKJS+Hs1OA58D8wD5MjKzbcCNwAUefYREHVCKQRz1yyfok3QAeIwkHlDEh62mMotpIHAL8l6W9fI9jfU6mf4Bym0TPaJvSshD0MXI6oEdnElJPcDr3JAmPQGS9wPH3ORIudRLO1UcSzk9fE+gnnrqjZw8BFyB7ACwXBXXArcBOaqsDMRe9DNbbLdeFeVQXq0qE30HqD988uz4NXADi34F8qD8UeSbgESWv4GyreFsNLSvkH58FTmbKDePehzq/TTUAIIhlsonwKXKKhRAQQPqFuN5Gcu7gFURWppV7C9pmcgV+TQGgyxPB97zWkJBt82JbDdwlSqOoxDZcNtV+QYo7I2EOfttUEXbIf9t5O8C8apcvsBut03sNvMlao3LjPfzWczcfcB8vp85MSE0LcIDLo3W5iSL5nPZGHPaT/1mD5SEtPO0423KqoiwD4GVgJjKVA8uYi1agR+A40A3Z/UyoA8oB5LZP4NnwOUessRa1fALL6Wlc3hezNPnQIzVsVIRr+UalFSOgb3ENTrdRaEQu5WwkwzgBZ8fRL7C1dD7B99lj4kVKiIv4ffguGXDI79QzWSZJfhmRbyes/Ks7AWgM8xV8zP7PQ/crmZX5N9ktS1T50AheY6b+XXq5KzE6PssIdnq+R3U70e+Xw1eNtlsOmdJtNvJVFzEE1eWUyf6DlnrfzaXqNHTrDZ2H+plxreSn/B8ZIw8vcN8tVF2uczWIvXc6GI9xLx9S4jMbSQ/iLq9E3yJRg89JgmfJ4FLhCdkl4g3apZNrvIO62w3FY2l3QK+dqC+y5nCRHkdfF1Afbp+gI6bMdu5es3rJbHHRX6a2siHnOikQ8q/cTO/e+wlbMgvZf470OLSca56bo0S+VYPfSa1kN8Y3yCvbiksbPa4pqWr5/YokW/30GeWzojayCnCO2i5tV6zqg+UE1Eif8JDn9fXiRXy01TB9z7Id0eJfLcP8prftEBV1a65xrzRJg96nJKJ6vj+yweZWTTF8rn9XO0uZMTB7L0+lzbxNL+Sro2xDqpkVemVZoY5oyJ/Tph9EtVkeco1M+OchzM/EqP8BknPYFfXuLivclqu5us9aPOZD5e3gzN+FO3TfbQXn+YwX19FnzUubYrV6d8jG/aUqr9mEptpssmPUdD8TgWt8EWmD/KpUSKf6oO85jccpPE3vsoiHlp26lDPGVEin+GhT8dBjdPWJbyNe9CkdvlCF8Hf+fg6k02ZHvpMWqiMRpP2bbRLusKlYyevYZKyokQ+S1333C43K2wX2pBvUJfdQvr32q/4G9lB43egPmUqWVOesUgHqU/XJ6hb3hD5nj2gxF9mWONhOvxy4a6wdDQzsmVc0tcsBXF0ZWfwXDDhi3jULQ91k7Jc8maX8a0krzPxUHPf0JtTyD7Eq1YpFL5iXQXlUz1tQnSol3voYl5SrucV0PG4nDdYA/2J0bgWBrdyvG5paCsTUaqiyRXjLuCMj9cphVssEodVjCWP91e5gN8VgrhXuhK4E3iOmy9PRQ/sA3CLOlXrdBzfT9ymiadrcQi/ppv92unayqn9lIrbbOYhZOI2mSF8KIn77BQ6XKaecZtxPy4wDr+DrxI/+VOtNzvGImvxYwjsDOEeHHFzD1A/h3a7xiMW1E933dytH4ecqonCfTJic9u/SBE/zVn4QsVYYt2I+7x0H6F8Q1zkvkU9DvUa4nvJK3SsEkJHGRf5UhWLp3k36u5VDpqkzZjBpAjNYxKXk0mrIT+fe0hbo6+ED3lNHOJGw98o5EflitZBYS7qPsLzPnOX5PqMJO1Ud+d9IlfkO2fj9nHK/c4mH8cXeQ7gONek+QISq5efW15GvlHd5AtQtj7MWZeoV4Hy3TdSbr3z728CojeLPJywyKsBLFF7wGHo7gMJ+WlzBuVrfRJfy9DdWOiQ8opUmehbEoq4q7XxUBhgfLxcmVGH7rSOPsgpvUZ+PLOtDd7FzG5TYUW3/gM0sdVuazwi8tY58J/5Hfb/8wu4yyDOv/8ehBjMOf3Xxz8CDABO5oxRLv29kwAAAABJRU5ErkJggg==",")")}}):"enter"===btn?enterTxt:btn},index))},index))})})}let keyboardBtns={koNormal:[["ㅂ","ㅈ","ㄷ","ㄱ","ㅅ","ㅛ","ㅕ","ㅑ","ㅐ","ㅔ"],["ㅁ","ㄴ","ㅇ","ㄹ","ㅎ","ㅗ","ㅓ","ㅏ","ㅣ"],["shift","ㅋ","ㅌ","ㅊ","ㅍ","ㅠ","ㅜ","ㅡ","backspace"],["123","한/영","space","@",".","enter"]],koShift:[["ㅃ","ㅉ","ㄸ","ㄲ","ㅆ","ㅛ","ㅕ","ㅑ","ㅒ","ㅖ"],["ㅁ","ㄴ","ㅇ","ㄹ","ㅎ","ㅗ","ㅓ","ㅏ","ㅣ"],["shift","ㅋ","ㅌ","ㅊ","ㅍ","ㅠ","ㅜ","ㅡ","backspace"],["123","한/영","space","@",".","enter"]],enNormal:[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["shift","z","x","c","v","b","n","m","backspace"],["123","한/영","space","@",".","enter"]],enShift:[["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["shift","Z","X","C","V","B","N","M","backspace"],["123","한/영","space","@",".","enter"]],numberNormal:[["1","2","3","4","5","6","7","8","9","0"],["-","/",":",";","(",")","$","&"],[",","?","!","'",'"',"backspace"],["123","한/영","space","@",".","enter"]],numberShift:[["!","@","#","$","%","^","&","*","(",")"],["_","+","{","}","[","]","\\","|"],[",","?","!","'",'"',"backspace"],["#+=","한/영","space","@",".","enter"]]};try{Keyboard.displayName="Keyboard",Keyboard.__docgenInfo={description:"",displayName:"Keyboard",props:{setValue:{defaultValue:null,description:"",name:"setValue",required:!0,type:{name:"(value: string) => void"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string"}},enterTxt:{defaultValue:{value:"enter"},description:"",name:"enterTxt",required:!1,type:{name:"string"}},onEnter:{defaultValue:null,description:"",name:"onEnter",required:!1,type:{name:"(() => void)"}},defaultValue:{defaultValue:{value:""},description:"",name:"defaultValue",required:!1,type:{name:"string"}},defaultKeyboard:{defaultValue:{value:"koNormal"},description:"",name:"defaultKeyboard",required:!1,type:{name:"enum",value:[{value:'"koNormal"'},{value:'"koShift"'},{value:'"enShift"'},{value:'"enNormal"'},{value:'"numberNormal"'},{value:'"numberShift"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Keyboard/index.tsx#Keyboard"]={docgenInfo:Keyboard.__docgenInfo,name:"Keyboard",path:"src/components/Keyboard/index.tsx#Keyboard"})}catch(__react_docgen_typescript_loader_error){}function Memo(_ref){let{onSubmit,onCancel,style={},value="",className="fixed w-full bottom-0 z-10"}=_ref,[content,setContent]=(0,react.useState)(""),[px,setPx]=(0,react.useState)(1);return(0,react.useEffect)(()=>{setPx(window.innerWidth/960),setContent(value)},[value]),(0,jsx_runtime.jsxs)("div",{className:" ".concat(className," w-full bg-[#f7f7f9] flex flex-col justify-center items-center"),style:{...style,paddingBottom:265*px+"px"},children:[(0,jsx_runtime.jsx)(Title.A,{style:{paddingBottom:8*px+"px"},children:"특이 사항"}),(0,jsx_runtime.jsxs)("div",{className:"bg-white border border-lightgray",style:{width:600*px+"px",height:160*px+"px",padding:"".concat(10*px,"px ").concat(15*px,"px"),fontSize:12.5*px+"px"},children:[content,(0,jsx_runtime.jsx)(TextCursor.y,{height:12.5}),!content&&(0,jsx_runtime.jsx)("span",{className:"text-darkgray",children:"내용을 입력하세요."})]}),(0,jsx_runtime.jsx)(ButtonArea.Q,{onSubmit:()=>{onSubmit(content)},onCancel:onCancel}),(0,jsx_runtime.jsx)(Keyboard,{defaultValue:value,setValue:value=>setContent(value)})]})}try{Memo.displayName="Memo",Memo.__docgenInfo={description:"",displayName:"Memo",props:{onSubmit:{defaultValue:null,description:"",name:"onSubmit",required:!0,type:{name:"(value: string) => void"}},onCancel:{defaultValue:null,description:"",name:"onCancel",required:!0,type:{name:"() => void"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties"}},value:{defaultValue:{value:""},description:"",name:"value",required:!1,type:{name:"string"}},className:{defaultValue:{value:"fixed w-full bottom-0 z-10"},description:"",name:"className",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Memo/index.tsx#Memo"]={docgenInfo:Memo.__docgenInfo,name:"Memo",path:"src/components/Memo/index.tsx#Memo"})}catch(__react_docgen_typescript_loader_error){}let Memo_stories={title:"Components/Memo",component:Memo,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{onSubmit:{control:"function"},onCancel:{control:"function"},value:{control:"text"},style:{control:"object"},className:{control:"text"}}},Example={args:{onSubmit:()=>{},onCancel:()=>{},value:"",style:{},className:"relative"}};Example.parameters={...Example.parameters,docs:{...Example.parameters?.docs,source:{originalSource:"{\n  args: {\n    onSubmit: () => {},\n    onCancel: () => {},\n    value: '',\n    style: {},\n    className: 'relative'\n  }\n}",...Example.parameters?.docs?.source}}};let __namedExportsOrder=["Example"]},"./src/components/Button/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{$:()=>Button});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");function Button(_ref){let{size="md",type="button",className="",disabled=!1,onClick=()=>{},children,buttonType="default",style={}}=_ref,[px,setPx]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{setPx(window.innerWidth/960)},[]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button",{type:type,disabled:disabled,onClick:onClick,className:"\n        ".concat("primary"===buttonType?"bg-black border-black text-white font-medium ":"dimmend"===buttonType?"text-darkgray border-darkgray":"secondary"===buttonType?"text-white border-white":"bg-white border-black text-black","\n        border\n        ").concat("sm"===size?"rounded-sm":"xl"===size?"rounded-lg":"rounded-md","\n        ").concat(disabled?"text-opacity-40 border-opacity-40":"","\n        ").concat(className,"\n    "),style:{fontSize:("sm"===size?11:"xl"===size?17:14)*px+"px",height:("sm"===size?27.5:"md"===size?45:"lg"===size?50:60)*px+"px",padding:"0 ".concat("sm"===size?0:"xl"===size?25:"lg"===size?15:10,"px"),width:"sm"===size?55*px+"px":"",...style},children:children})}try{Button.displayName="Button",Button.__docgenInfo={description:"",displayName:"Button",props:{size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"xl"'}]}},type:{defaultValue:{value:"button"},description:"",name:"type",required:!1,type:{name:"enum",value:[{value:'"button"'},{value:'"submit"'},{value:'"reset"'}]}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string"}},disabled:{defaultValue:{value:"false"},description:"",name:"disabled",required:!1,type:{name:"boolean"}},onClick:{defaultValue:{value:"() => {}"},description:"",name:"onClick",required:!1,type:{name:"(() => void)"}},buttonType:{defaultValue:{value:"default"},description:"",name:"buttonType",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"primary"'},{value:'"secondary"'},{value:'"dimmend"'}]}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Button/index.tsx#Button"]={docgenInfo:Button.__docgenInfo,name:"Button",path:"src/components/Button/index.tsx#Button"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/ButtonArea/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Q:()=>ButtonArea});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_Button__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/Button/index.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");function ButtonArea(_ref){let{className="",onSubmit,submitText="확인",onCancel,cancelText="취소",size="md",cancelDisabled=!1,submitDisabled=!1}=_ref,[px,setPx]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{setPx(window.innerWidth/960)},[]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{className:"flex mx-auto ".concat(className),style:{width:287.5*px+"px",gap:7.5*px+"px",paddingTop:12*px+"px"},children:[onCancel&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_1__.$,{size:size,disabled:cancelDisabled,className:"w-full",onClick:onCancel,children:cancelText}),onSubmit&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_1__.$,{size:size,disabled:submitDisabled,buttonType:"primary",className:"w-full",onClick:onSubmit,children:submitText})]})}try{ButtonArea.displayName="ButtonArea",ButtonArea.__docgenInfo={description:"",displayName:"ButtonArea",props:{className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string"}},onSubmit:{defaultValue:null,description:"",name:"onSubmit",required:!1,type:{name:"(() => void)"}},onCancel:{defaultValue:null,description:"",name:"onCancel",required:!1,type:{name:"(() => void)"}},submitText:{defaultValue:{value:"확인"},description:"",name:"submitText",required:!1,type:{name:"ReactNode"}},cancelText:{defaultValue:{value:"취소"},description:"",name:"cancelText",required:!1,type:{name:"ReactNode"}},size:{defaultValue:{value:"md"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"sm"'},{value:'"md"'},{value:'"lg"'}]}},cancelDisabled:{defaultValue:{value:"false"},description:"",name:"cancelDisabled",required:!1,type:{name:"boolean"}},submitDisabled:{defaultValue:{value:"false"},description:"",name:"submitDisabled",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ButtonArea/index.tsx#ButtonArea"]={docgenInfo:ButtonArea.__docgenInfo,name:"ButtonArea",path:"src/components/ButtonArea/index.tsx#ButtonArea"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/TextCursor/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{y:()=>TextCursor});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");function TextCursor(_ref){let{height=14,style={}}=_ref,[px,setPx]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{setPx(window.innerWidth/960)},[]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{className:"inline-block bg-black align-middle",style:{width:1*px+"px",height:height*px+"px",marginTop:-2*px+"px",animation:"twinkling 0.5s infinite alternate",...style}})}try{TextCursor.displayName="TextCursor",TextCursor.__docgenInfo={description:"",displayName:"TextCursor",props:{height:{defaultValue:{value:"14"},description:"",name:"height",required:!1,type:{name:"number"}},style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/TextCursor/index.tsx#TextCursor"]={docgenInfo:TextCursor.__docgenInfo,name:"TextCursor",path:"src/components/TextCursor/index.tsx#TextCursor"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/Title/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>Title});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");function Title(_ref){let{children,style={}}=_ref,[px,setPx]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{setPx(window.innerWidth/960)},[]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3",{className:"font-bold text-center",style:{fontSize:20*px+"px",paddingBottom:18*px+"px",...style},children:children})}try{Title.displayName="Title",Title.__docgenInfo={description:"",displayName:"Title",props:{style:{defaultValue:{value:"{}"},description:"",name:"style",required:!1,type:{name:"CSSProperties"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Title/index.tsx#Title"]={docgenInfo:Title.__docgenInfo,name:"Title",path:"src/components/Title/index.tsx#Title"})}catch(__react_docgen_typescript_loader_error){}},"./node_modules/hangul-js/hangul.js":(module,exports,__webpack_require__)=>{var __WEBPACK_AMD_DEFINE_RESULT__;!function(){"use strict";var CONSONANTS_HASH,CHO_HASH,JUNG_HASH,JONG_HASH,COMPLEX_CONSONANTS_HASH,COMPLEX_VOWELS_HASH,CHO=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"],JUNG=["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ",["ㅗ","ㅏ"],["ㅗ","ㅐ"],["ㅗ","ㅣ"],"ㅛ","ㅜ",["ㅜ","ㅓ"],["ㅜ","ㅔ"],["ㅜ","ㅣ"],"ㅠ","ㅡ",["ㅡ","ㅣ"],"ㅣ"],JONG=["","ㄱ","ㄲ",["ㄱ","ㅅ"],"ㄴ",["ㄴ","ㅈ"],["ㄴ","ㅎ"],"ㄷ","ㄹ",["ㄹ","ㄱ"],["ㄹ","ㅁ"],["ㄹ","ㅂ"],["ㄹ","ㅅ"],["ㄹ","ㅌ"],["ㄹ","ㅍ"],["ㄹ","ㅎ"],"ㅁ","ㅂ",["ㅂ","ㅅ"],"ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];function _makeHash(array){for(var length=array.length,hash={0:0},i=0;i<length;i++)array[i]&&(hash[array[i].charCodeAt(0)]=i);return hash}function _makeComplexHash(array){for(var code1,code2,length=array.length,hash={},i=0;i<length;i++)code1=array[i][0].charCodeAt(0),code2=array[i][1].charCodeAt(0),void 0===hash[code1]&&(hash[code1]={}),hash[code1][code2]=array[i][2].charCodeAt(0);return hash}function _isConsonant(c){return void 0!==CONSONANTS_HASH[c]}function _isCho(c){return void 0!==CHO_HASH[c]}function _isJung(c){return void 0!==JUNG_HASH[c]}function _isJong(c){return void 0!==JONG_HASH[c]}function _isHangul(c){return 44032<=c&&c<=55203}function _isJungJoinable(a,b){return!!COMPLEX_VOWELS_HASH[a]&&!!COMPLEX_VOWELS_HASH[a][b]&&COMPLEX_VOWELS_HASH[a][b]}function _isJongJoinable(a,b){return!!COMPLEX_CONSONANTS_HASH[a]&&!!COMPLEX_CONSONANTS_HASH[a][b]&&COMPLEX_CONSONANTS_HASH[a][b]}CONSONANTS_HASH=_makeHash(["ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄸ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅃ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]),CHO_HASH=_makeHash(["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]),JUNG_HASH=_makeHash(["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"]),JONG_HASH=_makeHash(["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]),COMPLEX_CONSONANTS_HASH=_makeComplexHash([["ㄱ","ㅅ","ㄳ"],["ㄴ","ㅈ","ㄵ"],["ㄴ","ㅎ","ㄶ"],["ㄹ","ㄱ","ㄺ"],["ㄹ","ㅁ","ㄻ"],["ㄹ","ㅂ","ㄼ"],["ㄹ","ㅅ","ㄽ"],["ㄹ","ㅌ","ㄾ"],["ㄹ","ㅍ","ㄿ"],["ㄹ","ㅎ","ㅀ"],["ㅂ","ㅅ","ㅄ"]]),COMPLEX_VOWELS_HASH=_makeComplexHash([["ㅗ","ㅏ","ㅘ"],["ㅗ","ㅐ","ㅙ"],["ㅗ","ㅣ","ㅚ"],["ㅜ","ㅓ","ㅝ"],["ㅜ","ㅔ","ㅞ"],["ㅜ","ㅣ","ㅟ"],["ㅡ","ㅣ","ㅢ"]]);var disassemble=function(string,grouped){if(null===string)throw Error("Arguments cannot be null");"object"==typeof string&&(string=string.join(""));for(var cho,jung,jong,code,r,result=[],length=string.length,i=0;i<length;i++){var temp=[];_isHangul(code=string.charCodeAt(i))?(code-=44032,jong=code%28,jung=(code-jong)/28%21,cho=parseInt((code-jong)/28/21),temp.push(CHO[cho]),"object"==typeof JUNG[jung]?temp=temp.concat(JUNG[jung]):temp.push(JUNG[jung]),jong>0&&("object"==typeof JONG[jong]?temp=temp.concat(JONG[jong]):temp.push(JONG[jong]))):_isConsonant(code)?"string"==typeof(r=_isCho(code)?CHO[CHO_HASH[code]]:JONG[JONG_HASH[code]])?temp.push(r):temp=temp.concat(r):_isJung(code)?"string"==typeof(r=JUNG[JUNG_HASH[code]])?temp.push(r):temp=temp.concat(r):temp.push(string.charAt(i)),grouped?result.push(temp):result=result.concat(temp)}return result},disassembleToString=function(str){return"string"!=typeof str?"":(str=disassemble(str)).join("")},assemble=function(array){"string"==typeof array&&(array=disassemble(array));var code,previous_code,result=[],length=array.length,stage=0,complete_index=-1,jong_joined=!1;function _makeHangul(index){var cho,jung1,jung2,jong2,jong1=0,hangul="";if(jong_joined=!1,!(complete_index+1>index))for(var step=1;;step++){if(1===step){if(_isJung(cho=array[complete_index+step].charCodeAt(0))){if(complete_index+step+1<=index&&_isJung(jung1=array[complete_index+step+1].charCodeAt(0))){result.push(String.fromCharCode(_isJungJoinable(cho,jung1))),complete_index=index;return}result.push(array[complete_index+step]),complete_index=index;return}if(!_isCho(cho)){result.push(array[complete_index+step]),complete_index=index;return}hangul=array[complete_index+step]}else if(2===step){if(_isCho(jung1=array[complete_index+step].charCodeAt(0))){hangul=String.fromCharCode(cho=_isJongJoinable(cho,jung1)),result.push(hangul),complete_index=index;return}hangul=String.fromCharCode((21*CHO_HASH[cho]+JUNG_HASH[jung1])*28+44032)}else 3===step?(_isJungJoinable(jung1,jung2=array[complete_index+step].charCodeAt(0))?jung1=_isJungJoinable(jung1,jung2):jong1=jung2,hangul=String.fromCharCode((21*CHO_HASH[cho]+JUNG_HASH[jung1])*28+JONG_HASH[jong1]+44032)):4===step?(jong1=_isJongJoinable(jong1,jong2=array[complete_index+step].charCodeAt(0))?_isJongJoinable(jong1,jong2):jong2,hangul=String.fromCharCode((21*CHO_HASH[cho]+JUNG_HASH[jung1])*28+JONG_HASH[jong1]+44032)):5===step&&(jong1=_isJongJoinable(jong1,jong2=array[complete_index+step].charCodeAt(0)),hangul=String.fromCharCode((21*CHO_HASH[cho]+JUNG_HASH[jung1])*28+JONG_HASH[jong1]+44032));if(complete_index+step>=index){result.push(hangul),complete_index=index;return}}}for(var i=0;i<length;i++){if(!_isCho(code=array[i].charCodeAt(0))&&!_isJung(code)&&!_isJong(code)){_makeHangul(i-1),_makeHangul(i),stage=0;continue}0===stage?_isCho(code)?stage=1:_isJung(code)&&(stage=4):1==stage?_isJung(code)?stage=2:_isJongJoinable(previous_code,code)?stage=5:_makeHangul(i-1):2==stage?_isJong(code)?stage=3:_isJung(code)?_isJungJoinable(previous_code,code)||(_makeHangul(i-1),stage=4):(_makeHangul(i-1),stage=1):3==stage?_isJong(code)?!jong_joined&&_isJongJoinable(previous_code,code)?jong_joined=!0:(_makeHangul(i-1),stage=1):_isCho(code)?(_makeHangul(i-1),stage=1):_isJung(code)&&(_makeHangul(i-2),stage=2):4==stage?_isJung(code)?_isJungJoinable(previous_code,code)?(_makeHangul(i),stage=0):_makeHangul(i-1):(_makeHangul(i-1),stage=1):5==stage&&(_isJung(code)?(_makeHangul(i-2),stage=2):(_makeHangul(i-1),stage=1)),previous_code=code}return _makeHangul(i-1),result.join("")};function Searcher(string){this.string=string,this.disassembled=disassemble(string).join("")}Searcher.prototype.search=function(string){return disassemble(string).join("").indexOf(this.disassembled)};var hangul={disassemble:disassemble,d:disassemble,disassembleToString:disassembleToString,ds:disassembleToString,assemble:assemble,a:assemble,search:function(a,b){var ad=disassemble(a).join(""),bd=disassemble(b).join("");return ad.indexOf(bd)},rangeSearch:function(haystack,needle){var result,hex=disassemble(haystack).join(""),nex=disassemble(needle).join(""),grouped=disassemble(haystack,!0),re=RegExp(nex,"gi"),indices=[];if(!needle.length)return[];for(;result=re.exec(hex);)indices.push(result.index);function findStart(index){for(var i=0,length=0;i<grouped.length;++i)if(index<(length+=grouped[i].length))return i}function findEnd(index){for(var i=0,length=0;i<grouped.length;++i)if(length+=grouped[i].length,index+nex.length<=length)return i}return indices.map(function(i){return[findStart(i),findEnd(i)]})},Searcher:Searcher,endsWithConsonant:function(string){"object"==typeof string&&(string=string.join(""));var code=string.charCodeAt(string.length-1);if(_isHangul(code)){if((code-=44032)%28>0)return!0}else if(_isConsonant(code))return!0;return!1},endsWith:function(string,target){return disassemble(string).pop()===target},isHangul:function(c){return"string"==typeof c&&(c=c.charCodeAt(0)),_isHangul(c)},isComplete:function(c){return"string"==typeof c&&(c=c.charCodeAt(0)),_isHangul(c)},isConsonant:function(c){return"string"==typeof c&&(c=c.charCodeAt(0)),_isConsonant(c)},isVowel:function(c){return"string"==typeof c&&(c=c.charCodeAt(0)),_isJung(c)},isCho:function(c){return"string"==typeof c&&(c=c.charCodeAt(0)),_isCho(c)},isJong:function(c){return"string"==typeof c&&(c=c.charCodeAt(0)),_isJong(c)},isHangulAll:function(str){if("string"!=typeof str)return!1;for(var i=0;i<str.length;i++)if(!_isHangul(str.charCodeAt(i)))return!1;return!0},isCompleteAll:function(str){if("string"!=typeof str)return!1;for(var i=0;i<str.length;i++)if(!_isHangul(str.charCodeAt(i)))return!1;return!0},isConsonantAll:function(str){if("string"!=typeof str)return!1;for(var i=0;i<str.length;i++)if(!_isConsonant(str.charCodeAt(i)))return!1;return!0},isVowelAll:function(str){if("string"!=typeof str)return!1;for(var i=0;i<str.length;i++)if(!_isJung(str.charCodeAt(i)))return!1;return!0},isChoAll:function(str){if("string"!=typeof str)return!1;for(var i=0;i<str.length;i++)if(!_isCho(str.charCodeAt(i)))return!1;return!0},isJongAll:function(str){if("string"!=typeof str)return!1;for(var i=0;i<str.length;i++)if(!_isJong(str.charCodeAt(i)))return!1;return!0}};void 0!==(__WEBPACK_AMD_DEFINE_RESULT__=(function(){return hangul}).call(exports,__webpack_require__,exports,module))&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}()},"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{"use strict";/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f=__webpack_require__("./node_modules/react/index.js"),k=Symbol.for("react.element"),m=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,g){var b,d={},e=null,h=null;for(b in void 0!==g&&(e=""+g),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(h=a.ref),a)m.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}exports.jsx=q,exports.jsxs=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")},"./src/images/icon_remove.png":module=>{"use strict";module.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAArCAYAAADCBiAVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAshJREFUeNrcmr9rFUEQxy/nk2cEg7FJoaKolZUgiKCgBAuLaKNVCsHOUmzUQhQsfILYBKKdYKGQaGNErPwB/gdCKq3UJggJCRpijPodmJVl2b3s7s1ushn4cC+Xe/fuc7d7Ozt3fWNj45VwHADvwE4wDxbBHDMbsCT+ShxQJ6EgxQAzFLm/eU049CQtppA0BSVCnaQ9Ed9dUsKdhIIvwSToB4Ngu2OpPm8SblVdbkFDnUSCU+A8+BWwn20eJ8L1v60p+6SUIMUC8yXiODYb4sfBPQlJScG2sQxmmIq7yP+oN4DgqlFvdMEYyeIEQyWLFAyRtAlOlCDoK2kTfAJGSxD0kXQJXgArLX73DBgO2P4S2JVCMpXgWfCc0z4f0WvgAR+Lr+gHLRsarDMLHgTPOEPp9xAlwTv8eT945dnFfmvTu7k6oyDFNLiv/d0kqgtWPHW6DP60ba4pBfWDv7uKqE1wBLxpO2nOIahLUFw1REnkiKSgLplTsEn0NfdXMUHVXNdC0NV0xQWV5KQhSPO5ixkEddH3lvU3JASVJF2x79q63eBRgnKEK26CE5b1twMThkbJj7wzXZRStscZRHvgljH59RleooYQJTqTUbSn3XRUHzwNrkuL6uMkiR4D3zKI2gTVTaYnLWomA5/AycSiTYL6NmKitrQupSjlrlc8hwmb6HjMMbiS3VSi0zzRXvYcB3XRz+CU59C2BexVNJUklaieKIzysk2i8AKcAz88x8EezyaouX71/I2j4K0td80pOhW4/cPU5Y8cN6N1UcgqWjSkJFmsaGhxuUjRmMcExYnGPvApSrRu8d31JNoHdoB94DA45KrxtBE1x9FuFV5hp7TN9TS5aUlyA76FLElRymiogPy08n9noJvqMku9GGETHWHWKlYq4bc/XKJt42fl/2KTuW5B+kq6RCkJX6riXjaaNcoh0fFPgAEACvUWxkJ2N/0AAAAASUVORK5CYII="}}]);
//# sourceMappingURL=components-Memo-Memo-stories.6165139c.iframe.bundle.js.map