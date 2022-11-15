interface ShowLoader{
    show: boolean;
}
export default function Loader(props:ShowLoader){
    return props ? <div className="loader"></div> : null;
}
