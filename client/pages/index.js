import Cookies from "cookies";
import FeatureSection from "@/components/Feature-section";
import HeroSection from "../components/Hero-section";
import TestmonialSection from "@/components/Testmonial-section";
import Footer from "@/components/Footer";
import NavBar from "@/components/Navbar";
import axios from "axios";
import CommentPanel from "@/components/CommentPanel";
import Head from "next/head";

export default function HomePage({ currentUser }) {
  return (
    <>
      <Head>
        <title>RecipeNE</title>
        <meta
          name="description"
          content="Enjoy the most authentic Northeastern Chinese cuisine without stepping out of your home."
        ></meta>
      </Head>
      <NavBar currentUser={currentUser} />
      <HeroSection />
      <FeatureSection />
      <TestmonialSection />
    </>
  );
}

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

//eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkwWWpReVlXUTNNVEEzWW1OallqVmlZamt3Wmpjd09DSXNJbkp2YkdVaU9pSjFjMlZ5SWl3aVpXMWhhV3dpT2lKMFpXUmtlVEU1T1Rjd09EQTVNVUJuYldGcGJDNWpiMjBpTENKMWMyVnlibUZ0WlNJNklteHBibWQwWVNJc0ltbGhkQ0k2TVRZNE9UVXlPVFU0TlN3aVpYaHdJam94TmpnNU5UTXdNVGcxZlEuZjVNb2dPbVRCSHIteFFRcE9Jc3FGc21Tb1NiUV9PR1pCUXZ5eEJtRGtZQSJ9
