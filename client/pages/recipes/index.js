import NavBar from "../../components/Navbar";
import PageHeader from "../../components/Page-Header";
import Cookies from "cookies";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { Fragment, useState, useRef, useEffect } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import RecipeList from "@/components/RecipeList";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const sortOptions = [
  { name: "Most Popular", queryName: `most-popular` },
  { name: "Difficulity: Low to High", queryName: "diff-low-to-high" },
  { name: "Difficulity: High to Low", queryName: "diff-high-to-low" },
];

const mainIngredientFilters = {
  id: "main-ingredient",
  name: "Main Ingredient",
  options: [
    { value: "pork", label: "Pork" },
    { value: "beef", label: "Beef" },
    { value: "lamb", label: "Lamb" },
    { value: "fish", label: "Fish" },
    { value: "chicken", label: "Chicken" },
    { value: "seafood", label: "Seafood" },
    { value: "vegetable", label: "Vegetable" },
    { value: "soy", label: "Soy" },
    { value: "noodle", label: "Noodle" },
    { value: "rice", label: "Rice" },
  ],
};

const dishTypeFilters = {
  id: "dish-type",
  name: "Dish Type",
  options: [
    { value: "appitizer", label: "Appetizer" },
    { value: "main-dish", label: "Main Dish" },
    { value: "side-dish", label: "Side Dish" },
    { value: "soup", label: "Soup" },
    { value: "dessert", label: "Dessert" },
  ],
};

const RecipePage = ({
  currentUser,
  recipes,
  pageNumber,
  currentPage,
  totalResult,
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [sortOrder, setSortOrder] = useState(null);
  const [mainIngredientChoice, setMainIngredientChoice] = useState(null);
  const [dishTypeChoice, setDishTypeChoice] = useState(null);

  const mainIngredientButtons = mainIngredientFilters.options.map((option) => {
    return false;
  });

  const dishTypeButtons = dishTypeFilters.options.map((option) => {
    return false;
  });
  const [mainIngredientCheckStatus, setMainIngredientCheckStatus] = useState(
    mainIngredientButtons
  );
  const [dishTypeCheckStatus, setDishTypeCheckStatus] =
    useState(dishTypeButtons);

  const handleSortClick = (e, i) => {
    e.preventDefault();
    if (i === 0) {
      setSortOrder(`most-popular`);
    } else if (i === 1) {
      setSortOrder("diff-low-to-high");
    } else if (i === 2) {
      setSortOrder("diff-high-to-low");
    }
  };

  const handleMainIngredientBoxChange = (e, i) => {
    if (!mainIngredientCheckStatus[i]) {
      setMainIngredientCheckStatus((prev) => {
        return prev.map((el, idx) => {
          if (idx === i) {
            return true;
          }
          return false;
        });
      });
      setMainIngredientChoice(e.target.value);
    } else {
      setMainIngredientCheckStatus((prev) => {
        return prev.map((el) => {
          return false;
        });
      });
      setMainIngredientChoice(null);
    }
  };

  const handleDishTypeBoxChange = (e, i) => {
    if (!dishTypeCheckStatus[i]) {
      setDishTypeCheckStatus((prev) => {
        return prev.map((el, idx) => {
          if (idx === i) {
            return true;
          }
          return false;
        });
      });
      setDishTypeChoice(e.target.value);
    } else {
      setDishTypeCheckStatus((prev) => {
        return prev.map((el) => {
          return false;
        });
      });
      setDishTypeChoice(null);
    }
  };

  const query = router.query;

  return (
    <>
      <Head>
        <title>All Recipes</title>
        <meta
          name="description"
          content="
          These are the carefully selected recipes for you."
        ></meta>
      </Head>
      <NavBar currentUser={currentUser} />
      <PageHeader
        heading="Northeastern Chinese Recipes"
        subHeading="Still thinking about what to have for dinner? Pick one from the recipes below and give your family a big surprise."
        bgImageURL="/recipe-header.png"
      />
      <div className="bg-gray-50">
        {/* <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 sm:hidden"
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

   
                  <form className="mt-4">
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.name}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  <ChevronDownIcon
                                    className={classNames(
                                      open ? "-rotate-180" : "rotate-0",
                                      "h-5 w-5 transform"
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 text-sm text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root> */}

        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
          <section
            aria-labelledby="filter-heading"
            className="border-t border-gray-200 py-6"
          >
            <div className="flex items-center justify-between">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
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
                  <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option, optionIdx) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <Link
                              // onClick={(e) => handleSortClick(e, optionIdx)}
                              href={{
                                pathname: router.pathname,
                                query: { ...query, order: option.queryName },
                              }}
                              replace
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm font-medium text-gray-900"
                              )}
                            >
                              {option.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                onClick={() => setOpen(true)}
              >
                Filters
              </button>

              <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
                <Popover
                  as="div"
                  key={mainIngredientFilters.name}
                  id={`desktop-menu-0`}
                  className="relative inline-block text-left"
                >
                  <div>
                    <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>{mainIngredientFilters.name}</span>

                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>
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
                    <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <form className="space-y-4">
                        {mainIngredientFilters.options.map(
                          (option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${mainIngredientFilters.id}-${optionIdx}`}
                                name={`${mainIngredientFilters.id}[]`}
                                checked={mainIngredientCheckStatus[optionIdx]}
                                defaultValue={option.value}
                                type="checkbox"
                                onChange={(e) =>
                                  handleMainIngredientBoxChange(e, optionIdx)
                                }
                                // onClick={onMainIngredientChange}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-${mainIngredientFilters.id}-${optionIdx}`}
                                className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                              >
                                {option.label}
                              </label>
                            </div>
                          )
                        )}
                      </form>
                    </Popover.Panel>
                  </Transition>
                </Popover>
                <Popover
                  as="div"
                  key={dishTypeFilters.name}
                  id={`desktop-menu-1`}
                  className="relative inline-block text-left"
                >
                  <div>
                    <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      <span>{dishTypeFilters.name}</span>

                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>
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
                    <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <form className="space-y-4">
                        {dishTypeFilters.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`filter-${dishTypeFilters.id}-${optionIdx}`}
                              name={`${dishTypeFilters.id}[]`}
                              defaultValue={option.value}
                              type="checkbox"
                              onChange={(e) =>
                                handleDishTypeBoxChange(e, optionIdx)
                              }
                              checked={dishTypeCheckStatus[optionIdx]}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-${dishTypeFilters.id}-${optionIdx}`}
                              className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </form>
                    </Popover.Panel>
                  </Transition>
                </Popover>

                <Link
                  href={{
                    query: {
                      order: query.order,
                      ...(mainIngredientChoice
                        ? { ["main-ingredient"]: mainIngredientChoice }
                        : {}),
                      ...(dishTypeChoice
                        ? { ["dish-type"]: dishTypeChoice }
                        : {}),
                    },
                  }}
                  replace
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Apply filter <span aria-hidden>→</span>
                </Link>
              </Popover.Group>
            </div>
          </section>
        </div>
      </div>
      <div className="bg-white mt-12">
        <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
          <RecipeList
            recipes={recipes}
            currentPage={currentPage}
            pageNumber={pageNumber}
          />
          <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * 12 + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {(currentPage - 1) * 12 + 12 < totalResult
                    ? (currentPage - 1) * 12 + 12
                    : totalResult}
                </span>{" "}
                of <span className="font-medium">{totalResult}</span> results
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
              <Link
                replace
                href={{
                  pathname: router.pathname,
                  query: {
                    ...query,
                    page: currentPage === 1 ? currentPage : currentPage - 1,
                  },
                }}
                className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
              >
                Previous
              </Link>
              <Link
                replace
                href={{
                  pathname: router.pathname,
                  query: {
                    ...query,
                    page:
                      currentPage + 1 <= pageNumber
                        ? currentPage + 1
                        : currentPage,
                  },
                }}
                className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
              >
                Next
              </Link>
            </div>
          </nav>
        </div>
      </div>
      ;
    </>
  );
};

export async function getServerSideProps(context) {
  console.log(context.query);
  const sortOrder = context.query.order;
  const mainIngredient = context.query["main-ingredient"];
  const dishType = context.query["dish-type"];
  const pageNumber = context.query.page || 1;
  let baseURL = `http://www.recipe-ne.com/api/v1/recipes`;

  if (sortOrder || mainIngredient || dishType || pageNumber) {
    baseURL += "?";
  }

  let sort = "";
  if (sortOrder === "most-popular") {
    sort = "-popularity";
  } else if (sortOrder === "diff-low-to-high") {
    sort = "difficulity";
  } else if (sortOrder === "diff-high-to-low") {
    sort = "-difficulity";
  }

  const queryStringArr = [];

  sort && queryStringArr.push(`sort=${sort}`);
  mainIngredient && queryStringArr.push(`category=${mainIngredient}`);
  dishType && queryStringArr.push(`type=${dishType}`);
  pageNumber && queryStringArr.push(`page=${pageNumber}`);
  const queryURL = queryStringArr.join("&");

  const fullURL = baseURL + queryURL;

  const recipeResponse = await axios.get(fullURL, {
    headers: {
      Host: "www.recipe-ne.com",
    },
  });

  const recipes = recipeResponse.data.recipes;
  let currentPage = recipeResponse.data.page;
  const totalResult = recipeResponse.data.length;
  const pageNumberFromServer = Math.floor(recipeResponse.data.length / 12) + 1;
  console.log(recipeResponse.data.length);
  if (currentPage > pageNumberFromServer) {
    currentPage = 1;
  }

  const { req, res } = context;
  const cookies = new Cookies(req, res);
  try {
    // console.log("headerCookie", req.headers.cookie);
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
      props: {
        currentUser,
        recipes,
        pageNumber: pageNumberFromServer,
        currentPage,
        totalResult,
      },
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
          props: {
            currentUser: user,
            recipes,
            pageNumber: pageNumberFromServer,
            currentPage,
            totalResult,
          },
        };
      }
    } catch (err) {
      console.error(err);
      return {
        props: {
          currentUser: null,
          recipes,
          pageNumber: pageNumberFromServer,
          currentPage,
          totalResult,
        },
      };
    }
  }
}

export default RecipePage;
