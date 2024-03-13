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
      if (!formData?.service?.[formData.mainSelect.value]) {
        setServices((state) => [...state, formData.mainSelect.value]);
      }
    }
  };

  const changeHandler = () => {
    if (methods.getValues('service')) {
      console.log();
      setTotalPrice(() => {
        return getSum(
          Object.entries(methods.getValues('service')).map(([key, item]) => {
            switch (key) {
              case 'binding_thermo':
                return !isNaN(item?.price * (item?.count - 10)) ? item?.price * (item?.count - 10) : 0;
              default:
                return !isNaN(item?.price * (item?.count ?? 1)) ? item?.price * (item?.count ?? 1) : 0;
            }
          }),
        );
      });
    }
  };

  useEffect(() => {}, [methods, services]);

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
    for (const [key, value] of Object.entries(cost.maxCount)) {
      if (+count <= +key) {
        return value['value'];
      }
    }

    return defaultValue;
  };

  const removeService = (item) => {
    setServices(
      services.filter((el) => {
        if (el === item) {
          methods.setValue(`service.${item}`, null);
          if (methods.getValues(`service.${item}_preparation`)) {
            methods.setValue(`service.${item}_preparation`, null);
          }
          return false;
        }
        return true;
      }),
    );
    changeHandler();
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
              {!!services.length && (
                <Element>
                  <div>{tOther('service')}</div>
                  <div>{tOther('count')}</div>
                  <div>{tOther('price')}</div>
                </Element>
              )}
              {services.map((item, index) => {
                const category = calculation.category[item];
                switch (category) {
                  case 'single_value':
                    return (
                      <Element key={`${item}_${index}-count`}>
                        <div>{tSelect(item)}</div>
                        <Input name={`service.${item}.count`} placeholder={tInputs('count')} type="number" min={0} step={1} />
                        <Input name={`service.${item}.price`} placeholder={tInputs('price')} type="number" step={0.05} defaultValue={price[item]} />
                        <CloseButton type="button" onClick={methods.handleSubmit(() => removeService(item))}>
                          ×
                        </CloseButton>
                      </Element>
                    );
                  case 'multi_value_preparation':
                    return (
                      <ElementThree key={`${item}_${index}-count`}>
                        <div>{tSelect(item)}</div>
                        <Input
                          name={`service.${item}_preparation.price`}
                          placeholder={tInputs('preparation')}
                          type="number"
                          step={0.05}
                          defaultValue={price[item].preparation}
                        />
                        <Input
                          name={`service.${item}.count`}
                          placeholder={tInputs('count')}
                          type="number"
                          min={0}
                          onInput={(e) => countChange(e, item)}
                          step={1}
                        />
                        <Input name={`service.${item}.price`} placeholder={tInputs('price')} type="number" step={0.05} />
                        <CloseButton type="button" onClick={methods.handleSubmit(() => removeService(item))}>
                          ×
                        </CloseButton>
                      </ElementThree>
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
                        <CloseButton type="button" onClick={methods.handleSubmit(() => removeService(item))}>
                          ×
                        </CloseButton>
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
                        <CloseButton type="button" onClick={methods.handleSubmit(() => removeService(item))}>
                          ×
                        </CloseButton>
                      </Element>
                    );
                }
              })}
            </Elements>
            {totalPrice > 0 && (
              <TotalPrice>
                <p>{`${tOther('totalPrice')} ${totalPrice} ${tOther('valute')}`}</p>
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
  grid-template-columns: 1fr 200px 200px 50px;
  padding: 12px;
  gap: 48px;
  &:nth-child(2n - 1) {
    background-color: #ffddee;
  }
  &:nth-child(2n) {
    background-color: #ddeeff;
  }
`;

const ElementThree = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 200px 200px 200px 50px;
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
  text-align: right;
  p {
    display: block;
    font-size: 24px;
  }
`;
const CloseButton = styled.button`
  top: 0;
  right: 12px;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: var(--thirdColor);
  background: none;
  cursor: pointer;
  font-weight: 600;
  transition: filter var(--transitionDuration);
  z-index: 100000;
  &:hover {
    color: var(--secondaryColor);
  }
  @media screen and (max-width: 768px) {
    position: fixed;
  }
`;
