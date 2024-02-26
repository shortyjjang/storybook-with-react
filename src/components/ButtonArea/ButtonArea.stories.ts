import type { Meta, StoryObj } from '@storybook/react';
import { ButtonArea } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/ButtonArea',
  component: ButtonArea,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    className: { control: 'text' },
    onSubmit: { control: 'function' },
    onCancel: { control: 'function' },
    submitText: { control: 'text' },
    cancelText: { control: 'text' },
    size: {
      control: {
        type: 'radio',
        options: ['sm', 'md', 'lg']
      }
    },
    cancelDisabled: { control: 'boolean' },
    submitDisabled: { control: 'boolean' },

  },
} satisfies Meta<typeof ButtonArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    onSubmit: () => {},
    onCancel: () => {},
    submitText: '확인',
    cancelText: '취소',
    size: 'md',
    cancelDisabled: false,
    submitDisabled: false
  },
};
