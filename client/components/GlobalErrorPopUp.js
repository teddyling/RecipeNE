import { useContext } from "react";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { globalErrorContext } from "./GlobalError";
const GlobalErrorPopUp = () => {
  const context = useContext(globalErrorContext);

  return (
    <>
      {context.error && (
        <div className="absolute rounded-md bg-red-50 p-4 left-0 right-0 mx-12">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Oops, there are some issues with the server. Sorry for the
                inconvenience, and please try again later
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => context.hideError()}
                  type="button"
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalErrorPopUp;
