import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [formValid, setFormValid] = useState(false);

  const [inputEmail, setInputEmail] = useState("");
  const [inputEmailValid, setInputEmailValid] = useState(null);
  const [inputEmailErrorMessage, setInputEmailErrorMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(inputEmail)) {
        setInputEmailValid(true);
      } else if (inputEmail.length === 0) {
        setInputEmailValid(null);
      } else {
        setInputEmailValid(false);
        setInputEmailErrorMessage("Invalid email");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [inputEmail]);

  useEffect(() => {
    if (inputEmailValid) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [inputEmailValid]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://recipe-ne.com/api/v1/users/forgetpassword", {
        email: inputEmail,
      })
      .then(() => {
        router.push(`/verify-email/${inputEmail}?type=forgot-password`);
      })
      .catch((err) => {
        if (
          err.response.data.errors[0].message ===
          "The resource you are trying to access could not be found!"
        ) {
          setInputEmailValid(false);
          setInputEmailErrorMessage(
            "This email is not associated with any account."
          );
        } else {
          showError();
        }
      });
  };

  return (
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
              htmlFor="email"
              className="block text-md font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="relative mt-2">
              <input
                onChange={(e) => setInputEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={inputEmail}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
              />
              <div
                className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
                  inputEmailValid === false ? "" : "invisible"
                }`}
              >
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            </div>
            <p
              className={`mt-2 text-sm text-red-600 ${
                inputEmailValid === false ? "" : "invisible"
              }`}
            >
              {inputEmailErrorMessage}
            </p>
          </div>

          <div>
            <button
              disabled={!formValid}
              type="submit"
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                formValid
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
                `Continue`
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link
            href="/login"
            className="font-semibold leading-6 text-orange-600 hover:text-orange-400"
          >
            Return to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
