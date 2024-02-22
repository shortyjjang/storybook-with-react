import { atom } from 'recoil';
import { MenuListsType } from './type';

export const MenuLists = atom<MenuListsType[]>({
    key: 'MenuLists', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});

