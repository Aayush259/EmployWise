import { FiLoader } from "react-icons/fi";
import { IButtonProps } from "../utils/interfaces";

export const Loader = () => {

    return (
        <div>
            <FiLoader size={40} className="animate-spin mx-auto" />
        </div>
    );
};

export const Button: React.FC<IButtonProps> = ({ children, className, ...props }) => {

    return (
        <button
            className={`px-4 py-2 bg-blue-500 rounded-md disabled:opacity-50 hover:opacity-80 disabled:cursor-default cursor-pointer duration-200 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
