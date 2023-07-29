import Cookies from "cookies";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import axios from "axios";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { globalErrorContext } from "@/components/GlobalError";

const ChangePasswordPage = () => {
  const [buttonValid, setButtonValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordValid, setCurrentPasswordValid] = useState(null);
  const [currentPasswordErrorMessage, setCurrentPasswordErrorMessage] =
    useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordValid, setNewPasswordValid] = useState(null);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");

  const [passwordUpdatedSuccessfully, setPasswordUpdatedSuccessfully] =
    useState(false);

  const { error, showError } = useContext(globalErrorContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPassword.length !== 0) {
        setCurrentPasswordValid(true);
      } else {
        setCurrentPasswordValid(false);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [currentPassword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const upper = /[A-Z]/.test(newPassword);
      const lower = /[a-z]/.test(newPassword);
      const number = /[0-9]/.test(newPassword);
      if (newPassword.length === 0) {
        setNewPasswordValid(null);
      } else if (newPassword === currentPassword) {
        setNewPasswordValid(false);
        setNewPasswordErrorMessage(
          "The new password cannot be the same as the old password."
        );
      } else if (
        newPassword.length >= 8 &&
        newPassword.length <= 20 &&
        upper &&
        lower &&
        number
      ) {
        setNewPasswordValid(true);
      } else {
        setNewPasswordValid(false);
        setNewPasswordErrorMessage(`Passwords must be between 8 and 20 characters long and include
        at least 1 uppercase letter, 1 lowercase letter, and 1 number`);
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [newPassword]);

  useEffect(() => {
    if (currentPasswordValid && newPasswordValid) {
      setButtonValid(true);
    } else {
      setButtonValid(false);
    }
  }, [currentPasswordValid, newPasswordValid]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    axios
      .patch("http://recipe-ne.com/api/v1/users/updatepassword", {
        oldPassword: currentPassword,
        newPassword,
      })
      .then(() => {
        setButtonValid(false);
        setPasswordUpdatedSuccessfully(true);
        axios.post(`http://recipe-ne.com/api/v1/users/signout`, {}).then(() => {
          setTimeout(() => {
            window.location.href = "/";
          }, 5000);
        });
      })
      .catch((error) => {
        setButtonValid(true);
        console.error(error);
        if (
          error.response.data.errors[0].message ===
          "The input previous password is wrong."
        ) {
          setCurrentPassword("");
          setNewPassword("");
          setCurrentPasswordValid(false);
          setCurrentPasswordErrorMessage("The current password is incorrect.");
        } else {
          showError();
        }
      });
  };

  return (
    <>
      <div
        className={`rounded-md bg-green-50 p-4 ${
          !passwordUpdatedSuccessfully && "invisible"
        }`}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Password updated successfully, you will be redirected to the home
              page in 5 seconds.
            </p>
          </div>
        </div>
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link href="/">
            <img
              className="mx-auto h-10 w-auto"
              src="/signup-login-logo.png"
              alt="Your Company"
            />
          </Link>
          <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
            Change your password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6 novalidate" onSubmit={onFormSubmit}>
            <div>
              <label
                htmlFor="current-password"
                className="block text-md font-medium leading-6 text-gray-900"
              >
                Current password
              </label>
              <div className="relative mt-2">
                <input
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  value={currentPassword}
                  id="current-password"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                />

                {/* <div
              className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
                inputEmailValid === false ? "" : "invisible"
              }`}
            >
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div> */}
              </div>
              <p
                className={`mt-2 text-sm text-red-600 ${
                  currentPasswordValid === false ? "" : "invisible"
                }`}
              >
                {currentPasswordErrorMessage}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="new-password"
                  className="block text-md font-medium leading-6 text-gray-900"
                >
                  New password
                </label>
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => {
                    setNewPasswordValid(null);
                    setNewPassword(e.target.value);
                  }}
                  value={newPassword}
                  id="new-password"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                />
              </div>
              {newPasswordValid === null ? (
                <p className={`mt-2 text-sm text-gray-700 `}>
                  Passwords must be between 8 and 20 characters long and include
                  at least 1 uppercase letter, 1 lowercase letter, and 1 number
                </p>
              ) : newPasswordValid ? (
                <p className={`mt-2 text-sm text-green-600 `}>
                  Good job! Your password looks nice
                </p>
              ) : (
                <p className={`mt-2 text-sm text-red-600 `}>
                  {newPasswordErrorMessage}
                </p>
              )}
            </div>

            <div>
              <button
                disabled={!buttonValid}
                type="submit"
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                  buttonValid
                    ? "bg-orange-600 hover:bg-orange-500"
                    : "bg-orange-300"
                }`}
              >
                {isLoading ? (
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-neutral-100 motion-reduce:animate-[spin_1.5s_linear_infinite]">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                ) : (
                  `Change Password`
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {/* Not a member?{" "}
        <a
          href="#"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Start a 14 day free trial
        </a> */}
          </p>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
