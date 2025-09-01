import { Header } from '@/components';
import { Contact, PageLayout } from '../components';

export default function ContactPage() {
  return (
    <PageLayout>
      <Header level={'h1'}>Contact</Header>
      <Contact />
    </PageLayout>
  );
}
