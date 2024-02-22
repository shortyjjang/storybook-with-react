import { atom } from 'recoil';
import { reasonType } from './type';

export const disCountReasons = atom<reasonType[]>({
    key: 'disCountReasons', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});
