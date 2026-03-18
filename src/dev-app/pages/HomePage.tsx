import { useNavigate } from "react-router-dom";

export function HomePage() {

    const navigate = useNavigate();
    const onClick = () => {
        console.log("X");
        navigate("about");
    }
    return (
        <>
            <p className="text-slate-600">
                Parcel, React Router, Tailwind, and the resizable layout are working together.
            </p>
            <div>
                <button className="bg-indigo-600 text-white rounded-xl min-w-20 p-2" onClick={onClick} >Test</button>
            </div>
        </>
    );
}
