import { atom } from 'recoil';

export const userInfo = atom({
    key: 'userInfo', // unique ID (with respect to other atoms/selectors)
    default: {
        token: '',
        loginId: '',
        name: '',
        brandName: '', 
        departmentStore: {
            branchName: '',
            brandName: '',
            departmentStoreName: ''
        }
    }, // default value (aka initial value)
});
