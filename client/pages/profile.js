import Cookies from "cookies";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { Dialog, Switch } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { StarIcon } from "@heroicons/react/20/solid";
import { globalErrorContext } from "@/components/GlobalError";

import NavBar from "@/components/Navbar";
import axios from "axios";

const reviews = [
  {
    id: 1,
    title: "Can't say enough good things",
    rating: 5,
    content: ` Very Good!
      
    `,
    author: "Risako M",
    date: "May 16, 2021",
    datetime: "2021-01-06",
  },
  // More reviews...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ currentUser }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] =
    useState(true);

  const [comments, setComments] = useState([]);

  const [resetingUsername, setResetingUsername] = useState(false);
  const [resetingEmail, setResetingEmail] = useState(false);
  const [resetingPassword, setResetingPassword] = useState(false);

  const [newUsername, setNewUserName] = useState(currentUser.username);
  const [newUsernameValid, setNewUserNameValid] = useState(true);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [usernameChanged, setUsernameChanged] = useState(false);

  const [newEmailAddress, setNewEmailAddress] = useState(currentUser.email);
  const [newEmailAddressValid, setNewEmailAddressValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);
  const { showError } = useContext(globalErrorContext);

  useEffect(() => {
    axios
      .get("http://www.recipe-ne.com/api/v1/comments/mycomments")
      .then((res) => {
        setComments(res.data.comments);
      })
      .catch((err) => {});
  }, []);

  // Check username Validity
  useEffect(() => {
    const timer = setTimeout(() => {
      let re = /[^0-9a-zA-Z]/;

      if (
        newUsername.length >= 4 &&
        newUsername.length <= 15 &&
        !re.test(newUsername)
      ) {
        setNewUserNameValid(true);
        setUsernameErrorMessage("");
      } else if (newUsername.length === 0) {
        setNewUserNameValid(null);
      } else {
        setNewUserNameValid(false);
        setUsernameErrorMessage("Invalid username");
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [newUsername]);
  // Check email Validity
  useEffect(() => {
    const timer = setTimeout(() => {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(newEmailAddress)) {
        setNewEmailAddressValid(true);
        setEmailErrorMessage("");
      } else if (newEmailAddress.length === 0) {
        setNewEmailAddressValid(null);
      } else {
        setNewEmailAddressValid(false);
        setEmailErrorMessage("Invalid Email");
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [newEmailAddress]);

  const handleChangeUsernameClick = (e) => {
    e.preventDefault();
    setResetingUsername(true);
  };
  const handleChangeEmailClick = (e) => {
    e.preventDefault();
    setResetingEmail(true);
  };
  const handleChangePasswordClick = (e) => {
    e.preventDefault();
    setResetingPassword(true);
  };

  const handleNewUsernameSave = async (e) => {
    e.preventDefault();
    await axios
      .patch("http://www.recipe-ne.com/api/v1/users/updateme", {
        username: newUsername,
      })
      .then((data) => {
        axios
          .post(`http://www.recipe-ne.com/api/v1/users/signout`, {})
          .then(() => {
            setUsernameErrorMessage("");
            setUsernameChanged(true);
            setTimeout(() => {
              window.location.href = "/";
            }, 3000);
          });
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].message ===
          "The username is already in use!"
        ) {
          setNewUserNameValid(false);
          setUsernameErrorMessage(
            "The username is already associated with an account"
          );
        } else {
          showError();
        }
      });
  };

  const handleNewEmailSave = async (e) => {
    e.preventDefault();
    await axios
      .patch("http://www.recipe-ne.com/api/v1/users/updatemyemail", {
        email: newEmailAddress,
      })
      .then(() => {
        axios
          .post(`http://www.recipe-ne.com/api/v1/users/signout`, {})
          .then(() => {
            setEmailErrorMessage("");
            setEmailChanged(true);
            router.push(
              `/verify-email/${currentUser.email}?type=change-email-address&newemail=${newEmailAddress}`
            );
          });
      })
      .catch((error) => {
        if (
          error.response.data.errors[0].message ===
          "The email is already in use!"
        ) {
          setNewEmailAddressValid(false);
          setEmailErrorMessage(
            "The email is already associated with an ccount"
          );
        } else {
          showError();
        }
      });
  };

  return (
    <>
      <NavBar currentUser={currentUser} />
      <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile
              </h2>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Username
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    {resetingUsername ? (
                      <>
                        <input
                          onChange={(e) => setNewUserName(e.target.value)}
                          type="email"
                          name="email"
                          className={`block w-1/4 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ${
                            !newUsernameValid ? "ring-red-600" : "ring-gray-300"
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6`}
                          value={newUsername}
                        />
                        {usernameErrorMessage ? (
                          <p className="mt-1 text-sm text-red-600">
                            {usernameErrorMessage}
                          </p>
                        ) : usernameChanged ? (
                          <p className="mt-1 text-sm text-green-600">
                            Successfully changed the username. Logging out...
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            Changing your username will require you to log in
                            again
                          </p>
                        )}

                        {/* {newUsernameValid === false ? (
                          <p
                            className="mt-1 text-sm text-red-600"
                            id="email-error"
                          >
                            Not a valid username
                          </p>
                        ) : usernameErrorMessage ? (
                          <p className="mt-1 text-sm text-red-600">
                            {usernameErrorMessage}
                          </p>
                        ) : usernameChanged ? (
                          <p className="mt-1 text-sm text-green-600">
                            Successfully changed the username. Logging out...
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            Changing your username will require you to log in
                            again
                          </p>
                        )} */}
                      </>
                    ) : (
                      <div className="text-gray-900">
                        {currentUser.username}
                      </div>
                    )}
                    {resetingUsername ? (
                      <div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setNewUserName(currentUser.username);
                            setResetingUsername(false);
                          }}
                          type="button"
                          className="font-semibold text-orange-600 hover:text-orange-400 pr-4"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleNewUsernameSave}
                          type="button"
                          className={`rounded-md shadow-sm font-semibold text-white px-2 py-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${
                            !usernameChanged &&
                            newUsername !== currentUser.username &&
                            newUsernameValid
                              ? "bg-orange-600 hover:bg-orange-400"
                              : "bg-orange-300"
                          }`}
                          disabled={
                            usernameChanged ||
                            newUsername === currentUser.username ||
                            !newUsernameValid
                          }
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleChangeUsernameClick}
                        type="button"
                        className="font-semibold text-orange-600 hover:text-orange-400"
                      >
                        Update
                      </button>
                    )}
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Email address
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    {resetingEmail ? (
                      <>
                        <input
                          onChange={(e) => setNewEmailAddress(e.target.value)}
                          type="text"
                          name="username"
                          className="block w-1/4 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                          value={newEmailAddress}
                        />

                        {emailErrorMessage ? (
                          <p className="mt-1 text-sm text-red-600">
                            {emailErrorMessage}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            Changing your username will require you to log in
                            again
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-900">{currentUser.email}</div>
                    )}
                    {resetingEmail ? (
                      <div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setNewEmailAddress(currentUser.email);
                            setResetingEmail(false);
                          }}
                          type="button"
                          className="font-semibold text-orange-600 hover:text-orange-400 pr-4"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleNewEmailSave}
                          disabled={
                            newEmailAddress === currentUser.email ||
                            !newEmailAddressValid
                          }
                          type="button"
                          className={`rounded-md shadow-sm font-semibold text-white px-2 py-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 ${
                            newEmailAddress !== currentUser.email &&
                            newEmailAddressValid
                              ? "bg-orange-600 hover:bg-orange-400"
                              : "bg-orange-300"
                          }`}
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleChangeEmailClick}
                        type="button"
                        className="font-semibold text-orange-600 hover:text-orange-400"
                      >
                        Update
                      </button>
                    )}
                  </dd>
                </div>
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Password
                  </dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    {resetingPassword ? (
                      <>
                        <button
                          onClick={() => router.push("/change-password")}
                          type="button"
                          className="rounded-md shadow-sm font-semibold bg-orange-600 hover:bg-orange-400 text-white px-2 py-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                        >
                          Change password
                        </button>
                        <p className="mt-1 text-sm text-gray-900">
                          Changing your password will require you to log in
                          again
                        </p>
                      </>
                    ) : (
                      <div className="text-gray-900">••••••••</div>
                    )}
                    {resetingPassword ? (
                      <div>
                        <button
                          onClick={() => setResetingPassword(false)}
                          type="button"
                          className="font-semibold text-orange-600 hover:text-orange-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleChangePasswordClick}
                        type="button"
                        className="font-semibold text-orange-600 hover:text-orange-400"
                      >
                        Update
                      </button>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Recent reviews
              </h2>

              {/* <ul
                role="list"
                className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
              > */}
              <div className="mt-6 space-y-10 divide-y divide-gray-200 border-b border-t border-gray-200 pb-10">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8"
                  >
                    <div className="lg:col-span-8 lg:col-start-5 xl:col-span-9 xl:col-start-4 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8">
                      <div className="flex items-center xl:col-span-1">
                        {/* On Guo Bao Rou */}
                        <div className="flex items-center text-sm font-semibold text-gray-900">
                          {comment.recipe.title}
                          {/* {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                review.rating > rating
                                  ? "text-yellow-400"
                                  : "text-gray-200",
                                "h-5 w-5 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          ))} */}
                        </div>
                        {/* <p className="ml-3 text-sm text-gray-700">
                          {review.rating}
                        </p> */}
                      </div>

                      <div className="mt-4 lg:mt-6 xl:col-span-2 xl:mt-0">
                        <h3 className="text-sm font-medium text-gray-900">
                          {comment.content}
                        </h3>

                        {/* <div
                          className="mt-3 space-y-6 text-sm text-gray-500"
                          dangerouslySetInnerHTML={{ __html: review.content }}
                        /> */}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-sm lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:flex-col lg:items-start xl:col-span-3">
                      <p className="font-medium text-gray-900">
                        {currentUser.username}
                      </p>
                      <time
                        dateTime={comment.createdAt}
                        className="ml-4 border-l border-gray-200 pl-4 text-gray-500 lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                      >
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            minute: "2-digit",
                            hour: "numeric",
                          }
                        )}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
              {/* <li className="flex justify-between gap-x-6 py-6">
                  <div className="font-medium text-gray-900">QuickBooks</div>
                  <button
                    type="button"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Update
                  </button>
                </li> */}
              {/* </ul> */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const cookies = new Cookies(req, res);
  try {
    const response = await axios.get(
      "http://www.recipe-ne.com/api/v1/users/currentuser",
      {
        headers: {
          Host: "www.recipe-ne.com",
          Cookie: req.headers.cookie,
        },
      }
    );

    const currentUser = response.data.currentUser;

    return {
      props: { currentUser },
    };
  } catch (err) {
    try {
      console.log("Trying to refresh token");
      if (err.response.data.errors.message === `Token Expired`) {
        const refreshResponse = await axios.post(
          `http://www.recipe-ne.com/api/v1/users/refresh-token`,
          {},
          {
            headers: {
              Host: "www.recipe-ne.com",
              Cookie: req.headers.cookie,
            },
          }
        );
        const refreshedEncodedCookie = btoa(
          JSON.stringify(refreshResponse.data)
        );
        const user = refreshResponse.data.user;

        cookies.set("session", refreshedEncodedCookie);
        return {
          props: { currentUser: user },
        };
      }
    } catch (err) {
      console.error(err);
      return {
        props: { currentUser: null },
      };
    }
  }
}
