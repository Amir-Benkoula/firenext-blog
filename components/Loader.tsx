interface ShowLoader{
    show: boolean;
}
export default function Loader({ show }: ShowLoader){
    return show ? <div className="loader"></div> : null;
}
