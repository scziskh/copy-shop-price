import '@/globals.css';
import { intl } from '@/config';
import PageLayout from '@/layouts/page-layout';
import { getMessages } from '@/lib/messages';

export const generateStaticParams = async () => {
  return intl.locales.map((locale) => ({ locale }));
};

const LocaleLayout = async ({ children, params: { locale } }) => {
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <PageLayout locale={locale} messages={messages}>
          {children}
        </PageLayout>
      </body>
    </html>
  );
};

export default LocaleLayout;
