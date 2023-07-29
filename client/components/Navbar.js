import Image from "next/image";
import Link from "next/link";
import { useState, Fragment, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import {
  Bars3Icon,
  XMarkIcon,
  // UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import { useRouter, Router } from "next/router";
// import { UserCircleIcon } from "@heroicons/react/20/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavBar = ({ currentUser }) => {
  const router = useRouter();
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const options = [
    { name: "About Northeastern", href: "/about-northeastern" },
    { name: "Recipes", href: "/recipes" },
    { name: "Must Know", href: "/must-know" },
    { name: "About Us", href: "/about-us" },
  ];

  const onSignout = async (e) => {
    try {
      e.stopPropagation();
      await axios.post(`http://recipe-ne.com/api/v1/users/signout`, {});
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  const loginAndSignup = (
    <>
      <Link
        href="/login"
        className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 hover:text-gray-400"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        Sign up
      </Link>
    </>
  );

  const userProfile = (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex rounded-full text-orange-600 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-400">
          <UserCircleIcon className="h-8 w-8 rounded-full" />
          <div className="ml-3 mr-2">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {currentUser && currentUser.username}
            </p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
              ▼
            </p>
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile"
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
              >
                Your Profile
              </Link>
            )}
          </Menu.Item>
          {/* <Menu.Item>
            {({ active }) => (
              <a
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
                onClick={(e) => console.log("sign out!")}
              >
                Settings
              </a>
            )}
          </Menu.Item> */}
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/"
                className={classNames(
                  active ? "bg-gray-100" : "",
                  "block px-4 py-2 text-sm text-gray-700"
                )}
                onClick={onSignout}
              >
                Sign out
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );

  return (
    <header className="bg-white border-b-2 border-orange-300 ">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <img className="h-8 w-auto" src="/logo.png" alt="Website logo" />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {options.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-400"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          {/* <Link
            href="/login"
            className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900 hover:text-gray-400"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Sign up
          </Link> */}
          {currentUser ? userProfile : loginAndSignup}
          {/* <Menu as="div" className="relative ml-3">
            <div>
              <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Your Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu> */}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      {/* <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <a
              href="#"
              className="ml-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog> */}
    </header>
  );
};

export default NavBar;
