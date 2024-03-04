'use client';

import StyledComponentsRegistry from '@/lib/registry';
import { NextIntlClientProvider, IntlErrorCode } from 'next-intl';
import { notFound } from 'next/navigation';

const onError = (error) => {
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    return notFound();
  }
  if (error.code !== IntlErrorCode.FORMATTING_ERROR) {
    return console.error(error);
  }
};

const PageLayout = ({ locale, messages, children }) => {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      defaultTranslationValues={{
        bold: (chunks) => <strong>{chunks}</strong>,
        p: (chunks) => <p>{chunks}</p>,
        h1: (chunks) => <h1>{chunks}</h1>,
        h2: (chunks) => <h2>{chunks}</h2>,
        h3: (chunks) => <h3>{chunks}</h3>,
        ul: (chunks) => <ul>{chunks}</ul>,
        li: (chunks) => <li>{chunks}</li>,
        value: 'Not found translation',
      }}
      onError={onError}
    >
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </NextIntlClientProvider>
  );
};

export default PageLayout;
