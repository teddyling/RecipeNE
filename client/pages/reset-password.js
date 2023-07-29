import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { globalErrorContext } from "@/components/GlobalError";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordValid, setInputPasswordValid] = useState(null);
  const [inputPasswordErrorMessage, setInputPasswordErrorMessage] =
    useState("");

  const [passwordChangedSuccessfully, setPasswordChangedSuccessfully] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useContext(globalErrorContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      const upper = /[A-Z]/.test(inputPassword);
      const lower = /[a-z]/.test(inputPassword);
      const number = /[0-9]/.test(inputPassword);
      if (
        inputPassword.length >= 8 &&
        inputPassword.length <= 20 &&
        upper &&
        lower &&
        number
      ) {
        setInputPasswordValid(true);
      } else if (inputPassword.length === 0) {
        setInputPasswordValid(null);
      } else {
        setInputPasswordValid(false);
        setInputPasswordErrorMessage(
          "Passwords must be between 8 and 20 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number."
        );
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [inputPassword]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://recipe-ne.com/api/v1/users/resetpassword/${token}`, {
        password: inputPassword,
      })
      .then(() => {
        setPasswordChangedSuccessfully(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      })
      .catch((err) => {
        showError();
      });
  };

  return (
    <>
      <div
        className={`absolute rounded-md w-full bg-green-50 p-4 ${
          !passwordChangedSuccessfully && "invisible"
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
            <h3 className="text-sm font-medium text-green-800">
              Password reset successfully!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>You will be redirected to the log in page in 5 seconds</p>
            </div>
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
            Reset your password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6 novalidate" onSubmit={onFormSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-md font-medium leading-6 text-gray-900"
              >
                New Password
              </label>
              <div className="relative mt-2">
                <input
                  onChange={(e) => setInputPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  value={inputPassword}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                />
                <div
                  className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
                    inputPasswordValid === false ? "" : "invisible"
                  }`}
                >
                  <ExclamationCircleIcon
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
              {inputPasswordValid === null ? (
                <p className={`mt-2 text-sm text-gray-700 `}>
                  Passwords must be between 8 and 20 characters long and include
                  at least 1 uppercase letter, 1 lowercase letter, and 1 number
                </p>
              ) : inputPasswordValid ? (
                <p className={`mt-2 text-sm text-green-600 `}>
                  Good job! Your password looks nice
                </p>
              ) : (
                <p className={`mt-2 text-sm text-red-600 `}>
                  {inputPasswordErrorMessage}
                </p>
              )}
            </div>

            <div>
              <button
                disabled={!inputPasswordValid}
                type="submit"
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                  inputPasswordValid
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
                  `Reset password`
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            {/* <Link
            href="/login"
            className="font-semibold leading-6 text-orange-600 hover:text-orange-400"
          >
            Return to sign in
          </Link> */}
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
