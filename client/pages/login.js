import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { globalErrorContext } from "@/components/GlobalError";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import Head from "next/head";

const Login = () => {
  const router = useRouter();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [inputEmailValid, setInputEmailValid] = useState(null);
  const [inputPasswordValid, setInputPasswordValid] = useState(null);

  const [formValid, setFormValid] = useState(false);

  const [invalidCredential, setInvalidCredential] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useContext(globalErrorContext);

  // Check if the input email is valid
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
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [inputEmail]);
  // Check if the password is empty
  useEffect(() => {
    if (inputPassword.length === 0) {
      setInputPasswordValid(false);
    } else {
      setInputPasswordValid(true);
    }
  }, [inputPassword]);
  // Check if the form is valid
  useEffect(() => {
    if (inputEmailValid && inputPasswordValid) {
      setFormValid(true);
    }
  }, [inputEmailValid, inputPasswordValid]);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormValid(false);
    await axios
      .post(
        "https://www.recipe-ne.com/api/v1/users/login",
        {
          email: inputEmail,
          password: inputPassword,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setIsLoading(false);
        router.push("/");
      })
      .catch((error) => {
        if (error.response.data.errors[0].message === "Invalid Credentials") {
          setIsLoading(false);
          setInputEmail("");
          setInputPassword("");
          setFormValid(false);
          setInvalidCredential(true);
          console.error(error);
        } else {
          showError();
        }
      });
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta
          name="description"
          content="
          Login page"
        ></meta>
      </Head>
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
            Sign in to your account
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
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    setInvalidCredential(false);
                  }}
                  value={inputEmail}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
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
                Not a valid email address
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-md font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-semibold text-orange-600 hover:text-orange-400"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setInvalidCredential(false);
                  }}
                  id="password"
                  value={inputPassword}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                />
              </div>
              <p
                className={`mt-2 text-sm text-red-600 ${
                  invalidCredential ? "" : "invisible"
                }`}
              >
                Invalid Credentials
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
                  `Sign in`
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

export default Login;
