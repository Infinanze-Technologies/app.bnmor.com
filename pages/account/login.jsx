import Auth from "@/modules/views/auth/index"
import FrontLayout from "@/components/FrontLayout"
import PageTitle from "@/components/DashboardLayout/DashMeta"
import { getSession } from 'next-auth/react'
export default function HomePage(props) {
    return (
        <>
          <FrontLayout>
            <PageTitle title="Admin Login Page" />
            <Auth  session={props} />
          </FrontLayout>
        </>
    )
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req })
  return { props: { ...session }}
}