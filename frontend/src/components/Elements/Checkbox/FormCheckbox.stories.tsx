import type { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';

import { FormCheckbox } from './FormCheckbox';

const meta = {
  component: FormCheckbox,
  tags: ['autodocs'],
} satisfies Meta<typeof FormCheckbox>;

export default meta;

type Story = StoryObj<typeof FormCheckbox>;

// FormProvider で囲む必要がある
export const Basic: Story = {
  args: {
    name: 'name',
    label: 'label',
  },
  decorators: [
    (Story) => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
};
