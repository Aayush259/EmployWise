import { FiLoader } from "react-icons/fi";
import { IButtonProps, IInputProps } from "../utils/interfaces";

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

export const Input: React.FC<IInputProps> = ({ id, label, className, containerClassName, reference, ...props }) => {

    return (
        <div className={`mt-4 ${containerClassName}`}>
            <label htmlFor={id} className="block font-medium">
                {label}
            </label>

            <input ref={reference} id={id} className={`block duration-300 outline-none mt-1 p-2 w-full rounded-md bg-gray-800 shadow-in ${className}`} {...props} />
        </div>
    );
};
