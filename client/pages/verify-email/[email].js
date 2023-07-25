import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

const VerifyEmailPage = () => {
  const [resendButtonAble, setResendButtonAble] = useState(true);
  const [resendButtonReableTime, setResendButtonReableTime] = useState(60);
  const router = useRouter();
  const { email, type } = router.query;

  useEffect(() => {
    if (resendButtonAble) {
      setResendButtonReableTime(60);
    } else {
      const timer = setTimeout(() => {
        setResendButtonReableTime(resendButtonReableTime - 1);
        console.log(resendButtonReableTime);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendButtonAble, resendButtonReableTime]);

  const handleResendEmailClick = (e) => {
    e.preventDefault();
    if (!resendButtonAble) {
      return;
    }
    setResendButtonAble(false);
    if (router.query.type === "verify-signup") {
      axios
        .post("http://authenticdongbei.com/api/v1/users/resend-email", {
          email,
          type,
        })
        .then(() => {
          setTimeout(() => {
            setResendButtonAble(true);
            setResendButtonReableTime(60);
          }, 60 * 1000);
        })
        .catch((err) => {
          console.error(err);
          setResendButtonAble(true);
          setResendButtonReableTime(60);
        });
    } else if (router.query.type === "change-email-address") {
      console.log(email, type);
      const newEmail = router.query.newemail;
      axios
        .post("http://authenticdongbei.com/api/v1/users/resend-email", {
          email,
          type,
          newEmail,
        })
        .then(() => {
          console.log("Email Sent!");
          setTimeout(() => {
            setResendButtonAble(true);
          }, 60 * 1000);
        })
        .catch((err) => {
          console.error(err);
          setResendButtonAble(true);
        });
    } else if (router.query.type === "forgot-password") {
      axios
        .post("http://authenticdongbei.com/api/v1/users/resend-email", {
          email,
          type,
        })
        .then(() => {
          console.log("Email Sent!");
          setTimeout(() => {
            setResendButtonAble(true);
          }, 60 * 1000);
        })
        .catch((err) => {
          console.error(err);
          setResendButtonAble(true);
        });
    }
  };

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-orange-600">
          An email has been sent to your inbox.
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Please check you inbox
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-800">
          Check <span className="font-extrabold">{email}</span> to verify your
          email address
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
          <Link
            onClick={handleResendEmailClick}
            href="#"
            className={`text-sm font-semibold leading-7 ${
              resendButtonAble
                ? "text-gray-900"
                : "text-gray-400 pointer-events-none cursor-default"
            }`}
          >
            {resendButtonAble
              ? "Resend email"
              : `Resend in ${resendButtonReableTime} s`}{" "}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
