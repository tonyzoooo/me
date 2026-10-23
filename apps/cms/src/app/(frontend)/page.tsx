import { redirect } from 'next/navigation'

// The CMS has no public frontend; send the root straight to the admin panel.
export default function HomePage() {
  redirect('/admin')
}
