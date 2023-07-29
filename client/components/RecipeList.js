import Image from "next/image";
import { StarIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import recipeShowPage from "@/pages/recipes/[slug]";
import Cookies from "cookies";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RecipeList = ({ recipes, currentPage, pageNumber }) => {
  return (
    <div className="-mx-px  grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
        >
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
            <Image
              src={`https://recipe-ne.s3.amazonaws.com/profile/${recipe.image}-profile.png`}
              alt={recipe.title}
              className="h-full w-full object-cover object-center"
              height={1080}
              width={1080}
              priority
            />
          </div>
          <div className="pb-4 pt-10 text-center">
            <h3 className="text-md font-bold text-gray-900">
              <Link href={`/recipes/${recipe.slug}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {recipe.title}
              </Link>
            </h3>
            <div className="mt-3 flex flex-col items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={classNames(
                      recipe.popularity > rating
                        ? "text-yellow-400"
                        : "text-gray-200",
                      "h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">popularity rating</p>
            </div>
            <div className="mt-3 flex flex-col items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <ExclamationTriangleIcon
                    key={rating}
                    className={classNames(
                      recipe.difficulity > rating
                        ? "text-orange-600"
                        : "text-gray-200",
                      "h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">difficulity</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export async function getServerSideProps(context) {
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
      props: { currentUser },
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

export default RecipeList;
