import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";

const dispatch= useDispatch();
export function dispatch1(mesg){
    dispatch(showMessage({ message: mesg}));
}