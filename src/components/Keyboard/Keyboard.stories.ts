import type { Meta, StoryObj } from '@storybook/react';
import Keyboard from '.';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/NumberKeypad',
  component: Keyboard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    setValue: { control: 'function' },
    className: { control: 'text' },
    enterTxt: { control: 'text' },
    onEnter: { control: 'function' },
    defaultValue: { control: 'text' },
    defaultKeyboard: { control: 'radio', options:['koNormal' , 'koShift' , 'enShift' , 'enNormal' , 'numberNormal' , 'numberShift']},
  },
} satisfies Meta<typeof Keyboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    defaultValue: 'Hello World!',
    defaultKeyboard: 'koNormal',
    enterTxt: '닫기',
    onEnter: () => {},
  },
};
