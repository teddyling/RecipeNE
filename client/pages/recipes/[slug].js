import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Cookies from "cookies";
import axios from "axios";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import NavBar from "@/components/Navbar";
import { globalErrorContext } from "@/components/GlobalError";
import CommentPanel from "@/components/CommentPanel";
import RecipeList from "@/components/RecipeList";
import Head from "next/head";

const recipeShowPage = ({
  currentUser,
  recipe,
  comments,
  mayAlsoLikeRecipe,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [commentPanelOpen, setCommentPanelOpen] = useState(false);
  const [testcomments, setTestComments] = useState([]);
  const [commentIsLoading, setCommentIsLoading] = useState(false);
  const { showError } = useContext(globalErrorContext);

  useEffect(() => {
    setCommentIsLoading(true);
    axios
      .get(`http://recipe-ne.com/api/v1/comments/${recipe.id}`)
      .then((data) => {
        setCommentIsLoading(false);
        setTestComments(
          data.data.comments.map((comment) => {
            return {
              ...comment,
              createdAt: new Date(comment.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  minute: "2-digit",
                  hour: "numeric",
                }
              ),
            };
          })
        );
      })
      .catch((err) => {
        setCommentIsLoading(false);
        showError();
      });
  }, []);

  const breadCrumbs = [
    { id: 1, name: "Home", href: "/" },
    { id: 2, name: "Recipes", href: "/recipes" },
  ];

  const onCommentButtonClick = () => {
    if (!currentUser) {
      return router.push("/signup");
    }
    if (commentPanelOpen) {
      return;
    }
    setCommentPanelOpen(true);
  };

  const onCommentSubmit = (content) => {
    axios
      .post("http://recipe-ne.com/api/v1/comments", {
        recipeId: recipe.id,
        comment: content,
      })
      .then((data) => {
        const comment = data.data.comment;
        comment.createdAt = new Date(comment.createdAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "2-digit",
            minute: "2-digit",
            hour: "numeric",
          }
        );
        setTestComments((prev) => {
          return [...prev, comment];
        });
        setCommentPanelOpen(false);

        //setCommentPanelOpen(false);
      })
      .catch(() => {
        showError();
      });
  };
  const onCommentCancel = () => {
    setCommentPanelOpen(false);
  };

  return (
    <>
      <Head>
        <title>{recipe.title}</title>
        <meta name="description" content={recipe.description}></meta>
      </Head>
      <NavBar currentUser={currentUser} />

      <main className="pt-10 sm:pt-16">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {breadCrumbs.map((breadcrumb) => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a
                    href={breadcrumb.href}
                    className="mr-2 text-md font-medium text-gray-900"
                  >
                    {breadcrumb.name}
                  </a>
                  <svg
                    width={16}
                    height={20}
                    viewBox="0 0 16 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-4 text-gray-300"
                  >
                    <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-md">
              <span className="font-medium text-gray-500 hover:text-gray-600">
                {recipe.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl  lg:gap-x-8 lg:px-8">
          <Image
            src={`https://recipe-ne.s3.amazonaws.com/show/${recipe.image}-show.png`}
            alt="dish photo"
            className="h-full w-full object-cover object-center"
            width={1216}
            height={810}
            priority
          />
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16">
          <div className="lg:col-span-2 lg:pr-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {recipe.title}
            </h1>
          </div>
          <div className="py-5 lg:col-span-2 lg:pr-8 pb-0">
            <h1 className="text-md font-base tracking-tight text-gray-700 sm:text-md">
              Recipe from{" "}
              <a
                href={recipe["recipe_provider_url"]}
                className="font-bold hover:text-gray-600 underline decoration-orange-500 decoration-2 underline-offset-4 hover:underline hover:decoration-orange-600 hover:decoration-4"
                target="_blank"
              >
                {recipe[`recipe_provider_name`]}'s Youtube Channel
              </a>
            </h1>
          </div>
          <div className="py-5 lg:col-span-2 lg:pr-8 pt-2">
            <h1 className="text-md font-base tracking-tight text-gray-700 sm:text-md">
              View the author's original recipe video{" "}
              <a
                href={recipe["recipe_video_url"]}
                className="font-bold hover:text-gray-600 underline decoration-orange-500 decoration-2 underline-offset-4 hover:underline hover:decoration-orange-600 hover:decoration-4"
                target="_blank"
              >
                HERE
              </a>
            </h1>
          </div>

          {/* Options */}

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <div className="space-y-6">
                <p className="text-lg text-gray-900">{recipe.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-4xl font-bold text-gray-900">Ingredients</h2>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-base">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient} className="text-gray-400">
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2
                id="shipping-heading"
                className="text-4xl font-bold text-gray-900"
              >
                Procedures
              </h2>

              <div className="mt-4">
                <ol
                  role="list"
                  className="list-decimal space-y-5 pl-4 text-base"
                >
                  {recipe.steps.map((step) => (
                    <li key={step} className="text-gray-400">
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>
        </div>
        {/* You may also Like */}
        <section
          aria-labelledby="related-products-heading"
          className="bg-white"
        >
          <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2
              id="related-products-heading"
              className="text-xl font-bold tracking-tight text-gray-900 mb-10"
            >
              You may also like
            </h2>
            <RecipeList recipes={mayAlsoLikeRecipe} />
          </div>
        </section>
        {/* Reviews */}
        <section aria-labelledby="reviews-heading" className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-32">
            <div className="lg:col-span-4">
              <h2
                id="reviews-heading"
                className="text-4xl font-bold tracking-tight text-gray-900"
              >
                Reviews
              </h2>

              <div className="mt-10">
                <h3 className="text-base font-medium text-gray-500 mb-6 italic ">
                  "When writing reviews, please be polite and respectful to
                  others."
                </h3>
                <h3 className="text-lg font-medium text-gray-900">
                  Post your reviews
                </h3>
                <p className="mt-1 text-base text-gray-600">
                  Have you tried this recipe? Do you like this recipe? Would you
                  recommend this recipe to others? Please write down your
                  thoughts.
                </p>

                <button
                  className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
                  onClick={onCommentButtonClick}
                >
                  Write a review
                </button>
              </div>
            </div>

            <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
              {commentPanelOpen && (
                <CommentPanel
                  onCommentCancel={onCommentCancel}
                  onCommentSubmit={onCommentSubmit}
                />
              )}
              {testcomments.length === 0 ? (
                <div className="font-base font-bold text-gray-800">
                  This recipe hasn't received any reviews yet. Be the first to
                  lead the way!
                </div>
              ) : (
                <div className="flow-root">
                  <div className="-my-12 divide-y divide-gray-200">
                    {testcomments.map((comment) => (
                      <div key={comment.id} className="py-12">
                        <div className="flex items-center">
                          {/* <img
                          src={review.avatarSrc}
                          alt={`${review.author}.`}
                          className="h-12 w-12 rounded-full"
                        /> */}
                          <UserCircleIcon className="h-10 w-10 rounded-full text-orange-600" />
                          <div className="ml-4">
                            <h4 className="text-sm font-bold text-gray-900">
                              {comment.user.username}
                            </h4>
                            <h4 className="text-sm font-base text-gray-500">
                              {comment.createdAt}
                            </h4>
                          </div>
                        </div>

                        <div className="mt-4 space-y-6 text-base italic text-gray-600" />
                        {comment.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export async function getServerSideProps(context) {
  const slug = context.query.slug;
  const response = await axios.get(
    `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/recipes/s/${slug}`,
    {
      headers: {
        Host: "recipe-ne.com",
      },
    }
  );
  const recipe = response.data.recipe;
  const recipeId = recipe.id;

  const commentResponse = await axios.get(
    `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/comments/${recipeId}`,
    {
      headers: {
        Host: "recipe-ne.com",
      },
    }
  );

  const mayAlsoLikeResponse = await axios.get(
    "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/recipes/may-also-like",
    {
      headers: {
        Host: "recipe-ne.com",
      },
    }
  );
  const mayAlsoLikeRecipe = mayAlsoLikeResponse.data.recipes;

  let comments = commentResponse.data.comments;

  const { req, res } = context;
  const cookies = new Cookies(req, res);
  try {
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/users/currentuser",
      {
        headers: {
          Host: "recipe-ne.com",
          Cookie: req.headers.cookie,
        },
      }
    );

    const currentUser = response.data.currentUser;

    return {
      props: { currentUser, recipe, comments, mayAlsoLikeRecipe },
    };
  } catch (err) {
    try {
      console.log("Trying to refresh token");
      if (err.response.data.errors.message === `Token Expired`) {
        const refreshResponse = await axios.post(
          `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/v1/users/refresh-token`,
          {},
          {
            headers: {
              Host: "recipe-ne.com",
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
          props: { currentUser: user, recipe, comments, mayAlsoLikeRecipe },
        };
      }
    } catch (err) {
      console.error(err);
      return {
        props: { currentUser: null, recipe, comments, mayAlsoLikeRecipe },
      };
    }
  }
}

export default recipeShowPage;
