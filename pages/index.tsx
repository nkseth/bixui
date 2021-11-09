import { GetServerSideProps } from "next";

export default function Home() {
   return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async () => {
   return {
      props: {},
      redirect: {
         destination: "/auth/login",
         permanent: false,
      },
   };
};

//https://www.freepik.com/vectors/flower , Flower vector created by upklyak - www.freepik.com