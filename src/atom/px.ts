import { atom } from 'recoil';

export const screenPx = atom<number>({
    key: 'screenPx', // unique ID (with respect to other atoms/selectors)
    default: 1, // default value (aka initial value)
});
