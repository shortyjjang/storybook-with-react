import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    size: ['sm' , 'md' , 'lg'],
    type: ['button' , 'submit' , 'reset'],
    className: { control: 'text' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
    children: { control: 'text' },
    buttonType: ['default' , 'primary'],
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    buttonType: 'primary',
    children: 'Button',
    size: 'sm',
    type: 'button',
  },
};
