'use client';

/*Libs*/
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styled from 'styled-components';
import Select from 'react-select';
import { useForm, Controller, FormProvider } from 'react-hook-form';

/*Configs*/
import { select } from '@/config';

/*Components*/
import { Button } from '@/components/form';
import Container from '@/layouts/container';
import { calculation } from '@/config/calculation.config';
import Input from '@/components/form/input';
import { getSum } from '@/helpers/math';

const Homepage = () => {
  /*Translations*/
  const tSelect = useTranslations('Select');
  const tButtons = useTranslations('Buttons');
  const tInputs = useTranslations('Inputs');
  const tOther = useTranslations('Other');

  /*States*/
  const methods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });
  const [isClient, setIsClient] = useState(false);
  const [services, setServices] = useState([]);
  const [price, setPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  /*Effects*/
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const getPrice = async () => {
      const response = await fetch('/api/price.json');
      const data = await response.json();
      setPrice(data);
    };
    getPrice();
  }, []);

  /*Configs*/
  const options = select.map((value, id) => ({ value, label: tSelect(value), id }));

  /*Handlers*/
  const submitHandler = (formData) => {
    if (formData?.mainSelect?.value) {
      if (formData?.count?.[formData.mainSelect.value] === undefined) {
        setServices((state) => [...state, formData.mainSelect.value]);
      }
    }
  };

  const changeHandler = () => {
    if (methods.getValues('service')) {
      console.log(methods.getValues('service'));
      setTotalPrice(() =>
        getSum(
          Object.entries(methods.getValues('service')).map(([key, item]) => {
            switch (key) {
              case 'binding_thermo':
                return item.price * (item.count - 10);
              default:
                return item.price * (item.count ?? 1);
            }
          }),
        ),
      );
    }
  };

  const countChange = (e, item) => {
    const count = e.target.value;
    const cost = price[item];
    if (cost) {
      if (item === 'plotter_cutting') {
        return methods.setValue(`service.plotter_cutting.price`, getPricePlotter(cost, count));
      }
      return methods.setValue(`service.${item}.price`, getPrice(cost, count));
    }
  };

  const getPrice = (cost, count) => {
    const defaultValue = cost.default;
    for (const [key, value] of Object.entries(cost.maxCount)) {
      if (+count <= +key) {
        return value;
      }
    }

    return defaultValue;
  };

  const getPricePlotter = (cost, count) => {
    const defaultValue = cost.default.value;
    console.log(defaultValue);
    for (const [key, value] of Object.entries(cost.maxCount)) {
      if (+count <= +key) {
        return value['value'];
      }
    }

    return defaultValue;
  };

  if (!isClient || !price) {
    return <></>;
  }

  return (
    <Wrapper>
      <Container>
        <FormProvider {...methods}>
          <form onChange={methods.handleSubmit(changeHandler)} onSubmit={methods.handleSubmit(submitHandler)}>
            <Grid>
              <Controller
                control={methods.control}
                name="mainSelect"
                render={({ field: { onChange, value, ref } }) => (
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
            <Elements>
              {services.map((item, index) => {
                const category = calculation.category[item];
                switch (category) {
                  case 'single_value':
                    return (
                      <Element key={`${item}_${index}-count`}>
                        <div>{tSelect(item)}</div>
                        <Input name={`service.${item}.count`} placeholder={tInputs('count')} type="number" min={0} step={1} />
                        <Input name={`service.${item}.price`} placeholder={tInputs('price')} type="number" step={0.05} defaultValue={price[item]} />
                      </Element>
                    );
                  case 'binding_thermo':
                    return (
                      <Element key={`${item}_${index}-count`}>
                        <div>{tSelect(item)}</div>
                        <Input
                          name={`service.binding_thermo.count`}
                          placeholder={tInputs('count')}
                          type="number"
                          min={0}
                          onInput={(e) => countChange(e, item)}
                          step={1}
                        />
                        <Input name={`service.binding_thermo.price`} placeholder={tInputs('price')} type="number" step={0.05} />
                        <Input
                          name={`service.binding_thermo_preparation.price`}
                          placeholder={tInputs('preparation')}
                          type="number"
                          step={0.05}
                          defaultValue={price.binding_thermo.preparation}
                        />
                      </Element>
                    );
                  case 'plotter_cutting':
                    return (
                      <Element key={`${item}_${index}-count`}>
                        <div>{tSelect(item)}</div>
                        <Input
                          name={`service.plotter_cutting.count`}
                          placeholder={tInputs('count')}
                          type="number"
                          min={0}
                          onInput={(e) => countChange(e, item)}
                          step={1}
                        />
                        <Input name={`service.plotter_cutting.price`} placeholder={tInputs('price')} type="number" step={0.05} />
                      </Element>
                    );
                  default:
                    return (
                      <Element key={`${item}_${index}-count`}>
                        <div>{tSelect(item)}</div>
                        <Input
                          name={`service.${item}.count`}
                          placeholder={tInputs('count')}
                          type="number"
                          min={0}
                          onInput={(e) => countChange(e, item)}
                          step={1}
                        />
                        <Input name={`service.${item}.price`} placeholder={tInputs('price')} type="number" step={0.05} />
                      </Element>
                    );
                }
              })}
            </Elements>
            {!!totalPrice && (
              <TotalPrice>
                <p>{`${tOther('totalPrice')} ${+totalPrice} ${tOther('valute')}`}</p>
              </TotalPrice>
            )}
          </form>
        </FormProvider>
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

const Elements = styled.div`
  padding: 48px 0;
`;

const Element = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 4fr 1fr 1fr 1fr;
  padding: 12px;
  gap: 48px;
  &:nth-child(2n - 1) {
    background-color: #ffddee;
  }
  &:nth-child(2n) {
    background-color: #ddeeff;
  }
`;

const TotalPrice = styled.div`
  p {
    display: block;
    font-size: 24px;
  }
`;
