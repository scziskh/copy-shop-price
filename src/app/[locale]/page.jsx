'use client';

import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { select } from '@/config';
import { useEffect, useState } from 'react';

const Homepage = (props) => {
  const methods = useForm();
  const { handleSubmit } = methods;
  const id = Date.now().toString();
  const t = useTranslations('Select');
  const options = select.map((value, id) => ({ value, label: t.rich(value), id }));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const submitHandler = (formData) => {
    // values are available in formData
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        {isClient && (
          <Controller
            control={methods.control}
            name="MainSelect"
            render={({ field: { onChange, value, name, ref } }) => (
              <Select
                id={id}
                placeholder={t('placeholder')}
                inputRef={ref}
                options={options}
                value={options.find((c) => c.value === value)}
                onChange={(val) => onChange(val)}
              />
            )}
          />
        )}
      </form>
    </div>
  );
};

export default Homepage;
