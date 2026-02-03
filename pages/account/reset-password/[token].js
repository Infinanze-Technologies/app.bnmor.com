import ResetPassword from "@/modules/views/auth/resetPassword"
import FrontLayout from "@/components/FrontLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
// import { getSession } from 'next-auth/react'
export default function HomePage() {
    return (
        <>
          <FrontLayout>
            <PageTitle title="Reset Password Page" />
            <ResetPassword  />
          </FrontLayout>
        </>
    )
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req })
//   return { props: { ...session }}
// }