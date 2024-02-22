import { atom } from 'recoil';
import { reasonType } from './type';

export const cancelReasons = atom<reasonType[]>({
    key: 'cancelReasons', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});
