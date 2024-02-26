import type { Meta, StoryObj } from '@storybook/react';
import PopupContainer  from '.';




// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/PopupContainer',
  component: PopupContainer,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    screenSize: { 
      control: {
        type: 'object',
        // 'object' control type은 오브젝트 전체를 편집할 수 있도록 해줍니다.
      },
    },
    title: { control: 'text' },
    children: { control: 'text' },
    onSubmit: { control: 'function' },
    onCancel: { control: 'function' },
    overflow: { control: 'boolean' },
  },
} satisfies Meta<typeof PopupContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    screenSize: {
      width: 500,
      height: 500,
    },
    title: 'Hello World!',
    children: 'Hello World!',
    onSubmit: () => {},
    onCancel: () => {},
    overflow: false,
  }
};
