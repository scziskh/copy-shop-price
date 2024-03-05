'use client';

/*Libs*/
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styled from 'styled-components';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';

/*Configs*/
import { select } from '@/config';

/*Components*/
import { Button } from '@/components/form';
import Container from '@/layouts/container';
import { calculation } from '@/config/calculation.config';

const Homepage = () => {
  /*Translations*/
  const tSelect = useTranslations('Select');
  const tButtons = useTranslations('Buttons');

  /*States*/
  const methods = useForm();
  const [isClient, setIsClient] = useState(false);
  const [services, setServices] = useState([]);

  /*Effects*/
  useEffect(() => setIsClient(true), []);
  useEffect(() => console.log(services), [services]);

  /*Configs*/
  const options = select.map((value, id) => ({ value, label: tSelect(value), id }));

  /*Handlers*/
  const submitHandler = (formData) => {
    if (formData?.mainSelect?.value) {
      setServices((state) => [...state, formData.mainSelect.value]);
    }
  };

  if (!isClient) {
    return <></>;
  }

  return (
    <Wrapper>
      <Container>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          <Grid>
            <Controller
              control={methods.control}
              name="mainSelect"
              render={({ field: { onChange, value, name, ref } }) => (
                <Select
                  placeholder={tSelect('placeholder')}
                  inputRef={ref}
                  options={options}
                  value={options.find((c) => c.value === value)}
                  onChange={(val) => onChange(val)}
                />
              )}
            />

            <Button label={tButtons('add')} type="submit" />
          </Grid>
          {services.map((item, index) => (
            <div key={index}>{calculation.category[item]}</div>
          ))}
        </form>
      </Container>
    </Wrapper>
  );
};

export default Homepage;

const Wrapper = styled.main`
  display: block;
  padding: 24px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  gap: 48px;
`;
