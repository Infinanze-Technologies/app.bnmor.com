import ForgetPassword from "@/modules/views/auth/forgetPassword"
import FrontLayout from "@/components/FrontLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
// import { getSession } from 'next-auth/react'
export default function HomePage(props) {
    return (
        <>
          <FrontLayout>
            <PageTitle title="Forget Password Page" />
            <ForgetPassword   />
          </FrontLayout>
        </>
    )
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req })
//   return { props: { ...session }}
// }