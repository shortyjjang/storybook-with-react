import { atom } from 'recoil';
import { reasonType } from './type';

export const disposalReasons = atom<reasonType[]>({
    key: 'disposalReasons', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});
