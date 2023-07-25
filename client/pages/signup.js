import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import axios from "axios";

const Signup = () => {
  const router = useRouter();

  const [inputEmail, setInputEmail] = useState("");
  const [inputEmailValid, setInputEmailValid] = useState(null);
  const [inputUsername, setInputUsername] = useState("");
  const [inputUsernameValid, setInputUsernameValid] = useState(null);
  const [inputPassword, setInputPassword] = useState("");
  const [inputPasswordValid, setInputPasswordValid] = useState(null);

  const [formValid, setFormValid] = useState(false);

  const [emailInUse, setEmailInUse] = useState(false);
  const [usernameInUse, setUsernameInUse] = useState(false);

  const [IsLoading, setIsLoading] = useState(false);

  const [successAndRedirect, setSuccessAndRedirect] = useState(false);
  // const [successRedirectTime, setSuccessRedirectTime] = useState(6);

  // Check if input email is valid
  useEffect(() => {
    const timer = setTimeout(() => {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(inputEmail)) {
        setInputEmailValid(true);
        console.log("valid Email");
      } else if (inputEmail.length === 0) {
        setInputEmailValid(null);
      } else {
        setInputEmailValid(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [inputEmail]);

  // Check if input username is valid
  useEffect(() => {
    const timer = setTimeout(() => {
      let re = /[^0-9a-zA-Z]/;

      if (
        inputUsername.length >= 4 &&
        inputUsername.length <= 15 &&
        !re.test(inputUsername)
      ) {
        setInputUsernameValid(true);
        console.log("valid Username");
      } else if (inputUsername.length === 0) {
        setInputUsernameValid(null);
      } else {
        setInputUsernameValid(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [inputUsername]);
  // Check if password is valid
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
        console.log("valid Password");
      } else if (inputPassword.length === 0) {
        setInputPasswordValid(null);
      } else {
        setInputPasswordValid(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [inputPassword]);

  // Check if form is valid
  useEffect(() => {
    if (inputEmailValid && inputPasswordValid && inputUsernameValid) {
      setFormValid(true);
      console.log("form valid");
    } else {
      setFormValid(false);
    }
  }, [inputEmailValid, inputPasswordValid, inputUsernameValid]);

  // useEffect(() => {
  //   if (successAndRedirect) {
  //     if (successRedirectTime <= 0) {
  //       router.push("/");
  //     } else {
  //       setTimeout(() => {
  //         setSuccessRedirectTime((prev) => prev - 1);
  //       }, 1000);
  //     }
  //   }
  // }, [successAndRedirect, successRedirectTime]);
  // console.log(successRedirectTime);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormValid(false);
    console.log(inputEmail, inputUsername, inputPassword);
    await axios
      .post("http://authenticdongbei.com/api/v1/users/signup", {
        username: inputUsername,
        email: inputEmail,
        password: inputPassword,
      })
      .then((response) => {
        setIsLoading(false);
        setSuccessAndRedirect(true);
        setFormValid(false);
        router.push(`/verify-email/${inputEmail}?type=verify-signup`);
      })
      .catch((error) => {
        setIsLoading(false);
        setFormValid(true);
        if (
          error.response.data.errors[0].message ===
          "The email is already in use!"
        ) {
          console.log("email in use");
          setInputEmailValid(false);
          setEmailInUse(true);
        } else if (
          error.response.data.errors[0].message ===
          "The username is already in use!"
        ) {
          setInputUsernameValid(false);
          setUsernameInUse(true);
        } else {
          console.log("Internal Error");
        }
        console.error(error);
      });
  };

  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* {successAndRedirect && (
            <div className="rounded-md bg-yellow-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon
                    className="h-5 w-5 text-yellow-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Attention needed
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Check <strong>{inputEmail}</strong> to verify your account
                      and get started.
                    </p>
                    <p>You will be redirected to the homepage in 5 seconds.</p>
                  </div>
                </div>
              </div>
            </div>
          )} */}
          <div>
            <Link href="/">
              <img
                className="h-10 w-auto"
                src="/signup-login-logo.png"
                alt="website logo"
              />
            </Link>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create your RecipeNE account
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {/* Not a member?{" "}
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Start a 14 day free trial
              </a> */}
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form className="space-y-6" onSubmit={onFormSubmit} noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-md font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={inputEmail}
                      onChange={(e) => {
                        setInputEmail(e.target.value);
                      }}
                      required
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6 ${
                        inputEmailValid === false
                          ? "ring-red-500"
                          : inputEmailValid === true
                          ? "ring-green-400"
                          : ""
                      }`}
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
                    className={`mt-1 text-sm ${
                      inputEmailValid ? `text-green-600` : `text-red-600`
                    } ${inputEmailValid === null ? "invisible" : ""}`}
                  >
                    {!inputEmailValid
                      ? emailInUse
                        ? `The email is already associated with an account`
                        : `Not a valid email address.`
                      : `Looks great!`}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-md font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={inputUsername}
                      onChange={(e) => setInputUsername(e.target.value)}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6 ${
                        inputUsernameValid === false
                          ? "ring-red-500"
                          : inputUsernameValid === true
                          ? "ring-green-400"
                          : ""
                      }`}
                    />
                    <div
                      className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
                        inputUsernameValid === false ? "" : "invisible"
                      }`}
                    >
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <p
                    className={`mt-1 text-sm ${
                      inputUsernameValid === false
                        ? "text-red-600"
                        : inputUsernameValid
                        ? "text-green-600"
                        : "text-gray-900"
                    } 
                    `}
                  >
                    {inputUsernameValid === false
                      ? usernameInUse
                        ? `The username is already taken!`
                        : "Not a valid username!"
                      : inputUsernameValid
                      ? "Lovely to meet you!"
                      : "Username must consist of 4 to 15 letters or numbers."}
                  </p>
                </div>

                <div className="basis-1">
                  <label
                    htmlFor="password"
                    className="block text-md font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6 ${
                        inputPasswordValid === false
                          ? "ring-red-500"
                          : inputPasswordValid === true
                          ? "ring-green-400"
                          : ""
                      }`}
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
                  <p
                    className={`mt-2 text-sm ${
                      inputPasswordValid === false
                        ? "text-red-600"
                        : inputPasswordValid
                        ? "text-green-600"
                        : "text-gray-900"
                    }`}
                  >
                    {inputPasswordValid
                      ? `Good Job! Your password looks nice!`
                      : `Passwords must be between 8 and 20 characters long and
                    include at least 1 uppercase letter, 1 lowercase letter, and
                    1 number.`}
                  </p>
                </div>

                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-700"
                  >
                    Remember me
                  </label>
                  </div>

                  <div className="text-sm leading-6">
                    <a
                      href="#"
                      className="font-semibold text-orange-600 hover:text-orange-400"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div> */}

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
                    {IsLoading ? (
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-neutral-100 motion-reduce:animate-[spin_1.5s_linear_infinite]">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                          Loading...
                        </span>
                      </div>
                    ) : (
                      `Create account`
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* <div className="mt-10">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-gray-900">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <a
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <span className="text-sm font-semibold leading-6">
                  Twitter
                </span>
              </a>

              <a
                href="#"
                className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">
                  GitHub
                </span>
              </a>
            </div>
          </div> */}
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/signup-page.png"
          alt="A dish photo"
        />
      </div>
    </div>
  );
};

export default Signup;
