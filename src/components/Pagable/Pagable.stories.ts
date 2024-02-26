import type { Meta, StoryObj } from '@storybook/react';
import { Pagable } from '.';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Pagable',
  component: Pagable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    scrollAlign: {control : 'radio', options: ['vertical' , 'horizontal']},
    width: { control: 'number' },
    height: { control: 'number' },
    children: { control: 'text' },
    touchable: { control: 'boolean' },
    rowsPerPage: { control: 'number' },
    offset: { control: 'array'},
    className: { control: 'text' },
    callback: { control: 'function' },
  },
} satisfies Meta<typeof Pagable>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    scrollAlign: 'vertical',
    width: 500,
    height: 500,
    children: 'Hello World!',
    touchable: true,
    rowsPerPage: 10,
    offset: [0, 0],
    className: 'relative',
    callback: () => {},
  },
};
