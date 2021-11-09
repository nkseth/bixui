import { GetServerSideProps } from "next";

export default function DashboardIndex() {
   return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
   return {
      props: {},
      redirect: {
         destination: "/dashboard/booth/all",
         permanent: false,
      },
   };
};
