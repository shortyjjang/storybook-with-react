import type { Meta, StoryObj } from '@storybook/react';
import { Memo } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Memo',
  component: Memo,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    onSubmit: { control: 'function' },
    onCancel: { control: 'function' },
    value: { control: 'text' },
    style: { control: 'object' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Memo>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    onSubmit: () => {},
    onCancel: () => {},
    value: '',
    style: {},
    className: 'relative',
  },
};
