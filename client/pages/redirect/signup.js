import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const RedirectSignUpPage = () => {
  const router = useRouter();
  const [secLeft, setSecLeft] = useState(5);

  useEffect(() => {
    if (secLeft <= 0) {
      router.push("/");
    } else {
      const timer = setTimeout(() => {
        setSecLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [secLeft]);

  return (
    <div className="bg-amber-700 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Your email has been successfully verified!
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-200">
            You will be automatically redirected to the homepage in {secLeft}{" "}
            seconds.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-200">
            If the redirect is not working, please click this{" "}
            <Link
              className="text-blue-500 dark:text-blue-300 hover:underline"
              href="/"
            >
              Link
            </Link>{" "}
            to go to the homepage
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedirectSignUpPage;
